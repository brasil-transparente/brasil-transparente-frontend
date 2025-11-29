# Build stage
FROM node:22.14.0 AS build

# Cria dir para a aplicação
WORKDIR /app

# Instala dependências e constrói a aplicação
COPY package*.json ./
RUN npm ci

# Copia todos os arquivos do projeto
COPY . .
RUN npm run build

FROM nginx:stable-alpine

# Copia os arquivos construídos para o diretório padrão do Nginx
COPY default.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/dist/browser /usr/share/nginx/html

# Copia o arquivo de configuração customizado do Nginx
EXPOSE 80

# Inicia o Nginx
CMD ["nginx", "-g", "daemon off;"]