import React ,{useState}from 'react'

const Login = () => {
  const [currentState,setcurrentState]=useState('Sign Up');
  const onSubmitHandler = async(e)=>
  {
    e.preventDefault();
  }

  return (
    <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800' action="">
      <div className='inline-flex items-center gap-2 mb-2 mt-10'>
        <p className='prata-regular text-3xl'>{currentState}</p>
        <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
      </div>
      {currentState==='Login' ? '' :<input className='w-full px-3 py-2 border border-gray-800' type="text" placeholder='Name' required/>}
      <input className='w-full px-3 py-2 border border-gray-800' type="email" placeholder='Email' required/>
      <input className='w-full px-3 py-2 border border-gray-800' type="password" placeholder='Password' required/>
      <div className='w-full flex justify-between text-sm mt-[-8px]'>
        <p>Frogot Password</p>
        {
          currentState === 'Login' ?
          <p onClick={()=>setcurrentState('Sign Up')} className='cursor-pointer'>Create Account</p> :
          <p onClick={()=>setcurrentState('Login')} className='cursor-pointer'>Login Here</p>
        }
      </div>
      <button  className='bg-black text-white font-light px-8 py-2 mt-4 cursor-pointer hover:' >{currentState === 'Login' ? 'Sign In' :'Sign UP'}</button>
    </form>
  )
}

export default Login
