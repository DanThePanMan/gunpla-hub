import { useState, useEffect } from "react";
import Feed from "../components/home/Feed";
import LeftSidebar from "../components/universal/LeftSidebar";

const Home = () => {
    const [posts, setPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {}, []);

    return (
        <div className="min-h-screen relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-900/20 via-slate-900 to-purple-900/20"></div>
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>

            <div className="relative z-10 pt-6">
                <div className="max-w-7xl mx-auto flex gap-6 px-4">
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
        </div>
    );
};

export default Home;
