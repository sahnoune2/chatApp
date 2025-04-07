import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import "./App.css";
import { Header } from "./component/Header";
import { Footer } from "./component/Footer";
import { Hero } from "./component/Hero";
import { Signup } from "./component/Signup";

import { ToastContainer } from "react-toastify";
import axios from "axios";
import { Chat } from "./component/Chat";

const getAllUsers = async () => {
  try {
    const response = await axios.get("http://localhost:5000/auth/allusers");
    return response.data.users;
  } catch (error) {
    return null;
  }
};

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: (
        <>
          <Header /> <Outlet /> <Footer className="mt-[100vh]" />
          <ToastContainer position="top-right" />
        </>
      ),
      children: [
        { path: "/", element: <Hero /> },
        { path: "/signup", element: <Signup /> },
        { path: "/chat", element: <Chat />, loader: getAllUsers },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
}

export default App;
