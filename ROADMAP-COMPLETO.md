# Finfit - Roadmap completo

Use este arquivo como quadro vivo. Marque o que fechar, corte o que nao servir e mantenha o produto honesto com a dor real.

Legenda:

- `[ ]` ainda nao feito
- `[x]` entregue
- `[~]` parcial / em desenho
- `[-]` descartado

## Visao grande

Finfit deve virar o sistema operacional pessoal de treino do Jefferson: planejar, registrar, importar, revisar e decidir o que fazer com o corpo, sem depender de assinatura, feed social ou aplicativo que trata todo esporte como se fosse corrida.

O produto pode crescer como um "Strava pessoal + diario de treino + treinador de contexto", mas a primeira verdade continua simples: abrir rapido, registrar rapido e entender a semana.

## Status atual

- [x] Salvar marco `1.0.0`: Finfit local, PWA/offline, visual alinhado ao Finanza, dashboard, captura rapida, historico, progresso, corpo, dados/importacoes e painel de usuario com temas.
- [x] Criar base separada em `finfit-app`.
- [x] Criar repositorio privado no GitHub.
- [x] Definir norte do produto: Strava pessoal, sem foco comercial inicial.
- [x] Criar primeiro prototipo visual dark com DNA do Finanza.
- [x] Criar captura rapida multi-modalidade para academia, natacao, futevolei e treinos livres.
- [x] Salvar treinos localmente no navegador.
- [x] Criar metricas iniciais da semana.
- [x] Criar importacao/exportacao inicial por JSON e CSV.
- [x] Criar abas reais: Hoje, Plano, Historico, Corpo, Biblioteca e Dados.
- [x] Criar edicao, duplicacao, exclusao, filtros, favoritos e templates locais.
- [x] Criar registro de corpo/recuperacao.
- [x] Criar preview de importacao, export CSV e import GPX basico.
- [x] Criar aba de progresso com consistencia, semana vs anterior, recordes, alertas e modalidades.
- [x] Criar detalhes estruturados por treino para academia, natacao, futevolei e outros.
- [x] Preparar PWA/offline com manifest, service worker e fallback.
- [x] Criar modo "treino agora" com cronometro, descanso, sets e atalhos.
- [x] Criar snapshots de auto-backup local.
- [x] Criar temporadas/objetivos com periodizacao simples.
- [x] Expandir corpo com estresse, nutricao, humor, medidas e areas de dor.
- [x] Importar TCX basico e auditar duplicados exatos.
- [x] Criar primeira camada "Running Engine": distancia 28d, pace medio, PR estimado, carga aguda/base, tendencias, insights e Route Lab textual.
- [x] Evoluir Route Lab com mini-mapa SVG offline, splits destacados e segmentos pessoais por rota/distancia parecida.
- [x] Criar coach privado de corrida com proxima corrida sugerida, zonas de pace e preenchimento do treino planejado.
- [x] Tornar modalidades visiveis como hub: filtro global, resumo por esporte e acoes rapidas.
- [x] Criar Coach Semanal com proximas acoes copiaveis e atalhos para executar.
- [x] Criar engines 1.1 para academia, natacao e futevolei com metricas e exemplos.
- [x] Adicionar restore manual a partir do IndexedDB local.
- [x] Criar relatorio mensal exportavel.
- [x] Criar limpeza de dados com deduplicacao, normalizacao e snapshot.
- [x] Criar modelos rapidos de detalhes por modalidade no formulario.
- [x] Exibir status PWA/offline e atualizar app com um clique.
- [x] Refinar acabamento visual geral: hierarquia, espacamentos, grids responsivos, cards e estados de foco.
- [x] Corrigir sidebar para rail compacta estilo Finanza, definir black/roxo como padrao e criar contextos internos por modalidade.
- [x] Criar categoria de alimentacao com diario de alimentos, calorias, gasto estimado por treino e metas diarias.
- [x] Reduzir ruido visual geral: tipografia menor, widgets mais densos, menos sombra/glow e hierarquia mais consistente.
- [x] Criar painel simples na dashboard para marcar treinos feitos hoje e ver dados imediatos do dia.
- [x] Salvar versao `v1.1.0-pre-sport-ui` antes do passe visual esportivo.
- [x] Fazer redesign completo do shell visual: sidebar esportiva compacta, topbar de arena, paineis unificados e telas internas com linguagem de performance.
- [x] Refatorar CSS acumulado: reduzir de 87 KB para uma folha limpa de 22 KB, trocar paleta para grafite/laranja/verde e remover camadas pesadas de override.
- [x] Corrigir direcao visual que lembrava Discord: trocar rail escura por topo horizontal, base clara esportiva e cards de atividade estilo log/performance.
- [x] Criar direcao visual mais proxima de Strava/Nike/Hevy: tema escuro real, claro off-white com profundidade, fonte Inter e dashboard como diario de atleta.
- [x] Suavizar tipografia: remover Inter Tight, reduzir pesos 800/900, diminuir uppercase e aproximar de app esportivo premium.
- [x] Adicionar camada de missoes do atleta: XP diario, ofensiva semanal, progresso por etapas e recompensas nos check-ins.
- [x] Refazer direcao visual para tirar a cara de Discord: tema claro como padrao, nav desktop sem emojis, off-white editorial e cards menos "chat".
- [x] Forcar virada visual visivel: nova chave de aparencia, cache PWA v39, layout editorial com titulo grande e cards retangulares sem bolhas.
- [ ] Validar no uso real por uma semana.
- [~] Decidir se a primeira base duravel sera `localStorage`, IndexedDB, SQLite/Capacitor ou API Node.

## Plano mestre - Design e funcionalidades

Objetivo desta fase: transformar o Finfit em um produto simples de abrir todo dia, marcar o que foi feito e entender o que isso muda no treino, corpo e alimentacao. Tudo que nao ajudar esse ciclo deve ficar em segundo plano.

### Principios de design

- [ ] Dashboard primeiro como painel de acao: marcar treino, ver resumo do dia e decidir proximo passo.
- [ ] Reduzir a sensacao de app cheio: menos cards simultaneos, menos texto explicativo e mais estados claros.
- [ ] Usar hierarquia fixa: titulo pequeno, acao principal evidente, dados em blocos compactos e detalhes sob demanda.
- [ ] Manter sidebar curta: apenas areas principais; atalhos e configuracoes ficam dentro da dashboard ou usuario.
- [ ] Padronizar todos os widgets com os mesmos tamanhos de padding, borda, raio, sombra e tipografia.
- [ ] Criar uma tela mobile realmente propria, com o painel de hoje como primeira dobra.
- [ ] Separar "registrar" de "analisar": registro deve ser imediato; analise deve aparecer depois do dado salvo.
- [ ] Remover ou esconder qualquer modulo que nao tenha dado suficiente para ser util.
- [x] Fazer passe visual esportivo na primeira tela: seletor de modalidade forte, placar diario, semana em trilha e cards com cara de treino.

### Fase 1 - Dashboard util

- [x] Criar painel para marcar treinos feitos hoje.
- [x] Permitir editar rapido duracao/intensidade logo apos marcar um treino.
- [x] Mostrar "hoje" como linha do tempo simples: treino, comida, corpo e notas.
- [x] Transformar recomendacao em uma frase curta baseada no que foi marcado hoje.
- [ ] Criar estado vazio forte: quando nao ha dado, mostrar 2 ou 3 acoes claras, nao dashboards vazios.
- [ ] Mover acoes rapidas secundarias para uma area colapsavel ou para suas paginas.
- [x] Mostrar semana em 7 dias com checks, carga e descanso, sem excesso de texto.

### Fase 2 - Registro rapido completo

- [ ] Criar modal/inline edit apos check-in: tempo, RPE, dor, nota e detalhe opcional.
- [ ] Criar presets por modalidade com duracao e intensidade editaveis.
- [x] Criar check-in de alimentacao simples: refeicao, alimento rapido e calorias.
- [x] Criar check-in de corpo simples: sono, dor, energia e peso.
- [x] Permitir desfazer/editar qualquer item do dia sem ir para Historico.
- [x] Criar "favoritos de hoje": treinos ou refeicoes repetidos com um clique.

### Fase 3 - Analise que ajuda

- [x] Criar resumo diario: carga, calorias, dor, sono e consistencia.
- [x] Criar resumo semanal: sessoes por modalidade, carga total, dias ativos e alerta de excesso.
- [x] Criar comparacao simples com semana anterior.
- [x] Criar insights por modalidade apenas quando houver dados suficientes.
- [x] Criar "proxima melhor acao" com 3 opcoes: treinar, recuperar ou registrar dado faltante.
- [x] Criar feed pessoal privado: ultimas atividades com PR, carga e nota.

### Fase 4 - Modalidades completas

- [~] Musculacao: grupos musculares, exercicios, series, reps, carga, volume e recomendacoes por grupo.
- [~] Corrida: distancia, pace, elevacao, zonas, longao, tiros, base, fadiga e rotas.
- [ ] Natacao: metragem, estilo, series, ritmo e tecnica.
- [ ] Futevolei: jogo, tecnica, dupla, local, placar e intensidade.
- [ ] Mobilidade: area do corpo, dor antes/depois e progresso de recuperacao.
- [ ] Alimentacao: metas diarias, macros, alimentos frequentes, saldo com gasto de treino e historico.

### Fase 5 - Integracoes

- [ ] Definir backend/serverless minimo para integracoes que precisam de segredo.
- [ ] Integrar Strava por OAuth2 e importar atividades.
- [ ] Sincronizar novas atividades por webhook.
- [ ] Importar Garmin/Coros/Polar via arquivos enquanto nao houver integracao direta.
- [ ] Criar tela "Conexoes" em Dados.
- [ ] Criar normalizador unico para atividades externas.

### Fase 6 - Produto polido

- [ ] Criar design system interno: tokens, botoes, cards, tabelas, listas, formularios e estados vazios.
- [ ] Revisar todos os textos da interface para ficarem curtos, humanos e consistentes.
- [ ] Testar desktop e mobile com screenshots antes de cada publicacao grande.
- [ ] Criar onboarding simples: objetivo, modalidades, peso opcional, meta de alimentacao e frequencia semanal.
- [ ] Criar backup/exportacao guiada para nao depender de lembrar onde fica Dados.
- [ ] Definir o que vira 1.1: dashboard util, registro rapido completo e primeira analise semanal.

### O que nao fazer agora

- [-] Criar rede social, curtidas ou feed publico.
- [-] Copiar visual, marca ou telas proprietarias do Strava.
- [-] Adicionar graficos complexos antes do registro diario estar bom.
- [-] Criar muitas configuracoes antes de validar uso real.
- [-] Trocar a base de dados antes de fechar o fluxo principal.

## Como importar informacoes

### Strava - Integracao e inspiracao

- [~] Norte: ser um Strava pessoal/privado, copiando a clareza de registro, feed de atividades, segmentos pessoais e analises, sem copiar marca, layout proprietario ou rede social.
- [ ] Criar backend/serverless para OAuth2 do Strava com `client_secret` fora do navegador.
- [ ] Pedir escopos minimos: leitura de atividades e dados privados apenas se o usuario quiser importar tudo.
- [ ] Importar atividades via API e salvar como treinos Finfit normalizados.
- [ ] Usar webhooks do Strava para sincronizar novas atividades sem depender de importacao manual.
- [ ] Criar "feed pessoal" no Finfit: atividade recente, esforco relativo local, PRs pessoais, notas e proximas acoes.
- [ ] Criar "segmentos privados": comparar rotas parecidas importadas por GPX/TCX/Strava sem publicar nada.
- [ ] Criar mapeamento Strava -> Finfit: corrida, pedal/cardio, natacao, academia/treino, caminhada e outros.
- [ ] Criar tela de conexoes em Dados com status da conta, ultimo sync, revogar conexao e importar historico.

### Camada 1 - Agora

- [x] Exportar backup JSON proprio do Finfit.
- [x] Importar backup JSON proprio.
- [x] Importar CSV simples com colunas: `date,type,name,duration,intensity,note`.
- [x] Baixar modelo CSV.
- [x] Mostrar preview antes de importar.
- [x] Permitir escolher entre mesclar ou substituir.
- [x] Ignorar duplicados na mesclagem.
- [x] Mostrar erros de importacao linha a linha no preview basico.

### Camada 2 - Planilhas e historico manual

- [x] Importar CSV exportado de Google Sheets/Excel quando segue colunas simples.
- [x] Criar mapeador automatico de colunas: data, modalidade, duracao, nota, distancia, carga, RPE.
- [x] Aceitar aliases em portugues: `data`, `tipo`, `modalidade`, `tempo`, `duracao`, `observacao`.
- [x] Importar blocos de academia com exercicio, series, repeticoes, peso e descanso.
- [x] Importar natacao com metragem, estilo, series e tempo.
- [x] Importar futevolei com duracao, intensidade, local, dupla e resultado opcional.

### Camada 3 - Apps externos

- [x] Importar GPX basico para atividade de corrida/outro cardio.
- [x] Importar TCX basico quando houver arquivo.
- [x] Extrair splits, elevacao e amostra compacta de rota em GPX/TCX quando houver pontos.
- [ ] Importar FIT quando for prioridade.
- [ ] Importar exportacao do Strava como complemento, sem depender dele.
- [ ] Importar atividades do Garmin/Coros/Polar quando houver arquivos.
- [ ] Importar Apple Health/Google Fit via arquivos ou integracao futura.
- [ ] Detectar duplicados entre importacoes externas e registros manuais.

### Camada 4 - Automacao inteligente

- [x] Colar texto livre e transformar em treino: `natacao 45min moderado hoje`.
- [ ] Ler prints ou notas antigas e sugerir registros estruturados.
- [ ] Resumir uma semana importada e apontar lacunas.
- [ ] Sugerir categorias e modalidade quando o dado vier incompleto.

## Norte do produto

- [ ] Registrar treino em menos de 30 segundos quando ja existe modelo.
- [x] Montar treinos por dia, objetivo, esporte ou ciclo simples.
- [x] Visualizar semana atual, carga acumulada, recuperacao e proximo treino recomendado.
- [x] Separar plano do que foi executado por status planejado/feito/parcial/pulado.
- [~] Guardar historico de carga, repeticoes, distancia, tempo, RPE, energia e observacoes.
- [x] Mostrar progresso de forma pratica: volume, consistencia, recordes pessoais e sinais de excesso.
- [~] Funcionar muito bem no celular.
- [x] Nao depender de assinatura, feed social ou cloud obrigatoria.

## 0.1 - Fundacao e identidade

- [x] Criar repositorio isolado.
- [x] Criar README, brief e roadmap.
- [x] Criar UI inicial com linguagem visual preta, esportiva e organizada.
- [x] Alinhar visual com a base do Finanza: DM Sans, Syne, glass, dark, lime contido.
- [x] Criar tokens de design: cores, espacamentos, estados, tipografia e componentes.
- [x] Definir navegacao principal: Hoje, Plano, Historico, Corpo, Biblioteca, Dados.
- [x] Criar modelo inicial de dados.
- [~] Definir nomenclatura: treino, sessao, bloco, exercicio, set, metrica, ciclo.

## 0.2 - Registro rapido

- [x] Criar formulario rapido para adicionar treinos variados durante a semana.
- [x] Criar presets iniciais: academia, natacao, futevolei, corrida, mobilidade e outro.
- [x] Registrar duracao, tipo, intensidade e observacao.
- [x] Salvar localmente.
- [x] Registrar RPE, energia, dor e observacao.
- [x] Editar treino depois.
- [x] Duplicar treino anterior.
- [x] Marcar treino como planejado, feito, parcial ou pulado.
- [x] Criar entrada por texto livre.
- [x] Criar favoritos: "futevolei 90min forte", "natacao tecnica 45min", "academia upper".

## 0.3 - Modalidades de verdade

- [~] Academia: detalhes por linha, volume, foco, RPE e recordes detectados; falta editor de sets dedicado.
- [~] Natacao: engine de metragem, media e estilos; falta editor de series dedicado.
- [~] Futevolei: engine de locais, dupla e intensidade; falta campos dedicados para adversario/resultado.
- [~] Corrida: distancia, tempo e percepcao; falta pace, elevacao e FC.
- [~] Mobilidade/fisio: dor, foco corporal, tempo e observacoes; falta exercicios estruturados.
- [~] Treino livre: campos gerais; falta campos customizaveis reais.

## 0.4 - Montador de treinos

- [~] Criar biblioteca de exercicios.
- [x] Criar templates: upper, natacao, futevolei, corrida/cardio e mobilidade.
- [~] Montar treino com blocos: aquecimento, principal, acessorios, cardio, mobilidade.
- [~] Suportar progressao planejada por carga, reps, RPE, distancia ou tempo.
- [x] Criar ciclo semanal base.
- [x] Copiar semana anterior.
- [ ] Reordenar blocos e exercicios.
- [x] Criar plano por objetivo: forca, hipertrofia, condicionamento, tecnica, recuperacao.

## 0.5 - Dashboard pessoal

- [x] Tela "Hoje" com treinos sugeridos, prontidao e resumo da semana.
- [x] Criar seletor/hub de modalidade para alternar entre academia, natacao, corrida, futevolei, mobilidade e tudo.
- [x] Mostrar proximas acoes da semana com base em modalidade, carga, dor, sono e planos.
- [x] Semanario com dias, tipos de treino e status.
- [x] Indicadores: minutos totais, sessoes, modalidades e carga.
- [x] Carga semanal por modalidade.
- [x] Alertas pessoais: muita carga seguida, pouco descanso, grupo muscular esquecido.
- [x] Comparar semana atual com semana anterior.
- [x] Mostrar "proxima melhor acao" sem moralismo.

## 0.6 - Historico e progresso

- [x] Linha do tempo de treinos.
- [~] Filtros por tipo, periodo, status e busca textual.
- [~] Evolucao por exercicio: melhor carga, volume e ultima execucao quando detalhes seguem formato simples.
- [x] Evolucao por esporte: tempo, distancia, frequencia, melhor sessao e consistencia.
- [x] Corrida: pace medio, volume 28d, tendencia semanal, PR estimado e Route Lab textual.
- [x] Corrida: mini-mapa local, comparacao com rotas parecidas e leitura de queda/progressao por split.
- [x] Corrida: zonas de pace e prescricoes de treino geradas pelo historico/carga/dor.
- [~] Recordes pessoais manuais e automaticos.
- [x] Grafico/indicador de consistencia semanal e mensal inicial.
- [x] Notas por lesao, dor, sono, alimentacao ou energia.

## 0.7 - Corpo, recuperacao e contexto

- [~] Registro simples de peso e medidas; falta fotos opcionais.
- [x] Registro de sono, dor, energia, estresse, nutricao, humor e nota.
- [x] Indicador de prontidao simples, manual primeiro.
- [x] Associar sintomas ou dor a treinos recentes por data e areas.
- [~] Sugerir reducao de carga quando sinais ruins se repetem.
- [~] Criar mapa corporal de dores e grupos treinados.

## 0.8 - Dados, backup e importacao

- [x] Exportar/importar backup JSON.
- [x] Importar CSV simples.
- [x] Preview de importacao.
- [x] Backup automatico local.
- [x] Exportar CSV do historico.
- [x] Importar GPX.
- [~] Importar TCX/FIT.
- [x] Criar auditoria de duplicados.
- [ ] Criar ferramenta de limpeza/migracao dos dados.
- [x] Criar ferramenta de limpeza/migracao dos dados.

## 0.9 - Mobile e offline forte

- [~] Ajustar layout mobile como uso principal.
- [x] Preparar PWA.
- [ ] Avaliar Capacitor seguindo a linha do Finanza.
- [ ] Migrar armazenamento para IndexedDB ou SQLite no app.
- [x] Modo academia sem internet.
- [x] Cronometro e descanso entre series.
- [x] Atalhos rapidos na tela inicial.
- [x] Lembrete/status de backup.

## 1.0 - App pessoal estavel

- [ ] Fluxo completo: planejar, executar, revisar e ajustar.
- [ ] Uso diario sem friccao.
- [~] Backup confiavel.
- [ ] Visual consistente e rapido.
- [ ] Documentacao de uso pessoal.
- [ ] Dados importaveis/exportaveis.
- [ ] Lista clara do que fica fora: feed social, monetizacao, marketplace, coach publico.

## 1.5 - Sincronizacao e banco

- [ ] Criar API Node/Express apenas quando o local-first estiver validado.
- [ ] Modelar Postgres para usuarios, treinos, templates, exercicios e metricas.
- [ ] Sincronizacao multi-dispositivo.
- [ ] Login simples.
- [ ] Backup cloud opcional.
- [ ] Resolver conflitos de edicao entre dispositivos.
- [ ] Exportacao completa para independencia dos dados.

## 2.0 - Inteligencia pessoal

- [x] Gerar resumo semanal automatico local/exportavel.
- [~] Detectar padroes: melhora, queda, excesso, repeticao de dor, buracos de consistencia.
- [x] Recomendar proximo treino com base no historico, agenda e estado do corpo.
- [x] Criar coach layer inicial para corrida cruzando pace, carga, dor, academia recente e consistencia.
- [x] Transformar sugestao de corrida em treino planejado com um clique.
- [x] Criar periodizacao simples: base, carga, deload, teste.
- [~] Ajustar treino quando houve futevolei/natacao intensa na semana.
- [x] Explicar recomendacoes em linguagem humana.
- [ ] Criar "coach mode" privado, sem rede social.

## 3.0 - Ecossistema pessoal

- [ ] Integrar com Finanza para entender custo de esportes, mensalidades, equipamentos e saude.
- [ ] Integrar com Finvita, se fizer sentido, para rotina pessoal mais ampla.
- [ ] Cruzar treino, sono, alimentacao, humor e produtividade.
- [ ] Criar relatorios mensais exportaveis.
- [ ] Criar visao anual: fases, lesoes, picos, pausas e retomadas.

## Ideias grandes

- [~] "Strava pessoal": competir por contexto pessoal, rota, corrida e atleta hibrido antes de feed social.
- [x] "Segmentos privados": comparar rotas parecidas sem ranking social.
- [ ] "Meu corpo agora": leitura do estado atual e proxima acao.
- [x] "Temporada": organizar objetivos por trimestre.
- [ ] "Treinador offline": sugestoes sem cloud obrigatoria.
- [ ] "Memoria corporal": historico de dor, carga e recuperacao.
- [ ] "Importador universal": colar CSV, texto, print ou arquivo e transformar em treinos.
- [ ] "Replay do ano": melhores semanas, consistencia, recordes e aprendizados.
- [ ] "Sem paywall": tudo essencial fica seu, exportavel e local-first.
