import { Link } from "react-router-dom"
import { NewsDto } from "@/dtos"
import { generateSlug, dateLabel, dateTimestamp } from "@/utils"

type Props = {
    posts: NewsDto[]
}

export default function BlogPosts({ posts }: Props) {
    function authorLink(name?: string) {
        return name ? `/posts/author/${generateSlug(name)}` : null
    }

    function postLink(post: NewsDto) {
        return `/posts/${post.slug}`
    }

    return (
        <div className="mx-auto grid max-w-lg gap-5 lg:max-w-none lg:grid-cols-3">
            {posts.map(post => (
                <div key={post.id} className="flex flex-col overflow-hidden rounded-lg shadow-lg">
                    <div className="flex-shrink-0">
                        <Link to={postLink(post)}>
                            <img className="h-48 w-full object-cover" src={post.image} alt="" />
                        </Link>
                    </div>
                    <div className="flex-1 flex flex-col justify-between bg-white dark:bg-black p-6">
                        <div className="flex-1">
                            <p className="text-sm font-medium text-indigo-600 dark:text-indigo-300">Article</p>
                            <Link to={postLink(post)} className="mt-2 block">
                                <p
                                    className="text-xl font-semibold text-gray-900 dark:text-gray-50 whitespace-nowrap overflow-hidden text-ellipsis"
                                    title={post.title}>
                                    {post.title}
                                </p>
                                <p className="mt-3 text-base text-gray-500 dark:text-gray-400">{post.summary}</p>
                            </Link>
                        </div>
                        <div className="mt-6 flex items-center">
                            <div className="flex-shrink-0">
                                <Link to={authorLink(post.authorName)!}>
                                    <span className="sr-only">{post.authorName}</span>
                                    <img
                                        className="h-10 w-10 rounded-full"
                                        src={post.authorProfileUrl ?? "/img/profiles/user1.svg"}
                                        alt={post.authorName}
                                    />
                                </Link>
                            </div>
                            <div className="ml-3">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-50">
                                    {authorLink(post.authorName)
                                        ? <Link to={authorLink(post.authorName)!} className="hover:underline">{post.authorName}</Link>
                                        : <span>{post.authorName}</span>}
                                </p>
                                <div className="flex space-x-1 text-sm text-gray-500 dark:text-gray-400">
                                    <time dateTime={dateTimestamp(post.date)}>{dateLabel(post.date)}</time>
                                    <span className="px-1" aria-hidden="true">&middot;</span>
                                    <span>{post.minutesToRead} min read</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}
