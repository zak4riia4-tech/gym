/* ==========================================================================
   ALL CONTENT LIVES HERE.
   To resell this site to another gym you edit this file and swap the photos.
   No component below /content contains a hardcoded word.
   ========================================================================== */

export const site = {
  brand: {
    name: "IRONHAUS",
    city: "Erbil",
  },
  currency: {
    /** Headline prices are in Iraqi dinar. */
    code: "IQD",
    /** Secondary USD line. Update when the rate moves. */
    usdRate: 1320,
  },
} as const;

export type BillingPeriod = "monthly" | "yearly";

/** A plan's slug. Free-form now that plans are created in the admin. */
export type PlanId = string;

export type Plan = {
  id: PlanId;
  name: string;
  /** One line under the plan name. Says who the plan is for. */
  tagline: string;
  /**
   * Price in IQD, always expressed PER MONTH.
   * The yearly figure is the discounted monthly rate when paid up front —
   * that is the standard way pricing pages show an annual discount.
   */
  price: Record<BillingPeriod, number>;
  /** Name of the plan this one builds on, e.g. "Basic" -> "Everything in BASIC". */
  inherits?: string;
  features: string[];
  /** Exactly one plan should be featured. */
  featured?: boolean;
};

/** Discount applied when paying yearly. Drives the "Save 20%" badge. */
export const YEARLY_SAVING_PERCENT = 20;

export const membership = {
  eyebrow: "Membership",
  title: "Three ways to train.",
  description:
    "Every plan opens the same floor and the same hours. What changes is how much coaching comes with it. No joining fee, no contract, cancel any time.",
  footnote:
    "Prices in Iraqi dinar. USD shown at 1,320 IQD to the dollar. Student and couple rates available at the front desk.",
  cta: "Choose Plan",
};


/* ==========================================================================
   FITNESS PROGRAMS
   ========================================================================== */

/** Icon keys, not components — this file stays free of React imports so a
    non-programmer can edit it safely. ProgramCard maps the key to an icon. */
export type ProgramIcon = "dumbbell" | "flame" | "growth" | "movement";

export type Program = {
  id: string;
  name: string;
  description: string;
  difficulty: string;
  duration: string;
  icon: ProgramIcon;
};

export const programsSection = {
  eyebrow: "Programs",
  title: "Train with a purpose.",
  description:
    "Four routes across the same floor. Pick the one that matches what you are training for and your coach handles the programming.",
  cta: "Explore Program",
};

export const programs: Program[] = [
  {
    id: "strength",
    name: "Strength Training",
    description:
      "Barbell work built on the big lifts. Squat, press and deadlift, loaded properly and progressed every week.",
    difficulty: "Intermediate",
    duration: "60 min",
    icon: "dumbbell",
  },
  {
    id: "weight-loss",
    name: "Weight Loss",
    description:
      "Conditioning circuits paired with a food plan you can keep. Steady and measured, with no crash weeks.",
    difficulty: "All levels",
    duration: "45 min",
    icon: "flame",
  },
  {
    id: "muscle-building",
    name: "Muscle Building",
    description:
      "Hypertrophy blocks with tracked volume. Enough work to grow, enough rest to actually recover from it.",
    difficulty: "Intermediate",
    duration: "75 min",
    icon: "growth",
  },
  {
    id: "functional",
    name: "Functional Training",
    description:
      "Carry, hinge, push, pull. Movement that transfers to work, to sport and to everything outside the gym.",
    difficulty: "Beginner",
    duration: "50 min",
    icon: "movement",
  },
];

/* ==========================================================================
   TRAINERS
   ========================================================================== */

export type SocialPlatform = "instagram" | "facebook" | "email";

export type SocialLink = {
  platform: SocialPlatform;
  href: string;
};

export type Trainer = {
  id: string;
  /** Future route: /trainers/[slug] */
  slug: string;
  name: string;
  specialty: string;
  bio: string;
  experience: string;
  certification: string;
  /** Remote URL now, or "/media/trainers/name.jpg" once the gym sends photos. */
  image: string;
  socials: SocialLink[];
};

export const trainersSection = {
  eyebrow: "The Team",
  title: "Coached by people who still train.",
  description:
    "Every coach on this floor holds a current certification and competes or plays themselves. A first session with any of them is free.",
  cta: "View Profile",
};

/* PLACEHOLDER DATA — replace before any site goes live.
   The photos are stock images of people who do not work at this gym, and the
   social links point nowhere real. Swap both for the gym's own material:
   drop photos in /public/media/trainers/ and set image to "/media/trainers/x.jpg". */

/* ==========================================================================
   BOOKING FORM
   ========================================================================== */

export const booking = {
  eyebrow: "Booking request",
  title: "Start your membership.",
  description:
    "Send this and a coach calls you within one working day to arrange your first session. Nothing is charged now.",
  submit: "Send request",
  submitting: "Sending",
  successTitle: "Request received.",
  successBody:
    "A coach will call you within one working day to confirm your start date. Nothing has been charged.",
  successClose: "Close",
  close: "Close booking form",
  fields: {
    fullName: "Full name",
    email: "Email",
    phoneNumber: "Phone number",
    membershipPlan: "Membership plan",
    preferredStartDate: "Preferred start date",
    fitnessGoal: "Main goal",
    message: "Anything else we should know?",
  },
  optional: "Optional",
  goalPlaceholder: "Select a goal",
  messagePlaceholder: "Injuries, training history, preferred times…",
};

/** Options for the "Main goal" select. Free text is stored, so edit freely. */
export const fitnessGoals: string[] = [
  "Build strength",
  "Build muscle",
  "Lose weight",
  "General fitness",
  "Sport performance",
  "Return from injury",
];

/* ==========================================================================
   SEO
   Everything a search engine or a WhatsApp link preview shows. Edit this block
   when rebranding for another gym — no other file needs touching.
   ========================================================================== */

export const seo = {
  /** Used for canonical URLs and social previews. Set NEXT_PUBLIC_SITE_URL in production. */
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  title: "IRONHAUS — Strength & Conditioning Gym in Erbil",
  /** Kept under ~160 characters so search engines show all of it. */
  description:
    "A coached strength and conditioning gym in Erbil. Barbell training, group classes and personal coaching, with membership plans from 35,000 IQD a month.",
  /** Shown in link previews on WhatsApp, Facebook and Instagram. */
  ogTitle: "IRONHAUS — Train with a purpose",
  ogDescription:
    "Coached strength training in Erbil. Four programmes, three membership plans, no joining fee and no contract.",
  locale: "en_GB",
  /** Local-business details. Used for the structured data block. */
  business: {
    legalName: "IRONHAUS Gym",
    streetAddress: "100 Meter Road",
    city: "Erbil",
    region: "Kurdistan Region",
    country: "IQ",
    phone: "+964 750 123 4567",
    openingHours: "Mo-Sa 06:00-23:00",
  },
};

/* ==========================================================================
   NAVBAR + HERO
   ========================================================================== */

export const nav = {
  links: [
    { label: "Programmes", href: "#programs" },
    { label: "Membership", href: "#membership" },
    { label: "Trainers", href: "#trainers" },
    { label: "The floor", href: "#gallery" },
  ],
  cta: "Join now",
  openMenu: "Open menu",
  closeMenu: "Close menu",
};

export const hero = {
  eyebrow: "Hewlêr · Est. 2019",
  /* Three lines, set one per line in the wide display face. Anti-hype on
     purpose: the whole brand voice is about turning up, not about slogans. */
  headline: ["Strength", "is a habit,", "not a mood."],
  description:
    "A coached strength and conditioning gym in Erbil. Barbell floor, group classes and one-to-one coaching. No joining fee, no contract.",
  primaryCta: "Join now",
  secondaryCta: "View memberships",
  /* Only facts we can actually source: programmes and coaches are counted from
     the database, the hours come from seo.business. Nothing invented. */
  scrollHint: "Scroll",
  imageAlt: "The squat racks on the training floor at IRONHAUS, Erbil",
  image:
    "https://images.unsplash.com/photo-1558611848-73f7eb4001a1?auto=format&fit=crop&w=1600&q=80",
};

/* ==========================================================================
   WHY CHOOSE US
   ========================================================================== */

export type ReasonIcon = "coaches" | "contract" | "equipment" | "space";

export const whySection = {
  eyebrow: "Why here",
  title: "Four reasons people stay.",
  description:
    "Not promises — the things members actually mention when they are asked why they have not left.",
};

export const reasons: { icon: ReasonIcon; title: string; body: string }[] = [
  {
    icon: "coaches",
    title: "Coaches who still train",
    body: "Every coach on this floor holds a current certification and competes or plays themselves. Nobody here is reading your programme off a screen.",
  },
  {
    icon: "contract",
    title: "No contract, no joining fee",
    body: "Cancel whenever you like. We would rather keep you by being worth the money each month than by making it awkward to leave.",
  },
  {
    icon: "equipment",
    title: "Equipment that holds up",
    body: "Calibrated bars, plates that are the weight they claim, and racks that get serviced instead of taped up.",
  },
  {
    icon: "space",
    title: "Room to actually train",
    body: "Memberships are capped. At seven in the evening you are warming up, not queuing for a rack.",
  },
];

/* ==========================================================================
   GALLERY
   ========================================================================== */

export const gallerySection = {
  eyebrow: "The floor",
  title: "This is the room.",
  description:
    "No stock photography of somewhere else. Replace these with your own once the gym has been shot.",
};

/** Placeholder photography. Swap for the gym's own images before launch. */
export const galleryImages: { src: string; alt: string; span: string }[] = [
  {
    src: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=1200&q=80",
    alt: "Dumbbell rack along the wall of the training floor",
    span: "md:col-span-2 md:row-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=900&q=80",
    alt: "The main training floor seen from the entrance",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1517963879433-6ad2b056d712?auto=format&fit=crop&w=900&q=80",
    alt: "A lifter setting up over a loaded barbell",
    span: "",
  },
  {
    src: "https://images.unsplash.com/photo-1596357395217-80de13130e92?auto=format&fit=crop&w=900&q=80",
    alt: "A member working through a set in the squat rack",
    span: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?auto=format&fit=crop&w=900&q=80",
    alt: "Close view of hands gripping a loaded bar",
    span: "md:col-span-2",
  },
  {
    src: "https://images.unsplash.com/photo-1546483875-ad9014c88eba?auto=format&fit=crop&w=900&q=80",
    alt: "A member training on the machine floor",
    span: "md:col-span-2",
  },
];

/* ==========================================================================
   TESTIMONIALS
   ========================================================================== */

export const testimonialsSection = {
  eyebrow: "Members",
  title: "What people actually say.",
};

export const testimonials: { quote: string; name: string; detail: string }[] = [
  {
    quote:
      "I had trained for six years and thought I knew what I was doing. Aram rebuilt my deadlift in one session and the back pain I had lived with just stopped.",
    name: "Rêbin Salih",
    detail: "Member since 2021",
  },
  {
    quote:
      "The classes are the only reason I still turn up in January. Small groups, and the coach actually watches you instead of counting reps at the front.",
    name: "Hana Mahmud",
    detail: "Member since 2023",
  },
  {
    quote:
      "I came back after knee surgery expecting to be told to take it easy for a year. Instead they built the whole programme around it and I squat more now than before.",
    name: "Karzan Ali",
    detail: "Member since 2022",
  },
];

/* ==========================================================================
   CALL TO ACTION
   ========================================================================== */

export const ctaSection = {
  eyebrow: "First session",
  title: "Come in and try the floor.",
  description:
    "Your first session is free. Meet a coach, walk the room, lift something. No card, no sign-up, no follow-up calls unless you ask for them.",
  primary: "Book a free session",
  secondary: "Call the gym",
  image:
    "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&w=1600&q=80",
  imageAlt: "",
};

/* ==========================================================================
   FOOTER
   ========================================================================== */

export const footer = {
  blurb:
    "A coached strength and conditioning gym in Erbil. Open six days a week, staffed every hour we are open.",
  columns: [
    {
      heading: "Explore",
      links: [
        { label: "Programmes", href: "#programs" },
        { label: "Membership", href: "#membership" },
        { label: "Trainers", href: "#trainers" },
        { label: "The floor", href: "#gallery" },
      ],
    },
  ],
  contactHeading: "Visit",
  staffHeading: "Staff",
  staffLink: { label: "Dashboard", href: "/admin/login" },
  legal: "All rights reserved.",
  builtNote: "Placeholder address and phone number — replace before launch.",
};

/* ==========================================================================
   INSTALL PROMPT
   ========================================================================== */

export const install = {
  title: "Add to your home screen",
  body: "Install the site and it opens like an app, full screen and offline.",
  action: "Install",
  dismiss: "Dismiss",
  /* iOS has no install API, so these words are the whole feature there. */
  iosBefore: "Tap",
  iosShare: "Share",
  iosAfter: "then",
  iosAdd: "Add to Home Screen",
};
