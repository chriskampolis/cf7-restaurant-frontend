# 🍽️ Restaurant Frontend

This is the frontend for the Restaurant App, built with **React**, **TypeScript**, **Tailwind CSS**, and **Vite**.  
It communicates with the backend API to display menu items, manage orders, and allow managers to handle users and view completed orders.

---

## 👨‍💻 Features

- **Menu Display** – View menu items categorized by appetizers, main dishes, desserts, and drinks.  
- **Order Management** – Employees and managers can place and update orders for a specific table.  
- **Role-Based Access** – Managers have additional capabilities: edit menu, manage users, view completed orders.  
- **Authentication** – Login system with JWT stored in localStorage.  
- **Dynamic UI** – Shows total order sum, table selection, and item availability updates.

---

## 📝 Order Page

- **Table Selection & Status** – Each order is tied to a table and marked as either **New** or **In Progress**.  
- **Submitting an Order** – The first submission for a table creates the order and sets it to **In Progress**.  
- **Adding More Items** – If the table requests more dishes, the employee simply adjusts the quantities or adds new items, then submits again.  

**Example Flow**  
- Initial: `2x Fries, 1x Salad, 1x Steak` → **Submit**  
- Later: increase Salad to `2x`, add `1x Chocolate Cake` → **Submit again**  
- Final order becomes: `2x Fries, 2x Salad, 1x Steak, 1x Chocolate Cake`  

**Real-Time Updates**  
- The **total sum** of the order is updated in real-time as items are added or quantities changed.  
- **Item availability** is automatically adjusted when an order is submitted, ensuring accurate stock tracking.  

**Completing an Order**  
- An **in-progress order** can be marked as **Completed**.  
- Once completed, the table is **reset** and marked as **New** for future orders.  
- Completed orders are available for managers to review on the **Completed Orders** page.

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
   copy .env.example .env   # use copy if cp is not working
   # Edit .env with VITE_API_URL=http://127.0.0.1:8000
   ```

4. **Run Development Server**
   ```bash
   npm run dev
   # backend server must already be running
   ```
The app will be available at:
👉 http://localhost:5173/