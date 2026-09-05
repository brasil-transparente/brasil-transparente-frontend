## 📦 Instalação e Configuração

### Pré-requisitos
- Node.JS (^20.19.0 || ^22.12.0 || ^24.0.0)
- Angular CLI (^20.2.0)
- Prettier
- Git

# Passos para rodar o projeto localmente

### Clonar o repositório
```bash
git clone https://github.com/brasil-transparente/brasil-transparente-frontend.git
```

Entrar no diretório do projeto
```bash
cd brasil-transparente-frontend
```

Instalar as dependências
```bash
npm install

npm i -g @angular/cli@20.2.0 prettier
```

### Configuração de variáveis de ambiente
Configurar o arquivo `environment.ts` localizado em `src/environments/environment.development.ts` com a variável: 
```typescript
apiBase: 'URL_DA_API'
```

### Iniciar o servidor de desenvolvimento local

```bash
npm start
```

Ao executar o projeto local, a feature de cache local (localStorage) estará desabilitada. Para habilitar, alterar a variável `shouldCache` para `true` no arquivo de environment `src/environments/environment.development.ts`.

### Build para produção ou testes locais

Se você deseja gerar o build sem necessidade de rodar o banco de dados e o backend, é possível passar a variável de ambiente ```production``` utilizando o comando:
```bash
docker build --build-arg BUILD_ENV=production -t brasil-transparente-frontend .
```

Caso queira utilizar o banco e o back local:
```bash
docker build -t brasil-transparente-frontend .
```

Após gerado a imagem, rode o container:

```bash
docker run -p 80:8080 brasil-transparente-frontend
```

Acessar ```http://localhost``` para visualizar a aplicação rodando localmente.

### Testar o arquivo estático gerado
Se não quiser testar usando o ```npm start``` nem o container docker, você deverá usar algum serviço de host de arquivos locais. 
Para isso, você deve utilizar um servidor HTTP para servir os arquivos estáticos gerados no diretório `dist/browser`. Você pode usar o `http-server` ou o `serve`. Aqui estão os comandos para ambos (necessário instalar usando `npm i http-server` ou `npm i serve`):

```bash
npx http-server dist/browser -p 4200
npx serve dist/browser -p 4200
```

## 🤝 Como Contribuir
- 📌 **Participe no Discord**: A melhor forma de ajudar na contribuição do projeto é estar alinhado com o que está sendo discutido no nosso Discord:
  https://discord.gg/sQbf3bSzt4
- 🐛 **Issues existentes**: Dentro do repositório no GitHub mantemos uma lista de Issues que devem trabalhadas, geralmente alocadas dentro de projetos. É possível acompanhar o andamento das entregas por lá.
- 🛠️ **Reportar problemas/sugestões**: Para reportar bugs e sugerir novas melhorias, por favor, entre em contato com a gente no nosso Discord.

## ⚖️ Licença
[![AGPL-3.0](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Este projeto está licenciado sob os termos da **GNU Affero General Public License v3.0** (AGPL-3.0).
- ✅ Liberdade para usar e modificar.
- 🔁 Exige compartilhamento das modificações.
- 🌍 Código-fonte deve ser disponibilizado para usuários.

Consulte o arquivo LICENSE.md para o texto completo da licença.