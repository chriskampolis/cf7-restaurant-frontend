# 🍽️ Restaurant Frontend

This is the frontend for the Restaurant App, built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.  
It communicates with the backend API to display menu items, manage orders, and allow managers to handle users and view completed orders.

---

## 👨‍💻 Features

- **Menu Display** – View menu items categorized by appetizers, main dishes, desserts, and drinks.  
- **Order Management** – Employees and managers can place and update orders for a specific table.  
- **Role-Based Access** – Managers have additional capabilities: edit menu, manage users, view completed orders.  
- **Authentication** – Login system with JWT stored in localStorage.  
- **Dynamic UI** – Shows total order sum, table selection, and live item availability updates.

---

## 🛠️ Tech Stack & Dependencies

### Dependencies
- **React** – JavaScript library for building UI components.  
- **React DOM** – Provides DOM-specific methods for React.  
- **React Router DOM** – Handles client-side routing and navigation.  
- **Tailwind CSS** – Utility-first CSS framework for styling.  
- **@tailwindcss/vite** – Tailwind integration plugin for Vite.  
- **Axios** – HTTP client for making API requests to the backend.
- **jwt-decode** – Decodes JSON Web Tokens (JWT) for authentication.

### Dev Dependencies
- **Vite** – Fast build tool and development server.
- **TypeScript** – Adds static typing to JavaScript.
- **@vitejs/plugin-react** – React plugin for Vite.
- **ESLint & Plugins** – Linting and code quality checks for React and TypeScript.
- **@types/*** – Type definitions for TypeScript (React, jwt-decode, etc.).

---

## 🚀 Frontend Setup (React + Vite + TypeScript)

1. **Clone the Repository**

   ```bash
   git clone https://github.com/chriskampolis/cf7-restaurant-frontend.git
   cd cf7-restaurant-frontend
   ```

2. **Install Dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment**
   ```bash
   cp .env.example .env
   # Edit .env with VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   ```
The app will be available at:
👉 http://localhost:5173/