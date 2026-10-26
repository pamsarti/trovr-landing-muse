# Pagamento das curadorias

Links reutilizáveis InfinitePay, criados em 25/10/2026 na conta pamela-sarti:

- Essencial: https://checkout.infinitepay.io/pamela-sarti/qwdE2x8Bo4 — R$ 499; Pix ou cartão à vista em 1x sem juros, conforme checkout observado em 26/10/2026.
- Premium: https://checkout.infinitepay.io/pamela-sarti/h1xVnrDBZz — R$ 1.499; Pix à vista ou cartão em 1x/2x sem juros, conforme checkout observado em 26/10/2026. As opções de 3–8x com juros solicitadas não apareceram; pendência no provedor.

Checkout integrado: quantity 1; price em centavos 49900/149900; assured_installments 1/2; payment_methods_enabled credit_card e pix. Sem vencimento, recorrência ou restrição de uso único.

O botão aparece após a captura confirmada do formulário e preserva o plano enviado. O início da produção depende da conferência do pagamento e das informações necessárias. O site não verifica pagamentos automaticamente: conferir o recebimento na InfinitePay pelo e-mail do formulário. Não há webhook nem evento Purchase; begin_checkout/InitiateCheckout exigem consentimento e clique no botão.

Validação: 18 testes automatizados, TypeScript e build Netlify aprovados. Fluxos Essencial e Premium testados localmente com resposta de formulário simulada, sem criar leads externos ou efetuar pagamentos. Checkouts reais abertos para conferir produto e valor; nenhuma compra realizada.

## Auditoria de 26/10/2026

Dois formulários reais de QA recebidos uma vez cada no Netlify, campos e UTMs preservados. Essencial desktop e Premium em viewport 390×844: seleção de produto, confirmação, foco, rolagem e links corretos. Checkout ofereceu Pix, crédito e Apple Pay; Google Pay não apareceu neste navegador. Nenhum pagamento, QR Pix ou carteira foi confirmado. Essencial mostrou somente 1x; Premium somente 1x/2x. O texto anterior prometia até 12x indevidamente.

Pendente: disponibilizar 3–8x com juros no provedor, confirmar pagamento real autorizado e instruções de início ao comprador. Purchase não existe e não deve ser disparado por abertura do checkout. Não há idempotência de pedido entre recarregamentos; a trava atual evita envios simultâneos no mesmo formulário. Eventos de Lead/InitiateCheckout têm testes unitários e consentimento; recepção efetiva nos painéis Meta/GA não foi comprovada.
