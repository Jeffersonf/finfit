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

- [x] Criar base separada em `finfit-app`.
- [x] Criar repositorio privado no GitHub.
- [x] Definir norte do produto: Strava pessoal, sem foco comercial inicial.
- [x] Criar primeiro prototipo visual dark com DNA do Finanza.
- [x] Criar captura rapida multi-modalidade para academia, natacao, futevolei e treinos livres.
- [x] Salvar treinos localmente no navegador.
- [x] Criar metricas iniciais da semana.
- [x] Criar importacao/exportacao inicial por JSON e CSV.
- [ ] Validar no uso real por uma semana.
- [ ] Decidir se a primeira base duravel sera `localStorage`, IndexedDB, SQLite/Capacitor ou API Node.

## Como importar informacoes

### Camada 1 - Agora

- [x] Exportar backup JSON proprio do Finfit.
- [x] Importar backup JSON proprio.
- [x] Importar CSV simples com colunas: `date,type,name,duration,intensity,note`.
- [x] Baixar modelo CSV.
- [ ] Mostrar preview antes de importar.
- [ ] Permitir escolher entre mesclar, substituir ou ignorar duplicados.
- [ ] Mostrar erros de importacao linha a linha.

### Camada 2 - Planilhas e historico manual

- [ ] Importar CSV exportado de Google Sheets/Excel.
- [ ] Criar mapeador de colunas: data, modalidade, duracao, nota, distancia, carga, RPE.
- [ ] Aceitar aliases em portugues: `data`, `tipo`, `modalidade`, `tempo`, `duracao`, `observacao`.
- [ ] Importar blocos de academia com exercicio, series, repeticoes, peso e descanso.
- [ ] Importar natação com metragem, estilo, series e tempo.
- [ ] Importar futevolei com duracao, intensidade, local, dupla e resultado opcional.

### Camada 3 - Apps externos

- [ ] Importar GPX para corrida/ciclismo/caminhada.
- [ ] Importar TCX/FIT quando for prioridade.
- [ ] Importar exportacao do Strava como complemento, sem depender dele.
- [ ] Importar atividades do Garmin/Coros/Polar quando houver arquivos.
- [ ] Importar Apple Health/Google Fit via arquivos ou integracao futura.
- [ ] Detectar duplicados entre importacoes externas e registros manuais.

### Camada 4 - Automacao inteligente

- [ ] Colar texto livre e transformar em treino: `natacao 45min moderado hoje`.
- [ ] Ler prints ou notas antigas e sugerir registros estruturados.
- [ ] Resumir uma semana importada e apontar lacunas.
- [ ] Sugerir categorias e modalidade quando o dado vier incompleto.

## Norte do produto

- [ ] Registrar treino em menos de 30 segundos quando ja existe modelo.
- [ ] Montar treinos por dia, objetivo, grupo muscular, esporte ou ciclo.
- [ ] Visualizar semana atual, carga acumulada, recuperacao e proximo treino recomendado.
- [ ] Separar plano do que foi executado.
- [ ] Guardar historico de carga, repeticoes, distancia, tempo, zona, RPE, energia e observacoes.
- [ ] Mostrar progresso de forma pratica: volume, consistencia, recordes pessoais e sinais de excesso.
- [ ] Funcionar muito bem no celular.
- [ ] Nao depender de assinatura, feed social ou cloud obrigatoria.

## 0.1 - Fundacao e identidade

- [x] Criar repositorio isolado.
- [x] Criar README, brief e roadmap.
- [x] Criar UI inicial com linguagem visual preta, esportiva e organizada.
- [x] Alinhar visual com a base do Finanza: DM Sans, Syne, glass, dark, lime contido.
- [ ] Criar tokens de design: cores, espacamentos, estados, tipografia e componentes.
- [ ] Definir navegacao principal: Hoje, Plano, Historico, Corpo, Biblioteca, Dados.
- [ ] Criar modelo inicial de dados.
- [ ] Definir nomenclatura: treino, sessao, bloco, exercicio, set, metrica, ciclo.

## 0.2 - Registro rapido

- [x] Criar formulario rapido para adicionar treinos variados durante a semana.
- [x] Criar presets iniciais: academia, natacao, futevolei, corrida, mobilidade e outro.
- [x] Registrar duracao, tipo, intensidade e observacao.
- [x] Salvar localmente.
- [ ] Registrar RPE, energia, dor e qualidade.
- [ ] Editar treino depois.
- [ ] Duplicar treino anterior.
- [ ] Marcar treino como planejado, feito, parcial ou pulado.
- [ ] Criar entrada por texto livre.
- [ ] Criar favoritos: "futevolei 90min forte", "natacao tecnica 45min", "academia upper".

## 0.3 - Modalidades de verdade

- [ ] Academia: exercicios, series, repeticoes, peso, descanso, RPE e observacao por exercicio.
- [ ] Natacao: metragem, piscina, estilo, series, tempo, sensacao e tecnica.
- [ ] Futevolei: duracao, intensidade, local, parceiro, adversario, resultado e observacoes.
- [ ] Corrida: distancia, tempo, pace, elevacao, FC media/max, zona e percepcao.
- [ ] Mobilidade/fisio: dor antes/depois, foco corporal, tempo e exercicios.
- [ ] Treino livre: campos customizaveis.

## 0.4 - Montador de treinos

- [ ] Criar biblioteca de exercicios.
- [ ] Criar templates: push, pull, legs, upper, lower, full body, corrida, natacao, mobilidade.
- [ ] Montar treino com blocos: aquecimento, principal, acessorios, cardio, mobilidade.
- [ ] Suportar progressao planejada por carga, reps, RPE, distancia ou tempo.
- [ ] Criar ciclo semanal.
- [ ] Copiar semana anterior.
- [ ] Reordenar blocos e exercicios.
- [ ] Criar plano por objetivo: forca, hipertrofia, condicionamento, tecnica, recuperacao.

## 0.5 - Dashboard pessoal

- [ ] Tela "Hoje" com treinos sugeridos, prontidao e resumo da semana.
- [ ] Semanario com dias, tipos de treino e status.
- [ ] Indicadores: minutos totais, sessoes, volume, cardio, consistencia e descanso.
- [ ] Carga semanal por modalidade.
- [ ] Alertas pessoais: muita carga seguida, pouco descanso, grupo muscular esquecido.
- [ ] Comparar semana atual com semana anterior.
- [ ] Mostrar "proxima melhor acao" sem moralismo.

## 0.6 - Historico e progresso

- [ ] Linha do tempo de treinos.
- [ ] Filtros por tipo, grupo muscular, exercicio, periodo e intensidade.
- [ ] Evolucao por exercicio: melhor carga, reps, volume e ultima execucao.
- [ ] Evolucao por esporte: tempo, distancia, frequencia, melhor sessao e consistencia.
- [ ] Recordes pessoais manuais e automaticos.
- [ ] Grafico de consistencia semanal e mensal.
- [ ] Notas por lesao, dor, sono, alimentacao ou energia.

## 0.7 - Corpo, recuperacao e contexto

- [ ] Registro simples de peso, medidas e fotos opcionais.
- [ ] Registro de sono, dor, energia e estresse.
- [ ] Indicador de prontidao simples, manual primeiro.
- [ ] Associar sintomas ou dor a treinos recentes.
- [ ] Sugerir reducao de carga quando sinais ruins se repetem.
- [ ] Criar mapa corporal de dores e grupos treinados.

## 0.8 - Dados, backup e importacao

- [x] Exportar/importar backup JSON.
- [x] Importar CSV simples.
- [ ] Preview de importacao.
- [ ] Backup automatico local.
- [ ] Exportar CSV do historico.
- [ ] Importar GPX.
- [ ] Importar TCX/FIT.
- [ ] Criar auditoria de duplicados.
- [ ] Criar ferramenta de limpeza/migracao dos dados.

## 0.9 - Mobile e offline forte

- [ ] Ajustar layout mobile como uso principal.
- [ ] Preparar PWA.
- [ ] Avaliar Capacitor seguindo a linha do Finanza.
- [ ] Migrar armazenamento para IndexedDB ou SQLite no app.
- [ ] Modo academia sem internet.
- [ ] Cronometro e descanso entre series.
- [ ] Atalhos rapidos na tela inicial.
- [ ] Lembrete de backup.

## 1.0 - App pessoal estavel

- [ ] Fluxo completo: planejar, executar, revisar e ajustar.
- [ ] Uso diario sem friccao.
- [ ] Backup confiavel.
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

- [ ] Gerar resumo semanal automatico.
- [ ] Detectar padroes: melhora, queda, excesso, repeticao de dor, buracos de consistencia.
- [ ] Recomendar proximo treino com base no historico, agenda e estado do corpo.
- [ ] Criar periodizacao simples: base, carga, deload, teste.
- [ ] Ajustar treino quando houve futevolei/natacao intensa na semana.
- [ ] Explicar recomendacoes em linguagem humana.
- [ ] Criar "coach mode" privado, sem rede social.

## 3.0 - Ecossistema pessoal

- [ ] Integrar com Finanza para entender custo de esportes, mensalidades, equipamentos e saude.
- [ ] Integrar com Finvita, se fizer sentido, para rotina pessoal mais ampla.
- [ ] Cruzar treino, sono, alimentacao, humor e produtividade.
- [ ] Criar relatorios mensais exportaveis.
- [ ] Criar visao anual: fases, lesoes, picos, pausas e retomadas.

## Ideias grandes

- [ ] "Meu corpo agora": leitura do estado atual e proxima acao.
- [ ] "Temporada": organizar objetivos por trimestre.
- [ ] "Treinador offline": sugestoes sem cloud obrigatoria.
- [ ] "Memoria corporal": historico de dor, carga e recuperacao.
- [ ] "Importador universal": colar CSV, texto, print ou arquivo e transformar em treinos.
- [ ] "Replay do ano": melhores semanas, consistencia, recordes e aprendizados.
- [ ] "Sem paywall": tudo essencial fica seu, exportavel e local-first.
