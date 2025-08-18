import { BrowserRouter, Routes, Route } from 'react-router-dom';
// import './App.css';
import ProtectedRoute from './components/ProtectedRoute';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import OrderPage from './pages/OrderPage';
import AuthProvider from './context/AuthProvider';
import Layout from './components/Layout';
import MenuItemsPage from './pages/MenuItemsPage';
import UsersPage from './pages/UsersPage';


function App() {
  return (
    <>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route element={<Layout/>} >
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/menu" element={<MenuItemsPage />} />
              <Route path="/users" element={<UsersPage />} />
              <Route 
                path="/orders"
                element={
                  <ProtectedRoute>
                    <OrderPage />
                  </ProtectedRoute>
                }
              />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </>
  )
}

export default App
