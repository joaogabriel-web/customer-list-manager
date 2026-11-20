# DESENVOLVIMENTO E EVOLUÇÃO DE UM MVP — CUSTOMER LIST MANAGER

## 1. CONTEXTO DO PROJETO

Quero que você atue como um desenvolvedor Full Stack Sênior, com experiência em arquitetura de software, UX/UI Design, desenvolvimento de APIs REST, segurança, integração Frontend/Backend e desenvolvimento de aplicações web modernas.

O objetivo é analisar, organizar, melhorar e evoluir dois projetos existentes, transformando-os em um MVP (Minimum Viable Product) funcional, moderno, intuitivo, personalizável e de fácil utilização.

O sistema será utilizado na minha rotina pessoal e profissional. Portanto, priorize simplicidade, produtividade, organização e facilidade de manutenção.

**IMPORTANTE:** Antes de modificar qualquer arquivo, analise os projetos existentes, entenda sua estrutura, identifique as funcionalidades implementadas e preserve tudo aquilo que já funciona corretamente.

---

## 2. CAMINHOS DOS PROJETOS

Existem dois projetos separados que precisam trabalhar de maneira integrada.

### Backend — Projeto Base

Caminho:
`C:\Users\joao62425746\Documents\AulaExemploIA`

Este projeto contém a base do Backend e deve ser analisado para identificar:
- Estrutura atual da aplicação.
- Rotas existentes.
- Controllers e serviços.
- Configuração do servidor.
- Banco de dados local.
- Sistema de autenticação.
- Implementações de CRUD.
- Dependências instaladas.
- Possíveis melhorias na arquitetura.

### Frontend — Customer List Manager

Caminho:
`C:\Users\joao62425746\Documents\customer-list-manager`

Este projeto contém a interface do usuário e deve ser analisado para identificar:
- Estrutura dos componentes.
- Páginas existentes.
- Configuração do VueJS.
- Estilização CSS.
- Tipagem TypeScript.
- Gerenciamento de estado.
- Rotas de navegação.
- Dependências instaladas.
- Funcionalidades já implementadas.

---

## 3. TECNOLOGIAS UTILIZADAS

Mantenha como prioridade as tecnologias que já fazem parte dos projetos.

### Frontend
- HTML5.
- CSS3.
- JavaScript.
- TypeScript.
- VueJS.
- NodeJS.
- npm.

### Backend
- NodeJS.
- JavaScript.
- TypeScript, caso já esteja configurado ou seja compatível com a estrutura existente.
- Express.
- JWT (JSON Web Token).
- Banco de dados local.
- APIs REST.
- CRUD (Create, Read, Update e Delete).
- npm.
- Bibliotecas auxiliares necessárias ao funcionamento da aplicação.

Não introduza frameworks ou tecnologias desnecessárias. Priorize a reutilização das dependências existentes e evite criar complexidade desnecessária.

---

## 4. IDENTIDADE VISUAL E PALETA DE CORES

Utilize como referência principal a seguinte paleta de cores:

https://ascores.com.br/paleta/03071e-370617-6a040f-9d0208-d00000-dc2f02-e85d04-f48c06-faa307-ffba08/

Cores disponíveis:

- #03071E
- #370617
- #6A040F
- #9D0208
- #D00000
- #DC2F02
- #E85D04
- #F48C06
- #FAA307
- #FFBA08

### Diretrizes visuais

Crie uma identidade visual moderna, profissional e agradável.

Utilize:
- Tons escuros para estrutura, navegação e elementos de destaque.
- Tons vermelhos e alaranjados para ações importantes.
- Tons amarelos para detalhes, alertas e destaques.
- Fundos neutros para garantir boa leitura.
- Contraste adequado entre textos e fundos.
- Bordas discretas e cantos arredondados.
- Ícones intuitivos.
- Animações suaves e discretas.
- Feedback visual para interações.

Evite excesso de cores, sombras exageradas, elementos desnecessários e interfaces visualmente poluídas.

A interface deve transmitir organização, modernidade e praticidade.

---

## 5. OBJETIVO PRINCIPAL DO MVP

Desenvolver uma aplicação de gerenciamento pessoal, com foco em organização e produtividade.

O sistema deve ser:

- Simples de utilizar.
- Intuitivo.
- Personalizável.
- Responsivo.
- Modular.
- Organizado.
- Fácil de manter.
- Fácil de expandir futuramente.

A aplicação deve permitir que o usuário personalize sua experiência de acordo com suas necessidades.

Não desenvolva funcionalidades complexas sem necessidade. Priorize aquilo que realmente agrega valor à rotina.

---

## 6. DIRETRIZES DE UX/UI

A experiência do usuário deve ser uma das principais prioridades.

Desenvolva uma interface que tenha:

1. Dashboard inicial com visão geral das informações.
2. Menu lateral organizado e intuitivo.
3. Cabeçalho com identificação do usuário.
4. Navegação simples entre funcionalidades.
5. Cards para apresentação de informações.
6. Tabelas organizadas e de fácil leitura.
7. Formulários objetivos.
8. Botões com identificação clara de suas funções.
9. Modais para confirmações e operações rápidas, quando apropriado.
10. Mensagens de sucesso, erro e alerta.
11. Estados de carregamento.
12. Layout responsivo para computadores, tablets e celulares.

A interface deve permitir que o usuário encontre rapidamente o que procura.

---

## 7. FUNCIONALIDADES E INTEGRAÇÃO

Analise as funcionalidades que já existem e identifique oportunidades de melhoria.

### Autenticação
- Implementar ou preservar login.
- Utilizar JWT para autenticação.
- Proteger rotas privadas.
- Gerenciar sessões de maneira segura.
- Tratar erros de autenticação.
- Não armazenar senhas em texto puro.

### Gerenciamento de dados
- Implementar operações CRUD.
- Criar registros.
- Consultar registros.
- Editar registros.
- Excluir registros.
- Validar dados antes de salvar.
- Exibir mensagens de confirmação.
- Tratar erros da API.

### Integração Frontend e Backend
- Configurar corretamente a comunicação entre os projetos.
- Centralizar as chamadas HTTP.
- Padronizar respostas da API.
- Implementar tratamento de erros.
- Configurar variáveis de ambiente.
- Evitar URLs de API espalhadas pelo código.
- Garantir que os dados exibidos no Frontend sejam provenientes do Backend quando aplicável.

Não invente funcionalidades que não façam sentido para o propósito do sistema. Primeiro identifique o que já existe e, depois, proponha melhorias.

---

## 8. PERSONALIZAÇÃO

Uma característica importante do projeto é permitir personalização.

Sempre que fizer sentido, permita:
- Personalização de cores.
- Organização dos elementos da interface.
- Preferências de visualização.
- Configurações do usuário.
- Ajustes de exibição.

Priorize uma estrutura que facilite adicionar novas opções de personalização futuramente.

---

## 9. ORGANIZAÇÃO E QUALIDADE DO CÓDIGO

Adote boas práticas de desenvolvimento:

- Código limpo e legível.
- Separação de responsabilidades.
- Componentização no VueJS.
- Reutilização de componentes.
- Tipagem adequada com TypeScript.
- Organização de rotas.
- Padronização de nomenclaturas.
- Tratamento de exceções.
- Validação de dados.
- Segurança nas requisições.
- Evitar duplicação de código.
- Remover código obsoleto somente após verificar sua utilização.

Não crie arquivos desnecessários e não duplique funcionalidades existentes.

---

## 10. ETAPAS DE EXECUÇÃO

Execute o trabalho seguindo esta ordem:

### ETAPA 1 — Diagnóstico
Analise os dois diretórios e compreenda a estrutura dos projetos.

Identifique:
- Arquivos principais.
- Dependências.
- Tecnologias.
- Funcionalidades existentes.
- Problemas encontrados.
- Pontos de integração.

Apresente um resumo do diagnóstico antes de realizar grandes alterações.

### ETAPA 2 — Planejamento
Defina uma estratégia de integração entre Frontend e Backend.

Identifique os arquivos que precisam ser modificados e os que precisam ser criados.

Evite reconstruir projetos que já possuem uma estrutura funcional.

### ETAPA 3 — Backend
Revise e melhore:
- Organização da arquitetura.
- Rotas.
- Controllers.
- Serviços.
- Banco de dados.
- Autenticação JWT.
- Operações CRUD.
- Validações.
- Tratamento de erros.

### ETAPA 4 — Frontend
Revise e melhore:
- Layout.
- Componentes.
- Navegação.
- Dashboard.
- Formulários.
- Tabelas.
- Responsividade.
- Identidade visual.
- Experiência do usuário.

### ETAPA 5 — Integração
Conecte corretamente o Frontend ao Backend.

Valide:
- Login.
- Autenticação.
- Comunicação com a API.
- Criação de registros.
- Consulta de registros.
- Edição.
- Exclusão.
- Persistência dos dados.

### ETAPA 6 — Testes
Execute os testes disponíveis e verifique:
- Erros de compilação.
- Erros no console.
- Problemas de comunicação.
- Problemas de autenticação.
- Falhas nas operações CRUD.
- Problemas de responsividade.

Corrija os problemas encontrados.

### ETAPA 7 — Documentação
Crie ou atualize o README com:
- Descrição do projeto.
- Tecnologias utilizadas.
- Estrutura dos diretórios.
- Pré-requisitos.
- Instalação das dependências.
- Configuração das variáveis de ambiente.
- Como iniciar o Backend.
- Como iniciar o Frontend.
- Como executar os testes.

---

## 11. REGRAS IMPORTANTES

1. Não apague arquivos sem verificar sua importância.
2. Não sobrescreva funcionalidades que já estão funcionando sem necessidade.
3. Não altere configurações importantes sem compreender suas consequências.
4. Não invente dados ou credenciais.
5. Não exponha tokens, senhas ou informações sensíveis.
6. Não coloque segredos diretamente no código.
7. Não instale bibliotecas sem justificativa.
8. Não faça alterações desnecessárias na arquitetura.
9. Mantenha os dois projetos independentes, mas integrados.
10. Verifique se cada alteração realmente funciona.
11. Priorize soluções simples e eficientes.
12. Se encontrar algo que dependa de uma decisão minha, explique o problema e apresente uma recomendação antes de tomar uma decisão irreversível.

---

## 12. RESULTADO ESPERADO

Ao final, quero ter um MVP funcional, com:

- Frontend moderno e intuitivo.
- Backend organizado e funcional.
- Autenticação segura.
- Banco de dados funcionando.
- CRUD integrado.
- Comunicação estável entre Frontend e Backend.
- Identidade visual baseada na paleta informada.
- Interface responsiva.
- Estrutura organizada e escalável.
- Documentação para instalação e utilização.

O mais importante é que o sistema seja agradável de utilizar no dia a dia, simples de entender e flexível para receber novas funcionalidades.

## 13. INSTRUÇÃO FINAL AO COPILOT

Trabalhe como um desenvolvedor responsável pelo projeto, e não apenas como um gerador de código.

Analise antes de implementar, planeje antes de modificar e teste depois de implementar.

Não se limite a apresentar sugestões: execute as alterações necessárias diretamente nos arquivos dos projetos, desde que sejam seguras e compatíveis com a estrutura existente.

Comece pela análise completa dos dois diretórios. Depois apresente o diagnóstico e o plano de execução.

Implemente o projeto de forma incremental, validando cada etapa antes de avançar.

**Objetivo final: transformar a base atual em uma aplicação pessoal de gerenciamento, moderna, funcional, personalizável e pronta para utilização real.**