import type { Messages } from "./types";

/**
 * Portuguese (Brazil) catalog. Typed `satisfies Messages` so TypeScript fails
 * the build if any key from en.tsx is missing or has the wrong shape.
 *
 * Voice: experienced traveller, curated-specialist — not agency/operator
 * marketing. No clichés, no exclamation-mark hype. Rich entries keep the exact
 * same inline markup (<em>/<br/>/&nbsp;) as English.
 */
export const pt = {
  nav: {
    spots: "Lugares",
    sports: "Esportes",
    journal: "Histórias",
    about: "Sobre",
    itinerary: "Precisa de ajuda com seu roteiro?",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    switchToPt: "Ver em português",
    switchToEn: "Ver em inglês",
  },

  footer: {
    tagline: "Viaje para se descobrir, não para fugir.",
    spotsTagline: "Um guia dos lugares que valem a viagem.",
    copyright: "© 2026 trovr",
    copyrightEmail: "© 2026 · hello@trovr.agency",
  },

  notFound: {
    title: "Página não encontrada",
    body: "A página que você procura não existe ou foi movida.",
    goHome: "Ir para o início",
  },

  errorPage: {
    title: "Esta página não carregou",
    body: "Algo deu errado do nosso lado. Você pode recarregar ou voltar ao início.",
    tryAgain: "Tentar de novo",
  },

  home: {
    heroKicker: "Curadoria de viagens de experiência, esportes e cultura local",
    heroHeadline: () => (
      <>
        Viaje para se descobrir, <em className="italic font-normal">não para fugir.</em>
      </>
    ),
    heroBody:
      "A Trovr é uma curadoria de viagens fora do óbvio. Reunimos lugares para praticar kitesurf, surf, esqui, mergulho, trilhas e outros esportes, com informações que ajudam você a planejar uma viagem com mais propósito.",
    primaryCta: "Explorar destinos por esporte",
    secondaryCta: "Montar meu roteiro personalizado",
    pauseGallery: "Pausar galeria de imagens",
    playGallery: "Reproduzir galeria de imagens",
    sportsKicker: "Destinos para esportes pelo mundo",
    sportsTitle: "Encontre onde viver o esporte que move você.",
    sportsBody:
      "Explore lugares para kitesurf, surf, mergulho, esqui, trilhas, ciclismo, corrida, escalada, vela e cavalgada.",
    explore: "Explorar",
    mapKicker: "Mapa de destinos esportivos",
    mapTitle: "Explore lugares pelo esporte e pela cultura local.",
    mapBody:
      "Comece pela atividade que move você e descubra destinos, temporadas e histórias locais ao redor do mundo.",
    mapCta: "Explorar o mapa de lugares",
    placesKicker: "Destinos fora do óbvio",
    placesTitle: "Lugares escolhidos pelo que você pode viver.",
    placesBody:
      "Cada lugar da Trovr é selecionado pela experiência que oferece: o esporte, a época certa, a cultura local e aquilo que faz a viagem valer.",
    allPlaces: "Ver todos os lugares",
    placeCta: "Conhecer este destino",
    storiesKicker: "Cultura local e histórias de viagem",
    storiesTitle: "Conheça o lugar para além dos pontos turísticos.",
    storiesBody:
      "Descubra costumes, pessoas e experiências que ajudam a entender como é viver em cada destino.",
    storiesCta: "Ler histórias de viagem",
    manifestoKicker: "Viagens com propósito",
    manifestoHeadline: () => (
      <>
        Um carimbo mostra onde você esteve. A viagem certa muda{" "}
        <em className="italic font-normal">a forma como você volta.</em>
      </>
    ),
    manifestoP1:
      "Escolhemos experiências que deixam marca: viagens que despertam coragem, ampliam repertório e fazem você prestar mais atenção ao mundo e à sua própria forma de viver.",
    manifestoP2:
      "Você pode chegar por uma onda, uma trilha, uma montanha ou uma conversa com alguém que vive ali. O importante não é apenas conhecer outro lugar, mas entender sua cultura, viver algo verdadeiro e voltar com uma nova perspectiva.",
    manifestoClosing: "Na Trovr, o destino não é o fim da história. É onde a descoberta começa.",
    founderKicker: "A curadoria por trás da Trovr",
    founderTitle: "Experiência real por trás de cada recomendação.",
    founderBody:
      "A Trovr nasceu das viagens que eu indicaria para os meus amigos mais próximos. Não porque são perfeitas ou famosas, mas porque existe alguma coisa ali que vale o deslocamento: um esporte, uma cultura, um encontro ou uma experiência que muda a forma de enxergar o mundo.",
    founderCta: "Conhecer Pamela e a Trovr",
    serviceKicker: "Roteiros de viagem personalizados",
    serviceTitle: "Um roteiro feito para a sua forma de viajar.",
    serviceBody:
      "Você conta o que quer viver, quanto tempo tem e como gosta de viajar. A Trovr pesquisa destinos, melhores épocas, experiências, deslocamentos e opções de hospedagem para ajudar você a construir um roteiro coerente e fora do óbvio.",
    serviceDisclaimer:
      "A Trovr faz a curadoria e o planejamento do roteiro. As reservas e a operação da viagem continuam sob sua escolha.",
    serviceCta: "Quero um roteiro personalizado",
    faqKicker: "Perguntas frequentes",
    faqTitle: "O que você precisa saber sobre a Trovr.",
    faq: [
      {
        question: "O que é a Trovr?",
        answer:
          "A Trovr é uma plataforma de curadoria de viagens de experiência que conecta destinos, esportes, cultura local e roteiros personalizados.",
      },
      {
        question: "A Trovr vende ou opera viagens?",
        answer:
          "Não. A Trovr pesquisa destinos e ajuda a construir roteiros personalizados, mas não opera diretamente as viagens.",
      },
      {
        question: "Como encontrar destinos para praticar esportes?",
        answer:
          "Use o mapa da Trovr para explorar lugares por modalidade e região, com informações práticas sobre temporadas e condições.",
      },
      {
        question: "Como funciona o roteiro personalizado?",
        answer:
          "Você compartilha seus interesses, período, orçamento e estilo de viagem. A Trovr pesquisa as opções e organiza uma proposta de roteiro adequada ao seu perfil.",
      },
    ],
  },

  newsletter: {
    kicker: "Cartas da Trovr",
    headline: () => (
      <>
        Descubra novos lugares{" "}
        <em className="italic font-normal">antes de todo mundo falar sobre eles.</em>
      </>
    ),
    subtext:
      "Receba destinos por esporte, guias de viagem, histórias sobre cultura local, calendários de temporadas e experiências fora dos roteiros mais comuns.",
    emailPlaceholder: "Digite seu email",
    subscribe: "Receber novas descobertas",
    subscribing: "Inscrevendo…",
    success: "Pronto. A próxima descoberta chega por email.",
    error: "Algo deu errado. Tente novamente.",
  },

  about: {
    heroHeadline: "A Trovr nasceu das viagens que valem o deslocamento.",
    heroSubtext: "Curadoria de destinos esportivos, cultura local e experiências fora do óbvio.",

    whyP1:
      "Um destino pode ser bonito e ainda assim não dizer nada. A Trovr procura os lugares em que existe algo para viver, aprender e levar de volta.",
    whyP2:
      "A pesquisa começa pelo que move você: uma onda, uma trilha, uma montanha, o vento, a neve ou a vontade de entender uma cultura de perto. Depois entram a época certa, o contexto local e as escolhas práticas que transformam interesse em uma viagem possível.",
    whyP3:
      "A Trovr não opera nem vende pacotes. Fazemos curadoria e planejamento para que você descubra possibilidades, compare caminhos e viaje com mais contexto e propósito.",

    curateHeading: "Como curamos.",
    curateIntro: () => (
      <>
        Tudo&nbsp; começa com uma pergunta simples: o que existe ali que realmente vale a viagem? A
        resposta precisa ir além da fotografia e reunir experiência, contexto e informação útil.
      </>
    ),
    curateIntro2:
      "É uma curadoria pessoal, apoiada em três critérios que aparecem em tudo o que publicamos:",
    principle1Title: "Tem que te transformar.",
    principle1Body:
      "O lugar precisa oferecer algo que você possa viver, aprender ou levar de volta — pelo esporte, pela cultura ou por um encontro que mude a perspectiva.",
    principle2Title: "Não pode ser a óbvia.",
    principle2Body:
      "Procuramos alternativas com personalidade e contexto, mesmo quando estão perto de destinos conhecidos. Sair do óbvio não significa complicar a viagem.",
    principle3Title: "Tem que ser real, não pose para foto.",
    principle3Body:
      "A experiência precisa fazer sentido fora da fotografia. Informamos o que esperar, quando ir e o que torna aquele lugar particular para que a decisão seja consciente.",
    curateClosing:
      "Essa é a régua da Trovr: experiência real, cultura local e informação suficiente para ajudar você a descobrir o seu próprio caminho.",

    newsletterHeadline: "Receba as Cartas da Trovr.",
    newsletterSubtext: "Novos destinos, histórias, guias e temporadas esportivas no seu email.",
    newsletterSuccess: "Pronto. A próxima descoberta chega por email.",

    faqHeading: "Perguntas comuns.",
    faq: [
      {
        question: "O que é a Trovr?",
        answer:
          "A Trovr é uma plataforma de curadoria de destinos esportivos, cultura local e experiências fora do óbvio. Reunimos informação e contexto para ajudar você a escolher e planejar viagens com mais propósito.",
      },
      {
        question: "A Trovr vende ou opera viagens?",
        answer:
          "Não. A Trovr faz curadoria editorial e pode ajudar a planejar um roteiro personalizado. Reservas, pagamentos e a operação da viagem ficam sob a escolha do viajante e de seus fornecedores.",
      },
      {
        question: "Como a Trovr faz a curadoria das viagens?",
        answer:
          "Cada lugar é avaliado pela experiência que oferece, pelas melhores épocas, pelo contexto cultural e pela qualidade das informações disponíveis. A seleção combina pesquisa e uma régua editorial pessoal: precisa existir uma razão verdadeira para ir.",
      },
    ],
  },

  comingSoon: {
    kicker: "Expedições Trovr",
    headline: "Em breve…",
    body: "Ainda estamos moldando esta. Deixe seu email na página inicial e você será o primeiro a saber quando ela abrir.",
    backHome: "Voltar ao início",
  },

  journalIndex: {
    title: "Histórias",
    subtitle: "Cultura local, experiências e guias para conhecer um lugar além do óbvio.",
    moreHeading: "Mais do campo.",
    story: "história",
    stories: "histórias",
    readTheStory: "Ler a história",
  },

  inquiry: {
    heading: "Interessado?",
    subheading: "Conte sobre você. Voltamos com os detalhes.",
    name: "Nome",
    email: "Email",
    phone: "Telefone (opcional)",
    when: "Quando você está pensando?",
    whenPlaceholder: "ex.: agosto de 2026 ou flexível",
    about: "Uma linha sobre você",
    aboutPlaceholder: "Sua experiência, o que você busca…",
    submit: "Enviar pedido",
    sending: "Enviando…",
    success: "Obrigada. Retornamos em até 48 horas.",
    error: "Algo deu errado. Tente novamente.",
    tripsLikeThis: "Viagens como esta.",
    factOperator: "Operador",
    factSeason: "Temporada",
    factLevel: "Nível",
    factDuration: "Duração",
    factPrice: "Faixa de preço",
    notFound: "Viagem não encontrada.",
    loadError: "Esta viagem não carregou.",
    tryAgain: "Tentar de novo",
  },

  spotsChrome: {
    footerTagline: "Um guia dos lugares que valem a viagem.",
    comingSoon: "Em breve",
    soon: "— em breve",
  },

  spotFields: {
    break_type: "Tipo de onda",
    bottom_type: "Tipo de fundo",
    recommended_level: "Nível recomendado",
    ideal_swell: "Swell ideal",
    ideal_wind: "Vento ideal",
    ideal_tide: "Maré ideal",
    hazards: "Perigos",
    crowds: "Lotação",
    distance: "Distância",
    elevation: "Elevação",
    profile: "Perfil",
    difficulty: "Dificuldade",
    estimated_time: "Tempo estimado",
    route_type: "Tipo de rota",
    terrain_water: "Terreno e água",
    elevation_profile: "Elevação e perfil",
    terrain_surface: "Terreno e superfície",
    technical_grade: "Grau técnico",
    route_shape: "Formato da rota",
    support_water: "Apoio e água",
    distance_shape: "Distância e formato",
    surface: "Superfície",
    trail_type: "Tipo de trilha",
    technical_difficulty: "Dificuldade técnica",
    physical_demand: "Exigência física",
    status_condition: "Status e condição",
    bike_access: "Bicicleta e acesso",
    depth: "Profundidade",
    certification_level: "Nível de certificação",
    access_type: "Acesso",
    dive_type: "Tipo de mergulho",
    visibility: "Visibilidade",
    current: "Corrente",
    marine_life: "Vida marinha",
    season_water_temp: "Temporada e temp. da água",
    wind_by_month: "Vento por mês",
    best_season: "Melhor época",
    wind_direction: "Direção do vento",
    water_type: "Tipo de água",
    bottom_water: "Fundo e água",
    tide_current: "Maré e corrente",
    level_discipline: "Nível e modalidade",
    hazards_launch: "Perigos e decolagem",
    kite_wing: "Kitesurf / Wingfoil",
    holding: "Fundeio",
    protection: "Proteção",
    mooring: "Ancoradouro",
    services: "Serviços",
    hazards_price: "Perigos e preço",
    km_by_difficulty: "Pistas por dificuldade",
    altitude_vertical: "Altitude e desnível",
    lifts: "Remontes",
    season: "Temporada",
    snowpark: "Snowpark",
    snow_history: "Histórico de neve",
    pass_price: "Preço do passe",
    discipline: "Modalidade",
    number_of_routes: "Número de vias",
    grade_distribution: "Distribuição de graus",
    rock_type: "Tipo de rocha",
    aspect: "Orientação",
    approach: "Aproximação",
    height_protection: "Altura e proteção",
    riding_level: "Nível de montaria",
    pace: "Ritmo",
    terrain: "Terreno",
    horse_breed: "Raça do cavalo",
    riding_style: "Estilo de montaria",
    duration: "Duração",
    whats_included: "O que está incluído",
  },

  spotFieldsShort: {
    break_type: "Onda",
    bottom_type: "Fundo",
    recommended_level: "Nível",
    ideal_swell: "Swell",
    ideal_wind: "Vento",
    ideal_tide: "Maré",
    hazards: "Perigos",
    crowds: "Lotação",
    wind_direction: "Direção do vento",
    water_type: "Água",
    season: "Temporada",
    discipline: "Modalidade",
    riding_level: "Nível de montaria",
    terrain: "Terreno",
    horse_breed: "Raça do cavalo",
    distance: "Distância",
    elevation: "Elevação",
    difficulty: "Dificuldade",
    depth: "Profundidade",
    visibility: "Visibilidade",
    current: "Corrente",
    marine_life: "Vida marinha",
  },

  spotStatus: {
    source_claims: "Fonte afirma",
    estimate: "Estimativa",
  },

  seo: {
    siteTitle: "Trovr | Viagens de experiência, esportes e cultura",
    siteDescription:
      "Descubra destinos esportivos, cultura local e roteiros personalizados com a curadoria de viagens fora do óbvio da Trovr.",
    homeTitle: "Trovr | Viagens de experiência, esportes e cultura",
    homeDescription:
      "Descubra destinos para kitesurf, surf, trilhas, esqui e mergulho. Explore cultura local, melhores épocas e roteiros personalizados com a Trovr.",
    aboutTitle: "Sobre — Trovr",
    aboutDescription:
      "A história por trás da Trovr — uma coleção curada a mão de viagens de aventura imersivas, fora do circuito turístico, para quem viaja para explorar, sentir intensamente e voltar mudado.",
    journalTitle: "Histórias — Trovr",
    journalDescription: "Notas de campo dos lugares para onde mandamos gente.",
    tripsTitle: "Viagens — Trovr",
    tripsDescription:
      "Viagens curadas para quem viaja para sentir. Kite, surf, cavalo, vida selvagem, artes marciais.",
    comingSoonTitle: "Em Breve — Trovr",
    comingSoonDescription: "Esta expedição chega em breve.",
  },
} satisfies Messages;
