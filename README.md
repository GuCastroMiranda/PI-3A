# Projeto Integrador FarmaSUS (PI-3A)

Este repositório contém a solução completa para o aplicativo FarmaSUS, dividido em duas partes principais:
- **Frontend:** Aplicativo Mobile em React Native (Expo)
- **Backend:** API em Node.js com Fastify e PostgreSQL (Prisma ORM)

Abaixo estão as instruções de como configurar e rodar o projeto localmente na sua máquina.

---

## 🛠️ 1. Configurando e Rodando o Backend (API)

O backend é o coração do sistema, responsável por gerenciar o banco de dados (PostgreSQL) e as regras de negócio.

### Pré-requisitos
- Ter o **Node.js** instalado na máquina.
- Ter o **PostgreSQL** instalado e rodando (ou através do Docker).

### Passo a passo (Recomendado via Docker)

A forma mais fácil de rodar o backend, sem se preocupar com versões do Node.js ou dependências, é utilizando o Docker.

1. Abra o terminal e navegue até a pasta do backend:
   ```bash
   cd backend
   ```

2. Inicie os containers (Banco de Dados e API):
   ```bash
   docker compose up -d --build
   ```

3. **Pronto!**
   *O backend estará rodando em `http://localhost:3333` e as tabelas do banco serão criadas automaticamente. Você pode acompanhar os logs com `docker compose logs -f`.*

---

## 📱 2. Configurando e Rodando o Frontend (App Mobile)

O frontend foi construído utilizando o Expo. Ele faz requisições (via Axios) para o servidor Node que será ligado.

### Passo a passo

1. Abra um **novo** terminal (mantenha o terminal do backend rodando) e navegue até a pasta do aplicativo:
   ```bash
   cd frontend
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. **Configuração do IP da Máquina:**
   - Para que o emulador (ou o seu celular físico) consiga se comunicar com a API na sua máquina local, você deve alterar o IP no arquivo de conexão.
   - Abra o arquivo `frontend/services/api.ts`.
   - Altere a URL para o IP local do seu computador na rede Wi-Fi (exemplo: `192.168.1.X`). Não use `localhost` se for testar no Emulador Android, pois ele não reconhecerá.

4. **Inicie o Aplicativo:**
   ```bash
   npx expo start
   ```

5. **Testando:**
   - Pressione **`a`** no terminal para abrir no Emulador Android (caso tenha o Android Studio instalado).
   - Ou escaneie o **QR Code** usando o aplicativo "Expo Go" no seu celular físico (garanta que o celular está no mesmo Wi-Fi do computador).
   - Crie uma conta e teste a funcionalidade da aplicação
