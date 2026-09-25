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
    sports: "Sports",
    journal: "Journal",
    about: "About",
    itinerary: "Need help with your itinerary?",
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
    heroKicker: "Curated experiential travel, sports and local culture",
    heroHeadline: () => (
      <>
        Travel to discover yourself, <em className="italic font-normal">not to escape.</em>
      </>
    ),
    heroBody:
      "Trovr is a curation of off-the-beaten-path travel. We bring together places for kitesurfing, surfing, skiing, diving, hiking and other sports, with the context you need to plan a more meaningful trip.",
    primaryCta: "Explore destinations by sport",
    secondaryCta: "Build my custom itinerary",
    pauseGallery: "Pause image gallery",
    playGallery: "Play image gallery",
    sportsKicker: "Sports destinations around the world",
    sportsTitle: "Find where to live the sport that moves you.",
    sportsBody:
      "Explore places for kitesurfing, surfing, diving, skiing, hiking, cycling, trail running, climbing, sailing and horseback riding.",
    explore: "Explore",
    mapKicker: "Map of sports destinations",
    mapTitle: "Explore places through sport and local culture.",
    mapBody:
      "Start with the activity that moves you and discover destinations, seasons and local stories around the world.",
    mapCta: "Explore the map",
    placesKicker: "Off-the-beaten-path destinations",
    placesTitle: "Places chosen for what you can live there.",
    placesBody:
      "Every place on Trovr is selected for the experience it offers: the sport, the right season, local culture and what makes the journey worth it.",
    allPlaces: "See all places",
    placeCta: "Discover this destination",
    storiesKicker: "Local culture and travel stories",
    storiesTitle: "Know the place beyond its attractions.",
    storiesBody:
      "Discover customs, people and experiences that help you understand how life unfolds in each destination.",
    storiesCta: "Read travel stories",
    manifestoKicker: "Travel with purpose",
    manifestoHeadline: () => (
      <>
        A stamp shows where you went. The right trip changes{" "}
        <em className="italic font-normal">how you return.</em>
      </>
    ),
    manifestoP1:
      "We choose experiences that leave a mark: journeys that awaken courage, broaden your repertoire and make you pay closer attention to the world and to how you live.",
    manifestoP2:
      "You might arrive through a wave, a trail, a mountain or a conversation with someone who lives there. The point is not only to see another place, but to understand its culture and return with a new perspective.",
    manifestoClosing:
      "At Trovr, the destination is not the end of the story. It is where discovery begins.",
    founderKicker: "The curation behind Trovr",
    founderTitle: "Real experience behind every recommendation.",
    founderBody:
      "Trovr was born from the trips I would recommend to my closest friends. Not because they are perfect or famous, but because there is something there worth the journey: a sport, a culture, an encounter or an experience that changes how you see the world.",
    founderCta: "Meet Pamela and Trovr",
    serviceKicker: "Custom travel itineraries",
    serviceTitle: "An itinerary made for the way you travel.",
    serviceBody:
      "Tell us what you want to experience, how much time you have and how you like to travel. Trovr researches destinations, seasons, experiences, transport and lodging to help you build a coherent itinerary beyond the obvious.",
    serviceDisclaimer:
      "Trovr curates and plans the itinerary. Bookings and trip operation remain under your choice.",
    serviceCta: "I want a custom itinerary",
    faqKicker: "Common questions",
    faqTitle: "What you need to know about Trovr.",
    faq: [
      {
        question: "What is Trovr?",
        answer:
          "Trovr is a travel curation platform that connects destinations, sports, local culture and custom itineraries.",
      },
      {
        question: "Does Trovr sell or operate trips?",
        answer:
          "No. Trovr researches destinations and helps build custom itineraries, but does not directly operate trips.",
      },
      {
        question: "How can I find destinations for sports?",
        answer:
          "Use the Trovr map to explore places by sport and region, with practical information about seasons and conditions.",
      },
      {
        question: "How does a custom itinerary work?",
        answer:
          "You share your interests, travel period, budget and style. Trovr researches the options and organizes an itinerary proposal for your profile.",
      },
    ],
  },

  newsletter: {
    kicker: "Letters from Trovr",
    headline: () => (
      <>
        Discover new places{" "}
        <em className="italic font-normal">before everyone talks about them.</em>
      </>
    ),
    subtext:
      "Get sports destinations, travel guides, local culture stories, seasonal calendars and experiences outside the usual routes.",
    emailPlaceholder: "your@email.com",
    subscribe: "Get new discoveries",
    subscribing: "Subscribing…",
    success: "Done. The next discovery will arrive by email.",
    error: "Something went wrong. Please try again.",
  },

  about: {
    heroHeadline: "Trovr began with journeys worth going out of your way for.",
    heroSubtext: "Curation of sports destinations, local culture and uncommon experiences.",

    whyP1:
      "A destination can be beautiful and still say nothing. Trovr looks for places where there is something meaningful to live, learn and bring home.",
    whyP2:
      "The research starts with what moves you: a wave, a trail, a mountain, the wind, the snow or the desire to understand a culture up close. Then come the right season, local context and practical choices that make the trip possible.",
    whyP3:
      "Trovr does not operate or sell travel packages. We curate and plan so you can discover possibilities, compare routes and travel with more context and purpose.",

    curateHeading: "How we curate.",
    curateIntro: () => (
      <>
        Everything&nbsp; starts with one question: what is truly worth the trip? The answer must go
        beyond the photograph and bring together experience, context and useful information.
      </>
    ),
    curateIntro2:
      "It is personal curation, guided by three criteria that shape everything we publish:",
    principle1Title: "It has to change you.",
    principle1Body:
      "The place needs to offer something you can live, learn or bring home through sport, culture or a meaningful encounter.",
    principle2Title: "It can't be the obvious one.",
    principle2Body:
      "We look for alternatives with character and context, even near well-known destinations. Going beyond the obvious does not have to complicate the trip.",
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
          "Trovr is a curated platform for sports destinations, local culture and uncommon experiences, with information to help travelers choose and plan with purpose.",
      },
      {
        question: "Does Trovr sell or operate trips?",
        answer:
          "No. Trovr offers editorial curation and personalized itinerary planning. Bookings, payments and trip operations remain with the traveler and their chosen providers.",
      },
      {
        question: "How does Trovr curate its trips?",
        answer:
          "Each place is assessed for its experience, best seasons, cultural context and the quality of available information. There must be a real reason to go.",
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
    subtitle: "Local culture, experiences and guides for seeing a place beyond the obvious.",
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

  seo: {
    siteTitle: "Trovr | Experiential travel, sports and local culture",
    siteDescription:
      "Discover sports destinations, local culture and custom itineraries with Trovr's curation of off-the-beaten-path travel experiences.",
    homeTitle: "Trovr | Experiential travel, sports and local culture",
    homeDescription:
      "Discover destinations for kitesurfing, surfing, hiking, skiing and diving. Explore local culture, seasons and custom itineraries with Trovr.",
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
