import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import Layout from "@/components/Layout"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"
import { client } from "@/gateway"
import { GetNews, NewsDto } from "@/dtos"

export default function NewsByYearPage() {
    const { year } = useParams()
    const forYear = parseInt(year ?? "")
    const [posts, setPosts] = useState<NewsDto[]>([])
    const [allYears, setAllYears] = useState<number[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            setLoading(true)
            try {
                const res = await client.get(new GetNews({ year: forYear }))
                const results = res.results ?? []
                setPosts(results.sort((a, b) =>
                    new Date(b.date).getTime() - new Date(a.date).getTime()
                ))

                // also fetch all news to get available years for navigation
                const allRes = await client.get(new GetNews())
                const years = [...new Set(allRes.results?.map(p => new Date(p.date).getFullYear()))]
                setAllYears(years.sort((a, b) => b - a))
            } catch (err) {
                console.error("Failed to load news by year:", err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [forYear])

    const yearLink = (y: number) => `/posts/year/${y}`
    const title = `${forYear} posts`

    return (
        <Layout title={title}>
            {!loading && posts.length === 0 ? (
                <ErrorSummary
                    status={{
                        errorCode: "NotFound",
                        message: `Posts published in ${forYear} were not found`,
                    }}
                />
            ) : (
                <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        <BlogTitle heading={`All posts published in <b>${forYear}</b>`} />
                    </div>

                    <div className="mt-4 relative mb-8 mx-auto max-w-7xl">
                        <div className="flex flex-wrap justify-center">
                            {allYears.map(y =>
                                y === forYear ? (
                                    <b key={y} className="ml-3 text-sm font-semibold">{y}</b>
                                ) : (
                                    <Link
                                        key={y}
                                        to={yearLink(y)}
                                        className="ml-3 text-sm text-indigo-700 dark:text-indigo-300 font-semibold hover:underline"
                                    >
                                        {y}
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
                                    <Link className="text-sm font-semibold hover:underline" to="/posts">view all posts</Link>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            )}
        </Layout>
    )
}
