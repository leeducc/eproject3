// src/pages/forum/[id].tsx
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import {
    GetPost, Post,
    GetComments, Comment,
    CreateComment,
    VotePost, VoteComment
} from "@/dtos";
import { client } from "@/gateway";
import { useParams, Link } from "react-router-dom";
import { FaArrowUp, FaArrowDown, FaReply } from "react-icons/fa";

export default function ForumPostPage() {
    const { id } = useParams<{ id: string }>();
    const postId = Number(id);

    const [post, setPost] = useState<Post | null>(null);
    const [postReview, setPostReview] = useState(0);
    const [postVoteState, setPostVoteState] = useState<1 | -1 | 0>(0);

    const [comments, setComments] = useState<Comment[]>([]);
    const [commentVoteStates, setCommentVoteStates] = useState<Record<number, 1 | -1 | 0>>({});

    const [newComment, setNewComment] = useState("");
    const [replyTo, setReplyTo] = useState<number | null>(null);
    const [replyText, setReplyText] = useState("");

    useEffect(() => {
        // Load post and its review
        client.get(new GetPost({ id: postId })).then(p => {
            setPost(p);
            setPostReview(p.review);
            setPostVoteState(0);
        });

        // Load comments and initialize vote states
        client.get(new GetComments({ postId })).then(res => {
            setComments(res.comments);
            const initStates: Record<number,1|-1|0> = {};
            res.comments.forEach(c => initStates[c.id] = 0);
            setCommentVoteStates(initStates);
        });
    }, [postId]);

    if (!post) return <Layout title="Loading…">Loading…</Layout>;

    const formatDate = (value: string | Date) => {
        // 1) turn any string into a full ISO timestamp
        const str = typeof value === "string"
            // append “Z” if it looks like “YYYY‑MM‑DDTHH:MM:SS”
            ? (value.match(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}$/)
                ? value + "Z"
                : value)
            : value.toString();

        const d = new Date(str);
        if (isNaN(d.getTime())) {
            console.warn("Could not parse date:", value);
            return "Unknown date";
        }

        return d.toLocaleString(undefined, {
            dateStyle: "medium",
            timeStyle: "short",
        });
    };

    // Toggle post vote, undo on repeat
    const toggleVotePost = async (type: 1 | -1) => {
        const curr = postVoteState;
        await client.post(new VotePost({ postId, voteType: type }));
        const next = curr === type ? 0 : type;
        setPostVoteState(next);
        setPostReview(postReview + (next - curr));
    };

    // Toggle comment vote, undo on repeat
    const toggleVoteComment = async (commentId: number, type: 1 | -1) => {
        const curr = commentVoteStates[commentId] || 0;
        await client.post(new VoteComment({ commentId, voteType: type }));
        const next = curr === type ? 0 : type;
        setCommentVoteStates({ ...commentVoteStates, [commentId]: next });
        setComments(comments.map(c =>
            c.id === commentId
                ? { ...c, review: c.review + (next - curr) }
                : c
        ));
    };

    const submitComment = () => {
        if (!newComment.trim()) return;
        client.post(new CreateComment({ postId, content: newComment }))
            .then(res => {
                setComments([{ ...res, review: 0, replies: [] }, ...comments]);
                setCommentVoteStates({ ...commentVoteStates, [res.id]: 0 });
                setNewComment("");
            });
    };

    const submitReply = (parentId: number) => {
        if (!replyText.trim()) return;
        client.post(new CreateComment({
            postId,
            parentCommentId: parentId,
            content: replyText,
        })).then(res => {
            setComments(comments.map(c =>
                c.id === parentId
                    ? { ...c, replies: [...(c.replies||[]), { ...res, review: 0, replies: [] }] }
                    : c
            ));
            setCommentVoteStates({ ...commentVoteStates, [res.id]: 0 });
            setReplyTo(null);
            setReplyText("");
        });
    };

    return (
        <Layout title={post.title}>
            <Link to="/forum" className="text-blue-600 hover:underline text-sm">&larr; Back</Link>

            {/* Post Card */}
            <div className="mt-4 bg-white rounded-lg shadow-md flex flex-col md:flex-row">
                <div className="flex flex-row md:flex-col items-center bg-gray-50 p-2 rounded-t-lg md:rounded-l-lg">
                    <button
                        onClick={() => toggleVotePost(1)}
                        className={`p-1 ${postVoteState === 1 ? "text-green-600" : "text-gray-500"} hover:text-green-700`}
                    ><FaArrowUp size={20} /></button>
                    <span className="mx-2 md:my-2 text-gray-700 font-semibold">{postReview}</span>
                    <button
                        onClick={() => toggleVotePost(-1)}
                        className={`p-1 ${postVoteState === -1 ? "text-red-600" : "text-gray-500"} hover:text-red-700`}
                    ><FaArrowDown size={20} /></button>
                </div>
                <div className="p-6 flex-1">
                    <h1 className="text-2xl font-bold mb-2">{post.title}</h1>
                    <p className="text-gray-800 whitespace-pre-wrap">{post.content}</p>
                    <div className="text-sm text-gray-500 mt-4">Posted: {formatDate(post.createdAt)}</div>
                </div>
            </div>

            {/* New Comment */}
            <div className="mt-6 bg-white rounded-lg shadow-md p-4">
        <textarea
            className="w-full border rounded-md p-3 focus:ring focus:ring-blue-200"
            rows={3}
            placeholder="Add a comment…"
            value={newComment}
            onChange={e => setNewComment(e.target.value)}
        />
                <button
                    onClick={submitComment}
                    className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >Comment</button>
            </div>

            {/* Comments */}
            <div className="mt-6 space-y-4">
                {comments.map(c => (
                    <div key={c.id} className="bg-white rounded-lg shadow-sm flex">
                        <div className="flex flex-row md:flex-col items-center bg-gray-50 p-2 md:p-4 rounded-l-lg">
                            <button
                                onClick={() => toggleVoteComment(c.id, 1)}
                                className={`p-1 ${commentVoteStates[c.id] === 1 ? "text-green-600" : "text-gray-500"} hover:text-green-700`}
                            ><FaArrowUp /></button>
                            <span className="mx-2 md:my-2 text-gray-700 font-medium">{c.review}</span>
                            <button
                                onClick={() => toggleVoteComment(c.id, -1)}
                                className={`p-1 ${commentVoteStates[c.id] === -1 ? "text-red-600" : "text-gray-500"} hover:text-red-700`}
                            ><FaArrowDown /></button>
                        </div>
                        <div className="p-4 flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <span className="text-sm font-medium">User #{c.userId}</span>
                                <span className="text-xs text-gray-500">{formatDate(c.createdAt)}</span>
                            </div>
                            <p className="text-gray-800">{c.content}</p>
                            <button
                                onClick={() => setReplyTo(c.id)}
                                className="mt-2 flex items-center space-x-1 text-sm text-blue-600 hover:underline"
                            ><FaReply /><span>Reply</span></button>

                            {replyTo === c.id && (
                                <div className="mt-3 ml-6">
                  <textarea
                      className="w-full border rounded-md p-2 focus:ring focus:ring-blue-200"
                      rows={2}
                      placeholder="Your reply…"
                      value={replyText}
                      onChange={e => setReplyText(e.target.value)}
                  />
                                    <div className="flex space-x-2 mt-2">
                                        <button
                                            onClick={() => submitReply(c.id)}
                                            className="px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                                        >Submit</button>
                                        <button
                                            onClick={() => setReplyTo(null)}
                                            className="px-3 py-1 border rounded hover:bg-gray-100"
                                        >Cancel</button>
                                    </div>
                                </div>
                            )}

                            {c.replies.length > 0 && (
                                <div className="mt-4 ml-6 space-y-4">
                                    {c.replies.map(r => (
                                        <div key={r.id} className="bg-gray-50 rounded-lg p-3">
                                            <div className="flex justify-between items-center mb-1 text-sm text-gray-600">
                                                <span>User #{r.userId}</span>
                                                <span>{formatDate(r.createdAt)}</span>
                                            </div>
                                            <p className="text-gray-700">{r.content}</p>
                                            <div className="mt-2 flex items-center space-x-4 text-sm">
                                                <button
                                                    onClick={() => toggleVoteComment(r.id, 1)}
                                                    className={`hover:text-green-700 p-1 ${
                                                        commentVoteStates[r.id] === 1 ? "text-green-600" : "text-gray-500"
                                                    }`}
                                                ><FaArrowUp /> {r.review}</button>
                                                <button
                                                    onClick={() => toggleVoteComment(r.id, -1)}
                                                    className={`hover:text-red-700 p-1 ${
                                                        commentVoteStates[r.id] === -1 ? "text-red-600" : "text-gray-500"
                                                    }`}
                                                ><FaArrowDown /></button>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </Layout>
    );
}
