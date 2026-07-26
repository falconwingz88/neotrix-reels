import { useMemo, useState, type FormEvent } from "react";
import { Plus, Trash2, X, Save, GripVertical, Link2, Image as ImageIcon, Video } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { MediaUpload } from "@/components/MediaUpload";
import { ThumbnailUpload } from "@/components/ThumbnailUpload";
import type { Article, ArticleFaq, ArticleLink, ArticleMedia, ArticleSection } from "@/content/articles";
import type { CustomProject } from "@/contexts/ProjectsContext";
import { isSafeHttpUrl } from "@/lib/url";
import { normalizeArticleSlug, sanitizeArticleLinks } from "@/lib/articles";

type Props = {
  article: Article | null;
  projects: CustomProject[];
  onCancel: () => void;
  onSave: (article: Article) => Promise<void>;
};

const defaultSection = (): ArticleSection => ({ id: "section-" + Date.now(), heading: "New section", paragraphs: [""], bullets: [] });
const defaultFaq = (): ArticleFaq => ({ question: "", answer: "" });

const cloneArticle = (article: Article | null): Article => article
  ? JSON.parse(JSON.stringify(article)) as Article
  : {
      id: crypto.randomUUID(),
      slug: "",
      title: "",
      shortTitle: "",
      description: "",
      dek: "",
      category: "Production guide",
      publishedAt: new Date().toISOString().slice(0, 10),
      modifiedAt: new Date().toISOString().slice(0, 10),
      readingTime: "7 min read",
      accent: "cyan",
      keywords: [],
      takeaway: "",
      sections: [defaultSection()],
      faqs: [defaultFaq()],
      relatedWork: [],
      relatedProjectIds: [],
      externalLinks: [],
      media: [],
      coverImage: "",
      isPublished: true,
    };

const inputClass = "border-white/15 bg-white/[.05] text-white placeholder:text-white/25";
const textAreaClass = inputClass + " min-h-[110px]";

export const ArticleEditor = ({ article, projects, onCancel, onSave }: Props) => {
  const [draft, setDraft] = useState<Article>(() => cloneArticle(article));
  const [projectSearch, setProjectSearch] = useState("");
  const [saving, setSaving] = useState(false);

  const visibleProjects = useMemo(() => {
    const term = projectSearch.trim().toLowerCase();
    return projects.filter((project) => !term || (project.title + " " + (project.client || "")).toLowerCase().includes(term)).slice(0, 32);
  }, [projects, projectSearch]);

  const update = <K extends keyof Article>(key: K, value: Article[K]) => setDraft((current) => ({ ...current, [key]: value }));
  const updateSection = (index: number, patch: Partial<ArticleSection>) => update("sections", draft.sections.map((section, i) => i === index ? { ...section, ...patch } : section));
  const updateFaq = (index: number, patch: Partial<ArticleFaq>) => update("faqs", draft.faqs.map((faq, i) => i === index ? { ...faq, ...patch } : faq));
  const updateExternalLink = (index: number, patch: Partial<ArticleLink>) => update("externalLinks", (draft.externalLinks || []).map((link, i) => i === index ? { ...link, ...patch } : link));

  const mediaUrls = (draft.media || []).map((media) => media.url);
  const setMediaUrls = (urls: string[]) => {
    const existing = new Map((draft.media || []).map((media) => [media.url, media]));
    update("media", urls.filter(Boolean).map((url): ArticleMedia => existing.get(url) || ({
      type: /youtube|youtu\.be|\.mp4|\.mov|\.webm/i.test(url) ? "video" : "image",
      url,
      alt: draft.title,
      caption: "",
    })));
  };

  const toggleProject = (project: CustomProject) => {
    setDraft((currentDraft) => {
      const current = currentDraft.relatedProjectIds || [];
      const next = current.includes(project.id) ? current.filter((id) => id !== project.id) : [...current, project.id];
      return {
        ...currentDraft,
        relatedProjectIds: next,
        relatedWork: next.map((id) => {
          const selected = projects.find((item) => item.id === id);
          return selected ? { label: selected.title, query: selected.title } : null;
        }).filter((item): item is { label: string; query: string } => Boolean(item)),
      };
    });
  };

  const submit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.title.trim() || !draft.slug.trim() || !draft.description.trim() || !draft.takeaway.trim()) return;
    setSaving(true);
    try {
      await onSave({
        ...draft,
        title: draft.title.trim(),
        slug: normalizeArticleSlug(draft.slug || draft.title),
        shortTitle: draft.shortTitle.trim() || draft.title.trim(),
        description: draft.description.trim(),
        modifiedAt: new Date().toISOString().slice(0, 10),
        sections: draft.sections.filter((section) => section.heading.trim()).map((section) => ({
          ...section,
          id: normalizeArticleSlug(section.id || section.heading) || "section-" + Date.now(),
          heading: section.heading.trim(),
          paragraphs: section.paragraphs.filter((paragraph) => paragraph.trim()),
          bullets: (section.bullets || []).filter((bullet) => bullet.trim()),
        })),
        faqs: draft.faqs.filter((faq) => faq.question.trim() && faq.answer.trim()),
        keywords: draft.keywords.map((keyword) => keyword.trim()).filter(Boolean),
        externalLinks: sanitizeArticleLinks(draft.externalLinks),
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-8 rounded-2xl border border-white/15 bg-white/[.06] p-5 backdrop-blur-md md:p-8">
      <div className="flex items-start justify-between gap-5 border-b border-white/10 pb-5">
        <div><p className="admin-eyebrow">Article workspace</p><h2 className="text-2xl font-medium text-white">{article ? "Edit article" : "Create article"}</h2><p className="mt-2 max-w-xl text-sm text-white/45">Build a structured article with search metadata, media, FAQs, and links into the work archive.</p></div>
        <Button type="button" variant="ghost" size="icon" onClick={onCancel} className="text-white/60 hover:bg-white/10 hover:text-white" aria-label="Close article editor"><X /></Button>
      </div>

      <section className="grid gap-5 lg:grid-cols-2">
        <div className="space-y-2 lg:col-span-2"><Label className="text-white">Title *</Label><Input value={draft.title} onChange={(event) => update("title", event.target.value)} onBlur={() => !draft.slug && update("slug", normalizeArticleSlug(draft.title))} className={inputClass} placeholder="How to plan a commercial 3D film" required /></div>
        <div className="space-y-2"><Label className="text-white">URL slug *</Label><Input value={draft.slug} onChange={(event) => update("slug", normalizeArticleSlug(event.target.value))} className={inputClass} placeholder="commercial-3d-film-guide" required /></div>
        <div className="space-y-2"><Label className="text-white">Short card title *</Label><Input value={draft.shortTitle} onChange={(event) => update("shortTitle", event.target.value)} className={inputClass} placeholder="Commercial 3D Film Guide" required /></div>
        <div className="space-y-2"><Label className="text-white">Category</Label><Input value={draft.category} onChange={(event) => update("category", event.target.value)} className={inputClass} placeholder="Production guide" /></div>
        <div className="space-y-2"><Label className="text-white">Reading time</Label><Input value={draft.readingTime} onChange={(event) => update("readingTime", event.target.value)} className={inputClass} placeholder="8 min read" /></div>
        <div className="space-y-2"><Label className="text-white">Published date</Label><Input type="date" value={draft.publishedAt} onChange={(event) => update("publishedAt", event.target.value)} className={inputClass} /></div>
        <div className="space-y-2"><Label className="text-white">Accent</Label><select value={draft.accent} onChange={(event) => update("accent", event.target.value as Article["accent"])} className={"h-10 w-full rounded-md border px-3 text-sm " + inputClass}><option value="cyan">Cyan</option><option value="lime">Acid lime</option></select></div>
        <div className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/10 p-3"><Switch checked={draft.isPublished !== false} onCheckedChange={(checked) => update("isPublished", checked)} /><div><Label className="text-white">Published</Label><p className="text-xs text-white/40">Unpublished articles stay available in this dashboard only.</p></div></div>
      </section>

      <section className="grid gap-5 border-t border-white/10 pt-7">
        <div className="space-y-2"><Label className="text-white">Meta description *</Label><Textarea value={draft.description} onChange={(event) => update("description", event.target.value)} className={textAreaClass} placeholder="A clear 150-180 character description for search results." required /><p className="text-right text-[10px] text-white/35">{draft.description.length} characters</p></div>
        <div className="space-y-2"><Label className="text-white">Article introduction</Label><Textarea value={draft.dek} onChange={(event) => update("dek", event.target.value)} className={textAreaClass} placeholder="The opening answer readers see below the title." /></div>
        <div className="space-y-2"><Label className="text-white">Short answer / takeaway *</Label><Textarea value={draft.takeaway} onChange={(event) => update("takeaway", event.target.value)} className={textAreaClass} placeholder="A concise answer that can be understood on its own." required /></div>
        <div className="space-y-2"><Label className="text-white">Search topics (comma separated)</Label><Input value={draft.keywords.join(", ")} onChange={(event) => update("keywords", event.target.value.split(",").map((keyword) => keyword.trim()).filter(Boolean))} className={inputClass} placeholder="3D animation Jakarta, product film, VFX" /></div>
      </section>

      <section className="border-t border-white/10 pt-7"><Label className="mb-3 block text-white">Cover image</Label><ThumbnailUpload value={draft.coverImage || ""} onChange={(url) => update("coverImage", url)} /></section>

      <section className="border-t border-white/10 pt-7">
        <div className="mb-4 flex items-end justify-between gap-4"><div><Label className="text-white">Attached images and videos</Label><p className="mt-1 text-xs text-white/40">Upload images or paste YouTube, Vimeo, MP4, or hosted media URLs.</p></div><Link2 className="size-4 text-[#7DEBFF]" /></div>
        <MediaUpload value={mediaUrls} onChange={setMediaUrls} />
        {(draft.media || []).length > 0 && <div className="mt-4 grid gap-3">{(draft.media || []).map((media, index) => <div key={media.url + index} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-3 md:grid-cols-[auto_1fr]"><div className="flex items-center gap-2 text-xs text-white/45">{media.type === "video" ? <Video className="size-4 text-[#B8FF35]" /> : <ImageIcon className="size-4 text-[#7DEBFF]" />} {media.type}</div><div className="grid gap-2 md:grid-cols-2"><Input value={media.alt || ""} onChange={(event) => update("media", (draft.media || []).map((item, itemIndex) => itemIndex === index ? { ...item, alt: event.target.value } : item))} className={inputClass} placeholder="Accessible alt text" /><Input value={media.caption || ""} onChange={(event) => update("media", (draft.media || []).map((item, itemIndex) => itemIndex === index ? { ...item, caption: event.target.value } : item))} className={inputClass} placeholder="Optional caption" /></div></div>)}</div>}
      </section>

      <section className="border-t border-white/10 pt-7">
        <div className="mb-4 flex items-center justify-between gap-4">
          <div><Label className="text-white">Editorial links</Label><p className="mt-1 text-xs text-white/40">Add useful references, sources, or partner pages. Only secure HTTP(S) links are published.</p></div>
          <Button type="button" variant="outline" size="sm" onClick={() => update("externalLinks", [...(draft.externalLinks || []), { label: "", url: "" }])} className="border-white/15 bg-white/[.05] text-white"><Plus className="mr-2 size-3.5" /> Add link</Button>
        </div>
        {(draft.externalLinks || []).length === 0 ? (
          <p className="rounded-xl border border-dashed border-white/10 p-4 text-sm text-white/35">No external links attached.</p>
        ) : (
          <div className="space-y-3">
            {(draft.externalLinks || []).map((link, index) => {
              const invalid = link.url.trim().length > 0 && !isSafeHttpUrl(link.url.trim());
              return <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-3 md:grid-cols-[1fr_1.5fr_auto]">
                <Input value={link.label} onChange={(event) => updateExternalLink(index, { label: event.target.value })} className={inputClass} placeholder="Link label" />
                <div><Input value={link.url} onChange={(event) => updateExternalLink(index, { url: event.target.value })} className={inputClass + (invalid ? " border-red-400/70" : "")} placeholder="https://example.com/reference" type="url" />{invalid && <p className="mt-1 text-[10px] text-red-300">Use a valid HTTPS URL.</p>}</div>
                <Button type="button" variant="ghost" size="icon" onClick={() => update("externalLinks", (draft.externalLinks || []).filter((_, itemIndex) => itemIndex !== index))} className="text-red-300 hover:bg-red-500/10" aria-label="Remove link"><Trash2 className="size-4" /></Button>
              </div>;
            })}
          </div>
        )}
      </section>

      <section className="border-t border-white/10 pt-7">
        <div className="mb-4 flex items-end justify-between gap-4"><div><Label className="text-white">Attach projects</Label><p className="mt-1 text-xs text-white/40">Selected projects appear as links at the end of the public article.</p></div><Input value={projectSearch} onChange={(event) => setProjectSearch(event.target.value)} className={"max-w-xs " + inputClass} placeholder="Search projects" /></div>
        <div className="grid max-h-64 gap-2 overflow-y-auto rounded-xl border border-white/10 p-3 sm:grid-cols-2">{visibleProjects.map((project) => <label key={project.id} className="flex cursor-pointer items-center gap-3 rounded-lg p-2 text-sm text-white/65 hover:bg-white/[.05]"><input type="checkbox" checked={(draft.relatedProjectIds || []).includes(project.id)} onChange={() => toggleProject(project)} className="size-4 accent-[#B8FF35]" /><span className="min-w-0 truncate">{project.title}<small className="ml-2 text-white/30">{project.client || ""}</small></span></label>)}</div>
        {draft.relatedProjectIds && draft.relatedProjectIds.length > 0 && <p className="mt-2 font-mono text-[9px] uppercase tracking-[.12em] text-[#B8FF35]">{draft.relatedProjectIds.length} project(s) attached</p>}
      </section>

      <section className="border-t border-white/10 pt-7">
        <div className="mb-4 flex items-center justify-between"><div><Label className="text-white">Article sections *</Label><p className="mt-1 text-xs text-white/40">Separate paragraphs with a blank line and bullets with one item per line.</p></div><Button type="button" variant="outline" size="sm" onClick={() => update("sections", [...draft.sections, defaultSection()])} className="border-white/15 bg-white/[.05] text-white"><Plus className="mr-2 size-3.5" /> Add section</Button></div>
        <div className="space-y-4">{draft.sections.map((section, index) => <div key={section.id} className="rounded-xl border border-white/10 bg-black/10 p-4"><div className="mb-3 flex items-center gap-2"><GripVertical className="size-4 text-white/25" /><Input value={section.heading} onChange={(event) => updateSection(index, { heading: event.target.value })} className={inputClass} placeholder="Section heading" /><Button type="button" variant="ghost" size="icon" onClick={() => update("sections", draft.sections.filter((_, itemIndex) => itemIndex !== index))} disabled={draft.sections.length <= 1} className="text-red-300 hover:bg-red-500/10"><Trash2 className="size-4" /></Button></div><Textarea value={section.paragraphs.join("\n\n")} onChange={(event) => updateSection(index, { paragraphs: event.target.value.split(/\n\s*\n/) })} className={textAreaClass + " min-h-[150px]"} placeholder="Section paragraphs..." /><Textarea value={(section.bullets || []).join("\n")} onChange={(event) => updateSection(index, { bullets: event.target.value.split("\n") })} className={inputClass + " mt-3 min-h-[90px]"} placeholder="Optional bullets, one per line" /></div>)}</div>
      </section>

      <section className="border-t border-white/10 pt-7">
        <div className="mb-4 flex items-center justify-between"><div><Label className="text-white">FAQs</Label><p className="mt-1 text-xs text-white/40">These become visible answers and FAQ structured data.</p></div><Button type="button" variant="outline" size="sm" onClick={() => update("faqs", [...draft.faqs, defaultFaq()])} className="border-white/15 bg-white/[.05] text-white"><Plus className="mr-2 size-3.5" /> Add FAQ</Button></div>
        <div className="space-y-4">{draft.faqs.map((faq, index) => <div key={index} className="grid gap-3 rounded-xl border border-white/10 bg-black/10 p-4 md:grid-cols-[1fr_1fr_auto]"><Input value={faq.question} onChange={(event) => updateFaq(index, { question: event.target.value })} className={inputClass} placeholder="Question" /><Textarea value={faq.answer} onChange={(event) => updateFaq(index, { answer: event.target.value })} className={inputClass + " min-h-[80px]"} placeholder="Answer" /><Button type="button" variant="ghost" size="icon" onClick={() => update("faqs", draft.faqs.filter((_, itemIndex) => itemIndex !== index))} className="text-red-300 hover:bg-red-500/10"><Trash2 className="size-4" /></Button></div>)}</div>
      </section>

      <div className="flex flex-wrap justify-end gap-3 border-t border-white/10 pt-6"><Button type="button" variant="ghost" onClick={onCancel} className="text-white/60">Cancel</Button><Button type="submit" disabled={saving} className="bg-[#B8FF35] text-black hover:bg-[#d0ff73]"><Save className="mr-2 size-4" />{saving ? "Saving..." : article ? "Save article" : "Create article"}</Button></div>
    </form>
  );
};
