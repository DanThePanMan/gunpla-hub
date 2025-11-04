import { createBrowserRouter } from "react-router-dom";

import Login from "./pages/Login.jsx";
import Welcome from "./pages/Welcome.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Post from "./pages/post.jsx";
import User from "./pages/User.jsx";
import Layout from "./components/universal/Layout.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "/login", element: <Login /> },
    { path: "/signup", element: <SignUp /> },
    {
        path: "/",
        element: <Layout />,
        children: [
            { path: "home", element: <Home /> },
            { path: "post/:id", element: <Post /> },
            { path: "user/:id", element: <User /> },
        ],
    },
]);

export default router;
