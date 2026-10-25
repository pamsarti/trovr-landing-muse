export const VIAGEM_PLANS = {
  essencial: {
    name: "Curadoria Essencial",
    price: 499,
    title: "Descubra para onde ir.",
    description:
      "Uma seleção personalizada de destinos e experiências para quem quer encontrar uma viagem que realmente combine com seus interesses, seu momento e seu orçamento.",
    items: [
      "Briefing personalizado por formulário.",
      "Até 3 sugestões de destinos ou experiências.",
      "Até 5 indicações de atividades.",
      "Até 3 sugestões de hospedagem.",
      "Recomendações de operadores especializados.",
      "Estimativa geral de orçamento.",
      "Documento digital personalizado.",
      "Uma rodada de esclarecimentos.",
      "Entrega em até 5 dias úteis após briefing e pagamento.",
    ],
    exclusions: "Não inclui roteiro dia a dia, reservas ou acompanhamento durante a viagem.",
    cta: "Quero minha curadoria.",
    paymentUrl: null as string | null,
  },
  premium: {
    name: "Curadoria Premium",
    price: 1499,
    title: "Sua viagem, planejada em detalhes.",
    description:
      "Uma viagem construída em torno de você, com experiências selecionadas, roteiro organizado e todos os caminhos para transformar a ideia em uma viagem possível.",
    items: [
      "Briefing personalizado e reunião de até 45 minutos.",
      "Um destino principal e alternativa, se necessária.",
      "Roteiro personalizado dia a dia, para viagens de até 10 dias.",
      "Até 8 experiências selecionadas.",
      "Até 5 hospedagens comparadas.",
      "Pesquisa e comparação de operadores.",
      "Orientações sobre deslocamentos e logística.",
      "Orçamento estimado detalhado.",
      "Página privada e navegável.",
      "Versão digital em PDF.",
      "Até 2 rodadas de ajustes.",
      "Suporte para dúvidas por 15 dias após entrega.",
      "Entrega em até 10 dias úteis após briefing completo e reunião.",
    ],
    exclusions:
      "Não inclui reservas, pagamentos a fornecedores, concierge durante a viagem ou alterações ilimitadas.",
    cta: "Quero planejar minha viagem.",
    paymentUrl: null as string | null,
  },
} as const;
export type ViagemPlan = keyof typeof VIAGEM_PLANS;
export const formatPlanPrice = (price: number) => `R$ ${price.toLocaleString("pt-BR")}`;
