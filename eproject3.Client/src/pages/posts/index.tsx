import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import Layout from "@/components/Layout"
import { client } from "@/gateway"
import { GetNews, NewsDto } from "@/dtos"
import { generateSlug } from "@/utils"

export default function NewsIndexPage() {
    const [news, setNews] = useState<NewsDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const loadNews = async () => {
            try {
                const res = await client.get(new GetNews())
                setNews(res.results || [])
            } catch (err) {
                console.error("Failed to fetch news:", err)
            } finally {
                setLoading(false)
            }
        }

        loadNews()
    }, [])

    const thisYear = new Date().getFullYear()
    const allYears = [...new Set(news.map(n => new Date(n.date).getFullYear()))]
    const allTags = [...new Set(news.flatMap(n => n.tags))]
    const tagCounts: Record<string, number> = {}
    allTags.forEach(tag => tagCounts[tag] = news.filter(n => n.tags.includes(tag)).length)
    allTags.sort((a, b) => tagCounts[b] - tagCounts[a])

    const tagLink = (tag: string) => `/posts/tagged/${generateSlug(tag)}`
    const yearLink = (year: number) => `/posts/year/${year}`

    return (
        <Layout title="From the Blog">
            <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                <div className="absolute inset-0">
                    <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                </div>

                <div className="relative mx-auto max-w-7xl">
                    <BlogTitle heading="Writing on software design and aerospace industry." />
                </div>

                {/* Tags */}
                <div className="relative my-4 mx-auto max-w-7xl">
                    <div className="flex flex-wrap justify-center">
                        {allTags.map(tag => (
                            <Link
                                key={tag}
                                to={tagLink(tag)}
                                className="mr-2 mb-2 text-xs leading-5 font-semibold bg-slate-400/10 dark:bg-slate-400/30 rounded-full py-1 px-3 flex items-center space-x-2 hover:bg-slate-400/20 dark:hover:bg-slate-400/40 dark:highlight-white/5"
                            >
                                {tag}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Years */}
                <div className="relative mb-8 mx-auto max-w-7xl">
                    <div className="flex flex-wrap justify-center">
                        <b className="text-sm font-semibold">{thisYear}</b>
                        {allYears.filter(y => y !== thisYear).map(year => (
                            <Link
                                key={year}
                                to={yearLink(year)}
                                className="ml-3 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:underline"
                            >
                                {year}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Blog Posts */}
                <div className="relative mx-auto max-w-7xl">
                    {loading ? (
                        <div className="text-center text-gray-500 dark:text-gray-300">Loading...</div>
                    ) : (
                        <>
                            <BlogPosts posts={news.filter(n => new Date(n.date).getFullYear() === thisYear)} />
                            <div className="mt-8 text-center">
                                <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                            </div>
                        </>
                    )}
                </div>
            </div>

            
        </Layout>
    )
}
