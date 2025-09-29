import { useContext, useEffect, useState } from "react";
import Feed from "../components/home/Feed";
import PostsContext from "../contexts/postsContext";

const Home = () => {
    const { setPosts } = useContext(PostsContext);
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
    }, [setPosts]);

    return (
        <div>
            {/* Main Feed - Layout provides the sidebar */}
            <div className="max-w-2xl mx-auto px-4 py-4">
                <Feed loading={isLoading} />
            </div>
        </div>
    );
};

export default Home;
