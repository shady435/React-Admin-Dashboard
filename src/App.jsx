// App.jsx
import { HeroUIProvider } from "@heroui/react";
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider, useAuth } from "./pages/context/AuthContext";
import { ThemeProvider } from "./pages/context/ThemeContext";
import { ProtectedRoute } from "./pages/component/ProtectedRoute";
import Login from './pages/login/Login';
import Layout from './pages/Layout/Layout';
import Contact from './pages/contact/Contact';
import Home from './pages/Dashboard/Home';
import Addproducts from './pages/addProducts/Addproducts';
import Users from './pages/users/Users';
import Carts from './pages/carts/Carts';
import Settings from './pages/settings/Settings';
import Orders from './pages/orders/Orders';
import Products from './pages/component/Products';
import ProductDetails from './pages/ProductDetails';
import EditProduct from './pages/EditProduct';

const router = createBrowserRouter([
  { path: '/login', element: <Login /> },
  {
    path: '/',
    element: (
      <ProtectedRoute>
        <Layout />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <Home /> },
      { path: 'contact', element: <Contact /> },
      { path: 'addproducts', element: <Addproducts /> },
      { path: 'users', element: <Users /> },
      { path: 'products', element: <Products /> },
      { path: 'products/edit/:id', element: <EditProduct /> },
      { path: 'products/:id', element: <ProductDetails /> },
      { path: 'orders', element: <Orders /> },
      { path: 'carts', element: <Carts /> },
      { path: 'settings', element: <Settings /> },
    ],
  },
]);

function App() {
  return (
    <HeroUIProvider>
      <ThemeProvider>
        <AuthProvider>
          <RouterProvider router={router} />
        </AuthProvider>
      </ThemeProvider>
    </HeroUIProvider>
  );
}

export default App;