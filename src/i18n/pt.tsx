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
    spots: "Spots",
    journal: "Journal",
    about: "Sobre",
    earlyAccess: "Acesso antecipado",
    openMenu: "Abrir menu",
    closeMenu: "Fechar menu",
    switchToPt: "Ver em português",
    switchToEn: "View in English",
  },

  footer: {
    tagline: "Viaje para encontrar, não para fugir.",
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
    heroKicker: "Expedições escolhidas a dedo para quem viaja mais fundo.",
    heroHeadline: () => (
      <>
        Viaje para <em className="italic font-normal">encontrar.</em>
        <br />
        Não para fugir.
      </>
    ),
    seeExpeditions: "Ver expedições",
    earlyAccessArrow: "Acesso antecipado →",

    manifestoKicker: "O manifesto",
    manifestoHeadline: () => (
      <>
        A viagem certa vai&nbsp; <em className="italic font-normal">mais fundo</em>
        &nbsp;do que qualquer ponto no mapa.
      </>
    ),
    manifestoP1:
      "Escolhemos jornadas feitas para te expandir e ficar com você — daquelas que te deixam mais afiado, mais corajoso, mais atento ao que uma vida pode conter. Lugares que exigem algo de você e devolvem mais do que tomaram.",
    manifestoP2:
      "É essa a ideia da Trovr: aventura com algo por baixo. Intensa de viver. Impossível de esquecer.",

    journalKicker: "Notas de campo",
    journalHeadline: () => (
      <>
        Do <em className="italic font-normal">journal.</em>
      </>
    ),
    allEntries: "Todas as histórias →",

    expeditionsKicker: "Outono de 2026",
    expeditionsHeadline: () => (
      <>
        Primeiras <em className="italic font-normal">expedições.</em>
      </>
    ),
    metricActivity: "Atividade",
    metricDuration: "Duração",
    metricSeason: "Temporada",
    metricLevel: "Nível",
    seeThisExpedition: "Ver esta expedição",

    statPlaces: "Lugares mapeados para você",
    statContinents: "Continentes cobertos",
    statLaunching: "Lançamento",
  },

  newsletter: {
    kicker: "Acesso antecipado",
    headline: () => (
      <>
        Quando as <em className="italic font-normal">primeiras</em> expedições abrirem, você será o
        primeiro a saber.
      </>
    ),
    subtext: "Sem ruído. Só as cartas que importam.",
    emailPlaceholder: "seu@email.com",
    subscribe: "Inscrever",
    subscribing: "Inscrevendo…",
    success: "Obrigada. Em breve entramos em contato.",
    error: "Algo deu errado. Tente novamente.",
  },

  about: {
    heroHeadline: "Temos uma só regra:\nNinguém sai do mesmo jeito",
    heroSubtext: "Construímos a Trovr para cumprir essa promessa",

    whyP1:
      "Você nunca vai se arrepender de viver uma dessas. É a única promessa que fazemos — e tudo na Trovr existe para cumpri-la.",
    whyP2:
      "A Trovr é uma curadoria de jornadas que deixam marca. Viagens para quem viaja para se sentir desperto, testar os próprios limites, voltar um pouco outro. Alguns perseguem esse sentimento há anos. Outros só agora começam a senti-lo. Os dois têm lugar aqui.",
    whyP3:
      "São as jornadas que ficam com você — daquelas que expandem o que cabe numa vida, das quais você não se recupera por inteiro, em torno das quais você acaba construindo uma vida. O que você encontra lá fora é a razão de ir.",

    curateHeading: "Como curamos.",
    curateIntro: () => (
      <>
        Tudo&nbsp; começa no instinto. Cada viagem na Trovr é escolhida a mão — a minha — contra uma
        pergunta que venho refinando há anos: eu iria? Se eu não largaria tudo para viver aquilo,
        não passa. É o primeiro filtro, e o mais difícil de fingir.
      </>
    ),
    curateIntro2:
      "Mas o instinto tem forma. Olhe de perto o que sobrevive a ele e as mesmas três coisas estão sempre lá:",
    principle1Title: "Tem que te transformar.",
    principle1Body:
      "Não só te mostrar um lugar — deixar uma marca em você. As viagens que escolhemos são aquelas de que você volta um pouco diferente: mais corajoso, mais quieto, mais atento ao que é capaz. Se uma jornada não faz isso, é só logística.",
    principle2Title: "Não pode ser a óbvia.",
    principle2Body:
      "Nada de resorts que todo mundo já viu. Nada de rota que aparece primeiro na busca. Procuramos as viagens que a maioria nem sabe que existem — ou não ousaria fazer. Quanto mais longe do caminho batido, mais prestamos atenção.",
    principle3Title: "Tem que ser real, não pose para foto.",
    principle3Body:
      "Algumas viagens existem para render bem online e não deixam nada. Recusamos todas elas. O que guardamos são as jornadas que se vivem, não se encenam — as que ficam com você muito depois de a última foto deixar de importar.",
    curateClosing:
      "É esse o método inteiro. Sem comitê, sem checklist disfarçado de ciência. Só uma régua alta, pessoal, aplicada a cada viagem — para que, quando algo chega até você, já tenha conquistado a única aprovação que conta.",

    newsletterHeadline: "Deixe seu email.",
    newsletterSubtext: "Escrevemos quando as primeiras viagens abrirem.",
    newsletterSuccess: "Obrigada. Em breve falamos.",

    faqHeading: "Perguntas comuns.",
    faq: [
      {
        question: "O que é a Trovr?",
        answer:
          "A Trovr é uma coleção curada a mão de viagens de aventura imersivas, fora do circuito turístico — jornadas construídas em torno de esporte, exploração e descoberta de verdade, não de passeio. Cada viagem é escolhida por uma razão: acrescentar algo real à sua vida. A aventura é o caminho de entrada; o que você encontra lá fora é o que faz valer.",
      },
      {
        question: "Que tipo de viagem a Trovr oferece?",
        answer:
          "A Trovr faz a curadoria de experiências ativas e fora do mapa em cinco continentes — kitesurf, surf, mergulho livre, expedições a cavalo, jornadas de vida selvagem e mais. São viagens que exigem algo de você e devolvem mais do que tomaram: lugares remotos, terreno de verdade e o tipo de desafio do qual você volta um pouco mudado. Vão de jornadas para aventureiros experientes a outras para quem só agora começa a sentir o chamado.",
      },
      {
        question: "Como a Trovr faz a curadoria das viagens?",
        answer:
          "Cada viagem é escolhida a mão, contra uma única pergunta: nós iríamos? A Trovr procura jornadas que mudam quem as faz, que não são a opção turística óbvia, e que se vivem em vez de se encenar para uma foto. Não há comitê nem checklist disfarçado de ciência — só uma régua alta e pessoal aplicada a cada viagem, para que, quando uma chega até você, já tenha conquistado a única aprovação que conta.",
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
    title: "Journal",
    subtitle: "Notas de campo dos lugares para onde mandamos gente.",
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

  seo: {
    siteTitle: "Trovr — Viagens de Aventura Imersivas e Curadas",
    siteDescription:
      "Descubra viagens de aventura imersivas e curadas a mão — esporte, exploração e jornadas fora do mapa, escolhidas para acrescentar algo real à sua vida.",
    homeTitle: "Trovr — Viagens de Aventura Imersivas e Curadas",
    homeDescription:
      "Descubra viagens de aventura imersivas e curadas a mão — esporte, exploração e jornadas fora do mapa, escolhidas para acrescentar algo real à sua vida.",
    aboutTitle: "Sobre — Trovr",
    aboutDescription:
      "A história por trás da Trovr — uma coleção curada a mão de viagens de aventura imersivas, fora do circuito turístico, para quem viaja para explorar, sentir intensamente e voltar mudado.",
    journalTitle: "Journal — Trovr",
    journalDescription: "Notas de campo dos lugares para onde mandamos gente.",
    tripsTitle: "Viagens — Trovr",
    tripsDescription:
      "Viagens curadas para quem viaja para sentir. Kite, surf, cavalo, vida selvagem, artes marciais.",
    comingSoonTitle: "Em Breve — Trovr",
    comingSoonDescription: "Esta expedição chega em breve.",
  },
} satisfies Messages;
