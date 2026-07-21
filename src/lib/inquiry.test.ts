import { describe, expect, it, vi } from "vitest";
import { createInquirySubmissionGuard, hasContactErrors, inquiryFingerprint, normalizePhone, validateContactDetails } from "./inquiry";

describe("inquiry validation and submission", () => {
  it("requires a name and at least one reachable channel", () => {
    const errors = validateContactDetails({ name: "", company: "", email: "", phone: "" });
    expect(errors.name).toBeTruthy();
    expect(errors.contact).toBeTruthy();
    expect(hasContactErrors(errors)).toBe(true);
  });

  it("validates email and normalizes phone numbers", () => {
    expect(validateContactDetails({ name: "Aldy", company: "Neo", email: "bad", phone: "" }).email).toBeTruthy();
    expect(validateContactDetails({ name: "Aldy", company: "Neo", email: "hello@neotrix.asia", phone: "" })).toEqual({});
    expect(normalizePhone("+62 877-9768-1961")).toBe("+6287797681961");
  });

  it("creates a stable fingerprint", () => {
    expect(inquiryFingerprint({ name: " Aldy ", company: "Neo", email: "A@B.COM", phone: "+62 8" }, "Founder", "discuss"))
      .toBe("aldy|neo|a@b.com|+628|founder|discuss");
  });

  it("coalesces in-flight submissions and prevents a completed duplicate", async () => {
    const guard = createInquirySubmissionGuard();
    const action = vi.fn(async () => "saved-id");
    const [first, second] = await Promise.all([guard.submit("same-key", action), guard.submit("same-key", action)]);
    const third = await guard.submit("same-key", action);
    expect([first, second, third]).toEqual(["saved-id", "saved-id", "saved-id"]);
    expect(action).toHaveBeenCalledTimes(1);
  });

  it("allows a retry after a failed insert", async () => {
    const guard = createInquirySubmissionGuard();
    const action = vi.fn().mockRejectedValueOnce(new Error("offline")).mockResolvedValueOnce("saved");
    await expect(guard.submit("retry", action)).rejects.toThrow("offline");
    await expect(guard.submit("retry", action)).resolves.toBe("saved");
    expect(action).toHaveBeenCalledTimes(2);
  });
});
