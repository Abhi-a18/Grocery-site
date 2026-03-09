import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import App from "./App";
import Login from "./pages/Login";
import Home from "./pages/Home";
import Cart from "./pages/Cart";
import AddProduct from "./pages/AddProduct";
import Checkout from "./pages/Checkout";
import ProtectedRoute from "./components/ProtectedRoute";

import "./index.css";

const router = createBrowserRouter([

{
path: "/",
element: <Login />
},

{
path: "/",
element: ( <ProtectedRoute> <App /> </ProtectedRoute>
),
children: [

  {
    path: "home",
    element: <Home />
  },

  {
    path: "cart",
    element: <Cart />
  },

  {
    path: "add-product",
    element: <AddProduct />
  },

  {
    path: "checkout",
    element: <Checkout />
  }

]


}

]);

ReactDOM.createRoot(document.getElementById("root")).render( <Provider store={store}> <RouterProvider router={router} /> </Provider>
);
