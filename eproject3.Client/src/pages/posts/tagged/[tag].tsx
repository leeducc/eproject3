import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import Layout from "@/components/Layout"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"
import { client } from "@/gateway"
import { GetNews, NewsDto } from "@/dtos"
import { generateSlug } from "@/utils"

export default function PostsByTagPage() {
    const { tag } = useParams()
    const [posts, setPosts] = useState<NewsDto[]>([])
    const [allTags, setAllTags] = useState<string[]>([])
    const [tagCounts, setTagCounts] = useState<{ [tag: string]: number }>({})
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                if (!tag) return
                const res = await client.get(new GetNews({ tag }))
                setPosts(res.results ?? [])

                // load all news to get tag counts
                const allRes = await client.get(new GetNews())
                const tags = [...new Set(allRes.results?.flatMap(p => p.tags) ?? [])]
                const counts: { [tag: string]: number } = {}
                tags.forEach(t => {
                    counts[t] = allRes.results?.filter(p => p.tags.includes(t)).length ?? 0
                })
                tags.sort((a, b) => (counts[b] ?? 0) - (counts[a] ?? 0))

                setAllTags(tags)
                setTagCounts(counts)
            } catch (err) {
                console.error("Failed to load tag posts:", err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [tag])

    const selectedTag = tag
    const title = selectedTag ? `${selectedTag} tagged posts` : "Tag not found"

    const tagLink = (tag: string) => `/posts/tagged/${generateSlug(tag)}`

    return (
        <Layout title={title}>
            <title>{title}</title>
            {selectedTag ? (
                <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={`All posts tagged in <b>${selectedTag}</b>`} />
                    </div>
                    <div className="relative my-4 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            {allTags.map(t =>
                                t === selectedTag ? (
                                    <span
                                        key={t}
                                        className="mr-2 mb-2 text-xs leading-5 font-semibold bg-indigo-600 text-white rounded-full py-1 px-3 flex items-center space-x-2"
                                    >
                                        {t}
                                    </span>
                                ) : (
                                    <Link
                                        key={t}
                                        to={tagLink(t)}
                                        className="mr-2 mb-2 text-xs leading-5 font-semibold bg-slate-400/10 dark:bg-slate-400/30 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:hover:bg-slate-400/40"
                                    >
                                        {t}
                                    </Link>
                                )
                            )}
                        </div>
                    </div>
                    <div className="mt-12 relative mx-auto max-w-7xl">
                        {loading ? (
                            <div className="text-center text-gray-500 dark:text-gray-300">Loading...</div>
                        ) : (
                            <>
                                <BlogPosts posts={posts} />
                                <div className="mt-8 text-center">
                                    <Link className="text-sm font-semibold hover:underline" to="/posts">
                                        view all posts
                                    </Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            ) : (
                <ErrorSummary status={{ errorCode: "NotFound", message: `Posts tagged with ${tag} were not found` }} />
            )}
        </Layout>
    )
}
