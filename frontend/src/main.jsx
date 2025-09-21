import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { RouterProvider } from "react-router-dom";
import "./index.css";
import { JWTProvider } from "./contexts/jwtContext.jsx";
import { PostsProvider } from "./contexts/postsContext.jsx";

// router
import router from "./routes.jsx";

// main app
createRoot(document.getElementById("root")).render(
    <JWTProvider>
        <PostsProvider>
            <StrictMode>
                <RouterProvider router={router}></RouterProvider>
            </StrictMode>
        </PostsProvider>
    </JWTProvider>
);
