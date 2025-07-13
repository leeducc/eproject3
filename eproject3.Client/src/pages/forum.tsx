import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/useAuth";

type ForumPost = {
    title: string;
    author: string;
    channel: string;
    date: string;
    content: string;
    review: number;
};

const POSTS_PER_PAGE = 9;

export default function Forum() {
    const location = useLocation();
    const { auth } = useAuth();
    const [posts, setPosts] = useState<ForumPost[]>([]);
    const [filteredChannel, setFilteredChannel] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [isCreating, setIsCreating] = useState(false);
    const [newPostTitle, setNewPostTitle] = useState("");
    const [newPostContent, setNewPostContent] = useState("");
    const [voteStates, setVoteStates] = useState<(null | "like" | "dislike")[]>([]);

    useEffect(() => {
        fetch("/forum.json")
            .then((res) => res.json())
            .then((data) => {
                setPosts(data);
                setVoteStates(new Array(data.length).fill(null));
            });
    }, []);

    useEffect(() => {
        const channelParam = new URLSearchParams(location.search).get("channel");
        if (channelParam) {
            setFilteredChannel(channelParam);
        }
    }, [location.search]);

    useEffect(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, [currentPage]);

    const channels = Array.from(new Set(posts.map((p) => p.channel)));

    const filteredPosts = filteredChannel
        ? posts.filter((p) => p.channel === filteredChannel)
        : posts;

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const paginatedPosts = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleChannelClick = (channel: string | null) => {
        setFilteredChannel(channel);
        setCurrentPage(1);
    };

    function truncateText(text: string, maxLength: number) {
        if (text.length <= maxLength) return text;
        return text.slice(0, text.slice(0, maxLength).lastIndexOf(" ")) + "...";
    }

    function handleVote(index: number, type: "like" | "dislike") {
        const globalIndex = posts.findIndex(p =>
            p.title === paginatedPosts[index].title &&
            p.content === paginatedPosts[index].content &&
            p.channel === paginatedPosts[index].channel &&
            p.date === paginatedPosts[index].date &&
            p.author === paginatedPosts[index].author
        );

        if (globalIndex === -1) return;

        const currentVote = voteStates[globalIndex];
        const newVoteStates = [...voteStates];
        const updatedPosts = [...posts];

        if (currentVote === type) {
            newVoteStates[globalIndex] = null;
            updatedPosts[globalIndex].review += type === "like" ? -1 : 1;
        } else {
            if (currentVote === "like") {
                updatedPosts[globalIndex].review -= 1;
            } else if (currentVote === "dislike") {
                updatedPosts[globalIndex].review += 1;
            }

            newVoteStates[globalIndex] = type;
            updatedPosts[globalIndex].review += type === "like" ? 1 : -1;
        }

        setVoteStates(newVoteStates);
        setPosts(updatedPosts);
    }

    return (
        <Layout title="Forum">
            <div className="flex flex-col md:flex-row px-8 py-6">
                <aside className="w-full md:w-1/4 pr-0 md:pr-6 border-t md:border-t-0 md:border-r border-gray-200 mt-6 md:mt-0 order-2 md:order-1">
                    <h2 className="text-lg font-bold mb-4 uppercase tracking-wider">Channels</h2>
                    <div className="h-px bg-gray-300 mb-4" />
                    <ul className="space-y-2 text-sm">
                        <li
                            className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 flex justify-between ${
                                filteredChannel === null ? "bg-gray-100 font-semibold" : ""
                            }`}
                            onClick={() => handleChannelClick(null)}
                        >
                            <span>All</span>
                            <span className="text-xs text-gray-500">{posts.length}</span>
                        </li>
                        {channels.map((channel, idx) => {
                            const count = posts.filter((p) => p.channel === channel).length;
                            return (
                                <li
                                    key={idx}
                                    className={`px-2 py-1 rounded cursor-pointer hover:bg-gray-100 flex justify-between ${
                                        filteredChannel === channel ? "bg-gray-100 font-semibold" : ""
                                    }`}
                                    onClick={() => handleChannelClick(channel)}
                                >
                                    <span>{channel}</span>
                                    <span className="text-xs text-gray-500">{count}</span>
                                </li>
                            );
                        })}
                    </ul>
                </aside>

                <main className="w-full md:w-3/4 pl-0 md:pl-6 order-1 md:order-2">
                    {auth && (
                        <div className="mb-6 border border-gray-200 rounded-xl px-5 py-4 bg-white shadow-sm">
                            {!isCreating ? (
                                <div
                                    className="text-gray-500 cursor-text text-sm px-1 py-2 rounded hover:bg-gray-50 transition"
                                    onClick={() => setIsCreating(true)}
                                >
                                    What do you want to post?
                                </div>
                            ) : (
                                <div className="space-y-4 animate-fade-in">
                                    <input
                                        type="text"
                                        placeholder="Title"
                                        value={newPostTitle}
                                        onChange={(e) => setNewPostTitle(e.target.value)}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autoFocus
                                    />
                                    <textarea
                                        placeholder="What's on your mind?"
                                        value={newPostContent}
                                        onChange={(e) => setNewPostContent(e.target.value)}
                                        rows={4}
                                        className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    ></textarea>
                                    <div className="flex justify-end space-x-2">
                                        <button
                                            onClick={() => {
                                                if (!newPostTitle.trim() || !newPostContent.trim()) return;

                                                const newPost = {
                                                    title: newPostTitle,
                                                    content: newPostContent,
                                                    author: auth.userName ?? "You",
                                                    channel: "General",
                                                    date: new Date().toISOString().split("T")[0],
                                                    review: 0
                                                };

                                                setPosts([newPost, ...posts]);
                                                setVoteStates([null, ...voteStates]);
                                                setNewPostTitle("");
                                                setNewPostContent("");
                                                setIsCreating(false);
                                            }}
                                            className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700 transition"
                                        >
                                            Submit
                                        </button>
                                        <button
                                            onClick={() => {
                                                setIsCreating(false);
                                                setNewPostTitle("");
                                                setNewPostContent("");
                                            }}
                                            className="px-4 py-2 border border-gray-300 text-sm rounded-md hover:bg-gray-100 transition"
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    <div className="space-y-4">
                        {paginatedPosts.map((post, idx) => {
                            const globalIndex = posts.findIndex(p =>
                                p.title === post.title &&
                                p.content === post.content &&
                                p.channel === post.channel &&
                                p.date === post.date &&
                                p.author === post.author
                            );

                            return (
                                <Link
                                    to={`/forumpost/?id=${globalIndex}`}
                                    key={idx}
                                    className="block border-b py-4 hover:bg-gray-50 transition px-2 rounded"
                                >
                                    <div className="flex justify-between items-center">
                                        <h3 className="text-base font-semibold text-gray-800 line-clamp-2">
                                            {post.title}
                                        </h3>
                                        <span className="text-xs text-gray-500 whitespace-nowrap ml-4">
                                            {post.date}
                                        </span>
                                    </div>
                                    <p className="text-sm text-gray-600 mt-1">
                                        {truncateText(post.content, 150)}
                                    </p>
                                    <div className="mt-1 text-sm text-gray-500 flex justify-between items-center">
                                        <span className="italic">{post.channel}</span>
                                        <span className="font-medium">{post.author}</span>
                                    </div>
                                    <div className="mt-2 flex items-center text-sm text-gray-500 space-x-2">
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleVote(idx, "like");
                                            }}
                                            className={`px-1 ${voteStates[globalIndex] === "like" ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
                                        >↑</button>
                                        <span
                                            className={`px-2 font-semibold ${
                                                post.review > 0
                                                    ? "text-green-600"
                                                    : post.review < 0
                                                        ? "text-red-500"
                                                        : "text-gray-500"
                                            }`}
                                        >{post.review}</span>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                handleVote(idx, "dislike");
                                            }}
                                            className={`px-1 ${voteStates[globalIndex] === "dislike" ? "text-red-500 font-bold" : "hover:text-red-500"}`}
                                        >↓</button>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>

                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 space-x-2">
                            <button
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage((p) => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-30"
                            >Previous</button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 border rounded ${
                                        currentPage === i + 1 ? "bg-gray-200 font-semibold" : ""
                                    }`}
                                >{i + 1}</button>
                            ))}
                            <button
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage((p) => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-30"
                            >Next</button>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
