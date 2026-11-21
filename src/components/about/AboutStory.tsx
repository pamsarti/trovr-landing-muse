const paragraphs = [
  "Uma meia maratona na Argentina. Kitesurf no Egito. Snowboard no Japão. Para Pamela, planejar uma viagem sempre começa com alguma coisa que ela quer viver.",
  "Nas viagens, nos esportes e no contato com a natureza, ela sente vontade de experimentar coisas novas e viver histórias que vai levar para o resto da vida. Aprender alguma coisa só pelo prazer de tentar, viver essas experiências agora, sem esperar pelas condições perfeitas. Chegar a um lugar onde tudo é novo e sentir aquela vontade de conhecer mais.",
  "A Trovr nasce dessa vontade de viver tudo aquilo que a gente fica deixando para depois. De trocar o “um dia eu vou” pela emoção de estar ali, vivendo algo que, até pouco tempo antes, só existia na imaginação.",
  "É por isso que a gente seleciona viagens e conecta você a quem conhece cada destino de perto. Para você também sentir a prancha deslizando sobre a neve, ouvir o vento bufando no Mar Vermelho e descobrir que a vida é boa demais para não ser vivida.",
];

export function AboutStory({ className }: { className?: string }) {
  return (
    <div className={className}>
      {paragraphs.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
      <p><strong>Viaje para se descobrir, não para fugir.</strong></p>
    </div>
  );
}
