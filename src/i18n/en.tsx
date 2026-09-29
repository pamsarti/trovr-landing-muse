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
    sports: "Trips",
    journal: "Content",
    about: "About",
    itinerary: "Tell us what you need",
    openMenu: "Open menu",
    closeMenu: "Close menu",
    switchToPt: "Ver em português",
    switchToEn: "View in English",
  },

  footer: {
    tagline: "Travel to find, not to escape.",
    spotsTagline: "A guide to travelling beyond the usual routes.",
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
    heroKicker: "A hub for travel beyond the obvious",
    heroHeadline: () => (
      <>
        Discover the world beyond <em className="italic font-normal">the usual routes.</em>
      </>
    ),
    heroBody:
      "Trovr brings together places, experiences, sports, stories and practical information for people who want to leave the traditional tourist circuit without travelling in the dark.",
    primaryCta: "Explore places",
    secondaryCta: "Tell us what you need",
    pauseGallery: "Pause image gallery",
    playGallery: "Play image gallery",
    sportsKicker: "Choose what you want to experience",
    sportsTitle: "Sometimes the journey begins before the destination.",
    sportsBody:
      "Start with a sport, a landscape or a way of travelling. Discover where to live that experience, when to go and what surrounds it.",
    explore: "Explore",
    mapKicker: "Trovr map",
    mapTitle: "A world of possibilities beyond the usual route.",
    mapBody:
      "Explore places by sport, region and time of year. Each point brings together local context and information to help you decide whether the journey is right for you.",
    mapCta: "Explore the map",
    placesKicker: "Trovr curation",
    placesTitle: "Places with a real reason to go.",
    placesBody:
      "We do not look for beautiful destinations alone. We choose places where there is something to live: an activity, a culture, a landscape or a story worth the journey.",
    allPlaces: "See all places",
    placeCta: "Discover this destination",
    storiesKicker: "Trovr content",
    storiesTitle: "Context for understanding a place before you arrive.",
    storiesBody:
      "Articles, guides, selected news and practical choices for knowing destinations beyond their tourist attractions.",
    storiesCta: "See all content",
    manifestoKicker: "Travel beyond the obvious",
    manifestoHeadline: () => (
      <>
        It is not about going where no one has been. It is about experiencing a place{"\u00A0"}
        <em className="italic font-normal">differently.</em>
      </>
    ),
    manifestoP1:
      "Travelling beyond the obvious is not about chasing secret places or turning destinations into trophies. It means choosing with curiosity, understanding the context and letting the experience lead the journey.",
    manifestoP2:
      "You might arrive through a wave, a trail, a train, a mountain or a conversation. The destination matters, but what you find when you pay attention matters even more.",
    manifestoClosing:
      "At Trovr, a place is more than a point on the map. It is the beginning of a discovery.",
    founderKicker: "The curation behind Trovr",
    founderTitle: "Fewer ready-made lists. More reasons to travel.",
    founderBody:
      "Trovr selects places for what you can live and learn there. Every recommendation considers the experience, the right season, local culture and the information needed to turn interest into a possible journey.",
    founderCta: "Discover Trovr",
    serviceKicker: "For travellers, operators and brands",
    serviceTitle: "Every good journey begins with a well-directed conversation.",
    serviceBody:
      "You may be planning a trip, presenting an experience, proposing a partnership or simply working out where to begin. Share the context and Trovr will help direct the next step.",
    serviceDisclaimer:
      "Each conversation is directed according to what you need: content, curation, itinerary planning, visibility or partnership.",
    serviceCta: "Tell us what you need",
    faqKicker: "Common questions",
    faqTitle: "How to use Trovr to travel beyond the obvious.",
    faq: [
      {
        question: "What is Trovr and how does it help plan travel beyond the obvious?",
        answer:
          "Trovr is a hub for travel beyond the obvious. We bring together destinations, experiences, sports, local culture, content and practical information to help you decide where to go, when to travel and what to experience.",
      },
      {
        question: "What does travel beyond the obvious mean?",
        answer:
          "It does not mean looking only for secret or remote destinations. It means knowing a place beyond its tourist attractions, with local context, meaningful experiences and choices that fit the way you travel.",
      },
      {
        question: "How can I find destinations by sport, experience or time of year?",
        answer:
          "Use the Trovr map and filters to explore places by sport, region and season. Each destination brings together conditions, the best times to go and useful information for comparing options.",
      },
      {
        question: "How does Trovr choose the places and experiences it publishes?",
        answer:
          "Our curation considers what is meaningful to experience or learn, the best season, local culture and the quality of available information. A place belongs on Trovr when there is a real reason to go, not just a good photograph.",
      },
      {
        question: "Does Trovr sell flights, lodging or travel packages?",
        answer:
          "No. Trovr is a content and curation platform. Travellers make bookings and payments directly with the providers they choose.",
      },
      {
        question: "Does Trovr also create custom itineraries?",
        answer:
          "Yes. For travellers who want additional support, Trovr researches destinations, seasons, experiences, transport and lodging and organises a proposal around their interests, dates and pace.",
      },
    ],
  },

  newsletter: {
    kicker: "Letters from Trovr",
    headline: () => (
      <>
        Ideas for leaving{"\u00A0"}
        <em className="italic font-normal">the usual routes behind.</em>
      </>
    ),
    subtext:
      "Get places, experiences, local stories, sports seasons and new ways to see the world.",
    emailPlaceholder: "your@email.com",
    subscribe: "Get discoveries",
    subscribing: "Subscribing…",
    success: "Done. The next discovery will arrive by email.",
    error: "Something went wrong. Please try again.",
  },

  about: {
    heroHeadline: "Trovr exists to make the world less obvious.",
    heroSubtext:
      "Content, curation of places and experiences, itinerary research and connections for people who want to know the world beyond traditional tourist circuits.",

    whyP1:
      "Trovr brings together destination, sport, season and local-culture content, experience curation and support for turning a travel idea into a possible path.",
    whyP2:
      "You can come to discover a place, ask for itinerary support, present an operation or lodging, propose a story, build a partnership or simply research before deciding.",
    whyP3:
      "In every case, Trovr begins by understanding the context, then connects content, research and curation to indicate the next step clearly, without turning the experience into a generic package.",
    contactCta: "Tell us what you need",

    curateHeading: "How we choose.",
    curateIntro: () => (
      <>
        Everything&nbsp; starts with one question: what is truly worth the trip? The answer must go
        beyond the photograph and bring together experience, context and useful information.
      </>
    ),
    curateIntro2: "Our curation follows three criteria that shape everything we publish:",
    principle1Title: "It has to change you.",
    principle1Body:
      "The place needs to offer something you can live, learn or bring home through sport, culture or a meaningful encounter.",
    principle2Title: "It must go beyond the usual route.",
    principle2Body:
      "We look for alternatives with character and context, even near well-known destinations. Going beyond the obvious does not need to complicate the trip.",
    principle3Title: "It has to be real, not a photo op.",
    principle3Body:
      "The experience needs to make sense beyond the photograph. We explain what to expect, when to go and what makes each place distinctive.",
    curateClosing:
      "That is Trovr's standard: real experience, local culture and enough information to help you find your own way.",

    newsletterHeadline: "Receive letters from Trovr.",
    newsletterSubtext: "New destinations, stories, guides and sports seasons in your inbox.",
    newsletterSuccess: "Done. The next discovery will arrive by email.",

    faqHeading: "Common questions.",
    faq: [
      {
        question: "What is Trovr?",
        answer:
          "Trovr is a hub for travel beyond the obvious. We bring together content, curation of places and experiences, itinerary research and connections to help different people and projects find their next path.",
      },
      {
        question: "Does Trovr sell or operate trips?",
        answer:
          "No. Trovr offers editorial curation and personalized itinerary planning. Bookings, payments and trip operations remain with the traveler and their chosen providers.",
      },
      {
        question: "Who can contact Trovr?",
        answer:
          "Travellers, people still researching, operators, hosts, destinations, brands and editorial projects are all welcome. The form organises the type of interest so each conversation can follow the right path.",
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
    title: "Content for travel beyond the obvious.",
    subtitle:
      "Local culture, experiences, selected news and practical information for understanding what lies beyond tourist attractions.",
    moreHeading: "More content and guides.",
    story: "piece",
    stories: "pieces",
    readTheStory: "Read this",
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
    footerTagline: "A guide to travelling beyond the usual routes.",
    comingSoon: "Coming soon",
    soon: "— soon",
  },

  spotFields: {
    break_type: "Break type",
    bottom_type: "Bottom type",
    recommended_level: "Recommended level",
    ideal_swell: "Ideal swell",
    ideal_wind: "Ideal wind",
    ideal_tide: "Ideal tide",
    hazards: "Hazards",
    crowds: "Crowds",
    distance: "Distance",
    elevation: "Elevation",
    profile: "Profile",
    difficulty: "Difficulty",
    estimated_time: "Estimated time",
    route_type: "Route type",
    terrain_water: "Terrain & water",
    elevation_profile: "Elevation & profile",
    terrain_surface: "Terrain & surface",
    technical_grade: "Technical grade",
    route_shape: "Route shape",
    support_water: "Support & water",
    distance_shape: "Distance & shape",
    surface: "Surface",
    trail_type: "Trail type",
    technical_difficulty: "Technical difficulty",
    physical_demand: "Physical demand",
    status_condition: "Status & condition",
    bike_access: "Bike & access",
    depth: "Depth",
    certification_level: "Certification level",
    access_type: "Access",
    dive_type: "Dive type",
    visibility: "Visibility",
    current: "Current",
    marine_life: "Marine life",
    season_water_temp: "Season & water temp",
    wind_by_month: "Wind by month",
    best_season: "Best season",
    wind_direction: "Wind direction",
    water_type: "Water type",
    bottom_water: "Bottom & water",
    tide_current: "Tide & current",
    level_discipline: "Level & discipline",
    hazards_launch: "Hazards & launch",
    kite_wing: "Kite / Wing",
    holding: "Holding",
    protection: "Protection",
    mooring: "Mooring",
    services: "Services",
    hazards_price: "Hazards & price",
    km_by_difficulty: "Runs by difficulty",
    altitude_vertical: "Altitude & vertical",
    lifts: "Lifts",
    season: "Season",
    snowpark: "Snowpark",
    snow_history: "Snow history",
    pass_price: "Pass price",
    discipline: "Discipline",
    number_of_routes: "Number of routes",
    grade_distribution: "Grade distribution",
    rock_type: "Rock type",
    aspect: "Aspect",
    approach: "Approach",
    height_protection: "Height & protection",
    riding_level: "Riding level",
    pace: "Pace",
    terrain: "Terrain",
    horse_breed: "Horse breed",
    riding_style: "Riding style",
    duration: "Duration",
    whats_included: "What's included",
  },

  spotFieldsShort: {
    break_type: "Break",
    bottom_type: "Bottom",
    recommended_level: "Level",
    ideal_swell: "Swell",
    ideal_wind: "Wind",
    ideal_tide: "Tide",
    hazards: "Hazards",
    crowds: "Crowds",
    wind_direction: "Wind direction",
    water_type: "Water",
    season: "Season",
    discipline: "Discipline",
    riding_level: "Riding level",
    terrain: "Terrain",
    horse_breed: "Horse breed",
    distance: "Distance",
    elevation: "Elevation",
    difficulty: "Difficulty",
    depth: "Depth",
    visibility: "Visibility",
    current: "Current",
    marine_life: "Marine life",
  },

  spotStatus: {
    source_claims: "Source states",
    estimate: "Estimate",
  },
  spotStatusNote:
    "Flagged information comes from the original source or is an estimate and has not yet been independently verified by Trovr.",

  seo: {
    siteTitle: "Trovr | A hub for travel beyond the obvious",
    siteDescription:
      "Discover places, experiences, sports, stories and itineraries for travel beyond traditional tourist circuits with Trovr.",
    homeTitle: "Trovr | A hub for travel beyond the obvious",
    homeDescription:
      "Explore places beyond the obvious, sports experiences, local culture, seasons and custom itineraries with Trovr.",
    aboutTitle: "About Trovr | A hub for travel beyond the obvious",
    aboutDescription:
      "Meet Trovr, a hub of places, experiences and stories for travelling beyond traditional tourist circuits.",
    journalTitle: "Travel content beyond the obvious | Trovr",
    journalDescription:
      "Articles, news, guides, local culture and experiences for knowing destinations beyond tourist attractions and planning travel beyond the obvious.",
    tripsTitle: "Trips by sport, experience and concept | Trovr",
    tripsDescription:
      "Discover trips and experiences organised by sport, concept and destination with Trovr.",
    comingSoonTitle: "Coming Soon — Trovr",
    comingSoonDescription: "This expedition is coming soon.",
  },
} as const;
