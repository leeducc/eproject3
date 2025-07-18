// src/pages/ForumPage.tsx
import { useEffect, useState } from "react";
import Layout from "@/components/Layout";
import { client } from "@/gateway";
import {
    GetChannels, Channel,
    GetPosts, Post,
    CreatePost, VotePost
} from "@/dtos";
import { Link, useLocation, useNavigate } from "react-router-dom";

const POSTS_PER_PAGE = 9;

export default function ForumPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const [channels, setChannels] = useState<Channel[]>([]);
    const [posts, setPosts]       = useState<Post[]>([]);

    const [filteredChannelId, setFilteredChannelId] = useState<number | null>(null);
    const [currentPage, setCurrentPage]             = useState(1);
    const [isCreating, setIsCreating]               = useState(false);
    const [newTitle, setNewTitle]                   = useState("");
    const [newContent, setNewContent]               = useState("");

    // 1) Load channels once
    useEffect(() => {
        client.get(new GetChannels())
            .then(res => setChannels(res.channels));
    }, []);

    // 2) Load posts whenever the filter changes
    useEffect(() => {
        const req = new GetPosts();
        if (filteredChannelId != null) req.channelId = filteredChannelId;
        client.get(req).then(res => setPosts(res.posts));
    }, [filteredChannelId]);

    // 3) Sync filter state from URL
    useEffect(() => {
        const params = new URLSearchParams(location.search);
        const chId = params.get("channelId");
        setFilteredChannelId(chId ? parseInt(chId, 10) : null);
        setCurrentPage(1);
    }, [location.search]);

    const filteredPosts = filteredChannelId != null
        ? posts.filter(p => p.channelId === filteredChannelId)
        : posts;

    const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
    const pagePosts  = filteredPosts.slice(
        (currentPage - 1) * POSTS_PER_PAGE,
        currentPage * POSTS_PER_PAGE
    );

    const handleCreate = async () => {
        if (!newTitle.trim() || !newContent.trim()) return;
        const channelId = filteredChannelId ?? channels[0]?.id;
        const dto = new CreatePost({ channelId, title: newTitle, content: newContent });
        const created = await client.post(dto);
        setPosts([created, ...posts]);
        setNewTitle(""); setNewContent(""); setIsCreating(false);
    };

    const handleVote = async (postId: number, voteType: 1 | -1) => {
        await client.post(new VotePost({ postId, voteType }));
        // no review count; you'd need to re-fetch or compute on server
    };

    return (
        <Layout title="Forum">
            <div className="flex flex-col md:flex-row px-8 py-6">
                <aside className="md:w-1/4 mb-6 md:mb-0">
                    <h2 className="text-lg font-semibold mb-3">Channels</h2>
                    <ul className="space-y-2">
                        <li
                            className={`cursor-pointer ${filteredChannelId===null?'font-bold':''}`}
                            onClick={()=>navigate("/forum")}
                        >
                            All ({posts.length})
                        </li>
                        {channels.map(ch => (
                            <li
                                key={ch.id}
                                className={`cursor-pointer ${filteredChannelId===ch.id?'font-bold':''}`}
                                onClick={()=>navigate(`/forum?channelId=${ch.id}`)}
                            >
                                {ch.name} ({posts.filter(p=>p.channelId===ch.id).length})
                            </li>
                        ))}
                    </ul>
                </aside>

                <main className="md:w-3/4">
                    {/* Create new post */}
                    <div className="mb-6">
                        {isCreating ? (
                            <div className="space-y-2">
                                <input
                                    value={newTitle}
                                    onChange={e=>setNewTitle(e.target.value)}
                                    placeholder="Title"
                                    className="w-full border rounded px-3 py-2"
                                />
                                <textarea
                                    value={newContent}
                                    onChange={e=>setNewContent(e.target.value)}
                                    placeholder="Content"
                                    rows={4}
                                    className="w-full border rounded px-3 py-2"
                                />
                                <div className="flex space-x-2">
                                    <button onClick={handleCreate}
                                            className="px-4 py-2 bg-blue-600 text-white rounded">
                                        Submit
                                    </button>
                                    <button onClick={()=>setIsCreating(false)}
                                            className="px-4 py-2 border rounded">
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div
                                className="border rounded px-4 py-2 text-gray-500 cursor-pointer"
                                onClick={()=>setIsCreating(true)}
                            >
                                What do you want to post?
                            </div>
                        )}
                    </div>

                    {/* Posts list */}
                    <div className="space-y-4">
                        {pagePosts.map(p => (
                            <Link
                                key={p.id}
                                to={`/forum/${p.id}`}
                                className="block border rounded px-4 py-3 hover:bg-gray-50 transition"
                            >
                                <h3 className="text-base font-semibold">{p.title}</h3>
                                <p className="text-sm text-gray-600 mt-1">
                                    {p.content.length > 100 ? p.content.slice(0,100)+"..." : p.content}
                                </p>
                                <div className="mt-2 flex items-center space-x-2">
                                    <button onClick={e=>{e.preventDefault();handleVote(p.id,1)}}>↑</button>
                                    <button onClick={e=>{e.preventDefault();handleVote(p.id,-1)}}>↓</button>
                                </div>
                            </Link>
                        ))}
                    </div>

                    {/* Pagination */}
                    {totalPages>1 && (
                        <div className="mt-6 flex space-x-2 justify-center">
                            <button
                                disabled={currentPage===1}
                                onClick={()=>setCurrentPage(p=>p-1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >Prev</button>
                            {[...Array(totalPages)].map((_,i)=>(
                                <button
                                    key={i}
                                    onClick={()=>setCurrentPage(i+1)}
                                    className={`px-3 py-1 border rounded ${currentPage===i+1?'bg-gray-200':''}`}
                                >{i+1}</button>
                            ))}
                            <button
                                disabled={currentPage===totalPages}
                                onClick={()=>setCurrentPage(p=>p+1)}
                                className="px-3 py-1 border rounded disabled:opacity-50"
                            >Next</button>
                        </div>
                    )}
                </main>
            </div>
        </Layout>
    );
}
