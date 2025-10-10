# Backend Dockerfile
FROM node:18-alpine

# Instalar dependências necessárias para Prisma
RUN apk add --no-cache openssl libc6-compat

# Definir diretório de trabalho
WORKDIR /app

# Copiar package.json e package-lock.json
COPY package*.json ./

# Instalar dependências
RUN npm ci --only=production

# Copiar Prisma schema primeiro (necessário para gerar client)
COPY prisma ./prisma

# Gerar Prisma Client com binaryTargets corretos para Alpine
RUN npx prisma generate

# Copiar resto do código do projeto
COPY . .

# Expor porta
EXPOSE 5000

# Comando para criar tabelas e iniciar o servidor
CMD ["sh", "-c", "npx prisma db push --accept-data-loss && npm start"]
