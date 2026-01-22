import { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Feed from "../components/home/Feed";
import PostsContext from "../contexts/postsContext";
import JWTContext from "../contexts/jwtContext";

const Home = () => {
  const { setPosts } = useContext(PostsContext);
  const { token, user } = useContext(JWTContext);
  const [isLoading, setIsLoading] = useState(true);
  const [emptyFeed, setEmptyFeed] = useState(false);

  async function fetchFeedPosts() {
    // If not logged in, redirect to explore
    if (!token) {
      return { posts: [], notLoggedIn: true };
    }

    const response = await fetch(`${import.meta.env.VITE_API_URL}/posts/feed`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`failed to fetch feed ${response.status}`);
    }
    return response.json();
  }

  useEffect(() => {
    fetchFeedPosts()
      .then((data) => {
        if (data.notLoggedIn) {
          setPosts([]);
          setEmptyFeed(true);
        } else {
          setPosts(data.posts);
          setEmptyFeed(data.posts.length === 0);
        }
        setIsLoading(false);
      })
      .catch((error) => {
        console.error(error);
        setIsLoading(false);
      });
  }, [setPosts, token]);

  // Show message if not logged in
  if (!token) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-8">
        <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
          <svg
            className="w-16 h-16 text-primary mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
            />
          </svg>
          <h2 className="text-xl font-bold text-slate-100 mb-2">
            Login to see your feed
          </h2>
          <p className="text-slate-400 mb-4">
            Your home feed shows posts from builders you follow.
          </p>
          <div className="flex gap-4 justify-center">
            <Link to="/login" className="btn btn-primary">
              Login
            </Link>
            <Link to="/explore" className="btn btn-outline">
              Explore Posts
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Posts from builders you follow
          </p>
        </div>

        {emptyFeed && !isLoading ? (
          <div className="bg-slate-800 rounded-lg p-8 text-center border border-slate-700">
            <svg
              className="w-16 h-16 text-slate-500 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <h2 className="text-xl font-bold text-slate-100 mb-2">
              Your feed is empty
            </h2>
            <p className="text-slate-400 mb-4">
              Follow some builders to see their posts here!
            </p>
            <div className="flex gap-4 justify-center">
              <Link to="/community" className="btn btn-primary">
                Find Builders
              </Link>
              <Link to="/explore" className="btn btn-outline">
                Explore All Posts
              </Link>
            </div>
          </div>
        ) : (
          <Feed loading={isLoading} />
        )}
      </div>
    </div>
  );
};

export default Home;
