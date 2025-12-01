import React from 'react'
import NewsLetterBox from '../components/NewsLetterBox'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const Contact = () => {
  return (
    <div>
      <div className='text-center text-2xl pt-10 border-t'>
        <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-28'>
        <img className='w-full md:max-w-[480px]' src={assets.contact_img} alt="" />

        <div className='flex flex-col justify-center items-start gap-6'>
          <b>Our Store</b>
          <div>
            <p>
              Street: xxxx <br />
              City: yyy <br />
              State: zzz <br />
              Country: India <br />
              Phone: +91 xxxxx xxxxx <br />
              Email: xxxxxx@gmail.com
            </p>
          </div>

          <b>Careers at Forever</b>
          <div>
            <p>Learn more about our teams and job openings.</p>

            <button className='border border-black px-4 py-2 mt-2 hover:bg-black hover:text-white transition'>
              Explore Jobs
            </button>
          </div>
        </div>
      </div>

      {/* Newsletter Section */}
      <NewsLetterBox />
    </div>
  )
}

export default Contact
