import { useState, useEffect, SyntheticEvent, ChangeEvent, Dispatch, SetStateAction } from "react"
import { useNavigate, useSearchParams, Link } from "react-router-dom"
import { useClient } from "@/gateway"
import { Authenticate } from "@/dtos"
import { serializeToObject } from "@servicestack/client"
import { useAuth, Redirecting } from "@/useAuth"
import Page from "@/components/LayoutPage"
import { ApiContext, TextInput, Checkbox, ErrorSummary, getRedirect } from "@/components/Form"
import { Button } from "@/components/ui/button"

export default () => {
    const client = useClient()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { signedIn, revalidate } = useAuth()

    const [username, setUsername] = useState<string>()
    const [password, setPassword] = useState<string>()

    useEffect(() => {
        if (signedIn) navigate(getRedirect(searchParams) || "/", { replace: true })
    }, [signedIn])
    if (signedIn) return <Redirecting />

    const change = (set: Dispatch<SetStateAction<string | undefined>>) =>
        (e: ChangeEvent<HTMLInputElement>) => set(e.target.value)

    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()
        const { userName, password, rememberMe } = serializeToObject(e.currentTarget)
        const api = await client.api(new Authenticate({ provider: 'credentials', userName, password, rememberMe }))
        if (api.succeeded) await revalidate()
    }

    return (
        <Page title="Sign In" className="max-w-lg">
            <ApiContext.Provider value={client}>
                <form onSubmit={onSubmit} className="space-y-6">
                    <ErrorSummary except="userName,password,rememberMe" />
                    <TextInput id="userName" label="Email" value={username} onChange={change(setUsername)} autoComplete="email" />
                    <TextInput id="password" type="password" label="Password" value={password} onChange={change(setPassword)} autoComplete="current-password" />
                    <Checkbox id="rememberMe" label="Remember me" />
                    <Button type="submit" className="w-full">Sign In</Button>
                </form>

                <div className="mt-6 text-center space-y-3">
                    <p className="text-gray-500">Or sign in with:</p>
                    <div className="flex gap-4 justify-center">
                        <a href="https://localhost:5001/auth/google" className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded">Google</a>
                        <a href="https://localhost:5001/auth/facebook" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded">Facebook</a>
                    </div>
                    <p className="mt-4">
                        Don’t have an account? <Link to="/signup" className="text-indigo-600 font-semibold">Sign up</Link>
                    </p>
                </div>
            </ApiContext.Provider>
        </Page>
    )
}
