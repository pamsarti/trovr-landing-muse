export type TripPresentation = { title: string; place: string; type: string; summary: string; scene: string; practical: string; soon?: boolean; story?: boolean };

export const TRIP_PRESENTATION: Record<string, TripPresentation | undefined> = {
  "chicama-surfe": {
    "title": "Surfar a longa esquerda de Chicama",
    "place": "Puerto Malabrigo, Peru",
    "type": "Surf",
    "summary": "Em Puerto Malabrigo, uma esquerda acompanha o desenho da costa. Quando as seções se conectam, a onda continua abrindo à sua frente.",
    "scene": "Em Chicama, a onda quebra ao longo da costa de uma vila pesqueira no norte do Peru. Nos dias em que a ondulação conecta as seções, dá para passar de um trecho ao outro na mesma onda e ainda encontrar parede pela frente. É esse tempo na água, com espaço para ler a onda e escolher a próxima linha, que faz a viagem.",
    "practical": "A onda muda com a ondulação, o vento e a maré. Na conversa, conte como você surfa hoje e o que quer encontrar na água. Isso ajuda a orientar a escolha da época e dos dias que você pretende passar no litoral."
  },
  "tonga-jubartes": {
    "title": "Sair de barco para nadar com baleias jubartes",
    "place": "Tonga",
    "type": "Vida selvagem",
    "summary": "Saia de barco em Tonga e procure no horizonte os primeiros sinais das jubartes. Se as condições permitirem, o encontro continua na água.",
    "scene": "A experiência começa no barco, com os olhos no horizonte. Um sopro ou o movimento de uma cauda muda a atenção de todo mundo a bordo. Quando a equipe autoriza a entrada na água, existe a possibilidade de ver de perto a escala e o movimento de uma jubarte no mar aberto.",
    "practical": "O encontro depende do mar e do comportamento dos animais. A equipe responsável pela saída decide se é possível entrar na água. Na conversa, vale contar como você se sente nadando em mar aberto e em que época gostaria de ir."
  },
  "providencia-tubaroes": {
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
