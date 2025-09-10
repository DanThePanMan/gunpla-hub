import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

//pages
import Login from "./pages/Login.jsx";
import Welcome from "./pages/Welcome.jsx";
import SignUp from "./pages/SignUp.jsx";

// router
const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    {
        path: "Login",
        element: <Login />,
    },
    {
        path: "Signup",
        element: <SignUp />,
    },
]);

// main app

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <RouterProvider router={router}></RouterProvider>
    </StrictMode>
);
