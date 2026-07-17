/**
 * English catalog — the SOURCE OF TRUTH. Every string here is copied verbatim
 * from the original JSX. `pt.ts` must satisfy this shape (see types.ts), so the
 * build fails if a Portuguese key is missing.
 *
 * Plain values are strings. Entries whose original markup carries <em>/<br/>/
 * &nbsp; are functions returning JSX (typed `Rich`), so the markup is preserved
 * and never stringified. Call them in JSX: {t.home.heroHeadline()}.
 */
export const en = {
  nav: {
    spots: "Spots",
    journal: "Journal",
    about: "About",
    earlyAccess: "Early access",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchToPt: "Ver em português",
    switchToEn: "View in English",
  },

  footer: {
    tagline: "Travel to find, not to escape.",
    spotsTagline: "A guide to the places worth the journey.",
    copyright: "© 2026 trovr",
    copyrightEmail: "© 2026 · hello@trovr.agency",
  },

  notFound: {
    title: "Page not found",
    body: "The page you're looking for doesn't exist or has been moved.",
    goHome: "Go home",
  },

  errorPage: {
    title: "This page didn't load",
    body: "Something went wrong on our end. You can try refreshing or head back home.",
    tryAgain: "Try again",
  },

  home: {
    heroKicker: "Hand-picked expeditions for travelers who go deeper.",
    heroHeadline: () => (
      <>
        Travel to <em className="italic font-normal">find.</em>
        <br />
        Not to escape.
      </>
    ),
    seeExpeditions: "See expeditions",
    earlyAccessArrow: "Early access →",

    manifestoKicker: "The manifesto",
    manifestoHeadline: () => (
      <>
        The right trip goes&nbsp; <em className="italic font-normal">deeper</em>
        &nbsp;than anywhere on the map.
      </>
    ),
    manifestoP1:
      "We curate journeys made to stretch you and stay with you — the kind that leave you sharper, braver, more awake to what a life can hold. Places that ask something of you, and give back more than they took.",
    manifestoP2:
      "That's the whole idea of Trovr: adventure with something underneath it. Intense to live. Impossible to forget.",

    journalKicker: "Field notes",
    journalHeadline: () => (
      <>
        From the <em className="italic font-normal">journal.</em>
      </>
    ),
    allEntries: "All entries →",

    expeditionsKicker: "Fall 2026",
    expeditionsHeadline: () => (
      <>
        First <em className="italic font-normal">expeditions.</em>
      </>
    ),
    metricActivity: "Activity",
    metricDuration: "Duration",
    metricSeason: "Season",
    metricLevel: "Level",
    metricCountry: "Country",
    metricRegion: "Region",
    metricBest: "Best time",
    seeThisExpedition: "See this expedition",
    seeThisSpot: "See this spot",

    statPlaces: "Places mapped for you",
    statContinents: "Continents covered",
    statLaunching: "Launching",
  },

  newsletter: {
    kicker: "Early access",
    headline: () => (
      <>
        When the <em className="italic font-normal">first</em> expeditions open, you'll be the first
        to know.
      </>
    ),
    subtext: "No noise. Only the letters that matter.",
    emailPlaceholder: "your@email.com",
    subscribe: "Subscribe",
    subscribing: "Subscribing…",
    success: "Thank you. We'll be in touch soon.",
    error: "Something went wrong. Please try again.",
  },

  about: {
    heroHeadline: "We have only one rule:\nNo one walks out the same way",
    heroSubtext: "We built Trovr around keeping that promise",

    whyP1:
      "You'll never regret living one of these. It's the only promise we make — and everything about Trovr is built to keep it.",
    whyP2:
      "Trovr is a curation of journeys that leave a mark. Trips for people who travel to feel awake, to test their edges, to come home someone slightly new. Some have chased this feeling for years. Some are only just starting to sense the pull. Both belong here.",
    whyP3:
      "These are the journeys that stay with you — the kind that expand what a life can hold, that you don't quite recover from, that you end up building a life around. What you find out there is the reason to go.",

    curateHeading: "How we curate.",
    curateIntro: () => (
      <>
        It all&nbsp; starts with instinct. Every trip on Trovr is chosen by hand — mine — against a
        question I've been refining for years: would I go? If I wouldn't drop everything to live it
        myself, it doesn't make the cut. That's the first filter, and the hardest one to fake.
      </>
    ),
    curateIntro2:
      "But instinct has a shape. Look closely at what survives it, and the same three things are always there:",
    principle1Title: "It has to change you.",
    principle1Body:
      "Not just show you a place — leave a mark on you. The trips we choose are the ones you come back from a little different: braver, quieter, more awake to what you're capable of. If a journey can't do that, it's just logistics.",
    principle2Title: "It can't be the obvious one.",
    principle2Body:
      "No resorts everyone's already seen. No route that shows up first when you search. We look for the trips most people don't know exist — or wouldn't quite dare to take. The further off the well-worn track, the more we pay attention.",
    principle3Title: "It has to be real, not a photo op.",
    principle3Body:
      "Some trips exist to look good online and leave nothing behind. We pass on every one of them. What we keep are the journeys that are lived, not performed — the ones that stay with you long after the last picture stops mattering.",
    curateClosing:
      "That's the whole method. No committee, no checklist dressed up as science. Just a high bar, a personal one, applied to every single trip — so that by the time something reaches you, it's already earned the only approval that counts.",

    newsletterHeadline: "Leave your email.",
    newsletterSubtext: "We'll write when the first trips open.",
    newsletterSuccess: "Thank you. We'll be in touch.",

    faqHeading: "Common questions.",
    faq: [
      {
        question: "What is Trovr?",
        answer:
          "Trovr is a hand-curated collection of immersive, non-touristy adventure trips — journeys built around sport, exploration, and genuine discovery rather than sightseeing. Every trip is chosen for one reason: that it adds something real to your life. The adventure is the way in; what you find out there is why it matters.",
      },
      {
        question: "What kind of trips does Trovr offer?",
        answer:
          "Trovr curates active, off-the-map experiences across five continents — kitesurfing, surfing, freediving, horseback expeditions, wildlife journeys, and more. These are trips that ask something of you and give back more than they took: remote places, real terrain, and the kind of challenge you come back from a little changed. They range from journeys for seasoned adventurers to ones for people just beginning to feel the pull.",
      },
      {
        question: "How does Trovr curate its trips?",
        answer:
          "Every trip is chosen by hand, against a single question: would we go ourselves? Trovr looks for journeys that change the people who take them, that aren't the obvious touristy option, and that are lived rather than performed for a photo. There's no committee and no checklist dressed up as science — just a high, personal bar applied to every trip, so that by the time one reaches you, it's already earned the only approval that counts.",
      },
    ],
  },

  comingSoon: {
    kicker: "Trovr expeditions",
    headline: "Coming soon…",
    body: "We're still shaping this one. Leave your email on the homepage and you'll be the first to know when it opens.",
    backHome: "Back home",
  },

  journalIndex: {
    title: "Journal",
    subtitle: "Field notes from the places we send people.",
    moreHeading: "More from the field.",
    story: "story",
    stories: "stories",
    readTheStory: "Read the story",
  },

  inquiry: {
    heading: "Interested?",
    subheading: "Tell us about you. We'll come back with details.",
    name: "Name",
    email: "Email",
    phone: "Phone (optional)",
    when: "When are you thinking?",
    whenPlaceholder: "e.g. August 2026 or flexible",
    about: "A line about you",
    aboutPlaceholder:
      "Anything we should know — experience level, who's coming with you, what you're after.",
    submit: "Submit inquiry",
    sending: "Sending…",
    success: "Thank you. We'll get back to you within 48 hours.",
    error: "Something went wrong. Please try again.",
    tripsLikeThis: "Trips like this.",
    factOperator: "Operator",
    factSeason: "Season",
    factLevel: "Level",
    factDuration: "Duration",
    factPrice: "Price range",
    notFound: "Trip not found.",
    loadError: "This trip didn't load.",
    tryAgain: "Try again",
  },

  spotsChrome: {
    footerTagline: "A guide to the places worth the journey.",
    comingSoon: "Coming soon",
    soon: "— soon",
  },

  seo: {
    siteTitle: "Trovr — Curated Immersive & Adventure Travel Experiences",
    siteDescription:
      "Discover hand-curated adventure and immersive travel experiences — sport, exploration, and off-the-map journeys chosen to add something real to your life.",
    homeTitle: "Trovr — Curated Immersive & Adventure Travel Experiences",
    homeDescription:
      "Discover hand-curated adventure and immersive travel experiences — sport, exploration, and off-the-map journeys chosen to add something real to your life.",
    aboutTitle: "About — Trovr",
    aboutDescription:
      "The story behind Trovr — a hand-curated collection of immersive, non-touristy adventure trips for people who travel to explore, feel intensely, and come back changed.",
    journalTitle: "Journal — Trovr",
    journalDescription: "Field notes from the places we send people.",
    tripsTitle: "Trips — Trovr",
    tripsDescription:
      "Curated trips for people who travel to feel. Kite, surf, horseback, wildlife, martial arts.",
    comingSoonTitle: "Coming Soon — Trovr",
    comingSoonDescription: "This expedition is coming soon.",
  },
} as const;
