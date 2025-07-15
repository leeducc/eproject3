import {
    ChangeEvent,
    Dispatch,
    SetStateAction,
    SyntheticEvent,
    useEffect,
    useState,
} from "react"
import { useNavigate, useSearchParams } from "react-router-dom"

import Page from "@/components/LayoutPage"
import {
    FormLoading,
    ErrorSummary,
    TextInput,
    Checkbox,
    getRedirect,
    ApiContext,
    SelectInput,
    DateInput,
} from "@/components/Form"
import { Button } from "@/components/ui/button"
import { useClient } from "@/gateway"
import { RegisterExtended, RegisterResponse } from "@/dtos"
import { useAuth, Redirecting } from "@/useAuth"

export default () => {
    const client = useClient()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const { signedIn, revalidate } = useAuth()

    // Form state
    const [firstName, setFirstName] = useState("")
    const [lastName, setLastName] = useState("")
    const [displayName, setDisplayName] = useState("")
    const [username, setUsername] = useState("")
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [gender, setGender] = useState("")
    const [birthday, setBirthday] = useState("")
    const [phoneNumber, setPhoneNumber] = useState("")
    const [countries, setCountries] = useState<string[]>([])
    const [country, setCountry] = useState<string>("") // Start empty
    const [cities, setCities] = useState<string[]>([])
    const [city, setCity] = useState<string>("")
    const [address, setAddress] = useState("")
    const [autoLogin, setAutoLogin] = useState(false)

    useEffect(() => {
        if (signedIn) navigate(getRedirect(searchParams) || "/")
    }, [signedIn])

    if (signedIn) return <Redirecting />
    useEffect(() => {
        const fetchCountries = async () => {
            const res = await fetch("https://countriesnow.space/api/v0.1/countries/positions")
            const json = await res.json()
            const countryNames = json.data.map((c: any) => c.name)

            setCountries(countryNames)

            const defaultCountry = "Vietnam"
            setCountry(defaultCountry)  // ✅ Default to Vietnam
        }
        fetchCountries()
    }, [])


    useEffect(() => {
        const fetchCities = async (country: string) => {
            if (!country) return
            const res = await fetch("https://countriesnow.space/api/v0.1/countries/cities", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ country }),
            })
            const json = await res.json()
            setCities(json.data || [])
            setCity("") // Reset city when country changes
        }

        if (country) {
            fetchCities(country)  // <-- pass the country here
        } else {
            setCities([])
            setCity("")
        }
    }, [country])


    const onSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            client.setError({
                fieldName: "confirmPassword",
                message: "Passwords do not match",
            })
            return
        }

        const api = await client.api(new RegisterExtended({
            userName: username || undefined,
            email: username || undefined,
            password,
            confirmPassword,
            autoLogin,
            displayName,
            firstName,
            lastName,
            gender,
            birthDate: birthday,
            phoneNumber,
            address,
            city,
            country,
        }))

        if (api.succeeded) {
            await revalidate()
            const redirectUrl = (api.response as RegisterResponse).redirectUrl
            if (redirectUrl) {
                location.href = redirectUrl
            } else {
                navigate("/signin")
            }
        }
    }

    const change = (set: Dispatch<SetStateAction<string>>) =>
        (e: ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
            set(e.target.value)

    return (
        <Page title="Sign Up" className="max-w-lg">
            <ApiContext.Provider value={client}>
                <section className="mt-4 sm:shadow overflow-hidden sm:rounded-md">
                    <form onSubmit={onSubmit} className="max-w-prose">
                        <div className="shadow overflow-hidden sm:rounded-md">
                            <ErrorSummary except="displayName,userName,password,confirmPassword" />
                            <div className="px-4 py-5 bg-white dark:bg-black space-y-6 sm:p-6">
                                <h3 className="mb-4 text-2xl font-semibold text-gray-900 dark:text-gray-100 leading-tight">
                                    Create a new account
                                </h3>
                                <div className="flex flex-col gap-y-4">
                                    <TextInput id="firstName" label="First Name" value={firstName} onChange={change(setFirstName)} />
                                    <TextInput id="lastName" label="Last Name" value={lastName} onChange={change(setLastName)} />
                                    <TextInput id="displayName" help="Your full name" value={displayName} onChange={change(setDisplayName)} />
                                    <TextInput id="userName" autoComplete="email" label="Email" value={username} onChange={change(setUsername)} />
                                    <TextInput id="password" type="password" help="6 characters or more" autoComplete="new-password" value={password} onChange={change(setPassword)} />
                                    <TextInput id="confirmPassword" type="password" value={confirmPassword} onChange={change(setConfirmPassword)} />

                                    <SelectInput id="gender" label="Gender" options={["Male", "Female", "Other"]} value={gender} onChange={change(setGender)} />
                                    <DateInput id="birthday" label="Birthday" value={birthday} onChange={change(setBirthday)} max={new Date(new Date().setFullYear(new Date().getFullYear() - 15)).toISOString().split('T')[0]} />
                                    <TextInput id="phoneNumber" label="Phone Number" value={phoneNumber} onChange={change(setPhoneNumber)} pattern="\d{10,13}" />

                                    {countries.length === 0 ? <p>Loading countries...</p> : (
                                        <SelectInput
                                            id="country"
                                            label="Country"
                                            options={countries}
                                            value={country}
                                            onChange={(e: { target: { value: any } }) => {
                                                const selected = e.target.value
                                                setCountry(selected)
                                                setCity("") // always clear city
                                            }}
                                        />
                                        )}

                                    {!cities.length && country ? <p>Loading cities...</p> : (
                                        <SelectInput
                                            id="city"
                                            label="City"
                                            options={cities}
                                            value={city}
                                            onChange={(e: { target: { value: SetStateAction<string> } }) => setCity(e.target.value)}
                                            disabled={!cities.length}
                                        />
                                        )}

                                    <TextInput id="address" label="Street Address" value={address} onChange={change(setAddress)} />

                                    <Checkbox id="autoLogin" checked={autoLogin} onChange={() => setAutoLogin(!autoLogin)} label="Auto-login after sign up" />
                                </div>
                            </div>
                            <div className="pt-5 px-4 py-3 bg-gray-50 dark:bg-gray-900 text-right sm:px-6">
                                <div className="flex justify-end">
                                    <FormLoading className="flex-1" />
                                    <Button className="ml-3">Sign Up</Button>
                                </div>
                            </div>
                        </div>
                    </form>
                </section>
            </ApiContext.Provider>
        </Page>
    )
}
