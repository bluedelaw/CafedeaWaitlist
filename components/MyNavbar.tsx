import React from 'react'

const MyNavbar = () => {
  return (
    <>
        <nav className='bg-yellow-800'>
            <ul>
                <li>
                    <a href='/'>
                        Home
                    </a>
                </li>
                <li>
                    <a href='/add'>
                        Add
                    </a>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default MyNavbar