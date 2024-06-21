import React from 'react'
import { NavLink } from 'react-router-dom'
import { MdCategory, MdContacts, MdHomeFilled, MdShop2 } from 'react-icons/md'

const Navbar = ({ containerStyles }) => {
  return (
    <div>
      <nav className={`${containerStyles}`}>
        {/* <NavLink
          //   to={'/'}
          className={({ isActive }) => (isActive ? 'active_link' : '')}
        > */}
        <div className="flex items-center justify-center gap-x-1 text-secondaryColor">
          Buy
        </div>
        {/* </NavLink>
        <NavLink
          //   to={'/AboutUs'}
          className={({ isActive }) => (isActive ? 'active_link' : '')}
        > */}
        <div className="flex items-center justify-center gap-x-1 text-secondaryColor">
          Rent
        </div>
        {/* </NavLink>
        <NavLink
          //   to={'/Services'}
          className={({ isActive }) => (isActive ? 'active_link' : '')}
        > */}
        <div className="flex items-center justify-center gap-x-1 text-secondaryColor">
          Sell
        </div>
        {/* </NavLink>
        <NavLink
          //   to={'/Blog'}
          className={({ isActive }) => (isActive ? 'active_link' : '')}
        > */}
        <div className="flex items-center justify-center  gap-x-1 text-secondaryColor ">
          Find Agent
        </div>
        {/* </NavLink> */}
        <div className="flex items-center justify-center  gap-x-1 text-secondaryColor">
          Manage Listings
        </div>
        <div className="flex items-center justify-center  gap-x-1 text-secondaryColor">
          Help
        </div>
      </nav>
    </div>
  )
}

export default Navbar
