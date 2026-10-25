# Revisão das curadorias — 25/10/2026

A rota `/viagem` usa React 19, TanStack Start/Router, Vite e Tailwind. Mantidos header, footer, Fraunces, tokens semânticos, fotos de Providencia, variantes visuais e narrativa institucional. Nenhuma skill dos agentes Trovr foi utilizada.

## Arquivos

- `src/lib/viagem-plans.ts`: fonte de preços, escopos, limites, prazos e CTAs. `paymentUrl: null` reserva configuração futura, sem link fictício ou cobrança.
- `src/routes/viagem.tsx`: cards, FAQ, etapas, metadados/JSON-LD, escolha persistida na sessão, campos comerciais e confirmação por modalidade. Validação também funciona com campos de etapas ocultas. Trava de envio evita solicitações simultâneas.
- `public/__forms.html`: declaração estática de plano, preço e moeda para Netlify Forms.
- `src/lib/analytics.ts`: ViewContent e SelectPlan (customizado na Meta), Lead apenas após captura aceita. Google recebe view_item, SelectPlan e generate_lead. Consentimento e IDs existentes preservados. Nenhum evento Purchase/InitiateCheckout é disparado sem pagamento real.
- `src/lib/viagem-plans.test.ts`: regressão comercial, schema Netlify e eventos com/sem consentimento.

O formulário mantém `viagem-trovr`, todos os campos anteriores e POST para `/__forms.html`. Acrescenta `plan`, `price`, `currency`, UTMs limitadas a identificadores de campanha e origem do referrer sem query ou caminho. Nenhum dado pessoal novo vai para analytics. A seleção fica apenas no sessionStorage, com fallback em memória se indisponível.

## Evidências e limites da verificação

- TypeScript: aprovado.
- Vitest: 4 arquivos, 14 testes aprovados.
- Build completo: aprovado via run-heavy.py. O preset padrão local gera saída Nitro; Netlify configura seu preset no ambiente. Não houve deploy.
- Conferência visual: desktop 1280×720 e mobile 390×844; cards lado a lado e empilhados, respectivamente. Capturas entregues no chat.
- Ambos os CTAs selecionam sua modalidade e abrem o formulário. Premium persiste após recarregar.
- Três etapas preenchidas com dados sintéticos; validação de obrigatórios observada. POST local não é capturado pelo Netlify e mostra o erro esperado, sem falsa confirmação. Nenhum lead de cliente foi enviado.
- Console sem erros/avisos na inspeção da jornada local.
- Cookie banner e opção somente essenciais verificados no navegador; testes cobrem bloqueio de eventos sem consentimento.
- Canonical `/viagem` preservado; preço antigo removido inclusive do JSON-LD. Sitemap validado pelo build.

## Antes de vender

1. Após autorização para deploy, registrar os novos campos do Netlify Forms e testar uma captura real com dados sintéticos em ambiente seguro. Confirmar recebimento e notificações no destino configurado do Netlify. Não é possível afirmar a entrega real por uma prévia Vite local.
2. Configurar/aprovar links reais de pagamento por plano. Somente ao implementar essa etapa conectar InitiateCheckout ao início efetivo do checkout; Purchase deve depender de confirmação confiável do provedor. Não inserir evento Purchase no CTA.
3. Validar os eventos na ferramenta de testes da Meta/GA com consentimento após o deploy autorizado.

Na revisão inicial não houve merge, build hook, publicação no Netlify nem mudança de integração. `netlify.toml` mantém `ignore = "exit 0"`, evitando deploy automático por push. Não foi criada prévia pública porque exigiria publicação adicional.

## Imagem aprovada e publicação

Em 25/10/2026, Pamela aprovou a substituição da foto e a publicação. Foto: Sebastian Flegl, Pexels 5039305, https://www.pexels.com/photo/trees-on-island-5039305/. Licença: https://www.pexels.com/license/. Original 4000×3000 preservado localmente; derivada WebP otimizada 1920×1440 para o site. Fundo desktop/mobile, imagens acessíveis e compartilhamento social atualizados. A foto anterior permanece no projeto.
