import { createBrowserRouter } from "react-router-dom";

//pages
import Login from "./pages/Login.jsx";
import Welcome from "./pages/Welcome.jsx";
import SignUp from "./pages/SignUp.jsx";
import Home from "./pages/Home.jsx";
import Post from "./pages/post.jsx";
import User from "./pages/User.jsx";
import Layout from "./components/universal/Layout.jsx";

const router = createBrowserRouter([
    { path: "/", element: <Welcome /> },
    { path: "Login", element: <Login /> },
    { path: "Signup", element: <SignUp /> },
    {
        // Routes that should show the sidebar are children of Layout
        path: "/",
        element: <Layout />,
        children: [
            { path: "Home", element: <Home /> },
            { path: "post/:id", element: <Post /> },
            { path: "user/:id", element: <User /> },
        ],
    },
]);

export default router;
