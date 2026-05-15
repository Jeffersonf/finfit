# Finfit - Roadmap completo

Use este arquivo como quadro vivo. Marque o que fechar, corte o que nao servir e mantenha o produto honesto com a dor real.

Legenda:

- `[ ]` ainda nao feito
- `[x]` entregue
- `[~]` parcial / em desenho
- `[-]` descartado

## Status atual

- [x] Criar base separada em `finfit-app`.
- [x] Definir norte do produto: Strava pessoal, sem foco comercial inicial.
- [x] Criar primeiro prototipo visual dark fitness.
- [ ] Validar no uso real por uma semana.
- [ ] Decidir se a primeira base de dados sera `localStorage`, SQLite/Capacitor ou API Node.

## Norte do produto

- [ ] Registrar treino em menos de 30 segundos quando ja existe modelo.
- [ ] Montar treinos por dia, objetivo, grupo muscular, esporte ou ciclo.
- [ ] Visualizar semana atual, carga acumulada, recuperacao e proximo treino recomendado.
- [ ] Separar plano do que foi executado.
- [ ] Guardar historico de carga, repeticoes, distancia, tempo, zona, RPE e observacoes.
- [ ] Mostrar progresso de forma pratica: volume, consistencia, recordes pessoais e sinais de excesso.
- [ ] Funcionar bem no celular.
- [ ] Nao depender de assinatura, feed social ou cloud obrigatoria.

## 0.1 - Fundacao e identidade

- [x] Criar repositorio isolado.
- [x] Criar README, brief e roadmap.
- [x] Criar UI inicial com linguagem visual preta, esportiva e organizada.
- [ ] Criar tokens de design: cores, espacamentos, estados, tipografia e componentes.
- [ ] Definir navegacao principal: Hoje, Plano, Historico, Corpo, Biblioteca.
- [ ] Criar modelo inicial de dados.
- [ ] Definir nomenclatura: treino, sessao, bloco, exercicio, set, metrica, ciclo.

## 0.2 - Registro rapido de treino

- [ ] Criar formulario rapido para finalizar treino do dia.
- [ ] Registrar duracao, tipo, intensidade, RPE, energia e observacao.
- [ ] Permitir adicionar exercicios com series, repeticoes, peso e descanso.
- [ ] Permitir cardio com distancia, tempo, pace, FC media/max e zona.
- [ ] Salvar localmente.
- [ ] Editar treino depois.
- [ ] Duplicar treino anterior.
- [ ] Marcar treino como planejado, feito, parcial ou pulado.

## 0.3 - Montador de treinos

- [ ] Criar biblioteca de exercicios.
- [ ] Criar templates: push, pull, legs, upper, lower, full body, corrida, mobilidade.
- [ ] Montar treino com blocos: aquecimento, principal, acessorios, cardio, mobilidade.
- [ ] Suportar progressao planejada por carga, reps, RPE ou tempo.
- [ ] Criar ciclo semanal.
- [ ] Copiar semana anterior.
- [ ] Reordenar blocos e exercicios.

## 0.4 - Dashboard pessoal

- [ ] Tela "Hoje" com treino sugerido, prontidao e resumo da semana.
- [ ] Semanario com dias, tipos de treino e status.
- [ ] Indicadores: minutos totais, sessoes, volume, cardio, consistencia e descanso.
- [ ] Alertas pessoais: muita carga seguida, pouco descanso, grupo muscular esquecido.
- [ ] Comparar semana atual com semana anterior.
- [ ] Mostrar "proxima melhor acao" sem moralismo.

## 0.5 - Historico e progresso

- [ ] Linha do tempo de treinos.
- [ ] Filtros por tipo, grupo muscular, exercicio, periodo e intensidade.
- [ ] Evolucao por exercicio: melhor carga, reps, volume e ultima execucao.
- [ ] Recordes pessoais manuais e automaticos.
- [ ] Grafico de consistencia semanal e mensal.
- [ ] Notas por lesao, dor, sono, alimentacao ou energia.

## 0.6 - Corpo, recuperacao e contexto

- [ ] Registro simples de peso, medidas e fotos opcionais.
- [ ] Registro de sono, dor, energia e estresse.
- [ ] Indicador de prontidao simples, manual primeiro.
- [ ] Associar sintomas ou dor a treinos recentes.
- [ ] Sugerir reducao de carga quando sinais ruins se repetem.

## 0.7 - Mobile e offline forte

- [ ] Ajustar layout mobile como uso principal.
- [ ] Preparar PWA.
- [ ] Avaliar Capacitor seguindo a linha do Finanza.
- [ ] Armazenamento local robusto.
- [ ] Exportar/importar backup JSON.
- [ ] Rotina de backup manual e lembrete.

## 0.8 - Sync e banco

- [ ] Criar API Node/Express apenas quando o local-first estiver validado.
- [ ] Modelar Postgres para usuarios, treinos, templates, exercicios e metricas.
- [ ] Sincronizacao multi-dispositivo.
- [ ] Login simples.
- [ ] Backup cloud opcional.
- [ ] Importacao futura de Strava/arquivos quando fizer sentido.

## 1.0 - App pessoal estavel

- [ ] Fluxo completo: planejar, executar, revisar e ajustar.
- [ ] Uso diario sem friccao.
- [ ] Backup confiavel.
- [ ] Visual consistente e rapido.
- [ ] Documentacao de uso pessoal.
- [ ] Lista clara do que fica fora: feed social, monetizacao, marketplace, coach publico.

## Backlog de ideias

- [ ] Gerador de treino com base no tempo disponivel e no estado do corpo.
- [ ] Periodizacao simples: base, carga, deload, teste.
- [ ] Ranking pessoal por exercicio, nao social.
- [ ] Importar atividades do Strava como complemento, nao dependencia.
- [ ] Modo "treino agora" com cronometro, descanso e proximo set.
- [ ] Modo academia sem internet.
- [ ] Relatorio mensal: consistencia, evolucao, alertas e melhores treinos.
- [ ] Integracao com wearables apenas se nao complicar a base.

