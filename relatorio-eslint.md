# Relatorio: Estudo, Instalacao e Configuracao do ESLint

## Parte 2 - Estudo da Ferramenta

### 1. O que e o ESLint

O ESLint e uma ferramenta de analise estatica para codigo JavaScript e ECMAScript. Seu papel e examinar arquivos de codigo-fonte sem executar a aplicacao, identificar padroes problemáticos e apontar trechos que podem gerar bugs, inconsistencias ou baixa legibilidade. A propria documentacao oficial define o ESLint como uma ferramenta para identificar e relatar padroes encontrados em codigo JavaScript, com o objetivo de tornar o codigo mais consistente e evitar erros.

O principal objetivo do ESLint e apoiar a qualidade do codigo. Ele faz isso por meio de regras configuraveis, que podem verificar tanto aspectos de estilo quanto problemas de programacao. Por exemplo, a ferramenta pode impedir o uso de `var`, exigir comparacoes estritas com `===`, avisar sobre variaveis declaradas e nao utilizadas, ou sugerir o uso de `const` quando uma variavel nao e reatribuida. Assim, o ESLint funciona como uma camada automatizada de revisao antes da execucao ou entrega do software.

Historicamente, o ESLint foi criado por Nicholas C. Zakas em 2013. Antes dele, ferramentas como JSLint e JSHint ja eram usadas para verificar codigo JavaScript, mas eram mais limitadas em termos de extensibilidade e configuracao. O ESLint surgiu com uma proposta mais flexivel: permitir que regras fossem configuradas, substituidas e expandidas por plugins. Essa caracteristica tornou a ferramenta adequada para projetos com diferentes padroes de codificacao, frameworks e necessidades de equipe.

No contexto de utilizacao, o ESLint e comum em projetos Node.js, aplicacoes web, APIs, sistemas com React, Vue, Angular, TypeScript e outras tecnologias do ecossistema JavaScript. Ele pode ser executado diretamente no terminal, integrado a editores de codigo, usado em scripts do `package.json`, executado antes de commits e aplicado em pipelines de integracao continua. Dessa forma, a ferramenta ajuda a detectar problemas cedo, antes que eles cheguem ao ambiente de producao.

### 2. O que e Analise Estatica

Analise estatica e a avaliacao de um programa sem executa-lo. Em vez de rodar a aplicacao e observar seu comportamento em tempo real, a ferramenta examina o codigo-fonte, a sintaxe, as declaracoes, os imports, os tipos de construcao usados e os padroes definidos por regras. No caso do ESLint, a analise ocorre sobre arquivos JavaScript e verifica se eles atendem as expectativas configuradas para o projeto.

A diferenca central entre analise estatica e testes esta no momento e na forma de verificacao. Testes executam partes do sistema com entradas especificas e comparam o resultado obtido com o resultado esperado. Ja a analise estatica nao depende de uma entrada de usuario nem da execucao do programa. Ela consegue apontar problemas como variaveis nao usadas, imports inconsistentes, comparacoes inseguras e padroes de codigo proibidos antes mesmo de a aplicacao ser iniciada.

As vantagens da analise estatica incluem rapidez, baixo custo de execucao, padronizacao automatica, deteccao precoce de problemas e facilidade de integracao ao fluxo de desenvolvimento. Como a ferramenta pode ser executada muitas vezes durante o desenvolvimento, ela reduz a chance de erros simples chegarem a revisao manual ou ao ambiente de producao. Tambem contribui para a aprendizagem da equipe, pois cada aviso ou erro mostra uma regra objetiva de qualidade.

Apesar disso, a analise estatica possui limitacoes. Ela nao substitui testes unitarios, testes de integracao ou testes manuais, porque nao comprova que a funcionalidade atende aos requisitos de negocio. Tambem pode gerar falsos positivos, deixar de detectar problemas que dependem do comportamento em execucao ou exigir configuracao cuidadosa para nao se tornar excessivamente rigida. Portanto, a analise estatica deve ser usada como complemento dos testes e das revisoes de codigo.

### 3. Aplicacoes do ESLint

Na padronizacao de codigo, o ESLint permite transformar convencoes da equipe em regras automatizadas. Em vez de depender apenas da memoria dos desenvolvedores, o projeto passa a ter um arquivo de configuracao que define o estilo esperado. Isso reduz diferencas desnecessarias entre arquivos e facilita a leitura do codigo por qualquer integrante da equipe.

Na identificacao de erros, a ferramenta ajuda a encontrar problemas antes da execucao da aplicacao. Regras como `no-unused-vars`, `eqeqeq`, `no-var` e `prefer-const` apontam situacoes que podem indicar descuido, codigo morto, comparacoes inseguras ou uso de praticas antigas da linguagem. Embora nem todo aviso represente um bug real, muitos indicam pontos que merecem correcao ou revisao.

Na manutencao, o ESLint contribui para que o codigo continue compreensivel ao longo do tempo. Projetos que crescem sem padrao tendem a acumular estilos diferentes e decisoes contraditorias. Com linting, a equipe mantem uma base mais previsivel, o que facilita alterar funcionalidades, corrigir bugs e adicionar novos modulos.

Na qualidade, o ESLint atua como uma barreira automatica contra problemas recorrentes. Ele nao mede toda a qualidade de um software, mas aumenta a disciplina do projeto ao impedir que determinados padroes indesejados sejam aceitos. Isso melhora a confiabilidade da base e reduz retrabalho em revisoes.

No trabalho em equipe, a ferramenta diminui discussoes subjetivas sobre estilo. Como as regras ficam documentadas no projeto, todos seguem os mesmos criterios. Novos integrantes tambem conseguem entender rapidamente quais praticas sao aceitas e quais sao rejeitadas pela equipe.

Na integracao continua, o ESLint pode ser executado automaticamente em pipelines de CI/CD. Quando configurado com regras em nivel de erro, uma violacao faz o comando retornar codigo de falha, bloqueando merges ou entregas ate que o problema seja corrigido. Isso ajuda a garantir que o codigo enviado ao repositorio principal mantenha o padrao minimo definido pelo projeto.

## Parte 3 - Instalacao e Configuracao

### Instalacao

O projeto foi desenvolvido com Node.js e JavaScript, usando modulos ES. Para registrar a ferramenta de lint no projeto, foi adicionada a dependencia de desenvolvimento `eslint` no arquivo `package.json`.

Comando recomendado para instalacao local:

```bash
npm install eslint --save-dev
```

No projeto, o `package.json` ficou com o seguinte trecho:

```json
{
  "devDependencies": {
    "eslint": "^9.30.1"
  }
}
```

Tambem foram definidos scripts para facilitar a execucao:

```json
{
  "scripts": {
    "start": "node src/index.js",
    "demo": "node src/index.js demo",
    "lint": "eslint src"
  }
}
```

Com isso, a analise pode ser executada pelo comando:

```bash
npm run lint
```

### Inicializacao

Em um projeto criado do zero, a inicializacao interativa do ESLint pode ser feita com:

```bash
npx eslint --init
```

Nas versoes mais recentes, a documentacao oficial tambem recomenda:

```bash
npm init @eslint/config@latest
```

Neste trabalho, a configuracao foi criada manualmente para adequar o ESLint ao codigo desenvolvido e manter compatibilidade com duas formas de configuracao: a configuracao moderna em `eslint.config.js` e a configuracao legada em `.eslintrc.json`.

Os comandos utilizados para validar o funcionamento foram:

```bash
npm run demo
npm run lint
eslint src
```

O comando `npm run demo` executa a aplicacao, cria dados de exemplo e grava o arquivo `data/database.json`. O comando `npm run lint` executa a analise estatica nos arquivos dentro da pasta `src`.

### Configuracao

O arquivo `eslint.config.js` foi criado para configurar o ESLint no formato moderno. Ele define que os arquivos analisados estao em `src/**/*.js`, utiliza ECMAScript recente, modulos ES e variaveis globais adequadas ao ambiente Node.js.

Configuracao principal:

```javascript
export default [
  {
    files: ["src/**/*.js"],
    languageOptions: {
      ecmaVersion: 2024,
      sourceType: "module",
      globals: {
        console: "readonly",
        process: "readonly",
        Buffer: "readonly"
      }
    },
    rules: {
      "no-console": "off",
      "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
      "prefer-const": "error",
      "no-var": "error",
      "eqeqeq": "error"
    }
  }
];
```

Tambem foi adicionada uma configuracao `.eslintrc.json` para compatibilidade com versoes antigas do ESLint instaladas globalmente no ambiente:

```json
{
  "env": {
    "es6": true,
    "node": true
  },
  "parserOptions": {
    "ecmaVersion": 2020,
    "sourceType": "module"
  },
  "rules": {
    "no-console": "off",
    "no-unused-vars": ["warn", { "argsIgnorePattern": "^_" }],
    "prefer-const": "error",
    "no-var": "error",
    "eqeqeq": "error"
  }
}
```

As regras escolhidas foram:

- `no-console: off`: permite o uso de `console.log`, pois a aplicacao e uma CLI e precisa exibir informacoes no terminal.
- `no-unused-vars: warn`: avisa sobre variaveis nao utilizadas, mas nao bloqueia totalmente a execucao. O padrao `argsIgnorePattern: "^_"` permite argumentos intencionalmente ignorados quando iniciam com `_`.
- `prefer-const: error`: exige `const` quando uma variavel nao e reatribuida, tornando a intencao do codigo mais clara.
- `no-var: error`: impede o uso de `var`, favorecendo `let` e `const`, que possuem escopo mais previsivel.
- `eqeqeq: error`: exige comparacoes estritas com `===` e `!==`, reduzindo conversoes implicitas inesperadas.

O estilo adotado no projeto foi um estilo moderno de JavaScript para Node.js, com `import` e `export`, organizacao por modulos, classes de servico e separacao entre camada de CLI, persistencia em arquivo, validadores, formatadores e regras de negocio. A configuracao do ESLint acompanha esse estilo ao declarar `sourceType: "module"` e ao aplicar regras que reforcam clareza, consistencia e seguranca basica no uso da linguagem.

As principais opcoes configuradas foram:

- `files: ["src/**/*.js"]`: limita a analise aos arquivos fonte da aplicacao.
- `ecmaVersion`: informa a versao da linguagem JavaScript esperada.
- `sourceType: "module"`: habilita o uso de modulos ES.
- `globals`: informa ao ESLint quais identificadores globais sao aceitos no ambiente Node.js.
- `rules`: define as verificacoes aplicadas ao codigo.

### Resultado da execucao do ESLint

Apos a configuracao da ferramenta, foi executado o comando:

```bash
npx eslint .
```

O ESLint analisou os arquivos do projeto e apresentou o seguinte resumo:

- Quantidade de erros encontrados: 3 erros.
- Quantidade de avisos encontrados: 3 avisos.
- Total de problemas encontrados: 6 problemas.

Os problemas foram identificados nos arquivos `src/data/fileStore.js` e `src/index.js`. No arquivo `src/data/fileStore.js`, foi encontrado 1 aviso relacionado a variavel declarada e nao utilizada. No arquivo `src/index.js`, foram encontrados 3 erros e 2 avisos relacionados ao uso de `var`, variaveis nao utilizadas, uso inadequado de `let` quando `const` seria suficiente e comparacao nao estrita com `==`.

As principais categorias de problemas identificados foram:

- Variaveis declaradas e nao utilizadas: ocorrencias apontadas pela regra `no-unused-vars`, como `_error`, `executionCounter` e `unusedStartupMessage`.
- Uso de sintaxe antiga ou menos segura: ocorrencia apontada pela regra `no-var`, indicando que `var` deve ser substituido por `let` ou `const`.
- Declaracao de variavel com possibilidade de maior restricao: ocorrencia apontada pela regra `prefer-const`, indicando que `defaultCommand` nunca e reatribuida e deveria ser declarada com `const`.
- Comparacao nao estrita: ocorrencia apontada pela regra `eqeqeq`, indicando o uso de `==` em vez de `===`.

Esse resultado mostra a importancia do ESLint na identificacao automatica de problemas de padronizacao e possiveis riscos no codigo. Mesmo sem executar a aplicacao, a ferramenta conseguiu indicar pontos que podem ser corrigidos para tornar o codigo mais claro, consistente e alinhado as regras definidas no projeto.

### Correcao automatica com ESLint

Depois da primeira analise, foi executado o comando de correcao automatica:

```bash
npx eslint . --fix
```

Apos a execucao do `--fix`, o ESLint apresentou o seguinte resultado:

- Quantidade de erros restantes: 1 erro.
- Quantidade de avisos restantes: 3 avisos.
- Total de problemas restantes: 4 problemas.

Comparando com a execucao anterior, que apresentava 3 erros e 3 avisos, o ESLint conseguiu corrigir automaticamente 2 erros. Os problemas corrigidos automaticamente foram:

- Substituicao de `var` por `let` no arquivo `src/index.js`, atendendo a regra `no-var`.
- Substituicao de `let` por `const` na variavel `defaultCommand`, atendendo a regra `prefer-const`, pois essa variavel nao era reatribuida.

Essas correcoes foram possiveis porque nao exigiam decisao de negocio nem mudanca de comportamento da aplicacao. O ESLint apenas aplicou transformacoes sintaticas seguras, preservando a logica existente do codigo.

Os problemas que precisaram de intervencao manual foram:

- A comparacao `command == defaultCommand`, apontada pela regra `eqeqeq`. Embora a troca para `===` seja simples, o ESLint nao aplicou automaticamente essa mudanca neste caso, pois comparacoes podem envolver conversoes implicitas e a ferramenta evita alterar comportamento sem garantia total.
- A variavel `_error` declarada no bloco `catch` de `src/data/fileStore.js`, apontada como nao utilizada pela regra `no-unused-vars`.
- A variavel `executionCounter`, declarada e incrementada em `src/index.js`, mas sem uso efetivo no fluxo da aplicacao.
- A variavel `unusedStartupMessage`, declarada em `src/index.js`, mas nunca utilizada.

As limitacoes da correcao automatica ficaram evidentes nesse resultado. O `--fix` consegue resolver problemas mecanicos e seguros, como trocar `var` por `let` ou aplicar `const` quando a variavel nao e reatribuida. Entretanto, ele nao remove automaticamente variaveis nao utilizadas em todos os casos, porque isso poderia apagar codigo que o desenvolvedor ainda pretende usar ou alterar algum efeito colateral. Tambem nao corrige sempre comparacoes com `==`, pois substituir por `===` pode mudar o resultado quando ha conversao implicita de tipos.

Assim, a correcao automatica e util para reduzir parte do trabalho repetitivo, mas nao substitui a revisao manual. O desenvolvedor ainda precisa analisar os avisos e erros restantes, decidir se a variavel deve ser removida, utilizada corretamente ou se a regra precisa ser ajustada ao contexto do projeto.

## Parte 6 - Comparacao Antes e Depois

Nesta etapa, foram selecionadas correcoes apontadas pelo ESLint para comparar o codigo antes e depois da aplicacao das regras. Os exemplos abaixo mostram como pequenas alteracoes melhoram a padronizacao e reduzem riscos no codigo.

### Exemplo 1 - Substituicao de `var` por `let`

Antes:

```javascript
var executionCounter = 0;
```

Depois:

```javascript
let executionCounter = 0;
```

Explicacao:

O problema era o uso de `var`, uma forma antiga de declarar variaveis em JavaScript. A regra aplicada foi `no-var`, que impede o uso de `var` e recomenda `let` ou `const`. O beneficio da correcao e tornar o escopo da variavel mais previsivel, pois `let` possui escopo de bloco, enquanto `var` possui escopo de funcao e pode gerar comportamentos inesperados em codigos maiores.

### Exemplo 2 - Substituicao de `let` por `const`

Antes:

```javascript
let defaultCommand = "menu";
```

Depois:

```javascript
const defaultCommand = "menu";
```

Explicacao:

O problema era que a variavel `defaultCommand` foi declarada com `let`, mas nunca era reatribuida. A regra aplicada foi `prefer-const`, que recomenda o uso de `const` sempre que uma variavel nao precisa receber outro valor. O beneficio da correcao e deixar a intencao do codigo mais clara, indicando que aquele valor nao deve mudar durante a execucao da funcao.

### Exemplo 3 - Comparacao nao estrita

Antes:

```javascript
if (command == defaultCommand || command === "start") {
  await app.menu.start();
  return;
}
```

Depois:

```javascript
if (command === defaultCommand || command === "start") {
  await app.menu.start();
  return;
}
```

Explicacao:

O problema era o uso do operador `==`, que permite conversao implicita de tipos antes da comparacao. A regra aplicada foi `eqeqeq`, que exige o uso de `===` e `!==`. O beneficio da correcao e tornar a comparacao mais segura e previsivel, evitando que valores de tipos diferentes sejam considerados iguais por conversao automatica do JavaScript.

Neste caso, a correcao nao foi aplicada automaticamente pelo comando `npx eslint . --fix`, permanecendo como erro apos a execucao. Por isso, ela representa uma correcao que precisa de intervencao manual do desenvolvedor.

## Parte 7 - Avaliacao dos Resultados

### O ESLint encontrou problemas relevantes?

Sim. O ESLint encontrou problemas relevantes porque apontou tanto falhas de padronizacao quanto pontos que poderiam prejudicar a clareza do codigo. Foram identificados erros relacionados ao uso de `var`, ao uso de `let` em uma variavel que poderia ser `const`, a uma comparacao nao estrita com `==` e a variaveis declaradas sem uso. Mesmo que parte desses problemas nao causasse uma falha imediata na execucao da aplicacao, eles indicam praticas que podem reduzir a qualidade do codigo ao longo do tempo.

### Os problemas poderiam causar falhas reais?

Alguns problemas poderiam causar falhas reais dependendo do contexto. O caso mais importante foi a comparacao com `==`, pois esse operador permite conversao implicita de tipos. Em situacoes mais complexas, isso pode fazer com que valores diferentes sejam tratados como equivalentes, gerando comportamentos inesperados. O uso de `var` tambem pode causar problemas em codigos maiores, principalmente por causa do escopo de funcao e do comportamento de hoisting. Ja as variaveis nao utilizadas normalmente nao causam erro direto, mas podem indicar codigo incompleto, sobra de implementacao ou falta de limpeza.

### A ferramenta ajudou a melhorar a legibilidade?

Sim. A ferramenta ajudou a melhorar a legibilidade ao sugerir declaracoes mais claras e consistentes. A substituicao de `let` por `const`, por exemplo, comunica que determinado valor nao deve mudar. A eliminacao de variaveis nao utilizadas tambem contribui para a leitura, pois reduz informacoes desnecessarias no codigo. Quando o codigo possui menos elementos sem funcao, fica mais facil entender o fluxo real da aplicacao.

### A ferramenta ajudou a padronizar o codigo?

Sim. O ESLint ajudou a padronizar o codigo porque aplicou regras iguais para todos os arquivos analisados. Em vez de cada parte do projeto seguir um estilo diferente, a configuracao passou a definir criterios objetivos, como evitar `var`, preferir `const` quando possivel e usar comparacoes estritas. Essa padronizacao e importante principalmente em projetos com mais de um desenvolvedor, pois reduz discussoes subjetivas sobre estilo e facilita a manutencao.

### Quais limitacoes foram observadas?

Uma limitacao observada foi que o comando `--fix` nao corrigiu todos os problemas automaticamente. Ele corrigiu casos seguros, como `var` para `let` e `let` para `const`, mas manteve a comparacao com `==` e os avisos de variaveis nao utilizadas. Isso mostra que a ferramenta evita realizar alteracoes que possam mudar a logica do programa ou remover codigo sem confirmar a intencao do desenvolvedor. Outra limitacao e que o ESLint nao valida se a regra de negocio da aplicacao esta correta; ele apenas analisa o codigo de acordo com regras sintaticas e padroes configurados.

Tambem foi observado que a configuracao da ferramenta precisa ser adequada ao ambiente. Como existem diferencas entre versoes do ESLint, foi necessario manter uma configuracao moderna em `eslint.config.js` e uma configuracao legada em `.eslintrc.json` para compatibilidade. Isso demonstra que, embora a ferramenta seja util, ela exige configuracao cuidadosa para funcionar bem no projeto.

### Voce utilizaria essa ferramenta em projetos reais?

Sim, eu utilizaria o ESLint em projetos reais. A ferramenta ajuda a identificar problemas cedo, antes que eles cheguem a revisao de codigo ou ao ambiente de producao. Tambem melhora a padronizacao, facilita o trabalho em equipe e pode ser integrada a scripts do projeto e pipelines de integracao continua. Em projetos maiores, esse tipo de verificacao automatica reduz retrabalho e aumenta a consistencia da base de codigo.

Apesar disso, o ESLint deve ser usado como complemento, e nao como substituto de testes, revisao manual e validacao funcional. Ele melhora a qualidade estrutural do codigo, mas nao garante sozinho que a aplicacao atende aos requisitos. Portanto, em um projeto real, eu utilizaria o ESLint junto com testes automatizados, boas praticas de revisao e uma configuracao de regras coerente com o objetivo da equipe.

## Referencias

- ESLint. Getting Started with ESLint. Disponivel em: https://eslint.org/docs/latest/use/getting-started. Acesso em: 2 jul. 2026.
- ESLint. Configure Rules. Disponivel em: https://eslint.org/docs/latest/use/configure/rules. Acesso em: 2 jul. 2026.
- ESLint. Documentation. Disponivel em: https://eslint.org/docs/latest/. Acesso em: 2 jul. 2026.
- ZAKAS, Nicholas C. Introducing ESLint. Disponivel em: https://eslint.org/blog/2013/07/introducing-eslint/. Acesso em: 2 jul. 2026.
- Static program analysis. Disponivel em: https://en.wikipedia.org/wiki/Static_program_analysis. Acesso em: 2 jul. 2026.
- Software testing. Disponivel em: https://en.wikipedia.org/wiki/Software_testing. Acesso em: 2 jul. 2026.
