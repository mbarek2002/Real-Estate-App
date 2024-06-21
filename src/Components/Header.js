import React, { useState } from 'react'
import { NavLink, Link } from 'react-router-dom'
import { MdClose, MdMenu } from 'react-icons/md'
import { FaOpencart } from 'react-icons/fa'
import logo from '../assets/logos/logo.svg'

//import images svg
import Navbar from './NavBar'

const Header = () => {
  const [menuOpened, setmenuOpened] = useState(false)
  const toggleMenu = () => setmenuOpened(!menuOpened)

  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = () => {
    setIsAnimating(true)

    setTimeout(() => {
      setIsAnimating(false)
    }, 500)
  }

  return (
    <header className="fixed top-0  left-0 m-auto  w-full bg-white ring-1 ring-slate-900/5 z-10">
      <div className="px-4 flex items-center justify-around  py-3 max-xs:px-2">
        {!menuOpened ? (
          <div
            className={` ${
              isAnimating ? 'animate-spin360' : ''
            } transform origin-center`}
            onClick={handleClick}
          >
            {' '}
            <MdMenu
              className="md:hidden spin360 cursor-pointer hover:text-secondary mr-2 p-1 text-btnColor h-6 w-6 sm:h-8 sm:w-8 "
              onClick={toggleMenu}
            />
          </div>
        ) : (
          <div
            className={` ${isAnimating ? 'animate-spin360' : ''}`}
            onClick={handleClick}
          >
            {' '}
            <MdClose
              className="md:hidden spin360 cursor-pointer hover:text-secondary mr-2 p-1 text-btnColor h-6 w-6 sm:h-8 sm:w-8 rounded-full"
              onClick={toggleMenu}
            />
          </div>
        )}
        {/* logo */}
        <div className="flex items-center justify-center">
          {/* <Link> */}
          <div className="flex items-center justify-center h-6 w-6 md:h-10 md:w-10 sm:h-7 sm:w-7 mr-5">
            <img src={logo} className="w-full h-full object-fill" />
          </div>
          <div className="text-primaryColor text-sm lg:text-2xl sm:text-base md:text-xl font-bold">
            Convergimmob
          </div>
          {/* </Link> */}
        </div>

        {/* navbar mobile */}

        {/* navbar desktop */}
        <Navbar
          containerStyles={`${
            menuOpened
              ? 'flex items-start flex-col gap-y-12 fixed top-20 right-8 p-12 bg-white rounded-3xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300'
              : 'flex items-start flex-col gap-y-12 fixed top-20  p-12 bg-white rounded-3xl shadow-md w-64 medium-16 ring-1 ring-slate-900/5 transition-all duration-300 -right-[100%]'
          }`}
        />
        <div className="flex  sm:gap-x-12 bold-16">
          <Navbar
            containerStyles={'hidden md:flex gap-x-5 xl:gap-x-10 medium-15 '}
          />

          {/* <div className="flexBetween sm:gap-x-6"> */}

          {/* </div> */}
        </div>
        <div
          // to={'login'}
          className={ 
            'bg-btnColor text-xs lg:text-base text-white  rounded-lg flex items-center justify-center gap-x-2 p-2 lg:p-3'
          }
        >
          Contact us
        </div>
      </div>
    </header>
  )
}

export default Header
