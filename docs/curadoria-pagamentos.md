# Pagamento das curadorias

Links reutilizáveis InfinitePay, criados em 25/10/2026 na conta pamela-sarti:

- Essencial: https://checkout.infinitepay.io/pamela-sarti/qwdE2x8Bo4 — R$ 499; Pix ou cartão, 1x sem juros, 2–12x com juros ao comprador.
- Premium: https://checkout.infinitepay.io/pamela-sarti/h1xVnrDBZz — R$ 1.499; Pix ou cartão, até 2x sem juros, 3–12x com juros ao comprador.

Checkout integrado: quantity 1; price em centavos 49900/149900; assured_installments 1/2; payment_methods_enabled credit_card e pix. Sem vencimento, recorrência ou restrição de uso único.

O botão aparece após a captura confirmada do formulário e preserva o plano enviado. O início da produção depende da conferência do pagamento e das informações necessárias. O site não verifica pagamentos automaticamente: conferir o recebimento na InfinitePay pelo e-mail do formulário. Não há webhook nem evento Purchase; begin_checkout/InitiateCheckout exigem consentimento e clique no botão.

Validação: 18 testes automatizados, TypeScript e build Netlify aprovados. Fluxos Essencial e Premium testados localmente com resposta de formulário simulada, sem criar leads externos ou efetuar pagamentos. Checkouts reais abertos para conferir produto e valor; nenhuma compra realizada.
