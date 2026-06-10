FROM node:20-alpine

WORKDIR /app

# Instalar dependências
COPY package*.json ./
RUN npm install

# Copiar resto do código
COPY . .

# Gerar Prisma Client
RUN npx prisma generate

# Expor a porta que a API usa
EXPOSE 3333

# Comando para iniciar o servidor (executa as migrations primeiro)
CMD ["sh", "-c", "npx prisma db push && npm run dev"]
