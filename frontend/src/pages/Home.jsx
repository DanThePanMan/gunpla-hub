import { useState, useEffect } from "react";
import Feed from "../components/home/Feed";
import LeftSidebar from "../components/universal/LeftSidebar";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    async function fetchLastestPosts() {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/posts`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        if (!response.ok) {
            throw new Error(`failed to fetch posts ${response.status}`);
        }
        return response.json();
    }

    useEffect(() => {
        fetchLastestPosts()
            .then((data) => {
                setPosts(data.posts);
                setIsLoading(false);
            })
            .catch((error) => {
                console.error(error);
                setIsLoading(false);
            });
    }, []);

    return (
        <div className="min-h-screen">
            <div className="max-w-7xl mx-auto flex gap-4 px-4 py-4">
                {/* Left Sidebar */}
                <LeftSidebar samplePosts={null} />

                {/* Main Feed */}
                <div className="flex-1 min-w-0 max-w-2xl mx-auto lg:mx-0">
                    {/* Create Post */}

                    {/* Feed */}
                    <Feed posts={posts} loading={isLoading} />
                </div>
            </div>
        </div>
    );
};

export default Home;
