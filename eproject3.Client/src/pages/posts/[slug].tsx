import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Layout from "@/components/Layout"
import AuthorLinks from "@/components/AuthorLinks"
import MarkdownComponent from "@/components/MarkdownComponent"
import { ErrorSummary } from "@/components/Form"
import { dateLabel, dateTimestamp, generateSlug } from "@/utils"
import { client } from "@/gateway"
import { GetNews, NewsDto, GetAuthors, AuthorDto } from "@/dtos"

export default function NewsDetailPage() {
    const { slug } = useParams()
    const [post, setPost] = useState<NewsDto | null>(null)
    const [author, setAuthor] = useState<AuthorDto | null>(null)
    const [relatedPosts, setRelatedPosts] = useState<NewsDto[]>([])
    const [loading, setLoading] = useState(true)
    const [markdown, setMarkdown] = useState("")

    // Fetch the MDX file once we know contentPath
    useEffect(() => {
        if (!post?.contentPath) return
        fetch(`https://localhost:5001/news/${post.contentPath}`)
            .then(res => {
                if (!res.ok) throw new Error(res.statusText)
                return res.text()
            })
            .then(setMarkdown)
            .catch(err => console.error("Failed to load MDX:", err))
    }, [post?.contentPath])

    // Load post, author, and related posts
    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                if (!slug) return
                // 1) Get the news item
                const res = await client.get(new GetNews({ slug }))
                const item = res.results?.[0]
                if (!item) {
                    setPost(null)
                    return
                }
                setPost(item)

                // 2) Get the author
                const authRes = await client.get(new GetAuthors({ id: item.authorId }))
                setAuthor(authRes.results?.[0] ?? null)

                // 3) Get related posts
                const relatedRes = await client.get(new GetNews({ authorId: item.authorId }))
                setRelatedPosts(
                    relatedRes.results
                        ?.filter(p => p.slug !== item.slug)
                        .slice(0, 4) || []
                )
            } catch (err) {
                console.error("Failed to load post:", err)
            } finally {
                setLoading(false)
            }
        }
        load()
    }, [slug])

    const tagLink    = (tag: string)  => `/posts/tagged/${generateSlug(tag)}`
    const authorLink = (name: string) => `/posts/author/${generateSlug(name)}`
    const postLink   = (p: NewsDto)   => `/posts/${p.slug}`

    if (loading) {
        return <div className="text-center py-10">Loading post…</div>
    }
    if (!post) {
        return (
            <div className="mt-3 mb-20 mx-auto max-w-fit">
                <ErrorSummary
                    status={{
                        errorCode: "NotFound",
                        message: `Post "${slug}" was not found`,
                    }}
                />
            </div>
        )
    }

    return (
        <Layout>
            <title>{post.title}</title>

            {/* Banner */}
            <div className="relative w-full h-64 md:h-96 overflow-hidden mb-12">
                <img
                    src={post.image}
                    alt={`${post.title} Background`}
                    className="absolute inset-0 w-full h-full object-cover"
                />
            </div>

            <div className="container px-5 mb-32 mx-auto">
                <article className="mt-20">

                    {/* Title */}
                    <h1 className="text-6xl md:text-7xl lg:text-8xl font-bold mb-12 text-center md:text-left">
                        {post.title}
                    </h1>

                    {/* Author */}
                    {author && (
                        <div className="flex justify-between mb-8">
                            <div className="flex items-center">
                                <Link to={authorLink(author.name)}>
                                    <img
                                        className="w-12 h-12 rounded-full mr-4"
                                        src={author.profileUrl}
                                        alt={author.name}
                                    />
                                </Link>
                                <div className="flex flex-col">
                                    <Link
                                        className="text-xl font-semibold hover:underline"
                                        to={authorLink(author.name)}
                                    >
                                        {author.name}
                                    </Link>
                                    <AuthorLinks author={author} />
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Tags & Meta */}
                    <div className="flex max-w-3xl mx-auto justify-between mb-16">
                        <div>
                            <div className="mb-4 flex flex-wrap">
                                {post.tags.map(tag => (
                                    <Link
                                        key={tag}
                                        to={tagLink(tag)}
                                        className="mr-2 mb-2 text-xs font-semibold bg-slate-400/10 rounded-full py-1 px-3 hover:bg-slate-400/20"
                                    >
                                        {tag}
                                    </Link>
                                ))}
                            </div>
                            <div className="text-lg text-gray-500">
                                <time dateTime={dateTimestamp(post.date)}>
                                    {dateLabel(post.date)}
                                </time>
                                <span className="px-1">·</span>
                                <span>{post.minutesToRead} min read</span>
                            </div>
                        </div>
                    </div>

                    {/* Markdown Content: wrap long lines, no horizontal scroll */}
                    <div
                        className="
              prose
              lg:prose-xl
              max-w-none
              mb-32
              overflow-x-hidden
              whitespace-normal
              break-words
            "
                    >
                        <MarkdownComponent
                            type="blog"
                            doc={{
                                slug:           post.slug,
                                path:           post.contentPath,
                                fileName:       post.contentPath.split("/").pop() || "",
                                title:          post.title,
                                date:           post.date,
                                tags:           post.tags,
                                wordCount:      post.wordCount,
                                minutesToRead:  post.minutesToRead,
                                preview:        "",
                                content:        markdown,
                                lineCount:      markdown.split("\n").length,
                            }}
                        />
                    </div>
                </article>
            </div>

            {/* Related Posts */}
            {relatedPosts.length > 0 && (
                <div className="bg-gray-50 py-20">
                    <div className="max-w-3xl mx-auto">
                        <div className="flex justify-between mb-8">
                            <div className="flex items-center">
                                {author && (
                                    <Link to={authorLink(author.name)}>
                                        <img
                                            className="w-20 h-20 rounded-full"
                                            src={author.profileUrl}
                                            alt={author.name}
                                        />
                                    </Link>
                                )}
                                <div className="ml-4 font-medium text-2xl">
                                    More from {author?.name}
                                </div>
                            </div>
                            <div className="flex items-end">
                                {author && <AuthorLinks author={author} />}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-8">
                            {relatedPosts.map(p => (
                                <div key={p.slug} className="flex flex-col overflow-hidden">
                                    <Link to={postLink(p)}>
                                        <img
                                            className="h-48 w-full object-cover"
                                            src={p.image}
                                            alt={p.title}
                                        />
                                    </Link>
                                    <div className="flex flex-col justify-between bg-white p-6">
                                        <div>
                                            <p className="text-sm font-medium text-indigo-600">
                                                Article
                                            </p>
                                            <Link to={postLink(p)} className="mt-2 block">
                                                <p className="text-xl font-semibold truncate">
                                                    {p.title}
                                                </p>
                                                <p className="mt-3 text-base text-gray-500">
                                                    {p.summary}
                                                </p>
                                            </Link>
                                        </div>
                                        <div className="mt-6 flex items-center">
                                            <img
                                                className="h-10 w-10 rounded-full"
                                                src={author?.profileUrl}
                                                alt={author?.name}
                                            />
                                            <div className="ml-3">
                                                <p className="text-sm font-medium">
                                                    <Link
                                                        to={authorLink(p.authorName)}
                                                        className="hover:underline"
                                                    >
                                                        {p.authorName}
                                                    </Link>
                                                </p>
                                                <div className="flex space-x-1 text-sm text-gray-500">
                                                    <time dateTime={dateTimestamp(p.date)}>
                                                        {dateLabel(p.date)}
                                                    </time>
                                                    <span className="px-1">·</span>
                                                    <span>{p.minutesToRead} min read</span>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </Layout>
    )
}
