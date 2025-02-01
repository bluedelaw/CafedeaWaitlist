import React from 'react'

const MyNavbar = () => {
  return (
    <>
        <nav className="bg-gray-800 p-4">
            <ul className="flex space-x-4">
                <li>
                    <a href="/" className="text-white hover:text-yellow-300">
                        Home
                    </a>
                </li>
                <li>
                    <a href="/add" className="text-white hover:text-yellow-300">
                        Add
                    </a>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default MyNavbar
