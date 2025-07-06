import { Link } from "react-router-dom"
import Layout from "@/components/Layout"
import {useContext, useState} from "react"
import { PressContext } from "@/contexts"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"


export default () => {
    const press = useContext(PressContext)
    const title = press.news.config.blogTitle

    function authorLink(name: any) {
        return name && press.news.authors.some((x: any) => x.name.toLowerCase() == name.toLowerCase())
            ? `/posts/author/${generateSlug(name)}`
            : null
    }

    function postLink(post: any) {
        return `/posts/${post.slug}`
    }

    function author(name: string) {
        return name ? press.news.authors.filter((x: any) => x.name.toLowerCase() == name.toLowerCase())[0] : null
    }

    function authorProfileUrl(name: string) {
        return author(name)?.profileUrl ?? "/img/profiles/user1.svg"
    }

    const posts = press.news.posts
    const primaryPost = posts[0]
    const postAuthor = primaryPost.author
    const gridPosts = posts.slice(1, 7)
    const remainingPosts = posts.slice(7, 22)
    const [visibleCount, setVisibleCount] = useState(3)
    const visiblePosts = remainingPosts.slice(0, visibleCount)
    
    return (<>
        <Layout title={title}>
            <div className="container mx-auto px-5 mt-24 mb-24">
                {!primaryPost ? null : (<section>
                    <div className="mb-8 md:mb-16">
                        <div className="sm:mx-0">
                            <Link aria-label={primaryPost.title} to={postLink(primaryPost)}>
                                <img src={primaryPost.image} alt={`Cover Image for ${primaryPost.title}`}
                                     className="shadow-sm hover:shadow-2xl transition-shadow duration-200"/>
                            </Link>
                        </div>
                    </div>
                    <div className="md:grid md:grid-cols-2 md:gap-x-16 lg:gap-x-8 mb-20 md:mb-28">
                        <div>
                            <h3 className="mb-4 text-4xl lg:text-6xl leading-tight">
                                <Link className="hover:underline" to={postLink(primaryPost)}>{primaryPost.title}</Link>
                            </h3>
                            <div className="mb-4 md:mb-0 text-lg">
                                <time dateTime={dateTimestamp(primaryPost.date)}>{dateLabel(primaryPost.date)}</time>
                            </div>
                        </div>
                        <div>
                            <p className="text-lg leading-relaxed mb-4">{primaryPost.summary}</p>
                            {authorLink(primaryPost.author)
                                ? (<Link className="flex items-center text-xl font-bold"
                                         to={authorLink(primaryPost.author)!}>
                                    <img src={authorProfileUrl(primaryPost.author)}
                                         className="w-12 h-12 rounded-full mr-4" alt="Author"/>
                                    <span>{postAuthor}</span>
                                </Link>)
                                : (<span className="flex items-center text-xl font-bold">
                                    <img src={authorProfileUrl(primaryPost.author)}
                                         className="w-12 h-12 rounded-full mr-4" alt="Author"/>
                                        <span>{postAuthor}</span>
                                    </span>)}
                        </div>
                    </div>
                </section>)}

                {!gridPosts.length ? null : (<section>
                    <h2 className="mb-8 text-6xl md:text-7xl font-bold tracking-tighter leading-tight">More news</h2>
                    <div className="mx-auto mt-12 grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
                        {gridPosts.map(post => <div key={post.path}
                                                    className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                            <div className="flex-shrink-0">
                                <Link to={postLink(post)}>
                                    <img className="h-48 w-full object-cover" src={post.image} alt=""/>
                                </Link>
                            </div>
                            <div className="flex flex-1 flex-col justify-between bg-white dark:bg-black p-6">
                                <div className="flex-1">
                                    <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">
                                        Article
                                    </p>
                                    <Link to={postLink(post)} className="mt-2 block">
                                        <p className="text-xl font-semibold text-gray-900 dark:text-gray-50">{post.title}</p>
                                        <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.summary}</p>
                                    </Link>
                                </div>
                                <div className="mt-6 flex items-center">
                                    <div className="flex-shrink-0">
                                        <span>
                                            <span className="sr-only">{post.author}</span>
                                            <img className="h-10 w-10 rounded-full" src={authorProfileUrl(post.author)}
                                                 alt={`${post.title} background`}/>
                                        </span>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                            {authorLink(post.author)
                                                ? <Link to={authorLink(post.author)!}
                                                        className="hover:underline">{post.author}</Link>
                                                : <span>{post.author}</span>}
                                        </p>
                                        <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                            <time dateTime={dateTimestamp(post.date)}>{dateLabel(post.date)}</time>
                                            <span className="px-1" aria-hidden="true">&middot;</span>
                                            <span>{post.minutesToRead} min read</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>)}
                    </div>
                </section>)}

                {remainingPosts.length > 0 && (
                    <section className="mt-24 flex justify-center">
                        <div className="w-full max-w-screen-lg px-2">
                            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                                {visiblePosts.map(post => (
                                    <div key={post.path} className="bg-white dark:bg-zinc-900 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200">
                                        <Link to={postLink(post)}>
                                            <img
                                                className="w-full h-48 object-cover rounded-t-xl"
                                                src={post.image}
                                                alt={post.title}
                                            />
                                        </Link>
                                        <div className="p-5">
                                            <Link to={postLink(post)} className="hover:underline block">
                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white leading-snug">
                                                    {post.title}
                                                </h3>
                                            </Link>
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{post.summary}</p>
                                            <div className="mt-4 flex items-center">
                                                <img
                                                    className="h-9 w-9 rounded-full mr-3"
                                                    src={authorProfileUrl(post.author)}
                                                    alt={post.author}
                                                />
                                                <div>
                                                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                                                        {authorLink(post.author) ? (
                                                            <Link to={authorLink(post.author)!} className="hover:underline">{post.author}</Link>
                                                        ) : (
                                                            <span>{post.author}</span>
                                                        )}
                                                    </p>
                                                    <div className="text-xs text-gray-500 dark:text-gray-400">
                                                        <time dateTime={dateTimestamp(post.date)}>{dateLabel(post.date)}</time>
                                                        <span className="px-1" aria-hidden="true">·</span>
                                                        <span>{post.minutesToRead} min read</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Show more nếu còn bài chưa hiển thị */}
                            {visibleCount < remainingPosts.length && (
                                <div className="mt-10 text-center">
                                    <button
                                        onClick={() => setVisibleCount(prev => prev + 6)}
                                        className="px-4 py-2 text-sm font-semibold text-indigo-600 dark:text-indigo-300 hover:underline"
                                    >
                                        Show more posts
                                    </button>
                                </div>
                            )}
                        </div>
                    </section>
                )}
            </div>
        </Layout>
    </>)
}