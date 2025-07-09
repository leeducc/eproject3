import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import Layout from "@/components/Layout";

type Post = {
    title: string;
    author: string;
    channel: string;
    date: string;
    content: string;
    review: number;
};

type Comment = {
    postId: number;
    author: string;
    datetime: string;
    content: string;
    review: number;
};

export default function ForumPost() {
    const [post, setPost] = useState<Post | null>(null);
    const [comments, setComments] = useState<Comment[]>([]);
    const [channels, setChannels] = useState<string[]>([]);

    const [voteState, setVoteState] = useState<"like" | "dislike" | null>(null);
    const [postReview, setPostReview] = useState<number>(0);

    const [commentVoteStates, setCommentVoteStates] = useState<("like" | "dislike" | null)[]>([]);
    const [reviewStates, setReviewStates] = useState<number[]>([]);

    const [commentPage, setCommentPage] = useState(1);
    const COMMENTS_PER_PAGE = 1;

    const location = useLocation();
    const params = new URLSearchParams(location.search);
    const id = parseInt(params.get("id") || "0", 10);
    const selectedChannel = params.get("channel");

    useEffect(() => {
        fetch("/forum.json")
            .then((res) => res.json())
            .then((data: Post[]) => {
                if (data[id]) {
                    setPost(data[id]);
                    setPostReview(data[id].review || 0);
                    document.title = data[id].title;
                    const allChannels = Array.from(new Set(data.map((p) => p.channel)));
                    setChannels(allChannels);
                }
            });

        fetch("/forumpost.json")
            .then((res) => res.json())
            .then((data: Comment[]) => {
                const filtered = data.filter((c) => c.postId === id);
                setComments(filtered);
                setCommentVoteStates(new Array(filtered.length).fill(null));
                setReviewStates(filtered.map((c) => c.review));
            });
    }, [id]);

    if (!post) {
        return (
            <Layout title="Loading...">
                <div className="p-8 text-gray-500">Post not found or loading...</div>
            </Layout>
        );
    }

    const totalCommentPages = Math.ceil(comments.length / COMMENTS_PER_PAGE);
    const paginatedComments = comments.slice(
        (commentPage - 1) * COMMENTS_PER_PAGE,
        commentPage * COMMENTS_PER_PAGE
    );

    return (
        <Layout title={post.title}>
            <div className="flex flex-col md:flex-row px-8 py-6">
                {/* Sidebar */}
                <aside className="w-full md:w-1/4 pr-0 md:pr-6 border-t md:border-t-0 md:border-r border-gray-200 mt-6 md:mt-0 order-2 md:order-1">
                    <h2 className="text-lg font-semibold mb-3">Channels</h2>
                    <div className="h-px bg-gray-300 mb-4" />

                    <Link
                        to="/forum"
                        className={`block mb-2 ${!selectedChannel ? "font-bold text-blue-600" : "text-gray-700 hover:underline"}`}
                    >
                        All
                    </Link>

                    {channels.map((channel, i) => (
                        <Link
                            key={i}
                            to={`/forum?channel=${encodeURIComponent(channel)}`}
                            className={`block mb-2 ${selectedChannel === channel ? "font-bold text-blue-600" : "text-gray-700 hover:underline"}`}
                        >
                            {channel}
                        </Link>
                    ))}
                </aside>

                {/* Main Content */}
                <main className="w-full md:w-3/4 pl-0 md:pl-6 order-1 md:order-2">
                    <Link to="/forum" className="text-blue-600 text-sm hover:underline mb-4 block">
                        ← Back to Forum
                    </Link>

                    {/* Post content */}
                    <div className="border-b pb-4 mb-4">
                        <div className="mb-1 text-sm text-gray-600">
                            <span className="font-medium">{post.author}</span> · {post.date}
                        </div>
                        <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                        <p className="text-base text-gray-800 whitespace-pre-line">{post.content}</p>

                        <div className="flex items-center space-x-2 mt-4 text-sm text-gray-600">
                            <button
                                onClick={() => {
                                    if (voteState === "like") {
                                        setVoteState(null);
                                        setPostReview((prev) => prev - 1);
                                    } else {
                                        if (voteState === "dislike") setPostReview((prev) => prev + 1);
                                        setVoteState("like");
                                        setPostReview((prev) => prev + 1);
                                    }
                                }}
                                className={`px-1 ${voteState === "like" ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
                                title="Upvote"
                            >↑</button>

                            <span
                                className={`px-2 font-semibold ${postReview > 0 ? "text-green-600" : postReview < 0 ? "text-red-500" : "text-gray-500"}`}
                            >{postReview}</span>

                            <button
                                onClick={() => {
                                    if (voteState === "dislike") {
                                        setVoteState(null);
                                        setPostReview((prev) => prev + 1);
                                    } else {
                                        if (voteState === "like") setPostReview((prev) => prev - 1);
                                        setVoteState("dislike");
                                        setPostReview((prev) => prev - 1);
                                    }
                                }}
                                className={`px-1 ${voteState === "dislike" ? "text-red-500 font-bold" : "hover:text-red-500"}`}
                                title="Downvote"
                            >↓</button>
                        </div>
                    </div>

                    <h2 className="text-lg font-semibold mb-3">Comments ({comments.length})</h2>

                    {paginatedComments.map((comment, i) => {
                        const actualIndex = (commentPage - 1) * COMMENTS_PER_PAGE + i;
                        return (
                            <div key={i} className="border p-4 rounded mb-3 bg-gray-50 shadow-sm">
                                <div className="mb-1 text-sm text-gray-600">
                                    <span className="font-medium">{comment.author}</span> · {comment.datetime}
                                </div>
                                <p>{comment.content}</p>

                                <div className="flex items-center justify-start mt-2 text-sm text-gray-600 space-x-2">
                                    <button
                                        onClick={() => {
                                            const newVoteStates = [...commentVoteStates];
                                            const newReviewStates = [...reviewStates];

                                            if (newVoteStates[actualIndex] === "like") {
                                                newVoteStates[actualIndex] = null;
                                                newReviewStates[actualIndex] -= 1;
                                            } else {
                                                if (newVoteStates[actualIndex] === "dislike") newReviewStates[actualIndex] += 1;
                                                newVoteStates[actualIndex] = "like";
                                                newReviewStates[actualIndex] += 1;
                                            }

                                            setCommentVoteStates(newVoteStates);
                                            setReviewStates(newReviewStates);
                                        }}
                                        className={`px-1 ${commentVoteStates[actualIndex] === "like" ? "text-blue-600 font-bold" : "hover:text-blue-600"}`}
                                        title="Upvote"
                                    >↑</button>

                                    <span className={`px-2 font-semibold ${reviewStates[actualIndex] > 0 ? "text-green-600" : reviewStates[actualIndex] < 0 ? "text-red-500" : "text-gray-500"}`}>
                                        {reviewStates[actualIndex]}
                                    </span>

                                    <button
                                        onClick={() => {
                                            const newVoteStates = [...commentVoteStates];
                                            const newReviewStates = [...reviewStates];

                                            if (newVoteStates[actualIndex] === "dislike") {
                                                newVoteStates[actualIndex] = null;
                                                newReviewStates[actualIndex] += 1;
                                            } else {
                                                if (newVoteStates[actualIndex] === "like") newReviewStates[actualIndex] -= 1;
                                                newVoteStates[actualIndex] = "dislike";
                                                newReviewStates[actualIndex] -= 1;
                                            }

                                            setCommentVoteStates(newVoteStates);
                                            setReviewStates(newReviewStates);
                                        }}
                                        className={`px-1 ${commentVoteStates[actualIndex] === "dislike" ? "text-red-500 font-bold" : "hover:text-red-500"}`}
                                        title="Downvote"
                                    >↓</button>
                                </div>
                            </div>
                        );
                    })}

                    {totalCommentPages > 1 && (
                        <div className="flex justify-center items-center mt-4 space-x-2">
                            <button
                                disabled={commentPage === 1}
                                onClick={() => setCommentPage((p) => p - 1)}
                                className="px-3 py-1 border rounded disabled:opacity-30"
                            >Previous</button>
                            {[...Array(totalCommentPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCommentPage(i + 1)}
                                    className={`px-3 py-1 border rounded ${commentPage === i + 1 ? "bg-gray-200 font-semibold" : ""}`}
                                >{i + 1}</button>
                            ))}
                            <button
                                disabled={commentPage === totalCommentPages}
                                onClick={() => setCommentPage((p) => p + 1)}
                                className="px-3 py-1 border rounded disabled:opacity-30"
                            >Next</button>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
