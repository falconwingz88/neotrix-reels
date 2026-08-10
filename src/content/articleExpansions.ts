import type { Article, ArticleFaq, ArticleSection } from "@/content/articles";

export type ArticleExpansion = Pick<Article, "readingTime" | "takeaway" | "sections" | "faqs">;

const section = (id: string, heading: string, paragraphs: string[], bullets?: string[]): ArticleSection => ({
  id,
  heading,
  paragraphs,
  ...(bullets ? { bullets } : {}),
});

const faq = (question: string, answer: string): ArticleFaq => ({ question, answer });

/**
 * The managed Supabase article library contains older records that were
 * published with only a summary section. Keep those records editable in the
 * admin panel while supplying a durable editorial body for the public site.
 * Once an admin saves one of these articles, the enriched content is written
 * back through the normal ArticlesContext save path.
 */
export const ARTICLE_CONTENT_EXPANSIONS: Record<string, ArticleExpansion> = {
  "how-to-plan-a-product-film-for-a-new-mobile-device": {
    readingTime: "7 min read",
    takeaway: "A mobile-device film should make design, interaction, and everyday usefulness feel inevitable. Build the film around one clear human promise, then use 3D and live action only where each makes that promise easier to understand.",
    sections: [
      section("define-the-device-promise", "Define the device promise before the shot list", [
        "A new mobile device can be described by a long specification sheet, but a film rarely has time to communicate every specification equally. Start by choosing the one or two changes that should survive a viewer's first impression: a lighter form, a more private screen, a faster camera, a more expressive color, or a simpler way to get something done.",
        "That promise becomes the organizing principle for the visual world. If the idea is ease, the camera should move with confidence and the transitions should feel frictionless. If the idea is precision, surfaces, reflections, and motion need disciplined control. A memorable film is not a catalogue of features; it is a compressed demonstration of why the product matters.",
      ], ["Write the audience benefit in one sentence.", "Choose the hero feature and two supporting details.", "Separate proof points from decorative spectacle."]),
      section("build-the-product-truth", "Build product truth before visual style", [
        "The most beautiful device film fails when the phone's proportions, camera placement, ports, buttons, or interface are wrong. Gather approved CAD, orthographic drawings, product photography, screen designs, color references, and any information about final hardware changes before look development begins.",
        "A production-ready asset should support more than one hero angle. It needs accurate bevels, physically believable materials, correct screen behavior, and a naming structure that lets the team create variants without breaking the base model. This early discipline makes later creative exploration faster rather than slower.",
      ], ["Confirm which hardware revision is final.", "Lock screen content and legal copy before final renders.", "Keep a clean master asset separate from shot-specific effects."]),
      section("choose-the-world", "Choose a world that explains the product", [
        "A phone can be shown on a table, in a hand, inside a pocket, or in an entirely constructed world. The right setting depends on what the device needs to communicate. A tactile close-up can sell material quality; a controlled digital environment can make camera performance or connectivity visible; a real home or street can ground the product in ordinary life.",
        "Avoid adding an elaborate environment simply because it looks expensive. The world should create a reason for the camera to move and a context for the product to behave. When the product is the subject, supporting design should frame its silhouette, protect screen readability, and leave room for supers or voiceover.",
      ]),
      section("plan-the-shot-system", "Plan a shot system that can scale", [
        "Design the hero film and the deliverables together. A camera move that works in a wide sixteen-by-nine composition may lose the product in a vertical crop. A screen animation that reads in a long edit may be too small for a six-second social cut. Create a shot matrix early so every important beat has a useful adaptation path.",
        "This is where 3D production has a practical advantage: the camera, light, product, and environment can be recomposed after the hero idea is approved. That flexibility only exists when the scene is built with clean layers and deliberate framing, not when every output is treated as a one-off composite.",
      ], ["List hero, cutdown, vertical, square, and still outputs.", "Protect the feature proof in every crop.", "Reserve clean plates and product-only frames for future edits."]),
      section("finish-with-usefulness", "Finish with usefulness, not only spectacle", [
        "The final seconds should help the viewer connect the visual experience to a real decision. A device reveal, a feature demonstration, and a clear end frame are often more useful than another abstract transition. If the product is sold through retail or ecommerce, the film should leave a clean, legible image of the model and its key distinction.",
        "Review the film at the size and speed where it will actually be seen. Check small screens, muted playback, compressed social exports, and the first two seconds without audio. A premium product film is one where craft increases comprehension instead of competing with it.",
      ]),
    ],
    faqs: [
      faq("Should a mobile-device film be fully 3D?", "Not necessarily. Use 3D for precise product control, impossible camera moves, internal visualization, and scalable variants. Use live action when human use, context, or performance carries the message. A hybrid approach is often strongest."),
      faq("What assets should a brand provide before production?", "Provide approved CAD or dimensions, product photography, screen designs, brand guidelines, feature priorities, legal copy, launch timing, required formats, and any hardware details that are still changing."),
      faq("How do we make one hero film work for social?", "Build a shot matrix before animation begins. Identify which moments survive vertical and square crops, protect the product and supers inside safe areas, and create clean product-only or background plates for future cutdowns."),
    ],
  },
  "what-makes-a-liquid-product-film-feel-real": {
    readingTime: "8 min read",
    takeaway: "Realistic liquid comes from a chain of believable decisions: scale, viscosity, surface tension, lighting, refraction, camera timing, and compositing. The simulation is only one part of the shot.",
    sections: [
      section("start-with-behavior", "Start with the liquid's behavior", [
        "Before choosing a solver or building a beautiful shader, define what the liquid should feel like. Water breaks quickly and catches hard highlights. Oil stretches, clings, and moves with more resistance. A serum may form a smooth ribbon, while a carbonated drink introduces bubbles, foam, and small irregular bursts.",
        "Reference should describe behavior, not only color. Collect close-up footage of pours, drips, splashes, rebounds, and settling motion at an appropriate frame rate. Note how the liquid reacts to the bottle, the surface, gravity, and the force that created it. These observations become the visual rules for the shot.",
      ], ["Name the viscosity and surface behavior.", "Decide whether the liquid should feel clean, heavy, elastic, or energetic.", "Use real reference for timing, not only mood boards."]),
      section("build-the-scale", "Build believable scale into every decision", [
        "Liquid often looks artificial when the scene has no convincing scale. A droplet the size of a marble should not fall with the rhythm of a large stream. Surface tension, splash height, bubble size, and camera depth all need to agree about how large the product and the liquid are.",
        "The product itself provides useful scale cues. A cap thread, embossed letter, skin pore, glass edge, or small condensation bead can anchor the audience. Macro cinematography can exaggerate detail, but it cannot remove the need for consistent proportions.",
      ]),
      section("light-material", "Treat liquid as a material and a light event", [
        "Liquid is visible because it redirects light. Refraction, reflection, thickness, absorption, and the environment around the object all matter. A shader with the right transmission value will still look wrong if the surrounding light is flat or the bottle has nothing meaningful to reflect.",
        "Build the lighting around the intended read. Long soft sources can create elegant ribbons across a bottle; hard sources can make a splash feel crisp and energetic. Keep the background and liquid palette controlled so the viewer sees the action before losing it in decorative highlights.",
      ], ["Model thickness where refraction depends on it.", "Use reflections to describe form, not to add random sparkle.", "Test the liquid against both dark and light backgrounds."]),
      section("simulate-direct", "Direct the simulation instead of accepting the first result", [
        "A physically plausible simulation is not automatically a good commercial shot. The stream may hide the label, the splash may peak between useful frames, or the motion may feel too slow for the edit. Use guides, collision shapes, animated forces, and art-directed caches to preserve the intended composition while keeping the motion believable.",
        "Run small tests before committing to high-resolution caches. Approve the timing, silhouette, interaction point, and camera before adding foam, bubbles, secondary droplets, and microdetail. This keeps the expensive part of the process focused on a shot that already works.",
      ]),
      section("composite-for-truth", "Composite for the final sense of truth", [
        "The render becomes convincing when it is integrated with the image around it. Contact shadows, occlusion, motion blur, depth of field, subtle lens behavior, and a coherent grade help the liquid belong to the same camera as the product. Overly clean edges or disconnected grain can make a technically strong simulation feel pasted on.",
        "Review the shot in motion and at thumbnail size. Viewers notice rhythm, silhouette, and the relationship between liquid and product before they inspect the shader. If the motion is legible and the material responds to light consistently, the shot will feel real without needing to show every possible detail.",
      ]),
    ],
    faqs: [
      faq("Do liquid shots always need simulation?", "No. Practical reference, procedural meshes, hand-animated shapes, and 2D compositing can be effective depending on the shot. Simulation is most useful when the liquid needs complex interaction, branching motion, or believable secondary behavior."),
      faq("Why does a liquid render look like plastic?", "Common causes are incorrect scale, insufficient thickness, flat lighting, weak refraction, and a lack of contact with the product or surface. Fix the physical relationships before adding more glossy highlights."),
      faq("How early should liquid tests happen?", "As soon as the shot idea and camera are clear. Low-resolution tests can reveal timing, scale, and composition risk before the team spends time on detailed caches, bubbles, foam, and final shading."),
    ],
  },
  "character-animation-for-advertising-from-performance-to-pipeline": {
    readingTime: "8 min read",
    takeaway: "Character advertising works when performance, design, and production pipeline support one another. Start from the character's intention and physicality, then build the technical system that protects that performance through every shot.",
    sections: [
      section("find-the-performance", "Find the performance before polishing the model", [
        "A character can be beautifully designed and still feel empty if the audience cannot read what it wants, notices, or changes. Begin with the beat of the performance: curiosity, surprise, confidence, hesitation, mischief, relief, or a simple physical action that carries the brand message.",
        "Reference can come from live-action performance, gesture studies, animation tests, or thumbnail drawings. The goal is not to copy a person exactly. It is to discover the timing, weight, eyelines, and change in intention that make the action understandable in a few seconds.",
      ], ["Write the character's objective for each shot.", "Identify the pose or expression the audience must read.", "Choose exaggeration that fits the brand's tone."]),
      section("design-for-motion", "Design the character for motion, not only for a still", [
        "Character design changes once the model needs to bend, turn, squash, stretch, hold an object, or survive a close-up. Silhouette, joint placement, facial proportions, clothing construction, hair, and accessories all affect animation. A design that looks strong in a front view may become unreadable in profile or at speed.",
        "Create a motion-aware model sheet with key poses, expression ranges, scale references, and material notes. This gives modeling, rigging, animation, and look development a shared target and reduces late changes that travel through the whole pipeline.",
      ]),
      section("rig-for-intent", "Rig for the intent of the shot", [
        "A commercial rig should make the intended performance easier to control. Facial controls may need to prioritize a particular smile, eye direction, or stylized mouth shape. Body controls should support the character's center of gravity, planted contact, and the exaggeration that makes the action visible.",
        "Do not build every possible control before testing a short performance. A focused rig test can expose deformation problems, confusing controls, or a weak silhouette while the team can still adjust the design. The best rig is not the one with the longest control list; it is the one that gives the animator clear decisions.",
      ], ["Test the hero expression early.", "Check hands, feet, and object contact in motion.", "Keep animator-facing controls named and organized."]),
      section("animate-for-read", "Animate for readability at campaign speed", [
        "Advertising often compresses a character beat into one or two seconds. Holds, accents, anticipation, and clean silhouettes matter because the audience may see the shot once, on a small screen, with sound off. A technically subtle performance can disappear if the timing is too even or the pose changes too quickly.",
        "Review blocking before detail. Confirm the action reads without facial polish, then refine arcs, spacing, overlap, and secondary motion. Camera distance and lens choice are part of the performance; a close-up needs different acting choices from a full-body shot.",
      ]),
      section("keep-the-pipeline-reusable", "Keep the pipeline reusable across deliverables", [
        "Campaign characters are rarely used in only one film. Plan for alternate aspect ratios, short reactions, still poses, product interactions, and future edits. Keep the master rig and animation controls separated from shot-specific effects so the asset can be adapted without rebuilding it.",
        "A clean handoff includes approved model and texture versions, rig notes, animation caches or scenes, naming conventions, and a record of what is locked. Reuse becomes a creative advantage when the technical structure is designed for it from the start.",
      ]),
    ],
    faqs: [
      faq("Should a brand start with a character design or a script?", "They should develop together. The script defines the action and intention, while the character design determines what can be communicated through silhouette, expression, and movement. Test the character in the key performance before finalizing either."),
      faq("How long does character animation take?", "It depends on design complexity, rigging, number of characters, performance length, interaction, revisions, and deliverables. A short performance can still require substantial work when facial animation, cloth, hair, or precise object contact are involved."),
      faq("Can one character be reused across a campaign?", "Yes, if the master asset is built with reusable controls, materials, and scale references. Plan alternate poses, camera distances, aspect ratios, and product interactions before production is complete."),
    ],
  },
  "how-to-build-a-beauty-film-with-3d-vfx-and-macro-detail": {
    readingTime: "8 min read",
    takeaway: "A beauty film feels premium when macro detail serves a clear sensory idea. Build the product, surface, light, and transition language as one system so every close-up feels intentional rather than merely glossy.",
    sections: [
      section("define-the-sensory-idea", "Define the sensory idea before collecting references", [
        "Beauty communication often depends on an experience that cannot be explained by a specification alone: cool hydration, weightless absorption, rich nourishment, clean precision, or a ritual that feels calming. Name that experience first. It will guide material, color, speed, camera distance, and sound.",
        "A reference board should include behavior as well as beauty imagery. Look for how light travels across skin, how a cream folds, how a droplet holds to glass, how a powder breaks, or how a surface changes after contact. These details give the film a believable sensory vocabulary.",
      ]),
      section("protect-the-pack", "Protect packaging truth inside a stylized world", [
        "Macro photography magnifies every mistake. Label spacing, cap geometry, glass thickness, pump mechanics, print finishes, and color relationships must be approved before the hero shots are polished. Use a clean product asset and keep graphic artwork at the right resolution so the pack stays credible in close-up.",
        "If the brand has multiple variants, establish a master material and color system rather than treating each bottle as a separate object. That makes future shade, scent, or size adaptations faster and keeps the campaign visually coherent.",
      ], ["Confirm final artwork and regulatory copy.", "Lock the product dimensions and closure behavior.", "Create a neutral product turntable before the hero lighting."]),
      section("make-macro-readable", "Make macro detail readable, not just extreme", [
        "Macro scale changes the way the audience reads a shot. A beautiful texture can become noise if there is no focal hierarchy. Choose one dominant detail per frame: a liquid thread, a soft skin plane, a surface reflection, a powder bloom, or a precise edge catching light.",
        "Depth of field, camera movement, and focus pulls should reveal information in an order the eye can follow. Extreme shallow focus can feel luxurious, but it can also hide the product or make a transition impossible to understand. Use the lens as part of the narrative, not as a permanent filter.",
      ]),
      section("combine-3d-and-vfx", "Combine 3D and VFX around the same light logic", [
        "Beauty work often combines digital product animation, practical plates, particles, fluid effects, retouching, and compositing. The pieces will feel separate if they do not share a camera, direction of light, color temperature, and level of imperfection. Establish those rules before the effects department begins.",
        "Track the hero plate carefully, preserve natural contact and shadow behavior, and avoid removing every irregularity. Small variations in highlights, surface texture, and motion can make the final image feel photographed rather than sterilized.",
      ], ["Track plates before designing the effect.", "Keep one light direction across product and environment.", "Retain controlled texture and natural falloff."]),
      section("finish-with-restraint", "Finish with restraint and a clear product moment", [
        "Premium beauty work is often defined by what it refuses to add. More particles, more flares, and more reflections do not automatically create luxury. The final sequence should give the viewer time to register the pack, the sensory benefit, and the brand world before moving on.",
        "Review the film with the supers, sound, and end frame in place. A texture that is beautiful in isolation can compete with a claim or make a pack unreadable. The finished film should feel rich, but the message should remain easy to find.",
      ]),
    ],
    faqs: [
      faq("Is beauty product animation better in 3D or live action?", "The answer depends on the sensory idea. Use 3D for precise pack control, impossible macro travel, liquids, and repeatable variants. Use live action for skin, human ritual, and tactile authenticity. Many strong films combine both."),
      faq("How do you keep a macro beauty render from looking artificial?", "Use accurate packaging, believable scale, controlled reflections, natural depth of field, subtle texture, and consistent light. Avoid relying on glossy highlights or excessive effects to signal premium quality."),
      faq("What should be approved before final beauty renders?", "Approve the product model, artwork, material behavior, hero camera, focus strategy, color direction, sensory reference, and any claims or regulatory copy before committing to high-resolution effects and lighting."),
    ],
  },
  "designing-a-social-first-3d-campaign-that-still-feels-premium": {
    readingTime: "7 min read",
    takeaway: "Social-first 3D is not a smaller television commercial. Build the campaign around fast comprehension, repeatable visual rules, and formats that feel native to the feed without sacrificing art direction.",
    sections: [
      section("start-with-feed-behavior", "Start with the behavior of the feed", [
        "A social viewer may see the first frame for less than a second, watch without sound, or encounter the film between unrelated posts. That does not mean the work should become loud and frantic. It means the opening image, silhouette, motion direction, and caption relationship need to communicate quickly.",
        "Define what the viewer should understand before the first cut and what can be revealed later. A strong social-first concept has an immediate visual question: what is changing, why is the product there, or what unusual motion is about to happen? The answer can still unfold with taste.",
      ], ["Design the first frame as carefully as the end frame.", "Test the idea muted and at small size.", "Keep the brand cue visible without making the opening feel like a packshot."]),
      section("build-a-visual-engine", "Build a visual engine instead of isolated posts", [
        "A campaign feels premium when its posts share a recognizable logic. That logic may come from a camera move, a material transformation, a repeated shape, a color system, a character behavior, or a relationship between product and environment. Define the rule once, then explore how it behaves across content.",
        "A visual engine makes volume more manageable. Artists can create new moments without inventing a new world for every post, while the audience gets the pleasure of recognizing a system. The rule should be flexible enough to create variation and specific enough to feel owned.",
      ]),
      section("design-for-ratio", "Design for ratio and duration from the beginning", [
        "Vertical, square, and landscape versions are not simple crops. A product may need different scale, a character may need a different staging position, and text may need a completely different safe area. Include the real output matrix in storyboards and animatics rather than solving it after the hero render.",
        "Short duration can be an advantage when each beat is purposeful. Build a library of entrances, reveals, material moments, and end frames that can be recombined into six-second, ten-second, and fifteen-second edits without flattening the idea.",
      ], ["Map safe areas for every platform.", "Choose which shots need alternate staging.", "Keep clean plates and isolated product passes for cutdowns."]),
      section("make-premium-readable", "Make premium quality readable at social speed", [
        "Detail only matters when compression and viewing size preserve it. Large readable shapes, disciplined color, clean lighting, and intentional motion often communicate quality better than tiny simulations. If the visual depends on a subtle texture, design a larger contrast cue around it.",
        "Sound can deepen the work, but the visual should not collapse when muted. Use typography, composition, and movement to carry the basic idea, then let music and sound design add rhythm and reward rather than essential explanation.",
      ]),
      section("measure-with-learning", "Release with a learning loop", [
        "A social campaign should be designed to learn. Compare openings, pacing, end frames, copy length, and product visibility while protecting the core visual system. Performance data can reveal whether a beautiful transition hides the message or whether a quieter frame creates stronger retention.",
        "Do not let optimization erase the brand idea. The purpose of a visual system is to make iteration more intelligent, not to replace art direction with random variation. Keep a record of what changed and why so later posts become more deliberate.",
      ]),
    ],
    faqs: [
      faq("How long should a social-first 3D animation be?", "There is no single ideal duration. Build a flexible system that can produce short hooks, six-to-ten-second moments, and longer edits when the idea benefits from development. The first beat and product clarity matter more than a fixed number of seconds."),
      faq("Should every social post use a different 3D world?", "Usually no. A shared visual engine creates recognition and makes production more efficient. Variation should come from how the rule behaves, not from discarding the campaign identity every time."),
      faq("How can social 3D still feel premium?", "Use intentional composition, strong material and lighting decisions, readable motion, controlled typography, and enough negative space. Premium quality survives when the visual hierarchy is clear at small size and without sound."),
    ],
  },
  "a-practical-guide-to-3d-packaging-animation-for-fmcg-brands": {
    readingTime: "8 min read",
    takeaway: "Packaging animation is a system of accurate product design, material behavior, brand hierarchy, and repeatable camera language. Build the system once so every SKU can feel related without feeling copied.",
    sections: [
      section("clarify-the-pack-role", "Clarify what the pack needs to do in the film", [
        "An FMCG package can be the hero, a recognition cue, a gateway into a sensory world, or the final proof of a broader campaign idea. Decide which role it plays before planning the animation. A bottle that must communicate freshness needs a different visual treatment from a pack that must communicate heritage or premium craft.",
        "Write down the hierarchy of recognition: brand, product name, variant, benefit, and any mandatory claim. This hierarchy should influence camera distance, label orientation, lighting contrast, and how long the pack is held on screen.",
      ], ["Define the must-read side of the package.", "Separate mandatory information from decorative artwork.", "Agree which variant or SKU is the hero."]),
      section("model-the-master", "Model a master package asset", [
        "Start with approved dimensions, dielines, CAD, product photography, and final artwork. A master asset should include the packaging geometry, label placement, cap or closure behavior, material layers, and realistic variations in roughness and thickness. Small inaccuracies become visible when the camera moves close.",
        "Use a variant system instead of duplicating the entire scene for every SKU. Keep the package structure consistent, then change approved colors, labels, liquid contents, and accessories through controlled parameters. This protects both brand consistency and production speed.",
      ]),
      section("animate-the-reason", "Animate the package for a reason", [
        "A rotating packshot is useful when it reveals form, but motion becomes more memorable when it supports the product story. The pack can emerge from ingredients, travel through a campaign world, respond to a physical force, or transform into a useful serving moment. The animation should explain why the viewer is being asked to look.",
        "Camera choreography should keep the product legible. Avoid turning the package so quickly that the label becomes a flash of color. Use holds, controlled arcs, and motivated transitions to balance energy with recognition.",
      ], ["Choose one hero movement.", "Protect label readability through the key beat.", "Use transitions that reinforce the product benefit."]),
      section("make-materials-sell", "Make materials carry sensory meaning", [
        "Plastic, glass, foil, paper, metal, and liquid each reflect the brand differently. The material treatment should answer what the product promises: crisp and cool, warm and handmade, clean and clinical, rich and indulgent, or energetic and youthful. Surface detail should be specific enough to feel real without becoming visual noise.",
        "Lighting should reveal structure and packaging finish before it adds drama. A controlled highlight can describe a glossy pouch; a broad soft reflection can show glass; a broken highlight can support a textured paper label. The best material tests happen before final animation, when changes are still inexpensive.",
      ]),
      section("scale-the-campaign", "Scale the campaign without losing the family", [
        "Once the hero package and lighting language are approved, design a library of reusable shots: product turn, open-and-pour, ingredient interaction, variant reveal, retail lineup, and clean end frame. These modules can support master films, social edits, stills, ecommerce, and retail screens.",
        "Keep a clear record of which assets, colors, claims, and camera moves are approved. FMCG campaigns often expand late. A disciplined package system turns a late SKU request into a controlled adaptation instead of a new production crisis.",
      ]),
    ],
    faqs: [
      faq("What makes FMCG packaging difficult to animate?", "Small inaccuracies in labels, proportions, closures, print finishes, transparency, and liquid behavior become obvious in close-up. The package must be technically accurate and visually readable while still moving with energy."),
      faq("Can one 3D package asset support multiple SKUs?", "Yes. Build a master geometry and material system with controlled variant parameters. Keep artwork, color, liquid, and pack-specific details modular so adaptations do not create inconsistent duplicates."),
      faq("Should a packaging film include ingredients?", "Only when they help explain the product promise or sensory experience. Ingredients can create useful transitions and scale, but they should not hide the package hierarchy or replace a clear product moment."),
    ],
  },
  "motion-systems-for-brand-campaigns-making-many-assets-feel-one": {
    readingTime: "7 min read",
    takeaway: "A motion system gives a campaign repeatable behavior: how it enters, transforms, pauses, exits, and makes space for brand information. The result is consistency with enough variation to stay alive.",
    sections: [
      section("define-the-motion-grammar", "Define the motion grammar", [
        "A brand motion system is more than a transition pack. It describes how the identity behaves over time: whether movement is calm or sharp, whether objects orbit or slide, how far elements overshoot, how a reveal resolves, and how the frame returns to rest. These rules make separate assets feel related.",
        "Start by naming a small set of behaviors that express the brand's character. A precise technology brand may use controlled alignment and restrained easing. A playful FMCG brand may use elastic scale, bounce, and material response. The grammar should be specific enough to recognize and simple enough for teams to use.",
      ], ["Choose entrance, emphasis, transition, and exit behaviors.", "Define speed ranges and easing character.", "Write down what the system should never do."]),
      section("map-the-hierarchy", "Map motion to information hierarchy", [
        "Motion should help the audience understand what matters first. A hero product, campaign title, benefit, and supporting detail should not all arrive with equal force. Assign different movement roles to different levels so the eye can follow the message.",
        "A useful test is to mute the sound and watch only the movement. If the hierarchy is still visible, the system is doing communication work. If everything flashes, spins, or scales at once, the motion is competing with the information it should support.",
      ]),
      section("build-the-library", "Build a reusable motion library", [
        "Document examples instead of relying on verbal descriptions. The library can include title reveals, product entrances, logo behavior, card transitions, grid changes, scroll moments, and end frames. Each example should show the intended timing and include notes about when the behavior is appropriate.",
        "For 3D campaigns, keep the library connected to the asset and camera system. Reusable materials, rigs, lighting setups, and render passes make the motion language easier to carry across a hero film, cutdown, social post, and still-image sequence.",
      ], ["Create a small set of canonical examples.", "Separate brand rules from project-specific effects.", "Name files and controls so another team can find them."]),
      section("allow-variation", "Allow variation inside the rules", [
        "Consistency is not repetition. The same motion system should support different speeds, scales, products, crops, and emotional moments. Give designers controlled degrees of freedom: a range of duration, a choice of direction, a few approved transition types, and rules for when the system can break.",
        "A campaign becomes memorable when the audience recognizes the underlying behavior but still discovers something new in each asset. Variation should be designed, not left to random animation decisions made under deadline pressure.",
      ]),
      section("govern-the-system", "Govern the system through production", [
        "A motion system needs ownership. Decide who approves new behaviors, how exceptions are recorded, and which examples remain the source of truth. Without governance, a system slowly becomes a collection of unrelated tricks.",
        "Review a set of real deliverables together rather than approving rules in isolation. Check how the motion behaves with legal copy, product photography, subtitles, different aspect ratios, and compressed exports. The system is successful when it survives actual campaign pressure.",
      ]),
    ],
    faqs: [
      faq("What belongs in a brand motion system?", "Include timing and easing, entrance and exit behavior, transition logic, logo and typography motion, hierarchy rules, approved examples, aspect-ratio guidance, and clear exceptions. It should explain behavior, not only show a reel."),
      faq("How many motion behaviors should a campaign start with?", "Start small: a few entrances, emphasis moves, transitions, and end frames. A focused system is easier to recognize and apply than a large library of loosely related effects."),
      faq("Can a 3D motion system support static campaign assets?", "Yes. The same camera language, material relationships, composition rules, and visual rhythm can guide key visuals and stills. Static assets can become frames from the same campaign world instead of disconnected artwork."),
    ],
  },
  "how-vfx-and-3d-share-the-frame-in-product-advertising": {
    readingTime: "8 min read",
    takeaway: "The cleanest product advertising assigns each frame to the medium that can express it best. VFX brings captured reality and performance; 3D brings control, impossible behavior, and product precision. The frame must make them feel like one image.",
    sections: [
      section("assign-the-frame", "Assign the frame before assigning the tool", [
        "Begin with the visual job of each shot. A real hand opening a package may carry trust and tactility. A digital cross-section may explain construction more clearly than a physical teardown. A practical environment may establish scale, while a 3D extension can make the product travel somewhere impossible.",
        "Make a shot-by-shot decision about what should be filmed, modeled, simulated, or composited. This avoids building a hybrid pipeline by habit. The goal is not to show off VFX or 3D; it is to make the idea easier to believe and remember.",
      ]),
      section("capture-for-post", "Capture the information post-production will need", [
        "Hybrid work succeeds or fails in pre-production. Camera tracking markers, lens information, HDRI or reference photography, clean plates, product measurements, lighting continuity, and witness cameras can save weeks later. If the digital team cannot reconstruct the filmed shot, visual integration becomes guesswork.",
        "Bring VFX and 3D supervision into the shoot when the digital element is important. A small decision on set—camera height, light direction, product orientation, or background movement—can prevent an expensive compromise in post.",
      ], ["Record lens and camera data.", "Capture clean plates and lighting references.", "Confirm the product's position and scale in the physical scene."]),
      section("match-the-light", "Match light, lens, and physical contact", [
        "The audience reads integration through relationships: the direction of light, softness of shadow, level of contrast, depth of field, motion blur, and how objects touch or occlude one another. A perfect 3D asset can look wrong when it does not share the camera's imperfections.",
        "Start with large relationships before polishing. Match perspective and camera movement, then solve shadow and contact, then refine reflections, grain, distortion, and color. The order matters because detail cannot rescue a mismatch in scale or light direction.",
      ]),
      section("protect-the-product", "Protect product truth while adding spectacle", [
        "Product advertising often needs both excitement and accuracy. VFX can add energy around a product, but it should not distort the features the viewer is meant to evaluate. Maintain a clean master product pass, approved artwork, and a readable end frame even when the surrounding world becomes abstract.",
        "Use digital doubles when the camera or effect requires control, but compare them to approved references at every milestone. Small changes in bevel, screen ratio, cap shape, or label placement can weaken confidence even when the shot is visually impressive.",
      ]),
      section("finish-as-one-image", "Finish the frame as one image", [
        "The final composite should not advertise which department made which element. Grain, lens behavior, atmospheric depth, color, motion blur, and edge treatment should unify the frame. Keep enough texture and imperfection to preserve photographic credibility without making the product feel dirty or unclear.",
        "Review the work in motion, not only as stills. A composite that looks convincing frame by frame can still fail through a sliding shadow, inconsistent reflection, or a product that appears to float during a camera move. Integration is a temporal problem as much as a visual one.",
      ]),
    ],
    faqs: [
      faq("When should VFX and 3D teams join a product shoot?", "As early as the shot design stage, and ideally before the shoot. They can identify tracking, lighting, lens, product, and clean-plate requirements before the camera is rolling."),
      faq("Should the product always be filmed instead of rendered?", "No. Film it when physical interaction or authenticity is central; render it when control, variants, impossible movement, or product precision is central. Many campaigns use a digital double for selected shots and a real product for others."),
      faq("What makes a hybrid composite feel fake?", "Common causes are mismatched perspective, lighting, shadow, motion blur, depth of field, scale, or contact. Solve those relationships first, then add surface detail and grading."),
    ],
  },
  "what-to-put-in-a-commercial-animation-brief-before-you-contact-a-studio": {
    readingTime: "7 min read",
    takeaway: "A useful animation brief gives a studio enough context to make decisions: the business objective, audience, visual opportunity, delivery reality, timing, and constraints. It does not need to prescribe every shot.",
    sections: [
      section("write-the-outcome", "Write the outcome in plain language", [
        "Start with the change the campaign should create. Is the audience discovering a new product, choosing between options, understanding a technical benefit, or feeling a brand shift? A studio can respond creatively when the business and audience problem is clear.",
        "Avoid opening with a list of effects or software preferences. Those may be useful constraints later, but the strongest creative response begins with the reason the film needs to exist and what the viewer should take away from it.",
      ], ["Business objective", "Audience and market", "One-sentence viewer takeaway", "Success signal or action"]),
      section("define-the-deliverables", "Define the deliverables and where they will live", [
        "A thirty-second film for a cinema, a fifteen-second vertical edit, a product-page loop, and a set of stills may come from one campaign idea but they are different production requirements. Include platforms, durations, aspect ratios, resolution, captions, sound needs, and whether clean versions are required.",
        "If the matrix is not final, provide the likely range. Early visibility lets the studio design a camera and asset system that can support real outputs instead of treating every adaptation as an emergency crop.",
      ]),
      section("share-the-visual-world", "Share references with reasons", [
        "A reference image is more useful when the brief explains what it contributes: the camera distance, material feeling, pacing, color temperature, performance, or emotional tone. Tell the studio which references are mandatory and which are simply directional.",
        "Include existing brand work, competitor examples, product photography, packaging files, typography, legal guidance, and any visual territory the brand should avoid. A good reference set gives both permission and boundaries.",
      ], ["What to keep", "What to avoid", "What is still open for exploration"]),
      section("show-the-constraints", "Show the constraints early", [
        "Mention launch dates, approval layers, budget range, product availability, usage rights, regional versions, legal review, talent or location restrictions, and any NDA requirements. A constraint is not a problem when it is visible early; it becomes a problem when the team discovers it after the creative direction is locked.",
        "Also state who can approve creative, product accuracy, and final delivery. Consolidated feedback protects the schedule and prevents the studio from receiving contradictory notes from different stakeholders.",
      ]),
      section("leave-room-for-response", "Leave room for the studio to solve the production", [
        "The best brief is specific about the objective and open about the route. Ask the studio to respond with a point of view, visual development, production approach, schedule, assumptions, and questions. This gives you evidence of how the team thinks rather than only a compliance check against a predetermined shot list.",
        "If you already have a detailed storyboard, share it as a starting point and identify what is locked. If the idea is still open, say so. Clarity about what can change helps the studio put creative energy in the right place.",
      ]),
    ],
    faqs: [
      faq("How long should a commercial animation brief be?", "Long enough to explain the objective, audience, idea, references, deliverables, timing, budget context, and constraints. A concise, well-structured brief is more useful than a long document that hides the decision points."),
      faq("Should a brief include a storyboard?", "Include one if it exists, but label what is approved and what is exploratory. A storyboard can communicate intent while the studio still needs room to recommend the right production method and improve the sequence."),
      faq("Should we share a budget range?", "Usually yes. A range helps the studio design a realistic scope and identify tradeoffs. Without it, teams may make incompatible assumptions about complexity, deliverables, and revision depth."),
    ],
  },
  "from-key-visual-to-campaign-world-extending-one-idea-across-deliverables": {
    readingTime: "8 min read",
    takeaway: "Turn a key visual into a campaign world by extracting its rules: hierarchy, geometry, material, light, camera, and emotional temperature. Then build those rules as a flexible system that can generate film, social, stills, and future brand content.",
    sections: [
      section("read-the-system", "Read the key visual as a system", [
        "A key visual is often treated as a finished pose: a product in one place, a character holding one expression, or a composition that works only at one crop. The more useful reading asks what makes the image recognizable. Which element dominates? Where does the eye travel? What is the relationship between product, space, color, and light?",
        "Write those observations down before opening a 3D package or planning a motion test. Separate visual constants from flexible details. The constant might be a sharp diagonal, a cool-to-warm gradient, a floating product, a particular amount of negative space, or a contrast between polished material and rough texture. Those rules are the beginning of a campaign world.",
      ], ["List the image's visual constants.", "Separate hero elements from supporting texture.", "Describe the feeling the frame should keep in motion."]),
      section("extract-the-rules", "Extract rules for shape, material, and light", [
        "A campaign world becomes useful when its ingredients can be described in production terms. Identify the shape language: rounded, modular, faceted, stacked, organic, or architectural. Identify the material language: glass, coated paper, brushed metal, liquid, fabric, skin, or a deliberately unreal surface. Then identify how light reveals those materials.",
        "This translation does not make the work less creative. It gives artists something they can test and repeat. A visual direction such as 'premium and energetic' becomes more actionable when it includes a high-contrast key, a narrow highlight, fast but controlled camera arcs, and a limited accent color.",
      ], ["Shape vocabulary", "Material and surface behavior", "Light direction and contrast", "Color and atmosphere"]),
      section("build-the-world", "Build the smallest world that can carry the idea", [
        "You do not need to model an entire universe to extend a key visual. Build the smallest set of assets, surfaces, lighting states, and camera positions that can produce meaningful variation. A hero environment may need only one architectural gesture, one transition surface, and a set of product or character anchors.",
        "Use an animatic or low-fidelity layout to test the world before polishing. Can the camera leave the original pose and return to it? Can the product move without losing its hierarchy? Can the world create a second or third frame that still feels like the same campaign? If not, the system needs more structure before detail.",
      ]),
      section("design-the-deliverables", "Design film, social, and stills together", [
        "A campaign world is valuable because it can support more than one output. Plan the hero film, cutdowns, vertical moments, product loops, key visuals, thumbnails, and future updates as related compositions. That does not mean every asset should look identical. It means the audience should recognize the same visual logic across formats.",
        "Camera and layout decisions should respect the delivery matrix from the start. A strong wide composition may need a new vertical staging rather than a crop. A still may need a held pose and clean negative space. A social loop may need a motion cycle that returns naturally to its opening state.",
      ], ["Choose which moments are hero-only.", "Create reusable product, character, and environment passes.", "Protect safe areas for type and platform crops."]),
      section("protect-the-core", "Let the world expand without losing the original idea", [
        "The danger of extension is that the campaign becomes a collection of attractive images with no center. Keep a short creative test beside the production work: if someone sees an adapted frame without the original key visual, can they still identify the same idea? If not, bring back the dominant shape, material, camera behavior, or emotional temperature.",
        "The strongest systems create both continuity and discovery. The viewer recognizes the campaign, then finds a new way the rule behaves. That is the difference between resizing one image and building a world that can keep generating useful brand content.",
      ]),
    ],
    faqs: [
      faq("What should be extracted from a key visual first?", "Start with hierarchy, shape, material, light, color, camera position, and emotional temperature. Then separate the elements that must remain recognizable from the details that can evolve across deliverables."),
      faq("Does extending a key visual require a full 3D environment?", "No. Build only the assets and rules needed to create meaningful variation. A focused environment with reusable surfaces, lights, cameras, and product anchors can support a surprisingly broad campaign system."),
      faq("How do we keep adaptations from feeling repetitive?", "Keep the underlying rules consistent while varying camera, scale, timing, crop, interaction, and emphasis. The audience should recognize the system without seeing the same pose repeated in every format."),
    ],
  },
  "3d-commercial-animation-in-indonesia-from-brief-to-broadcast": {
    readingTime: "8 min read",
    takeaway: "A strong Indonesian commercial animation moves through a clear chain from brief to broadcast: local context, visual idea, production plan, craft, approvals, and delivery. Each handoff should protect the original communication problem.",
    sections: [
      section("start-with-context", "Start with the Indonesian audience and context", [
        "Commercial animation is never only a technical exercise. The product category, cultural reference, language, channel, and audience behavior all affect what feels clear and credible. A visual that reads as premium in one market may feel distant or overly formal in another.",
        "Include local insight in the brief rather than treating it as a last-minute copy check. Explain the audience, campaign moment, seasonal context, and any cultural signals that the work should respect or avoid. Local fluency helps the studio make the visual world feel intentional rather than generic.",
      ]),
      section("translate-the-brief", "Translate the brief into a visual proposition", [
        "Once the objective is clear, reduce the film to a visual proposition: what the viewer sees changing, how the product or character creates that change, and what feeling remains at the end. A proposition gives the team a decision filter for references, storyboard, design, and effects.",
        "Keep the idea strong enough to survive different delivery lengths. A broadcast master may develop the world, while a social cutdown may show only the transformation and product proof. The proposition is what keeps both versions related.",
      ], ["Audience truth", "Product or brand role", "Visual transformation", "End-frame message"]),
      section("plan-the-pipeline", "Plan the pipeline before final look development", [
        "Commercial 3D typically moves through concept, storyboard, animatic, asset creation, look development, animation, simulation, lighting, rendering, compositing, sound, and delivery. The exact order can flex, but the dependencies should be explicit. A late change to product geometry or camera can affect every downstream stage.",
        "Use early tests to reduce risk. Approve camera and timing in a simple animatic, approve material direction in a look test, and approve a difficult simulation at low resolution before scaling it up. The more specific the test question, the more useful the approval.",
      ]),
      section("run-approvals", "Run approvals as a production system", [
        "Most schedule problems are not caused by one difficult render. They come from unclear notes, fragmented approvals, or a late stakeholder seeing the work for the first time. Decide who consolidates feedback and what is locked at each milestone.",
        "A good production review distinguishes creative direction, product accuracy, technical feasibility, and delivery requirements. That lets the team solve the right problem without reopening every decision whenever a new note arrives.",
      ]),
      section("deliver-beyond-master", "Deliver beyond the broadcast master", [
        "Plan the handoff for the places the campaign will actually live: television, cinema, social, retail, ecommerce, presentations, and internal launch materials. Protect clean product frames, text-safe compositions, alternate crops, and required audio versions early.",
        "An Indonesian commercial can be locally fluent and internationally usable. A disciplined asset and render structure makes future cutdowns, subtitling, regional versions, and social adaptations more efficient without losing the visual character of the original film.",
      ]),
    ],
    faqs: [
      faq("How early should a 3D studio be involved in an Indonesian campaign?", "Bring the studio in while the visual idea and delivery matrix are still being shaped. Early involvement lets the team identify production risks, choose the right mix of 3D and live action, and plan assets for local and regional outputs."),
      faq("What are the main stages of a commercial 3D pipeline?", "Most projects include brief and treatment, storyboard, animatic, asset and look development, animation, simulation, lighting, rendering, compositing, sound, and delivery. The exact order changes with the project, but approvals should be explicit."),
      faq("Can an Indonesian studio deliver for international campaigns?", "Yes. A structured review process, clear files and approvals, and a disciplined production pipeline make remote collaboration practical. Local insight can remain an advantage while delivery serves regional or global brand standards."),
    ],
  },
  "3d-product-animation-for-indonesian-brands-designing-desire": {
    readingTime: "7 min read",
    takeaway: "Product animation for Indonesian brands should turn product truth into desire: show what the object is, make its benefit felt, and create a visual world that respects local audience context without becoming generic.",
    sections: [
      section("find-the-desire", "Find the desire behind the specification", [
        "A product has features, but people choose what those features mean in their lives. A faster device may mean less waiting, a better package may mean easier sharing, and a more refined material may signal confidence. Product animation becomes persuasive when it translates specification into a visual experience.",
        "Start by naming the emotional and practical benefit. Then choose the physical event that expresses it: a clean transformation, a satisfying interaction, a reveal of hidden construction, or a world that makes the benefit visible. The event should be specific to the product rather than a generic CGI flourish.",
      ]),
      section("keep-local-clarity", "Keep local clarity in the visual language", [
        "Indonesian audiences are not a single visual category, but campaigns can still benefit from local fluency in language, context, rhythm, and use. Pay attention to how the product appears in everyday life, where it is encountered, and which references feel familiar rather than imported.",
        "Local relevance does not require adding obvious cultural symbols to every frame. It can come through casting, environment, copy, color, behavior, and the practical situation the product solves. The key is to make the context feel observed rather than decorated.",
      ]),
      section("build-the-asset", "Build a product asset that can carry desire", [
        "Accuracy is the foundation of desire. Model the product from approved references, preserve proportions, match surface response, and build the asset so it can survive close-up. When the product is right, the team can explore light and camera without spending every review correcting geometry.",
        "Use a master asset with controlled variants for color, material, interface, package, and accessories. This makes the campaign adaptable for launch, retail, social, and future updates while keeping the visual identity unified.",
      ], ["Approved product geometry", "Final artwork and color references", "Variant and delivery plan"]),
      section("direct-the-camera", "Direct the camera toward a decision", [
        "A product camera move should reveal something. It can make the silhouette feel light, expose a detail, show an interaction, or place the product in an emotional world. If the camera is moving only to demonstrate technical skill, the audience may feel motion without understanding.",
        "Use holds and clear transitions around the information that matters. A controlled product moment can feel more premium than a faster sequence because it gives the viewer time to recognize form, material, and benefit together.",
      ]),
      section("design-for-reuse", "Design the film to keep working after launch", [
        "The first film is rarely the last content a brand needs. Plan isolated product rotations, feature moments, clean end frames, still poses, vertical crops, and short loops. These assets can support social, ecommerce, dealer screens, and product updates.",
        "Reuse should not mean repeating the same shot everywhere. Build a library of controlled components that can be recombined while preserving the same product truth and motion character.",
      ]),
    ],
    faqs: [
      faq("What makes product animation persuasive?", "It connects product accuracy to a clear benefit and gives the camera a reason to move. The visual should help the audience understand what the object is, why it matters, and how it fits the brand world."),
      faq("Does local relevance require showing Indonesian locations?", "Not always. Local relevance can come through language, use case, rhythm, casting, color, and audience insight. The context should feel specific and observed rather than added as decoration."),
      faq("Can product animation assets be reused for ecommerce?", "Yes. Plan clean product views, variant controls, still frames, isolated passes, and alternate crops during production. That makes the master film a source for useful launch and sales content."),
    ],
  },
  "ai-animation-for-commercials-from-exploration-to-final-frame": {
    readingTime: "8 min read",
    takeaway: "Use AI in commercial animation where it expands exploration or removes repetitive work, then bring the idea through a controlled 3D and post-production pipeline so the final frame remains coherent, accurate, and ownable.",
    sections: [
      section("separate-exploration", "Separate exploration from final production", [
        "AI can generate many visual directions quickly, which makes it useful at the beginning of a project. It can help a team test atmosphere, composition, character territory, color, and surreal transitions before committing to a detailed build. Exploration is valuable when it produces better decisions, not simply more images.",
        "The final production question is different. A commercial shot must maintain character identity, product accuracy, camera continuity, legal confidence, and repeatable revisions. Decide early which images are references, which are approved design targets, and which must be rebuilt or controlled in 3D.",
      ], ["Use AI to widen the option set.", "Select a clear visual target.", "Rebuild the elements that require continuity and accuracy."]),
      section("make-the-reference", "Turn a reference into a production plan", [
        "An AI image is not a shot list. Analyze the reference for camera, lens feel, light direction, geometry, material behavior, motion opportunity, and compositing layers. Annotate what must stay and what can change. This turns a seductive still into a brief that artists can actually execute.",
        "Build a look test or simple 3D blockout against the reference. If the camera and hierarchy work before polish, the team has a foundation. If they do not, generating more variations will only hide the underlying decision.",
      ]),
      section("protect-continuity", "Protect continuity across frames", [
        "Commercial animation is judged as a sequence. Products drift, characters change, materials flicker, and text mutates when a generative process is asked to carry continuity without a stable asset or reference system. Use 3D models, tracked cameras, controlled passes, and compositing to anchor what must remain consistent.",
        "AI can still contribute to backgrounds, texture ideas, matte exploration, or selected motion experiments when the boundaries are clear. The important thing is to know which pixels are allowed to improvise and which pixels are brand truth.",
      ]),
      section("direct-the-hybrid", "Direct the hybrid workflow", [
        "A hybrid pipeline needs one creative owner and one clear visual target. The team should decide when an AI-generated result is useful, when it needs cleanup, and when it should be replaced with a controlled render. Without that decision path, the project can spend its time polishing an image that cannot support the campaign.",
        "Keep versions and references organized. Record prompts or source references where appropriate, note selected elements, and preserve the approved direction. This makes revisions explainable and reduces the risk of returning to an earlier inconsistency.",
      ], ["Define approved reference frames.", "Track generated and rebuilt elements.", "Keep product, type, and identity under controlled systems."]),
      section("finish-with-judgment", "Finish with human judgment", [
        "The final frame needs art direction, not only technical assembly. Check composition, movement, material truth, brand hierarchy, cultural fit, legal risk, and how the image behaves beside the rest of the campaign. AI can accelerate options, but a strong commercial result still depends on selection and restraint.",
        "The audience does not need to know which tool produced a surface. They need to feel that the image belongs to one intentional world. The best AI-assisted work makes the process invisible and the idea unmistakable.",
      ]),
    ],
    faqs: [
      faq("Should AI-generated images be used as final commercial frames?", "Sometimes, when rights, continuity, product accuracy, and brand requirements are controlled. For many hero shots, AI is more valuable as exploration or reference while 3D and compositing provide repeatable final control."),
      faq("How do we keep AI animation consistent?", "Anchor the sequence with stable 3D assets, tracked cameras, controlled lighting, approved reference frames, and compositing passes. Define which elements may change and which must remain exact."),
      faq("Where does AI create the most value in a commercial workflow?", "It is especially useful for rapid visual exploration, mood and world development, reference generation, texture ideas, and selected repetitive tasks. Its value is highest when it improves a decision or removes low-value labor."),
    ],
  },
  "ai-production-for-advertising-in-indonesia-a-practical-workflow": {
    readingTime: "8 min read",
    takeaway: "A practical AI production workflow for advertising begins with a real communication goal, uses AI for directed exploration and acceleration, and keeps final brand truth inside a reviewable production system.",
    sections: [
      section("begin-with-governance", "Begin with governance, not novelty", [
        "Before choosing a tool, agree what the campaign needs to protect: product identity, talent likeness, cultural representation, brand safety, rights, confidential information, and approval records. These decisions determine where AI can be used responsibly and where a controlled pipeline is required.",
        "For Indonesian advertising teams, include agency, brand, legal, and production stakeholders early. A fast image is not useful if it creates uncertainty about rights, language, representation, or whether the final work can be explained to a client.",
      ], ["Define allowed and prohibited inputs.", "Name the approver for AI-assisted outputs.", "Record sources, versions, and final ownership assumptions."]),
      section("map-the-use-cases", "Map AI to the right use cases", [
        "AI can support concept exploration, reference frames, rough storyboards, background ideas, cleanup, rotoscoping, upscaling, and repetitive organization. These tasks have different risks. Generating a mood reference is not the same as generating a recognizable person or a final packshot.",
        "Create a simple workflow map that marks each step as exploratory, assistive, or final. This keeps the team from treating every tool output as equally trustworthy and makes the review burden proportionate to the risk.",
      ]),
      section("keep-production-grounded", "Keep production grounded in stable assets", [
        "The commercial center of gravity should remain controllable: approved product models, typography, logos, key characters, camera systems, and final compositions. AI can surround or inform those elements, but the brand should not depend on a sequence that cannot be revised consistently.",
        "For mixed AI and 3D work, use a reference pipeline. A selected image becomes a design target, a 3D blockout tests camera and scale, and final compositing brings the approved product and typography into the shot. Each stage answers a different question.",
      ]),
      section("review-for-local-fit", "Review for local fit and clarity", [
        "A generated image can look polished and still feel culturally wrong, generic, or disconnected from the audience. Review faces, gestures, environments, clothing, language, product use, and visual stereotypes with people who understand the market.",
        "Also test the image at the intended platform size and without sound. Production value should support comprehension. If an effect obscures the product benefit or the Indonesian copy becomes secondary, the workflow needs another creative decision.",
      ], ["Audience and cultural review", "Brand and product accuracy review", "Rights and safety review", "Platform readability review"]),
      section("measure-the-workflow", "Measure the workflow by decisions and output", [
        "A responsible workflow should make the project faster or better in a visible way. Compare how quickly the team reaches a good direction, how many revisions are required, whether continuity improves, and whether the final assets can be reused. More generated options are not the same as more value.",
        "Keep the strongest parts of the workflow and remove steps that create noise. AI should become part of a production culture with standards, not a separate novelty layer that the team feels obliged to use.",
      ]),
    ],
    faqs: [
      faq("What is a safe first AI use case for advertising?", "Directed visual exploration and reference development are often good starting points because they help teams discuss a creative direction before final production. Keep final brand assets, identity, and rights-sensitive elements under controlled systems."),
      faq("Who should approve AI-assisted advertising work?", "The same people who approve the campaign, with legal or brand-safety input when the workflow involves likeness, confidential material, recognizable brands, or rights-sensitive sources."),
      faq("How can Indonesian agencies use AI without losing craft?", "Use AI to expand exploration and remove repetitive work, then keep direction, product truth, continuity, typography, compositing, and final judgment inside a skilled production pipeline."),
    ],
  },
  "how-indonesian-fmcg-brands-use-3d-product-animation": {
    readingTime: "7 min read",
    takeaway: "For Indonesian FMCG brands, 3D product animation can make packaging, ingredients, preparation, and sensory benefit visible in one controlled world. The strongest work keeps the product recognizable while giving the audience a reason to desire it.",
    sections: [
      section("understand-the-category", "Understand the category moment", [
        "FMCG products are often chosen quickly and recognized through packaging, color, routine, and sensory expectation. A 3D film should know which moment it is supporting: launch, seasonal sale, new variant, premium repositioning, or a benefit that needs explanation.",
        "The visual approach should match that moment. A new flavor may need color and ingredient energy. A health claim may need clean precision and restraint. A heritage product may benefit from material, craft, and a slower sense of ritual. The same technique can feel wrong when the category role is unclear.",
      ]),
      section("make-the-pack-recognizable", "Make the pack recognizable immediately", [
        "Packaging is often the fastest cue in an FMCG frame. Model the approved shape, artwork, cap, label, and finish accurately, then light it so the brand hierarchy survives movement and compression. A beautiful environment cannot compensate for a pack that reads as a different product.",
        "Use the hero SKU as a visual anchor, then introduce variants through controlled color, material, ingredient, or lineup changes. Keep the logo and product name visible at the moments where the audience is deciding what they are looking at.",
      ], ["Approved pack geometry", "Readable front-facing artwork", "Variant and claim hierarchy"]),
      section("visualize-the-sensory", "Visualize the sensory benefit", [
        "3D can show what ordinary pack photography cannot: a drink moving through a world of freshness, a powder dissolving, a texture spreading, or ingredients assembling around the product. The effect should express the benefit rather than become a generic splash or particle effect.",
        "Use real references for motion and material. A believable pour, condensation bead, crumb, or soft texture gives the audience a physical cue. Stylization can heighten the experience, but it should keep a relationship with how the product is expected to feel.",
      ]),
      section("design-for-channels", "Design for the channels where FMCG is discovered", [
        "FMCG campaigns may appear in social feeds, retail screens, ecommerce, marketplaces, presentations, and broadcast. Each place changes the reading distance, sound assumption, duration, and crop. Plan a hero system with clear short-form moments instead of cropping a single master after the fact.",
        "Create clean product frames and variant controls as part of the production. They can support product pages, sales decks, and retailer requests without restarting the entire visual development process.",
      ]),
      section("balance-energy-and-truth", "Balance energy with product truth", [
        "The strongest FMCG animation has a clear visual beat and a clear product beat. Let the world create appetite or curiosity, then let the package resolve the message. If the effect remains the hero all the way to the end, the audience may remember the spectacle but not the product.",
        "Review the work in the environments where it will run. Check color, small-type readability, crop safety, and whether the product still feels attractive after compression. The craft is successful when the film creates desire and recognition together.",
      ]),
    ],
    faqs: [
      faq("Why use 3D for FMCG advertising?", "3D gives precise control over packaging, ingredients, liquids, materials, camera, lighting, and variants. It is especially useful when the campaign needs sensory visualization or many adaptations from one master asset."),
      faq("How do we avoid generic FMCG CGI?", "Start from the product's actual benefit, packaging truth, audience context, and sensory references. Give the effect a communication job and build a visual system that belongs to the brand rather than copying a familiar splash or particle style."),
      faq("Can one FMCG film support many variants?", "Yes, if the package, materials, lighting, and variant controls are structured from the beginning. Plan which elements change and which remain constant so the family feels related without becoming repetitive."),
    ],
  },
  "building-an-ai-and-3d-animation-pipeline-for-product-launches": {
    readingTime: "8 min read",
    takeaway: "A launch pipeline works when AI widens the creative search and 3D protects product continuity. Connect the two through approved references, stable assets, clear review gates, and a delivery system built for last-minute variants.",
    sections: [
      section("set-the-launch-logic", "Set the launch logic before the toolset", [
        "Product launches have a high density of decisions: positioning, product truth, campaign world, feature hierarchy, regional versions, legal review, and channel requirements. Start by mapping those decisions and the order in which they must become stable.",
        "AI and 3D should serve that map. Use AI for fast directional exploration when the world is still open. Use 3D when the product, camera, materials, and variants need repeatable control. The pipeline becomes efficient when each tool enters at the right stage.",
      ]),
      section("create-the-reference-pipeline", "Create a reference pipeline", [
        "A selected reference frame should carry production information. Record the camera feel, composition, light, color, material, atmosphere, product position, and what needs to remain consistent. Then translate the reference into a blockout or look test that can be reviewed with the team.",
        "This step prevents a common launch problem: the team approves a compelling image without checking whether it can support the product, the shot count, the timeline, or the required crops. A reference is valuable when it makes the next decision easier.",
      ], ["Reference frame", "Annotated visual rules", "3D blockout", "Approved look test"]),
      section("build-the-product-core", "Build the product core early", [
        "The product model, artwork, materials, interface, and variant system are the stable center of the launch. Build them before the world becomes too detailed. This gives creative teams something real to frame and gives the client an early way to review product accuracy.",
        "Keep product assets independent from background experimentation. If a world changes, the product should not need to be rebuilt. That separation is what lets a launch team explore quickly without putting the hero asset at risk.",
      ]),
      section("create-review-gates", "Create review gates that answer one question", [
        "Launch reviews become slow when every milestone asks for approval of everything. Instead, define gates: concept and hierarchy, camera and animatic, product and material, world and lighting, animation and effects, final composite, and deliverables. Each gate should make the next stage safer.",
        "For AI-assisted work, add a source and rights check where needed. For 3D work, add product and variant checks. Clear gates protect the schedule and make feedback more actionable for distributed teams.",
      ]),
      section("prepare-the-release", "Prepare the release system before the final week", [
        "A launch rarely ends with one master. Prepare naming, version control, clean frames, alternate ratios, subtitles, localized copy, stills, and product-only outputs before the final render. Store approved references with the delivery so future edits do not require reverse-engineering the original intent.",
        "The pipeline is successful when the launch team can respond to a new color, claim, crop, or channel without losing the visual world. Speed at the end is earned by structure at the beginning.",
      ]),
    ],
    faqs: [
      faq("Where should AI and 3D meet in a product launch?", "AI is useful for directional exploration and reference development; 3D is useful for product accuracy, camera continuity, materials, variants, and final control. A reference pipeline connects the two without asking one tool to do every job."),
      faq("When should the product asset be built?", "As early as approved design data allows. The product is the stable core of the launch, and early accuracy helps the team make better decisions about camera, world, material, and deliverables."),
      faq("How do launch teams handle late product variants?", "Build a master asset with controlled materials, artwork, color, and variant parameters. Keep the product separate from world experimentation and plan clean outputs so changes remain contained."),
    ],
  },
  "3d-animation-studio-indonesia-how-to-evaluate-craft-and-fit": {
    readingTime: "7 min read",
    takeaway: "Evaluate a 3D animation studio on relevant craft, creative interpretation, production clarity, collaboration style, and the ability to protect quality through real campaign constraints.",
    sections: [
      section("review-the-right-evidence", "Review the right evidence", [
        "A showreel demonstrates taste, but it is not enough to evaluate fit. Ask for complete films, relevant shots, case studies, and the team's role on each project. Look for the quality of the sequence, not only the strongest frame: storytelling, timing, materials, animation, compositing, and delivery discipline all matter.",
        "Relevant evidence can come from a different category if it proves the right capability. A beauty project may demonstrate macro material and product control; a character project may demonstrate performance; a technology film may demonstrate hard-surface precision and interface clarity.",
      ], ["Complete work", "Relevant craft", "Role and responsibility", "Evidence of delivery"]),
      section("test-the-thinking", "Test the studio's thinking", [
        "The first response to a brief reveals how a team balances idea and execution. Does it restate the business problem clearly? Does it propose a visual route with a reason? Does it identify risk and ask useful questions? A polished mood board without a production point of view is not a complete response.",
        "Give the team enough room to interpret the problem, but compare responses against the same objective. You are evaluating whether the studio can think with you, not whether it can guess a hidden preference.",
      ]),
      section("check-the-pipeline", "Check the pipeline and communication", [
        "Ask how creative development, animation, effects, rendering, compositing, sound, and delivery are organized. Find out who owns the day-to-day conversation, how feedback is consolidated, what each review includes, and which decisions become locked.",
        "A small or independent studio can be an advantage when decision-makers stay close to the work. A larger team may offer breadth and capacity. The important question is whether the structure matches the complexity and approval needs of the project.",
      ]),
      section("look-for-local-fit", "Look for local and regional fit", [
        "An Indonesia-based studio can bring practical understanding of local production culture, language, audience context, and agency relationships. That can reduce translation between brief and execution, especially when the campaign has local nuance or a fast review cycle.",
        "Local fit should not be confused with limited capability. A well-structured 3D pipeline can collaborate with international agencies, brands, and specialists. Evaluate the studio on evidence, clarity, and working chemistry rather than geography alone.",
      ]),
      section("make-the-appointment", "Make the appointment on evidence and chemistry", [
        "The strongest choice usually combines four things: relevant craft, a clear creative response, a realistic production plan, and a team you trust to communicate early. Price matters, but it should be compared against assumptions, scope, revision structure, and the value of reusable assets.",
        "Before appointing a studio, confirm who will lead the work, what the first milestone is, what the client needs to provide, and what happens when the brief changes. A good partnership starts with clarity rather than optimism alone.",
      ]),
    ],
    faqs: [
      faq("What should I ask a 3D animation studio in Indonesia?", "Ask which work is most relevant, who will lead the project, how approvals are structured, what risks the team sees, how product and brand accuracy are protected, what the schedule assumes, and how adaptations will be handled."),
      faq("Is a showreel enough to choose a studio?", "No. A reel is a useful first filter, but complete work, case studies, role clarity, production process, and the studio's response to your brief give stronger evidence of fit."),
      faq("Can a smaller Indonesian studio handle a regional campaign?", "Yes, when the studio has a clear pipeline, reliable communication, appropriate specialist support, and evidence of delivering the required craft and formats. Capacity should be discussed against the actual scope."),
    ],
  },
  "commercial-vfx-and-ai-production-keeping-brand-truth-in-the-frame": {
    readingTime: "8 min read",
    takeaway: "Commercial VFX and AI should expand what the brand can show without weakening what the brand must remain. Keep product truth, identity, continuity, rights, and final judgment inside the controlled center of the workflow.",
    sections: [
      section("define-brand-truth", "Define what cannot drift", [
        "Every campaign has elements that must remain exact: logo, product silhouette, packaging, talent likeness, typography, color relationships, claims, and sometimes cultural or technical details. Name these elements before experimenting so the team knows where flexibility ends.",
        "Brand truth is not the same as visual literalness. A stylized world can still be truthful when the product hierarchy and identity remain clear. The question is whether the audience can understand what belongs to the brand and trust what the film is showing.",
      ], ["Identity", "Product", "People and likeness", "Claims and context", "Rights and sources"]),
      section("use-ai-with-boundaries", "Use AI with explicit boundaries", [
        "AI can widen visual exploration, help build reference worlds, and assist with selected repetitive tasks. It becomes risky when it is asked to improvise a recognizable product, person, package, or sequence that must remain consistent from frame to frame.",
        "Define where AI is exploratory, where it is assistive, and where it is not permitted. Keep references, versions, and approvals organized so the team can explain how the final image was made and why it is suitable for the campaign.",
      ]),
      section("anchor-with-vfx-3d", "Anchor the work with VFX and 3D control", [
        "VFX and 3D can stabilize the parts of the image that need continuity. Track the camera, build a product asset, establish lighting, control typography, and composite the approved elements into the chosen world. This gives the team a repeatable base while exploratory material remains flexible around it.",
        "The goal is not to remove experimentation. It is to keep the campaign's center trustworthy while the surrounding image can become more imaginative. Stable anchors make creative risk safer.",
      ]),
      section("review-the-human-image", "Review human and cultural imagery carefully", [
        "Generated or composited people can carry unintended stereotypes, inaccurate gestures, or a visual tone that does not fit the audience. Review faces, bodies, clothing, environments, language, and power relationships with people who understand the market and the brand.",
        "When likeness or talent rights matter, use approved references and a process that can demonstrate consent and control. A technically impressive result is not a safe commercial result if the people in the frame are not handled responsibly.",
      ]),
      section("make-judgment-visible", "Make final judgment visible in the process", [
        "A responsible workflow has a named creative owner who can decide when a generated result is good enough, when it needs rebuilding, and when the concept itself should change. This avoids the common trap of polishing a visually exciting output that cannot survive client review or future adaptation.",
        "Keep a final brand-truth checklist beside the creative review. Check product accuracy, identity, continuity, claims, rights, cultural fit, platform readability, and the relationship between effect and message. The workflow is complete when the image is both compelling and defensible.",
      ]),
    ],
    faqs: [
      faq("What is brand truth in an AI-assisted commercial?", "It is the set of elements that must remain accurate and trustworthy: identity, product, people, claims, context, and rights. The world can be stylized while those essentials remain controlled."),
      faq("Can AI replace VFX and 3D in commercial production?", "It can reduce effort in selected tasks and broaden exploration, but VFX and 3D remain valuable for continuity, product accuracy, camera control, typography, and repeatable revisions. The best workflow assigns each tool the right job."),
      faq("How should an agency review AI-assisted imagery?", "Review creative quality, brand truth, product and identity accuracy, rights, cultural fit, continuity, and platform readability. Keep a record of approved references and the final production decision."),
    ],
  },
  "3d-animation-for-indonesian-telecom-and-technology-campaigns": {
    readingTime: "8 min read",
    takeaway: "Technology animation should make an invisible service feel understandable. Use 3D, motion, and VFX to translate networks, interfaces, data, and devices into a human benefit without losing technical credibility.",
    sections: [
      section("translate-the-invisible", "Translate the invisible into a visible benefit", [
        "Telecom and technology products often depend on systems the audience cannot see: connectivity, latency, cloud infrastructure, security, data flow, or a device ecosystem. A film becomes useful when it connects that invisible system to a human result: a conversation that stays clear, a service that responds, or work that can move without interruption.",
        "Start from the audience's experience rather than a literal diagram of the network. The visualization should make the benefit easier to feel and understand, not ask the viewer to learn infrastructure vocabulary before they can understand the product.",
      ]),
      section("choose-the-metaphor", "Choose a metaphor with technical discipline", [
        "Metaphor can make complex technology approachable, but it can also create confusion if the relationship to the real service is too loose. A path of light, a connected architecture, a field of signals, or a responsive interface can work when the film explains what the metaphor stands for.",
        "Test the metaphor with product, technical, and brand stakeholders. Confirm that speed, scale, reliability, and security are not being visually overstated. A beautiful sequence should not promise behavior the service does not provide.",
      ], ["What is literally true?", "What is a visual metaphor?", "What benefit must the audience remember?"]),
      section("make-the-interface", "Make interfaces and data readable", [
        "UI animation is often treated as decoration, but small errors in hierarchy, timing, or copy can weaken trust. Use approved interface designs, realistic content, and a clear relationship between the screen and the story. If a user action matters, show what changes and why.",
        "3D can place a device or interface inside a broader world, but give the audience moments of stillness. A screen that is always moving is harder to read and can make a service feel less dependable rather than more advanced.",
      ]),
      section("ground-the-world", "Ground the technology in Indonesian life", [
        "Local relevance can come from the situations the technology enables: work across locations, family connection, transport, commerce, entertainment, education, or everyday communication. Choose contexts that reflect the campaign audience rather than adding generic city imagery as a shortcut for progress.",
        "The visual tone should respect how people actually use the service. A large abstract network may be useful for a corporate brand film, while a consumer campaign may need a more human scale, clearer language, and recognizable moments of use.",
      ]),
      section("deliver-the-proof", "Deliver the proof across the campaign system", [
        "Technology campaigns often need a master film, explainers, social edits, product pages, sales presentations, and internal materials. Build a modular visual system with reusable devices, UI states, data motifs, and approved end frames so each output can focus on one proof point.",
        "Keep technical review in the production calendar. The earlier product and engineering teams see the visual logic, the easier it is to correct an inaccurate metaphor or interface before final animation.",
      ]),
    ],
    faqs: [
      faq("How do you animate telecom or technology concepts clearly?", "Connect an invisible system to a human benefit, choose a metaphor with technical discipline, and give the viewer enough stillness to read the interface or proof point. The visual should simplify without making false promises."),
      faq("Should a technology film show a network diagram?", "Only when the diagram helps the audience understand the product. A human-scale metaphor or device interaction may communicate the benefit more effectively than a literal infrastructure map."),
      faq("Who should review a telecom animation?", "Creative, brand, product, and technical stakeholders should review at different gates. Technical review should happen before final animation so the film does not polish an inaccurate claim."),
    ],
  },
  "the-future-of-ai-animation-and-3d-product-films-in-indonesia": {
    readingTime: "8 min read",
    takeaway: "The future of Indonesian product films is not AI replacing direction. It is a more connected production system where AI accelerates search, 3D protects continuity, and human craft decides what deserves to become a final image.",
    sections: [
      section("see-the-shift", "See the shift as a change in production shape", [
        "AI lowers the cost of exploring visual territory, while 3D remains powerful for objects, materials, cameras, and controlled variation. The result is not one new medium replacing another. It is a production shape with more options at the front and a stronger need for selection and structure at the end.",
        "For brands, this can mean earlier visual decisions, faster reference development, and more opportunities to test a campaign world before committing to final craft. The benefit appears when the team uses that speed to make better choices rather than simply creating more disposable images.",
      ]),
      section("protect-the-core", "Protect the core assets that make a product film trustworthy", [
        "Product geometry, packaging, typography, interface, character identity, and brand hierarchy need repeatable control. These are the elements audiences use to recognize and trust the product. A generative process can contribute around them, but it should not make them drift from shot to shot.",
        "Build master assets and reference systems early. Stable product truth makes experimentation more useful because the team can compare worlds and ideas without losing the object that the campaign is selling.",
      ], ["Accurate product asset", "Approved brand and interface system", "Clear reference frames", "Controlled final passes"]),
      section("design-for-volume", "Design for a higher volume of useful content", [
        "A launch can now need a hero film, many social moments, localized edits, stills, product loops, retail formats, and future variants. A modular 3D system can make that volume manageable when cameras, materials, lighting, and product parameters are organized for reuse.",
        "Volume should not create visual sameness. The system needs a recognizable grammar and enough room for different crops, speeds, interactions, and emotional beats. The audience should feel continuity without receiving the same frame repeatedly.",
      ]),
      section("keep-local-judgment", "Keep local judgment at the center", [
        "Technology can generate a plausible image without understanding Indonesian context, audience expectation, or the cultural meaning of a gesture or environment. Creative teams still need to decide what feels relevant, respectful, and persuasive for the market.",
        "Local production knowledge also matters operationally: agency collaboration, review culture, language, delivery expectations, and the practical realities of producing at speed. AI may change tools, but it does not remove the need for people who understand the work and the audience.",
      ]),
      section("build-the-next-system", "Build the next system deliberately", [
        "The most valuable studios will combine visual direction, 3D craft, VFX, technical experimentation, and production discipline. They will know when to explore, when to rebuild, when to simplify, and when a real reference is more useful than another generated option.",
        "For brands and agencies, the next step is not to ask whether a project uses AI. Ask whether the production system creates stronger ideas, protects brand truth, reduces avoidable labor, and produces assets that can continue working after the launch moment.",
      ]),
    ],
    faqs: [
      faq("Will AI replace 3D product animation?", "AI will change how teams explore and accelerate parts of the work, but 3D remains valuable for accurate products, controlled cameras, materials, continuity, variants, and reusable campaign assets. Direction and judgment remain central."),
      faq("What should Indonesian brands invest in next?", "Invest in clear brand and product assets, a strong visual system, reusable 3D foundations, structured review, and teams who can connect new tools to real audience and business needs."),
      faq("How can product films create more content without feeling repetitive?", "Build a modular visual system with distinct camera, crop, timing, interaction, and emphasis options. Keep the campaign rules consistent while allowing meaningful variation across outputs."),
    ],
  },
};

export const enrichArticleContent = (article: Article): Article => {
  const expansion = ARTICLE_CONTENT_EXPANSIONS[article.slug];
  const sectionCount = Array.isArray(article.sections) ? article.sections.length : 0;
  if (!expansion || sectionCount > 1) return article;
  return { ...article, ...expansion };
};

export const enrichArticlesContent = (articles: Article[]) => articles.map(enrichArticleContent);
