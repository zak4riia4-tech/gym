/**
 * English — the source dictionary.
 *
 * Every other language is a translation of this file, and the Dictionary type
 * is derived from it, so a missing key in ckb.ts or ar.ts is a build error
 * rather than a blank space on the page.
 */
export const en = {
  nav: {
    links: [
      { label: "Programmes", href: "#programs" },
      { label: "Membership", href: "#membership" },
      { label: "Trainers", href: "#trainers" },
      { label: "The floor", href: "#gallery" },
    ],
    cta: "Join now",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    language: "Language",
  },

  hero: {
    eyebrow: "Hewlêr · Est. 2019",
    headline: ["Strength", "is a habit,", "not a mood."],
    description:
      "A coached strength and conditioning gym in Erbil. Barbell floor, group classes and one-to-one coaching. No joining fee, no contract.",
    primaryCta: "Join now",
    secondaryCta: "View memberships",
    scrollHint: "Scroll",
    imageAlt: "The squat racks on the training floor at GO FIT GYM, Erbil",
    ledger: { programmes: "Programmes", coaches: "Coaches", open: "Open" },
  },

  why: {
    eyebrow: "Why here",
    title: "Four reasons people stay.",
    description:
      "Not promises — the things members actually mention when they are asked why they have not left.",
    reasons: {
      coaches: {
        title: "Coaches who still train",
        body: "Every coach on this floor holds a current certification and competes or plays themselves. Nobody here is reading your programme off a screen.",
      },
      contract: {
        title: "No contract, no joining fee",
        body: "Cancel whenever you like. We would rather keep you by being worth the money each month than by making it awkward to leave.",
      },
      equipment: {
        title: "Equipment that holds up",
        body: "Calibrated bars, plates that are the weight they claim, and racks that get serviced instead of taped up.",
      },
      space: {
        title: "Room to actually train",
        body: "Memberships are capped. At seven in the evening you are warming up, not queuing for a rack.",
      },
    },
  },

  programs: {
    eyebrow: "Programmes",
    title: "Train with a purpose.",
    description:
      "Four routes across the same floor. Pick the one that matches what you are training for and your coach handles the programming.",
    cta: "Explore programme",
    difficulty: "Difficulty",
    duration: "Duration",
    items: {
      strength: {
        name: "Strength Training",
        description:
          "Barbell work built on the big lifts. Squat, press and deadlift, loaded properly and progressed every week.",
        difficulty: "Intermediate",
      },
      "weight-loss": {
        name: "Weight Loss",
        description:
          "Conditioning circuits paired with a food plan you can keep. Steady and measured, with no crash weeks.",
        difficulty: "All levels",
      },
      "muscle-building": {
        name: "Muscle Building",
        description:
          "Hypertrophy blocks with tracked volume. Enough work to grow, enough rest to actually recover from it.",
        difficulty: "Intermediate",
      },
      functional: {
        name: "Functional Training",
        description:
          "Carry, hinge, push, pull. Movement that transfers to work, to sport and to everything outside the gym.",
        difficulty: "Beginner",
      },
    },
    minutes: "min",
  },

  membership: {
    eyebrow: "Membership",
    title: "Three ways to train.",
    description:
      "Every plan opens the same floor and the same hours. What changes is how much coaching comes with it. No joining fee, no contract, cancel any time.",
    footnote:
      "Prices in Iraqi dinar. USD shown at 1,320 IQD to the dollar. Student and couple rates available at the front desk.",
    cta: "Choose plan",
    monthly: "Monthly",
    yearly: "Yearly",
    save: "Save",
    billingPeriod: "Billing period",
    perMonth: "Per month",
    perMonthAnnual: "Per month · billed annually",
    approx: "≈",
    recommended: "Recommended",
    everythingIn: "Everything in",
  },

  trainers: {
    eyebrow: "The team",
    title: "Coached by people who still train.",
    description:
      "Every coach on this floor holds a current certification and competes or plays themselves. A first session with any of them is free.",
    cta: "View profile",
    experience: "Experience",
    certified: "Certified",
  },

  gallery: {
    eyebrow: "The floor",
    title: "This is the room.",
    description:
      "No stock photography of somewhere else. Replace these with your own once the gym has been shot.",
  },

  testimonials: {
    eyebrow: "Members",
    title: "What people actually say.",
    items: [
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
    ],
  },

  cta: {
    eyebrow: "First session",
    title: "Come in and try the floor.",
    description:
      "Your first session is free. Meet a coach, walk the room, lift something. No card, no sign-up, no follow-up calls unless you ask for them.",
    primary: "Book a free session",
    secondary: "Call the gym",
  },

  booking: {
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
    optional: "Optional",
    plan: "plan",
    selectPlaceholder: "Select an option",
    messagePlaceholder: "Injuries, training history, preferred times…",
    fields: {
      fullName: "Full name",
      email: "Email",
      phoneNumber: "Phone number",
      membershipPlan: "Membership plan",
      preferredStartDate: "Preferred start date",
      fitnessGoal: "Main goal",
      message: "Anything else we should know?",
    },
    goals: [
      "Build strength",
      "Build muscle",
      "Lose weight",
      "General fitness",
      "Sport performance",
      "Return from injury",
    ],
    errors: {
      nameRequired: "Enter your full name.",
      nameShort: "That name looks too short.",
      nameLong: "Keep the name under 100 characters.",
      emailRequired: "Enter your email address.",
      emailInvalid: "That email address is not valid.",
      emailLong: "That email address is too long.",
      phoneRequired: "Enter a phone number we can reach you on.",
      phoneInvalid: "Enter a valid phone number, e.g. 0750 123 4567.",
      planRequired: "Choose a membership plan.",
      planInvalid: "Choose a valid membership plan.",
      dateRequired: "Choose when you would like to start.",
      datePast: "Pick today or a later date.",
      goalLong: "That goal is too long.",
      messageLong: "Keep the message under 2000 characters.",
      unreachable: "Could not reach the gym's server. Check your connection and try again.",
      rejected: "The gym's system rejected one of your details. Please review the form.",
      closed: "Bookings are not being accepted right now. Please call us instead.",
      rateLimited:
        "We already have a request from these details today. A coach will call you — no need to send another.",
      generic: "Something went wrong sending your request. Please try again, or call us.",
      notAccepted: "Some details were not accepted. Please check the form.",
    },
  },

  footer: {
    blurb:
      "A coached strength and conditioning gym in Erbil. Open six days a week, staffed every hour we are open.",
    explore: "Explore",
    programmes: "Programmes",
    visit: "Visit",
    staff: "Staff",
    dashboard: "Dashboard",
    legal: "All rights reserved.",
  },

  install: {
    title: "Add to your home screen",
    body: "Install the site and it opens like an app, full screen and offline.",
    action: "Install",
    dismiss: "Dismiss",
    iosBefore: "Tap",
    iosShare: "Share",
    iosAfter: "then",
    iosAdd: "Add to Home Screen",
  },

  common: {
    skipToContent: "Skip to content",
    notFoundEyebrow: "Error 404",
    notFoundTitle: "This page does not exist.",
    notFoundBody:
      "The link may be out of date, or the address mistyped. Everything about memberships, programmes and coaching is on the main page.",
    notFoundAction: "Back to",
    errorEyebrow: "Something went wrong",
    errorTitle: "We could not load this page.",
    errorBody:
      "Try again in a moment. If it keeps happening, call the gym and we will sort it out over the phone.",
    errorRetry: "Try again",
    errorHome: "Back to the main page",
    reference: "Reference",
  },

  seo: {
    title: "GO FIT GYM — Strength & Conditioning Gym in Erbil",
    description:
      "A coached strength and conditioning gym in Erbil. Barbell training, group classes and personal coaching, with membership plans from 35,000 IQD a month.",
    ogTitle: "GO FIT GYM — Train with a purpose",
    ogDescription:
      "Coached strength training in Erbil. Four programmes, three membership plans, no joining fee and no contract.",
  },
};

/**
 * Every translation must match this shape exactly.
 *
 * Note there is no `as const` above: it would pin each English string as its
 * own literal type and no translation could ever satisfy it. Widening keeps
 * the structure enforced while letting the words differ.
 */
export type Dictionary = typeof en;
