"use client"

import { useState, useEffect } from "react"
import { db } from "@/firebaseConfig"
import { doc, getDoc } from "firebase/firestore"
import { setCookie, getCookie } from "cookies-next"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function LoginPage() {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie("token")
      if (token === "authenticated") {
        router.replace("/")
      }
    }
    checkAuth()

    // Prevent going back to protected pages
    window.history.pushState(null, "", window.location.href)
    window.onpopstate = () => {
      window.history.pushState(null, "", window.location.href)
    }

    return () => {
      window.onpopstate = null
    }
  }, [router])

  const handleLogin = async () => {
    setIsLoading(true)
    setError("")

    try {
      if (!db) {
        throw new Error("Firestore instance is not initialized")
      }

      console.log("Attempting to access Firestore")
      const docRef = doc(db, "config", "password")
      console.log("Document reference created")
      const docSnap = await getDoc(docRef)
      console.log("Document snapshot retrieved")

      if (docSnap.exists()) {
        const storedPassword = docSnap.data().value
        console.log("Password document exists")

        if (password === storedPassword) {
          setCookie("token", "authenticated", { expires: new Date(Date.now() + 24 * 60 * 60 * 1000) })
          router.replace("/")
        } else {
          setError("Incorrect password")
        }
      } else {
        console.log("No password document found")
        setError("No password found in database")
      }
    } catch (err) {
      console.error("Error in login process:", err)
      setError(`Error checking password: ${err.message || JSON.stringify(err)}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-bold text-center mb-6">Login</h1>
        <div className="space-y-4">
          <input
            type="password"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
          />
          <button
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <Loader2 className="animate-spin mr-2" size={18} />
                Logging in...
              </span>
            ) : (
              "Login"
            )}
          </button>
        </div>
        {error && <p className="text-red-500 mt-4 text-center">{error}</p>}
      </div>
    </div>
  )
}

