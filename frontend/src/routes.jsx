import { createBrowserRouter } from "react-router-dom";

//pages
import Login from "./pages/Login.jsx";
import Welcome from "./pages/Welcome.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";

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
    {
        path: "Home",
        element: <Home />,
    },
]);

export default router;
