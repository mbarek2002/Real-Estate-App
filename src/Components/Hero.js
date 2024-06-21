import React from 'react'
import heroImg from '../assets/images/HeroImg.svg'
const Hero = () => {
    return (
        <section className='lg:h-screen max-h-screen  w-full flex flex-col-reverse lg:flex-row items-center justify-center gap-y-5 lg:gap-x-1 mt-16 pt-5 lg:m-7  lg:p-0'>
            <div className='w-full lg:w-[55%] lg:h-[80%] flex items-start justify-center'>
                <div className='w-[80%] h-full flex flex-col items-center justify-center gap-y-5'>
                <h1 className='font-extrabold  text-5xl text-start'>Experience Your Future
                Home in Virtual Reality</h1>
                <p className='font-medium text-lg'>Take a virtual tour of your dream property from the comfort of your own home. Explore every detail,
                     visualize your new life, and find the perfect match before you even step inside.
                    </p>
                <div className='flex items-start justify-start w-full gap-x-6'>
                    <div className='bg-btnColor text-white py-3 px-6 rounded-sm text-center hover:bg-white hover:text-btnColor hover:ring-2 hover:ring-btnColor  sm:w-[45%] lg:w-[45%] xl:[35%] 2xl:w-[30%] 3xl:w-[25%]'>Start Your Tour</div>
                    <div className='hover:bg-btnColor hover:text-white py-3 px-6 rounded-sm text-center bg-white text-btnColor ring-2 ring-btnColor lg:w-[45%] xl:[35%]  2xl:w-[30%] 3xl:w-[25%]'>List Your Property</div>
                </div>

                    <div className='flex flex-col items-start justify-start w-full'>
                        <div className='flex w-1/3'>
                            <div className='bg-btnColor text-white'>Rent</div>
                            <div>Buy</div>
                        </div>
                        <div className=''>
                            <div className='flex flex-col'>
                                <label for="">City</label>
                                <input type="text" name="" id="" />
                            </div>
                            <div className='flex flex-col'>
                                <label for="">Property Type</label>
                                <input type="text" name="" id="" />
                            </div>
                            <div className='flex flex-col'>
                                <label for="">Price Range</label>
                                <input type="text" name="" id="" />
                            </div>
                            <div>
                                recherche
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div className='w-full h-1/2 lg:w-[45%]  lg:h-[80%] flex justify-end items-end'>
                <div className='h-full w-full'>   
                    <img src={heroImg} alt="" className='h-full w-full object-cover rounded-2xl lg:rounded-l-4xl lg:rounded-none'/>
                </div>
            </div>
        </section>
    )
}

export default Hero
