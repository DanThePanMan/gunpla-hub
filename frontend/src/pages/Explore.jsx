import { useContext, useEffect, useState } from "react";
import Feed from "../components/home/Feed";
import PostsContext from "../contexts/postsContext";

const Explore = () => {
  const { setPosts } = useContext(PostsContext);
  const [isLoading, setIsLoading] = useState(true);

  async function fetchAllPosts() {
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
    fetchAllPosts()
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
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-slate-100 flex items-center gap-2">
            <svg
              className="w-6 h-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Explore
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Discover all Gunpla builds from the community
          </p>
        </div>
        <Feed loading={isLoading} />
      </div>
    </div>
  );
};

export default Explore;
