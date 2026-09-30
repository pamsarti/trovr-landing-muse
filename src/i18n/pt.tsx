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
    sports: "Viagens",
    journal: "Conteúdo",
    about: "Sobre",
    itinerary: "Crie sua viagem",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    switchToPt: "Ver em português",
    switchToEn: "Ver em inglês",
  },

  footer: {
    tagline: "Viaje para se descobrir, não para fugir.",
    spotsTagline: "Um guia para viajar além dos roteiros de sempre.",
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
    heroKicker: "Hub de viagens fora do óbvio",
    heroHeadline: () => (
      <>
        Descubra o mundo além dos <em className="italic font-normal">roteiros de sempre.</em>
      </>
    ),
    heroBody:
      "A Trovr reúne lugares, experiências, esportes, histórias e informação prática para quem quer sair dos circuitos turísticos tradicionais sem viajar no escuro.",
    primaryCta: "Explorar lugares",
    secondaryCta: "Crie sua viagem",
    pauseGallery: "Pausar galeria de imagens",
    playGallery: "Reproduzir galeria de imagens",
    sportsKicker: "Escolha o que quer viver",
    sportsTitle: "Às vezes, a viagem começa antes do destino.",
    sportsBody:
      "Comece por um esporte, uma paisagem ou uma forma de viajar. Descubra onde viver essa experiência, quando ir e o que existe ao redor dela.",
    explore: "Explorar",
    mapKicker: "Mapa Trovr",
    mapTitle: "Um mundo de possibilidades fora da rota habitual.",
    mapBody:
      "Explore lugares por esporte, região e época do ano. Cada ponto reúne contexto local e informações para ajudar você a entender se aquela viagem combina com você.",
    mapCta: "Explorar o mapa",
    placesKicker: "Curadoria Trovr",
    placesTitle: "Lugares com uma razão verdadeira para ir.",
    placesBody:
      "Não procuramos apenas destinos bonitos. Escolhemos lugares onde existe algo para viver: uma atividade, uma cultura, uma paisagem ou uma história que justifique o deslocamento.",
    allPlaces: "Ver todos os lugares",
    placeCta: "Conhecer este destino",
    storiesKicker: "Conteúdo Trovr",
    storiesTitle: "Contexto para entender um lugar antes de chegar.",
    storiesBody:
      "Artigos, guias, notícias selecionadas e escolhas práticas para conhecer destinos para além dos pontos turísticos.",
    storiesCta: "Ver todo o conteúdo",
    manifestoKicker: "Viajar além do óbvio",
    manifestoHeadline: () => (
      <>
        Não é sobre chegar onde ninguém foi. É sobre viver o lugar{"\u00A0"}
        <em className="italic font-normal">de outro jeito.</em>
      </>
    ),
    manifestoP1:
      "Viajar fora do óbvio não significa perseguir lugares secretos ou transformar destinos em troféus. Significa escolher com mais curiosidade, entender o contexto e permitir que a experiência conduza a viagem.",
    manifestoP2:
      "Você pode chegar por uma onda, uma trilha, um trem, uma montanha ou uma conversa. O destino importa, mas o que você encontra quando presta atenção importa ainda mais.",
    manifestoClosing:
      "Na Trovr, o lugar não é apenas um ponto no mapa. É o começo de uma descoberta.",
    founderKicker: "A curadoria por trás da Trovr",
    founderTitle: "Menos listas prontas. Mais razões para viajar.",
    founderBody:
      "A Trovr seleciona lugares pelo que você pode viver e aprender neles. Cada recomendação considera a experiência, a melhor época, a cultura local e as informações necessárias para transformar interesse em uma viagem possível.",
    founderCta: "Conheça a Trovr",
    serviceKicker: "Viagem Trovr",
    serviceTitle: "Uma viagem que começa pelo que você quer viver.",
    serviceBody:
      "A Trovr transforma seu momento, seus desejos e seus limites em uma viagem possível, com curadoria fora do óbvio e um roteiro construído no seu ritmo.",
    serviceDisclaimer:
      "Você pode começar mesmo sem destino definido. A candidatura não gera cobrança nem contratação automática.",
    serviceCta: "Conhecer a Viagem Trovr",
    faqKicker: "Perguntas frequentes",
    faqTitle: "Como usar a Trovr para viajar fora do óbvio.",
    faq: [
      {
        question: "O que é a Trovr e como ela ajuda a planejar uma viagem fora do óbvio?",
        answer:
          "A Trovr é um hub de viagens fora do óbvio. Reunimos destinos, experiências, esportes, cultura local, conteúdo e informações práticas para ajudar você a escolher para onde ir, quando viajar e o que viver em cada lugar.",
      },
      {
        question: "O que significa viajar fora do óbvio?",
        answer:
          "Não significa procurar apenas destinos secretos ou remotos. Significa conhecer um lugar além dos pontos turísticos, com contexto local, experiências relevantes e escolhas que tenham relação com o seu jeito de viajar.",
      },
      {
        question: "Como encontrar destinos por esporte, experiência ou época do ano?",
        answer:
          "Use o mapa e os filtros da Trovr para explorar lugares por modalidade, região e temporada. Cada destino reúne condições, melhores épocas e informações úteis para comparar possibilidades antes de planejar a viagem.",
      },
      {
        question: "Como a Trovr escolhe os lugares e experiências que publica?",
        answer:
          "A curadoria considera o que existe de relevante para viver ou aprender, a melhor época, a cultura local e a qualidade das informações disponíveis. Um lugar entra na Trovr quando há uma razão real para ir, não apenas uma boa fotografia.",
      },
      {
        question: "A Trovr vende passagens, hospedagens ou pacotes de viagem?",
        answer:
          "Não. A Trovr funciona como plataforma de conteúdo e curadoria. As reservas, os pagamentos e a operação da viagem são feitos diretamente pelo viajante com os fornecedores que escolher.",
      },
      {
        question: "A Trovr também cria roteiros personalizados?",
        answer:
          "Sim. Para quem quer apoio adicional, a Trovr pesquisa destinos, épocas, experiências, deslocamentos e hospedagens e organiza uma proposta coerente com os interesses, o período e o ritmo da viagem.",
      },
    ],
  },

  newsletter: {
    kicker: "Cartas da Trovr",
    headline: () => (
      <>
        Ideias para sair{"\u00A0"}
        <em className="italic font-normal">dos roteiros de sempre.</em>
      </>
    ),
    subtext:
      "Receba lugares, experiências, histórias locais, temporadas esportivas e novas formas de conhecer o mundo.",
    emailPlaceholder: "Digite seu email",
    subscribe: "Receber descobertas",
    subscribing: "Inscrevendo…",
    success: "Pronto. A próxima descoberta chega por email.",
    error: "Algo deu errado. Tente novamente.",
  },

  about: {
    heroHeadline: "A Trovr existe para tornar o mundo menos óbvio.",
    heroSubtext:
      "Conteúdo, curadoria de lugares e experiências, pesquisa de roteiros e conexões para quem quer conhecer o mundo além dos circuitos turísticos tradicionais.",

    whyP1:
      "A Trovr reúne, em um só lugar, conteúdo sobre destinos, esportes, temporadas e cultura local, curadoria de experiências e apoio para transformar uma ideia de viagem em um caminho possível.",
    whyP2:
      "Você pode chegar para descobrir um lugar, pedir ajuda com um roteiro, apresentar uma operação ou hospedagem, propor uma pauta, construir uma parceria ou simplesmente pesquisar antes de decidir.",
    whyP3:
      "Em todos esses casos, a Trovr começa entendendo o contexto. Depois conecta conteúdo, pesquisa e curadoria para indicar o próximo passo com clareza, sem transformar a experiência em um pacote genérico.",
    contactCta: "Conte o que você procura",

    curateHeading: "Como escolhemos.",
    curateIntro: () => (
      <>
        Tudo&nbsp; começa com uma pergunta simples: o que existe ali que realmente vale a viagem? A
        resposta precisa ir além da fotografia e reunir experiência, contexto e informação útil.
      </>
    ),
    curateIntro2: "Nossa curadoria segue três critérios que aparecem em tudo o que publicamos:",
    principle1Title: "Tem que te transformar.",
    principle1Body:
      "O lugar precisa oferecer algo que você possa viver, aprender ou levar de volta — pelo esporte, pela cultura ou por um encontro que mude a perspectiva.",
    principle2Title: "Precisa ir além do roteiro de sempre.",
    principle2Body:
      "Procuramos alternativas com personalidade e contexto, mesmo quando estão perto de destinos conhecidos. Sair do óbvio não precisa complicar a viagem.",
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
          "A Trovr é um hub de viagens fora do óbvio. Reunimos conteúdo, curadoria de lugares e experiências, pesquisa de roteiros e conexões para ajudar diferentes pessoas e projetos a encontrar o próximo caminho.",
      },
      {
        question: "A Trovr vende ou opera viagens?",
        answer:
          "Não. A Trovr faz curadoria editorial e pode ajudar a planejar um roteiro personalizado. Reservas, pagamentos e a operação da viagem ficam sob a escolha do viajante e de seus fornecedores.",
      },
      {
        question: "Quem pode entrar em contato com a Trovr?",
        answer:
          "Viajantes, pessoas ainda pesquisando, operadores, anfitriões, destinos, marcas e projetos editoriais são bem-vindos. O formulário organiza o tipo de interesse para que cada conversa siga para o caminho certo.",
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
    title: "Conteúdo para viajar além do óbvio.",
    subtitle:
      "Cultura local, experiências, notícias selecionadas e informação prática para entender o que existe além dos pontos turísticos.",
    moreHeading: "Mais conteúdos e guias.",
    story: "conteúdo",
    stories: "conteúdos",
    readTheStory: "Ler conteúdo",
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
    footerTagline: "Um guia para viajar além dos roteiros de sempre.",
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
    wind_by_month: "Vento ao longo do ano",
    best_season: "Temporada recomendada",
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
    source_claims: "Fonte original",
    estimate: "Estimativa",
  },
  spotStatusNote:
    "Informações sinalizadas vêm da fonte original ou são estimativas e ainda não foram verificadas de forma independente pela Trovr.",

  seo: {
    siteTitle: "Trovr | Hub de viagens fora do óbvio",
    siteDescription:
      "Descubra lugares, experiências, esportes, histórias e roteiros para viajar além dos circuitos turísticos tradicionais com a Trovr.",
    homeTitle: "Trovr | Hub de viagens fora do óbvio",
    homeDescription:
      "Explore lugares fora do óbvio, experiências por esporte, cultura local, melhores épocas e roteiros personalizados com a Trovr.",
    aboutTitle: "Sobre a Trovr | Hub de viagens fora do óbvio",
    aboutDescription:
      "Conheça a Trovr, um hub de lugares, experiências e histórias para viajar além dos circuitos turísticos tradicionais.",
    journalTitle: "Conteúdo de viagem fora do óbvio | Trovr",
    journalDescription:
      "Artigos, notícias, guias, cultura local e experiências para conhecer destinos além dos pontos turísticos e planejar viagens fora do óbvio.",
    tripsTitle: "Viagens por esporte, experiência e conceito | Trovr",
    tripsDescription:
      "Descubra viagens fora do óbvio organizadas por esporte, experiência, conceito e destino no hub da Trovr.",
    comingSoonTitle: "Em Breve — Trovr",
    comingSoonDescription: "Esta expedição chega em breve.",
  },
} satisfies Messages;
