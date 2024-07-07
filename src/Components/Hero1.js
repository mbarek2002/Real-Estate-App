import React from 'react'
import heroImg from '../assets/images/HeroImg.svg'
// import { NavLink } from 'react-router-dom'
// import { MdOutlineLocalOffer } from 'react-icons/md'

const Hero1 = () => {
  return (
    <section className="lg:h-screen max-h-screen  w-full flex flex-col-reverse lg:flex-row  justify-center mx-3 gap-y-5 lg:gap-x-1 mt-16 pt-5 lg:mt-20  lg:p-0">
      <div className="bg-custom-image w-full bg-cover bg-no-repeat bg-top h-[50%] flex items-center justify-center rounded-md">
        <div className="p-5 rounded flex flex-col gap-y-5 w-[55%] bg-black">
          <h1 className="text-3xl font-bold  text-center text-white">
            Tour Your Future Home in VR
          </h1>
          <p className="text-lg text-center text-white">
            Explore properties virtually. Find your dream home from anywhere.
          </p>
          <div className="flex bg-white p-2 rounded-lg w-full">
            <div className=" flex flex-col gap-y-4 w-1/5" >
              <div className="flex justify-around rounded-lg ring-1 ring-secondaryColor">
                <div className="   text-xl font-semibold">Buy</div>
                <div className="   text-xl font-semibold">Rent</div>
              </div>
              <div className="flex justify-around  rounded-lg ring-1 ring-secondaryColor">
                <div className="  text-xs font-semibold">All</div>
                <div className="  text-xs font-semibold">Ready</div>
                <div className="  text-xs font-semibold">off-Plan</div>
              </div>
            </div>
            <div className='w-3/5 px-2 flex gap-y-4 flex-col justify-between'>
              <div className="flex items-center h-full rounded-lg ring-1 ring-secondaryColor gap-x-3 justify-start">
                <p className='text-lg font-semibold pl-2'>icon</p>
                <input type="text" className='w-4/5 py-2 ' placeholder='Enter location'/>
              </div>
              <div className=" h-full w-full bg-black">
                <div></div>
                <div></div>
              </div>
            </div>
            <div>
              <div>search</div>
              <div></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero1
