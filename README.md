# 🇧🇷 Brasil Transparente - Frontend

Frontend oficial do [Brasil Transparente](https://brasiltransparente.digital/), uma iniciativa open-source desenvolvida em Angular para facilitar o acesso, a visualização e a análise de dados dos gastos públicos federais do Brasil.

---

## Começando

### Pré-requisitos
- **Node.js**: `v20.19+` ou `v22 LTS` (recomendado)
- **Git**

> *Nota:* Não é necessário instalar o Angular CLI globalmente; os comandos e scripts utilizam a versão local instalada no projeto.

---

### Passo a passo para rodar localmente

1. **Clonar o repositório:**
   ```bash
   git clone https://github.com/brasil-transparente/brasil-transparente-frontend.git
   cd brasil-transparente-frontend
   ```

2. **Instalar as dependências:**
   ```bash
   npm install
   ```

3. **Configurar as variáveis de ambiente:**
   As configurações para desenvolvimento local ficam em `src/environments/environment.development.ts`:
   ```typescript
   export const environment = {
     apiBase: 'http://localhost:8080', // Aponte para 'https://api.brasiltransparente.digital' caso não esteja rodando o backend local
     shouldCache: false,                // Altere para true se desejar habilitar cache local (localStorage)
     siteUrl: 'https://brasiltransparente.digital'
   };
   ```

4. **Iniciar o servidor de desenvolvimento:**
   ```bash
   npm start
   ```
   Acesse **`http://localhost:4200`** no seu navegador. A aplicação recarrega automaticamente após alterações no código.

---

## Scripts Disponíveis

| Comando | Descrição |
| --- | --- |
| `npm start` | Inicia o servidor de desenvolvimento local (`http://localhost:4200`). |
| `npm run prod` | Inicia o servidor local apontando para a API de produção. |
| `npm run build:dev` | Gera a build de desenvolvimento na pasta `dist/browser`. |
| `npm run build:production` | Gera a build otimizada para produção. |
| `npm run lint` | Executa a verificação estática de código com o ESLint. |
| `npm test` | Executa os testes unitários com Karma. |

---

## 🐳 Executando com Docker (Opcional)

Se preferir rodar a aplicação através de um contêiner com Nginx:

```bash
# Construir a imagem (usa build de teste por padrão, apontando para a API remota)
docker build -t brasil-transparente-frontend .

# Ou gerar imagem com ambiente de produção:
docker build --build-arg BUILD_ENV=production -t brasil-transparente-frontend .

# Iniciar o container
docker run -d -p 8080:8080 brasil-transparente-frontend
```

Acesse em **`http://localhost:8080`**.

---

## 🤝 Como Contribuir

Toda contribuição é bem-vinda! Para colaborar:

1. **Participe no Discord**: Dúvidas, ideias e alinhamentos acontecem no nosso servidor do Discord:  
   👉 [Entrar no Discord](https://discord.gg/sQbf3bSzt4)
2. **Issues do GitHub**: Verifique as [Issues](https://github.com/brasil-transparente/brasil-transparente-frontend/issues) abertas para encontrar tarefas disponíveis ou sugerir melhorias.
3. **Fluxo de Trabalho**:
   - Crie uma branch para sua tarefa (`git checkout -b feature/minha-melhoria`).
   - Valide seu código com `npm run lint`.
   - Abra um Pull Request explicando as mudanças realizadas.

---

## ⚖️ Licença

[![AGPL-3.0](https://img.shields.io/badge/License-AGPL_v3-blue.svg)](https://www.gnu.org/licenses/agpl-3.0)

Este projeto está licenciado sob os termos da [GNU Affero General Public License v3.0 (AGPL-3.0)](LICENSE.md).