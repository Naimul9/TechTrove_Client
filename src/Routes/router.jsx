

import { createBrowserRouter } from "react-router-dom";
import MainLayout from "../Layout/MainLayout";
import Home from "../Pages/Home/Home";

import Register from "../Pages/Register/Register";
import Login from "../Pages/Login/Login";
import Products from "../Pages/Products/Products";
import Contact from "../Pages/Contact/Contact";
import Cart from "../Pages/Cart/Cart";
import ProductsDetail from "../Pages/Products/ProductsDetail";
import PaymentHistory from "../Pages/PaymentHistory/PaymentHistory";
import Wishlist from "../Pages/Wishlist/Wishlist";

export const router = createBrowserRouter([
    {
      path: "/",
      element: <MainLayout/>,
      children:[
        {index:true, element:<Home/>},
        {path: '/products', element:<Products/> },
        {path:'/login', element: <Login/>},
        {path:'/register', element: <Register/>},
        {path:'/contact', element:<Contact/>},
        {path:'/cart', element:<Cart/> },
        {path:'/product-detail/:id', element:<ProductsDetail/> },
        {path:'/payment-history', element:<PaymentHistory/> },
        {path:'/wishlist', element: <Wishlist/> },
        
        
       
      ]
    },
    
  ]);