export type TripPresentation = { title: string; place: string; type: string; summary: string; scene: string; practical: string; season?: string; duration?: string; days?: string; planning?: string; seasonSource?: string; soon?: boolean; story?: boolean };

export const TRIP_PRESENTATION: Record<string, TripPresentation | undefined> = {
  "chicama-surfe": {
    "season": "Abril a outubro costuma trazer ondulações de sul mais consistentes.",
    "duration": "A combinar, conforme os dias que você quer passar na água.",
    "days": "A praia é o ponto de partida. Os dias podem alternar sessões de surf, descanso e tempo na vila. A ondulação ajuda a decidir quando entrar; a viagem ganha ritmo entre uma sessão e outra.",
    "planning": "Conte de onde você sai, como surfa hoje e se viaja por conta própria ou com um grupo. A partir disso, a conversa avança para a época, a permanência e as possibilidades com os profissionais do destino.",
    "seasonSource": "https://www.chicamasurftrips.com/about-chicama/",
    "title": "Surfar a longa esquerda de Chicama",
    "place": "Puerto Malabrigo, Peru",
    "type": "Surf",
    "summary": "Em Puerto Malabrigo, uma esquerda acompanha o desenho da costa. Quando as seções se conectam, a onda continua abrindo à sua frente.",
    "scene": "Em Chicama, a onda quebra ao longo da costa de uma vila pesqueira no norte do Peru. Nos dias em que a ondulação conecta as seções, dá para passar de um trecho ao outro na mesma onda e ainda encontrar parede pela frente. É esse tempo na água, com espaço para ler a onda e escolher a próxima linha, que faz a viagem.",
    "practical": "A onda muda com a ondulação, o vento e a maré. Na conversa, conte como você surfa hoje e o que quer encontrar na água. Isso ajuda a orientar a escolha da época e dos dias que você pretende passar no litoral."
  },
  "tonga-jubartes": {
    "season": "Julho a outubro, período de chegada das jubartes a Tonga.",
    "duration": "A combinar, considerando os dias disponíveis e as saídas de barco.",
    "days": "Reserve espaço na viagem para o tempo do mar. Cada saída é diferente: pode haver espera no barco, observação à distância ou entrada na água autorizada pela equipe. Estar ali também é acompanhar o comportamento dos animais, sem apressar o encontro.",
    "planning": "A atividade deve acontecer com operador licenciado. Conte sua experiência nadando em mar aberto, as datas possíveis e com quem pretende viajar. A conversa ajuda a planejar a estadia e as saídas, sem prometer avistamento ou entrada na água.",
    "seasonSource": "https://www.tongatourism.travel/see-and-do/swim-with-whales",
    "title": "Sair de barco para nadar com baleias jubartes",
    "place": "Tonga",
    "type": "Vida selvagem",
    "summary": "Saia de barco em Tonga e procure no horizonte os primeiros sinais das jubartes. Se as condições permitirem, o encontro continua na água.",
    "scene": "A experiência começa no barco, com os olhos no horizonte. Um sopro ou o movimento de uma cauda muda a atenção de todo mundo a bordo. Quando a equipe autoriza a entrada na água, existe a possibilidade de ver de perto a escala e o movimento de uma jubarte no mar aberto.",
    "practical": "O encontro depende do mar e do comportamento dos animais. A equipe responsável pela saída decide se é possível entrar na água. Na conversa, vale contar como você se sente nadando em mar aberto e em que época gostaria de ir."
  },
  "providencia-tubaroes": {
    "season": "Mergulho ao longo do ano, sujeito ao vento e às condições do mar.",
    "duration": "A combinar, conforme os mergulhos e os deslocamentos até a ilha.",
    "days": "A viagem tem tempo de barco, tempo debaixo d’água e tempo de ilha. Entre os mergulhos, dá para conhecer Providencia com calma. Os pontos de saída são escolhidos conforme o mar e a experiência de quem mergulha; encontrar tubarões é uma possibilidade, não uma etapa marcada.",
    "planning": "Conte se você tem certificação, quando mergulhou pela última vez e se vai por conta própria ou em grupo. O planejamento precisa considerar a chegada à ilha e os intervalos indicados pela equipe de mergulho antes do voo de volta.",
    "seasonSource": "https://www.andadiwata.com/faq",
    "title": "Mergulhar com tubarões em Providencia",
    "place": "Providencia, Colômbia",
    "type": "Mergulho",
    "summary": "Conheça Providencia pelo mar. A saída de barco leva aos recifes da ilha, onde há a possibilidade de observar tubarões.",
    "scene": "Do barco, Providencia é uma ilha de morros verdes cercada de água azul. Abaixo da superfície, o recife muda a escala da paisagem. O mergulho acontece no ritmo do mar, com tempo para observar a vida em volta e a possibilidade de cruzar com tubarões.",
    "practical": "A escolha do ponto depende das condições do dia e da experiência de quem mergulha. Conte se você tem certificação e quando foi seu último mergulho. A chegada à ilha também merece tempo no planejamento.",
    "story": true
  },
  "kite-a-bordo": {
    "title": "Praticar kitesurf em uma viagem a bordo",
    "place": "",
    "type": "Kitesurf",
    "summary": "A embarcação é a base da viagem. A ideia é passar os dias na água e navegar entre os pontos de kite.",
    "scene": "Acordar a bordo, olhar o vento e preparar o equipamento. A ideia é viver o kitesurf com o barco como base, passar parte do dia na água e navegar entre os pontos de prática.",
    "practical": "O formato está em desenvolvimento. Destino, embarcação e período serão divulgados quando estiverem definidos.",
    "soon": true
  }
};
