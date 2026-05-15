# Finfit

Finfit e um app pessoal para planejar, registrar e revisar treinos com a mesma seriedade visual do Finanza, mas com uma identidade mais escura, fisica e orientada a performance.

O objetivo inicial nao e vender produto. E resolver dores pessoais que o Strava deixa caras, travadas ou dispersas: montagem de treinos, organizacao por ciclos, acompanhamento real do corpo e revisao simples do que foi feito.

## Decisoes iniciais

- Base separada do Finanza, sem mexer no repositorio original.
- Frontend web local-first como primeira entrega, facil de empacotar depois com Capacitor.
- Visual preto, tecnico e esportivo, sem virar rede social.
- Dados pensados para treino real: sessoes, blocos, exercicios, cargas, zonas, percepcao de esforco e recuperacao.
- Produto feito para uma pessoa primeiro: rapidez, clareza e controle importam mais do que onboarding ou monetizacao.

## Estrutura

- `frontend/`: prototipo navegavel inicial.
- `ROADMAP-COMPLETO.md`: mapa de produto, fases e backlog.
- `PRODUCT-BRIEF.md`: norte de produto e criterios de decisao.

## Rodar localmente

```bash
npm install
npm start
```

Tambem da para abrir `frontend/index.html` diretamente no navegador.

