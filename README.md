# Finance Manager API

## 🚀 Overview
Finance Manager API is a NestJS-based application designed to manage the financial operations of small businesses. The system allows a **manager** to receive funds and distribute them across multiple **cashboxes**, which are managed by **cashiers**. Cashiers can transfer money between cashboxes, and the system tracks all transactions while generating daily, weekly, monthly, and yearly reports.

## 🛠️ Features
- **User Management**: Authentication & Authorization (JWT & RBAC for Managers & Cashiers)
- **Cashbox Management**: Create, update, and track multiple cashboxes
- **Fund Distribution**: Manager deposits and assigns funds to cashboxes
- **Transactions**:
  - Deposits
  - Withdrawals
  - Transfers between cashboxes
- **Reports**:
  - Daily, Weekly, Monthly, and Yearly financial summaries
  - Transaction history tracking

## 🏗️ Tech Stack
- **Backend**: NestJS (TypeScript)
- **Database**: MariaDB TypeORM
- **Authentication**: Session-based authentication

## 📌 Installation
### Prerequisites
- Node.js (v18+ recommended)
- MariaDB
- Git
- pnpm, npm or yarn

### Steps
1. **Clone the repository**
   ```sh
   gh repo clone musanzi/cashbox-tracker-api
   cd cashbox-tracker-api
   ```
2. **Install dependencies**
   ```sh
   pnpm install
   ```
3. **Configure environment variables**
   Create a `.env` file in the root folder and add:
   ```
    cp env.example env
   ```
4. **Run database migrations** (if using TypeORM)
   ```sh
   npm run db:up
   ```
5. **Start the server**
   ```sh
   pnpm dev
   ```

## 📜 License
This project is licensed under the **MIT License**.

--
_Developed with ❤️ using NestJS_ 🚀
