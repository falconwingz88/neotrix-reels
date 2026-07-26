import { additionalArticles } from "@/content/additionalArticles";

export type ArticleSection = {
  id: string;
  heading: string;
  paragraphs: string[];
  bullets?: string[];
};

export type ArticleFaq = {
  question: string;
  answer: string;
};

export type RelatedWork = {
  label: string;
  query: string;
};

export type ArticleMedia = {
  type: "image" | "video";
  url: string;
  alt?: string;
  caption?: string;
};

export type ArticleLink = {
  label: string;
  url: string;
};

export type Article = {
  id?: string;
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  dek: string;
  category: string;
  publishedAt: string;
  modifiedAt: string;
  readingTime: string;
  accent: "cyan" | "lime";
  keywords: string[];
  takeaway: string;
  relatedWork?: RelatedWork[];
  relatedProjectIds?: string[];
  externalLinks?: ArticleLink[];
  media?: ArticleMedia[];
  coverImage?: string;
  isPublished?: boolean;
  sections: ArticleSection[];
  faqs: ArticleFaq[];
};

const coreArticles: Article[] = [
  {
    slug: "how-to-choose-3d-animation-studio-jakarta",
    title: "How to Choose a 3D Animation Studio in Jakarta",
    shortTitle: "Choosing a 3D Animation Studio in Jakarta",
    description:
      "A practical guide to choosing a Jakarta 3D animation studio for commercials, product films, VFX, and character work—from portfolio review to production planning.",
    dek:
      "The right studio is not simply the one with the most polished reel. It is the team that can translate a commercial idea into a clear production plan, protect the idea through every review, and deliver frames that work where the campaign will actually live.",
    category: "Production guide",
    publishedAt: "2026-07-26",
    modifiedAt: "2026-07-26",
    readingTime: "9 min read",
    accent: "cyan",
    keywords: [
      "3D animation studio Jakarta",
      "3D animation Indonesia",
      "commercial animation studio",
      "VFX studio Jakarta",
      "product animation studio",
    ],
    takeaway:
      "Choose a 3D animation partner by testing the fit between creative thinking, production clarity, relevant craft, and communication—not by reel aesthetics alone.",
    relatedWork: [
      { label: "Browse all selected work", query: "" },
      { label: "Oppo product films", query: "oppo" },
    ],
    sections: [
      {
        id: "start-with-the-problem",
        heading: "Start with the communication problem, not the software",
        paragraphs: [
          "A strong brief begins with what the audience should understand, feel, or remember. The technique comes later. A product launch may need precise material behavior and legible feature demonstrations. A character-led campaign may depend on performance, timing, and a distinctive visual world. A visual-effects film may need invisible integration rather than obvious spectacle.",
          "When speaking with a studio, describe the commercial objective, audience, placements, mandatory messages, timeline, and decision-makers before prescribing a specific 3D technique. A capable team should be able to explain why a visual approach supports those needs. If every conversation immediately becomes a discussion about software or render engines, the underlying idea may not be getting enough attention.",
        ],
        bullets: [
          "What should viewers remember after one viewing?",
          "Where will the film run: television, cinema, social, retail screens, or a product page?",
          "Which product details or brand assets must remain exact?",
          "Who gives consolidated feedback and final approval?",
        ],
      },
      {
        id: "review-relevant-work",
        heading: "Review relevant work, not only the showreel",
        paragraphs: [
          "A showreel is useful for understanding taste and range, but it compresses projects into their most impressive seconds. Ask to see complete films and project pages that resemble your challenge. Look for continuity across the whole piece: clear storytelling, considered pacing, consistent lighting, controlled materials, readable branding, and a finish that holds up beyond the hero shot.",
          "Relevance does not mean the studio must have animated the exact same product category. It means the work demonstrates the capabilities your project will depend on. For a beverage film, that could be liquid simulation, condensation, macro materials, and pack accuracy. For a mobile device, it might be hard-surface modeling, screen replacement, elegant camera choreography, and disciplined product lighting.",
          "Neotrix’s public work archive is organized as complete commercial projects so producers and brand teams can assess more than a montage. Use that same standard with any studio you consider.",
        ],
      },
      {
        id: "evaluate-process",
        heading: "Ask how the production process protects the idea",
        paragraphs: [
          "3D production is iterative. The best time to solve composition, timing, and product communication is before final rendering. A dependable studio should describe clear approval stages and explain what is being decided at each one.",
          "A typical commercial workflow may include creative alignment, treatment or visual development, storyboard, animatic, asset creation, look development, animation, simulation, lighting, rendering, compositing, sound coordination, and final delivery. These stages can overlap, but approvals should not be vague. Confirm what the client receives, how feedback is collected, and what happens when a previously approved direction changes.",
          "Early previews will not look finished. What matters is whether they answer the correct production question. A grey-shaded animatic can validate rhythm and camera movement. A material test can validate the exact finish of a package. A short simulation test can reduce risk before a full scene is built.",
        ],
      },
      {
        id: "creative-technical-fit",
        heading: "Look for both creative and technical fit",
        paragraphs: [
          "Commercial 3D animation sits between design, filmmaking, and technical problem-solving. Strong art direction without production control can miss deadlines. Technical depth without taste can produce expensive images that feel generic. The ideal partner can hold both sides of the work.",
          "Ask who will lead creative decisions, who manages production, and whether those people will remain involved throughout the project. For a compact studio, direct access to the decision-makers can make reviews faster and preserve intent. For a larger studio, confirm how information passes between account, production, and artist teams.",
        ],
        bullets: [
          "Creative direction: can the team turn strategy into a visual point of view?",
          "Production leadership: are scope, reviews, dependencies, and risks clearly managed?",
          "Specialist capability: does the team have the modeling, animation, simulation, lighting, and compositing depth required?",
          "Delivery awareness: can the master idea adapt to the campaign’s real formats and durations?",
        ],
      },
      {
        id: "timeline-budget",
        heading: "Discuss timeline and budget as connected decisions",
        paragraphs: [
          "There is no honest universal price for a minute of 3D animation. Complexity is driven by the number of shots, asset detail, character performance, simulation, environments, revision structure, render requirements, and deliverables—not duration alone. A ten-second film with photoreal liquid and precision macro shots can demand more work than a longer graphic sequence.",
          "Share a budget range when possible. It allows the studio to design the right production approach instead of guessing. A useful proposal should identify assumptions, deliverables, milestones, revision rounds, exclusions, and the conditions that could change cost.",
          "The same applies to schedule. Calendar time is shaped by both production and approval speed. Confirm when brand assets, product references, legal copy, audio, and client feedback will be available. A realistic schedule makes those dependencies visible rather than hiding them behind a single delivery date.",
        ],
      },
      {
        id: "jakarta-advantage",
        heading: "Consider what a Jakarta-based studio brings",
        paragraphs: [
          "For Indonesian campaigns, a Jakarta studio can combine local cultural fluency, practical access to agencies and production partners, and working hours aligned with local decision-makers. That context helps with details that may never appear in a written brief: the tone of a seasonal campaign, the way a product is used locally, or how a visual idea should balance global brand standards with Indonesian relevance.",
          "Location should not limit reach. Modern 3D pipelines are naturally collaborative, and a well-run Jakarta studio can work with regional and international teams through structured remote reviews. Neotrix is based in West Jakarta and works with agencies and brands in Indonesia and beyond.",
        ],
      },
      {
        id: "questions-to-ask",
        heading: "Seven questions to ask before appointing a studio",
        paragraphs: [
          "A short, direct conversation will often reveal more than a credentials deck. Use these questions to compare studios on the factors that affect the work after the pitch.",
        ],
        bullets: [
          "Which projects in your portfolio are most relevant to this brief, and why?",
          "Who will direct and produce our project day to day?",
          "What are the main approval stages and client deliverables?",
          "Which parts of the brief create the most schedule or technical risk?",
          "How do you maintain product and brand accuracy?",
          "How are changes after approval scoped and communicated?",
          "What do you need from us to create a reliable proposal and schedule?",
        ],
      },
      {
        id: "decision",
        heading: "Make the decision on evidence and working chemistry",
        paragraphs: [
          "The strongest appointment usually combines four things: a portfolio that proves the required craft, a creative response that understands the assignment, a production plan that makes risk visible, and a team you trust to communicate early. Price matters, but a low estimate built on unclear assumptions is not the same as value.",
          "If you are planning a commercial 3D animation, VFX, character, or product-film project, send Neotrix the objective, desired deliverables, timing, and any available references. We can then recommend a production path and identify the questions that should be answered before work begins.",
        ],
      },
    ],
    faqs: [
      {
        question: "How much does 3D animation cost in Jakarta?",
        answer:
          "There is no reliable flat rate. Cost depends on shot count, asset complexity, visual style, character or simulation work, rendering, revision rounds, and the number of final formats. A studio should quote against a defined scope and clearly state its assumptions.",
      },
      {
        question: "How long does a commercial 3D animation take?",
        answer:
          "A schedule is shaped by complexity and approval speed. Short commercial projects often move through creative development, animatic, asset and look development, animation, rendering, and post-production. The studio should provide milestones rather than only a final date.",
      },
      {
        question: "What should be included in a 3D animation brief?",
        answer:
          "Include the business objective, audience, key message, channels, duration and formats, product and brand assets, references, mandatory copy, timeline, budget range, and approval team. A good studio can help resolve missing details.",
      },
      {
        question: "Can a Jakarta 3D studio work with international clients?",
        answer:
          "Yes. 3D production is well suited to remote collaboration when reviews, file exchange, approvals, and time-zone expectations are structured clearly. Neotrix is based in Jakarta and works with teams in Indonesia and internationally.",
      },
    ],
  },
  {
    slug: "3d-product-animation-vs-live-action",
    title: "3D Product Animation vs Live Action: Which Should a Brand Choose?",
    shortTitle: "3D Product Animation vs Live Action",
    description:
      "Compare 3D product animation and live-action production for advertising. Learn when CGI, live action, or a hybrid approach best serves a commercial campaign.",
    dek:
      "This is not a contest between new and traditional production. The better choice depends on what the audience must see, how much control the idea demands, and how the campaign needs to scale after the hero film is finished.",
    category: "Creative strategy",
    publishedAt: "2026-07-26",
    modifiedAt: "2026-07-26",
    readingTime: "10 min read",
    accent: "lime",
    keywords: [
      "3D product animation",
      "CGI product video",
      "product animation Indonesia",
      "commercial VFX",
      "3D animation vs live action",
    ],
    takeaway:
      "Use 3D when control, visualization, transformation, or scalable asset reuse drives the idea; use live action when human truth and real-world performance are central; combine them when the concept needs both.",
    relatedWork: [
      { label: "See Oppo product films", query: "oppo" },
      { label: "See Wuling product work", query: "wuling" },
    ],
    sections: [
      {
        id: "different-strengths",
        heading: "Start with what each medium does naturally well",
        paragraphs: [
          "Live action captures real performance, physical presence, and spontaneous detail. It is often the clearest choice when a person’s expression, a social situation, a location, or documentary credibility carries the message. A strong director and crew can create an immediacy that would be unnecessary to reproduce digitally.",
          "3D product animation offers deliberate control over objects, materials, light, camera movement, and events that cannot be filmed safely or at all. It can reveal the inside of a device, suspend ingredients in mid-air, transition between product variants, or choreograph a camera through a microscopic world. The result can be photoreal, graphic, stylized, or somewhere between.",
          "Neither approach is automatically more premium. Quality comes from the idea, direction, craft, and production choices. The useful question is: which medium makes the communication clearer and the execution more achievable?",
        ],
      },
      {
        id: "choose-3d",
        heading: "Choose 3D product animation when control is the idea",
        paragraphs: [
          "3D becomes especially valuable when the product must look exact across a sequence of tightly designed shots. Once an accurate digital asset and material system exist, the team can refine camera angles, lighting, reflections, and motion without rebuilding a physical set for every variation.",
          "It is also effective when the film needs to explain something a camera cannot see. Internal technology, layers of formulation, airflow, impact protection, ingredient behavior, and abstract benefits can be visualized as a coherent world rather than added as disconnected graphics.",
        ],
        bullets: [
          "The product is not yet physically available, but approved design data exists.",
          "The concept involves impossible transformations, floating elements, or microscopic travel.",
          "Surface, liquid, particle, or lighting control is central to the visual identity.",
          "The campaign requires many product colors, regional variants, crops, or future adaptations.",
          "The product must remain pristine through macro close-ups and repeated takes.",
        ],
      },
      {
        id: "choose-live-action",
        heading: "Choose live action when human truth carries the message",
        paragraphs: [
          "When the audience needs to believe a relationship, a reaction, a performance, or a lived experience, live action can be the most direct route. Casting, location, wardrobe, production design, cinematography, and sound create meaning together. A real hand using a product or a genuine expression can communicate trust faster than a technically elaborate product shot.",
          "Live action is also practical when the concept can be captured cleanly in-camera and does not demand extensive post-production control. Familiar production methods are not a weakness; the simplest medium that expresses the idea well is often the strongest choice.",
        ],
        bullets: [
          "The story depends on dialogue, acting, comedy, or emotional nuance.",
          "Real environments and cultural specificity are important.",
          "Demonstrating authentic human use is more persuasive than a technical visualization.",
          "The product interaction can be filmed safely and repeatably.",
        ],
      },
      {
        id: "hybrid",
        heading: "A hybrid film can keep the best of both",
        paragraphs: [
          "Many commercial films are not purely 3D or purely live action. A hybrid approach can place a real performer in a digitally extended environment, transition from a physical product into an internal 3D visualization, or use computer-generated effects to shape light, ingredients, weather, or scale around filmed footage.",
          "Hybrid work should be planned before the shoot. Camera data, lenses, tracking references, lighting information, clean plates, product measurements, and on-set supervision can determine whether post-production feels seamless. Treating VFX as a rescue step after filming usually reduces options and increases uncertainty.",
          "For agencies, it is useful to bring the 3D or VFX team into pre-production early. They can identify which shots should be fully digital, which should be filmed, and which need specific capture methods to combine successfully.",
        ],
      },
      {
        id: "cost",
        heading: "Compare production shape, not a single headline cost",
        paragraphs: [
          "A simple live-action product shoot may be more efficient than building a detailed digital asset. A complex shoot with talent, locations, art department, motion control, practical effects, weather dependencies, and many regional versions may move the calculation in the other direction. Likewise, a short 3D film can be production-heavy if it requires intricate simulation or photoreal development.",
          "The important comparison is the complete scope. Include pre-production, production, post-production, revisions, usage needs, product variants, cutdowns, aspect ratios, stills, and the expected lifespan of the assets. Avoid treating the cost of the hero film as the only output.",
          "A reusable 3D product asset may create value beyond one edit. It can support vertical videos, retail displays, key visuals, product explainers, launch updates, and future color variants. That value is real only when reuse is planned and the rights, files, and adaptation process are clear.",
        ],
      },
      {
        id: "speed-flexibility",
        heading: "Understand where each approach is flexible—and where it is not",
        paragraphs: [
          "Live action concentrates major decisions around the shoot. Once a location is released, talent has left, and the set is struck, a new angle or performance may require a reshoot. Experienced teams reduce that risk through careful pre-production, boards, rehearsals, and on-set decision-making.",
          "3D moves more of the decision-making into a continuous digital pipeline. Camera and animation can be revised before final rendering, but late changes can still cascade through simulation, lighting, render, and compositing. The apparent flexibility of CGI is not unlimited. Approval discipline remains essential.",
          "In either medium, speed comes from making the right decisions at the right fidelity. Approve narrative and timing in boards or animatics. Approve physical details in product references or digital models. Approve the visual finish in focused look-development frames before producing every shot.",
        ],
      },
      {
        id: "channel-planning",
        heading: "Plan for the channel system from the beginning",
        paragraphs: [
          "A campaign rarely ends with one 16:9 master. Social platforms, marketplace pages, digital out-of-home, retail displays, presentations, and internal launches may all need different ratios, durations, safe zones, or levels of explanation.",
          "3D scenes can be designed with flexible framing and modular timing, but that flexibility must be included in the composition and render plan. Live-action shoots can capture alternate framings and dedicated vertical takes when the shot list anticipates them. In both cases, asking for adaptations after the hero film is locked may create compromises.",
          "Before choosing a medium, list the complete deliverable ecosystem. The best production approach is the one that creates a strong hero idea and remains coherent across the placements that will carry most of the audience.",
        ],
      },
      {
        id: "decision-framework",
        heading: "Use a five-question decision framework",
        paragraphs: [
          "A producer or brand team can usually identify the right direction by answering five questions together. If the answers are mixed, that is often a signal to explore a hybrid approach.",
        ],
        bullets: [
          "What must the audience believe or understand?",
          "Does the idea depend more on human performance or visual control?",
          "What cannot be captured physically, safely, or repeatedly?",
          "How many formats, versions, and future adaptations are required?",
          "Which risks must be resolved before production begins?",
        ],
      },
      {
        id: "working-with-neotrix",
        heading: "How Neotrix approaches the choice",
        paragraphs: [
          "Neotrix is a Jakarta-based 3D animation and VFX studio, so our role is not to recommend CGI for every brief. We look for the parts of an idea that benefit from digital control, visual invention, or post-production integration. If a live-action plate is the strongest foundation, we design the 3D and VFX around it. If the product world should be fully digital, we build the pipeline around accuracy and scalable delivery.",
          "For an early production conversation, share the campaign objective, script or treatment, product references, intended channels, timing, and budget range. We can help identify whether the idea is best served by 3D product animation, VFX-led live action, or a hybrid of the two.",
        ],
      },
    ],
    faqs: [
      {
        question: "Is 3D product animation cheaper than live action?",
        answer:
          "Not automatically. Cost depends on the creative scope. Compare the full production, revision, versioning, and reuse requirements rather than assuming either medium is always cheaper.",
      },
      {
        question: "Can 3D animation look photorealistic?",
        answer:
          "Yes, when accurate models, materials, lighting, camera behavior, rendering, and compositing are handled carefully. Photorealism should serve the communication goal; stylized 3D can be more effective for some brands and ideas.",
      },
      {
        question: "When should a brand use a hybrid live-action and CGI approach?",
        answer:
          "A hybrid approach is useful when human performance or a real environment matters, but the concept also needs impossible product behavior, digital environments, visualized benefits, or precise VFX integration.",
      },
      {
        question: "Can a 3D product asset be reused for other campaign content?",
        answer:
          "Often, yes. A well-built asset may support alternate edits, aspect ratios, stills, retail content, product explainers, and color variants. Reuse should be planned in the original scope, including file ownership and adaptation requirements.",
      },
    ],
  },
];

export const articles: Article[] = [...coreArticles, ...additionalArticles];

export const getArticleBySlug = (slug?: string) => articles.find((article) => article.slug === slug);

export const formatArticleDate = (date: string) =>
  new Intl.DateTimeFormat("en", { day: "numeric", month: "long", year: "numeric" }).format(
    new Date(`${date}T00:00:00Z`),
  );
