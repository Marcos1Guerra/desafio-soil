# 🌾 Pivot Control System - IoT Monitoring & Management

Este projeto é uma plataforma completa de monitoramento e controle de pivôs de irrigação, desenvolvida como parte de um desafio técnico para Engenharia de Software. A solução abrange desde a gestão de fazendas até o controle em tempo real de dispositivos via IoT.

## 🚀 Arquitetura do Sistema

A solução foi desenhada seguindo princípios de **Sistemas Distribuídos** e **Clean Architecture**, garantindo que o sistema seja resiliente e escalável.

* **Frontend:** Next.js 14+ (App Router), Tailwind CSS e Lucide Icons. Interface Mobile-First baseada rigorosamente no Figma.
* **Backend:** NestJS (Node.js) com TypeScript.
* **Banco de Dados:** PostgreSQL com **Prisma ORM**.
* **Processamento Assíncrono:** Redis + BullMQ para processar pacotes de telemetria sem onerar a thread principal da API.
* **Tempo Real:** WebSockets (Socket.io) para atualização instantânea dos gráficos e status na interface do usuário.
* **Infraestrutura:** Docker e Docker Compose para orquestração de serviços.

## 🛠️ Funcionalidades Principais

* **Autenticação JWT:** Sistema de login seguro com controle de acesso baseado em Roles (ADMIN, OPERADOR, VISUALIZADOR).
* **Gestão de Fazendas e Pivôs:** Listagem dinâmica filtrada por fazenda e integração com geolocalização.
* **Painel de Controle Real-time:**
  * Acionamento de comandos (Ligar/Desligar, Sentido, Irrigação).
  * Ponteiro dinâmico que gira conforme o ângulo real do pivô enviado por telemetria.
  * Cálculo automático de lâmina d'água baseado no percentímetro.
* **Histórico Detalhado:** Visualização de ciclos de operação com Timeline vertical e gráficos de linha interativos (Recharts).
* **Integração com Clima:** Consumo da API OpenWeather para exibir condições climáticas locais baseadas na latitude/longitude da fazenda.

## 📦 Como Rodar o Projeto

### Pré-requisitos
* Docker e Docker Compose instalados.
* Node.js 18+ instalado (opcional, para rodar comandos locais do Prisma).

### Instalação e Execução

1. Clone o repositório:
   ```bash
   git clone https://github.com/Marcos1Guerra/desafio-soil.git
   ```

2. Configure as variáveis de ambiente:
   * Crie um arquivo `.env` no `/backend` e `/frontend` seguindo os modelos `.env.example`.

3. Suba o ambiente com Docker:
  ```bash
   docker-compose up -d --build
   ```

4. Aplique as migrations do banco de dados:
  ```bash
  npx prisma migrate deploy
  ```

5. Acesse o sistema:
   * Frontend: `http://localhost:3000/login`
   * Backend: `http://localhost:3001`
   * Prisma Studio: `npx prisma studio` (na pasta backend)

## 🔐 Acesso ao Sistema
Para facilitar os testes de avaliação, você pode acessar o sistema utilizando o usuário administrador de testes (certifique-se de popular o banco ou rodar o script de seed, caso configurado):
- **Email**: admin@teste.com
- **Senha**: 123

## 📡 Simulação de Telemetria (IoT)
Para validar o funcionamento dos WebSockets e da fila Redis, utilize o script de simulação:
```bash
   node simulator.js
```
