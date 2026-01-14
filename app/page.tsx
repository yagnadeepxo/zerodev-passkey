"use client"

import {
    PasskeyValidatorContractVersion,
    WebAuthnMode,
    toPasskeyValidator,
    toWebAuthnKey
} from "@zerodev/passkey-validator"
import { getEntryPoint, KERNEL_V3_1 } from "@zerodev/sdk/constants"
import React, { useEffect, useState } from "react"
import { createPublicClient, http } from "viem"
import { sepolia } from "viem/chains"

const CHAIN = sepolia

const PASSKEY_SERVER_URL = `https://passkeys.zerodev.app/api/v3/ea9b4025-6363-407a-af07-ab095545dcf4`
//const entryPoint = getEntryPoint("0.7")

const publicClient = createPublicClient({
    transport: http(),
    chain: CHAIN
})

export default function Home() {
    const [mounted, setMounted] = useState(false)
    const [username, setUsername] = useState("")
    const [isRegistering, setIsRegistering] = useState(false)
    const [isLoggingIn, setIsLoggingIn] = useState(false)

    // Function to be called when "Register" is clicked
    const handleRegister = async () => {
        setIsRegistering(true)

        const webAuthnKey = await toWebAuthnKey({
            passkeyName: username,
            passkeyServerUrl: PASSKEY_SERVER_URL,
            mode: WebAuthnMode.Register,
            passkeyServerHeaders: {}
        })

        setIsRegistering(false)
        window.alert("Register done.")
    }

    const handleLogin = async () => {
        setIsLoggingIn(true)

        const webAuthnKey = await toWebAuthnKey({
            passkeyName: username,
            passkeyServerUrl: PASSKEY_SERVER_URL,
            mode: WebAuthnMode.Login,
            passkeyServerHeaders: {}
        })

        setIsLoggingIn(false)
        window.alert("Login done.")
    }

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return <></>

    // Spinner component for visual feedback during loading states
    const Spinner = () => (
        <svg
            className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
        >
            <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
            ></circle>
            <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
        </svg>
    )

    return (
        <main className="flex items-center justify-center min-h-screen px-4 py-24">
            <div className="w-full max-w-lg mx-auto">
                <h1 className="text-4xl font-semibold text-center mb-12">
                    ZeroDev Passkeys Demo
                </h1>

                <div className="space-y-4">
                    {/* Input Box */}
                    <input
                        type="text"
                        placeholder="Your username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        className="p-2 border border-gray-300 rounded-lg w-full"
                    />

                    {/* Register and Login Buttons */}
                    <div className="flex flex-col sm:flex-row sm:space-x-4">
                        {/* Register Button */}
                        <button
                            onClick={handleRegister}
                            disabled={isRegistering || isLoggingIn}
                            className="flex justify-center items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 w-full"
                        >
                            {isRegistering ? <Spinner /> : "Register"}
                        </button>

                        {/* Login Button */}
                        <button
                            onClick={handleLogin}
                            disabled={isLoggingIn || isRegistering}
                            className="mt-2 sm:mt-0 flex justify-center items-center px-4 py-2 bg-purple-500 text-white rounded-lg hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 w-full"
                        >
                            {isLoggingIn ? <Spinner /> : "Login"}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    )
}
