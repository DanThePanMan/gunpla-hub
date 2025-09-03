import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

//pages
import Login from "./pages/login.jsx";

// router

const router = createBrowserRouter([
    { path: "/", element: <>home</> },
    {
        path: "Login",
        element: <Login />,
    },
]);

// main app

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>
);
