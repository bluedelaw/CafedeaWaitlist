import React from 'react'

const MyNavbar = () => {
  return (
    <>
        <nav className='bg-yellow-800'>
            <ul>
                <li>
                    <a href='/' className='bg-yellow-600'>
                        Home
                    </a>
                </li>
                <li>
                    <a href='/add' className='bg-yellow-600'>
                        Add
                    </a>
                </li>
            </ul>
        </nav>
    </>
  )
}

export default MyNavbar