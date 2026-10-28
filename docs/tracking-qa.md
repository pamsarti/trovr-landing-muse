# Validação de rastreamento de Viagem Trovr

## Testes sem conversões comerciais

Abra uma nova navegação completa para `/viagem?trovr_qa=1`, preservando as UTMs que deseja conferir. Exemplo com os identificadores da campanha de curadorias:

`https://trovr.com.br/viagem?trovr_qa=1&utm_source=ig&utm_medium=paid_social&utm_campaign=trovr_curadorias_teste_01&utm_id=120249466799260302&utm_content=120249467085120302`

O modo QA não carrega os provedores de medição nem chama eventos GA, Meta ou Clarity, mesmo quando o consentimento está aceito. As origens legadas iniciadas por `qa_`, `test_` e `teste_` também são tratadas como testes. O nome de campanha `trovr_curadorias_teste_01` continua sendo tráfego comercial normal: a palavra teste na campanha não ativa QA.

Preencha somente dados fictícios claramente identificados. Ao enviar, o mesmo endpoint Netlify recebe o formulário `viagem-trovr-qa`, com `is_test=true`, um `submission_id` aleatório e as UTMs. Confira a mesma referência no Netlify Forms. O formulário `viagem-trovr` não deve receber esse registro. A confirmação de QA não oferece pagamento.

QA é uma propriedade explícita da URL, não uma classificação automática por nome ou e-mail e não é gravada como preferência permanente. Preserve `trovr_qa=1` durante o teste; abra novamente o link completo se navegar para outra página. Não preencha um teste em uma URL comercial sem a marcação. Não use clique faturável em anúncio para testar: use o destino com os valores resolvidos dos parâmetros.

## Fluxo comercial

O envio real continua em `viagem-trovr`, com `is_test=false`. A confirmação de recebimento antecede `generate_lead`, `submit_viagem_application` e `Lead`. Sem consentimento, o formulário funciona e os eventos opcionais não são enviados. O `submission_id` liga o registro ao evento GA; o evento Meta usa `trovr_lead_<submission_id>` para identificação. Chamadas repetidas com o mesmo ID na página são bloqueadas; isso não substitui idempotência no servidor para novas navegações ou reenvios após uma falha de rede.

`utm_source`, `utm_medium`, `utm_campaign`, `utm_id`, `utm_content` e `utm_term` são capturados do endereço de chegada ao formulário. A validação permite identificadores alfanuméricos, `_` e `-`, até 100 caracteres, para não enviar valores arbitrários ou dados de contato às plataformas.

## Limites da comprovação

O modo QA comprova navegação, validação, captura das UTMs e recebimento do formulário separado. Como bloqueia os provedores comerciais, esse envio não comprova por si só o recebimento de um novo Lead dentro da Meta ou do GA. Os contratos de chamadas reais, consentimento, deduplicação e isolamento são cobertos por testes automatizados. Para reconciliar uma conversão comercial, confira um pedido real consentido pelo seu `submission_id` e horário, respeitando o processamento das plataformas.

A correção é prospectiva. Eventos históricos de teste já recebidos pelo Analytics/Meta não são apagados por esta mudança. Devem continuar excluídos das análises históricas pelos critérios conhecidos; o filtro de relatório aplicado no GA não é uma exclusão global dos dados.
