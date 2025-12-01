import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-3'>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.exchange_icon} alt="" />
        <p className='font-semibold'>Easy Exchange Policy</p>
        <p className='text-gray-400'>we offer hassle free policy </p>
        </div>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.quality_icon} alt="" />
        <p className='font-semibold'>14 Days Return Policy</p>
        <p className='text-gray-400'>we provide 14 dyas free return. </p>
        </div>
        <div>
        <img className='w-12 m-auto mb-5' src={assets.support_img} alt="" />
        <p className='font-semibold'>Best Customer Support</p>
        <p className='text-gray-400'>we provide 24/7 customer support </p>
        </div>
    </div>
  )
}

export default OurPolicy
