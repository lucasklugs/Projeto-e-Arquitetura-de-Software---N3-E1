# Sistema de Estoque e Pedidos

Aplicacao propria em Node.js + JavaScript para gerenciamento simples de produtos, clientes e pedidos.

## Requisitos atendidos

- Mais de 5 arquivos fonte em `src/`.
- Mais de 300 linhas de codigo.
- Funcoes, classes, condicionais e repeticoes.
- Modulos ES com `import`/`export`.
- Entrada de dados via terminal.
- Persistencia em arquivo JSON em `data/database.json`.
- Script de lint com ESLint.

## Como executar

```bash
npm install
npm run demo
npm start
```

## Scripts

- `npm start`: abre o menu interativo.
- `npm run demo`: cria produtos, clientes e pedidos de exemplo.
- `npm run lint`: executa o ESLint nos arquivos fonte.

## Teste proposital do ESLint

O arquivo `src/lintExamples.js` contem erros e avisos intencionais para demonstrar a analise do ESLint. Ao executar `npm run lint`, devem aparecer problemas como uso de `var`, comparacao com `==`, variavel nao utilizada e sugestao de `const`.
