import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import BlogTitle from "@/components/BlogTitle"
import BlogPosts from "@/components/BlogPosts"
import { ErrorSummary } from "@/components/Form"
import Layout from "@/components/Layout"
import { client } from "@/gateway"
import { GetNews, NewsDto, GetAuthors, AuthorDto } from "@/dtos"

export default function AuthorPostsPage() {
    const { name } = useParams() // slug like "lucy-bates"
    const [author, setAuthor] = useState<AuthorDto | null>(null)
    const [posts, setPosts] = useState<NewsDto[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const load = async () => {
            if (!name) return
            setLoading(true)

            try {
                // Fetch author
                const authorRes = await client.get(new GetAuthors({ nameSlug: name }))
                const authorDto = authorRes.results?.[0]
                setAuthor(authorDto ?? null)

                // Fetch their posts
                if (authorDto?.slug) {
                    const postsRes = await client.get(new GetNews({ authorSlug: authorDto.slug }))
                    setPosts(postsRes.results ?? [])
                }
            } catch (err) {
                console.error("Failed to load author posts:", err)
            } finally {
                setLoading(false)
            }
        }

        load()
    }, [name])

    const title = author ? `${author.name}'s Posts` : "Author Not Found"

    return (
        <Layout title={title}>
            {!loading && !author ? (
                <ErrorSummary status={{ errorCode: "NotFound", message: `Author ${name} was not found` }} />
            ) : (
                <div className="relative bg-gray-50 dark:bg-gray-900 px-6 pt-16 pb-20 lg:px-8 lg:pt-24 lg:pb-28">
                    <div className="absolute inset-0">
                        <div className="h-1/3 bg-white dark:bg-black sm:h-2/3"></div>
                    </div>
                    <div className="relative mx-auto max-w-7xl">
                        {author && (
                            <BlogTitle heading={`All posts written by <b>${author.name}</b>`} />
                        )}
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
            )}
        </Layout>
    )
}
