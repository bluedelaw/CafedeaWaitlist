"use client"
import { usePathname, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { LogOut } from "lucide-react"

const MyNavbar = () => {
  const pathname = usePathname()
  const router = useRouter()

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  const handleLogout = async () => {
    try {
      const response = await fetch("/api/logout", { method: "POST" })
      if (response.ok) {
        router.push("/login")
      } else {
        console.error("Logout failed")
      }
    } catch (error) {
      console.error("Error during logout:", error)
    }
  }

  // Hide navbar only on login page
  if (pathname === "/login") {
    return null
  }

  return (
    <nav className="bg-gray-800 p-4">
      <div className="container mx-auto flex justify-between items-center">
        <ul className="flex space-x-4">
          <li>
            <button
              onClick={() => handleNavigation("/")}
              className={`text-white hover:text-yellow-300 ${pathname === "/" ? "text-yellow-300" : ""}`}
            >
              Home
            </button>
          </li>
          <li>
            <button
              onClick={() => handleNavigation("/add")}
              className={`text-white hover:text-yellow-300 ${pathname === "/add" ? "text-yellow-300" : ""}`}
            >
              Add
            </button>
          </li>
        </ul>
        {pathname !== "/add" && (
          <Button onClick={handleLogout} variant="ghost" className="text-white hover:text-yellow-300">
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        )}
      </div>
    </nav>
  )
}

export default MyNavbar

