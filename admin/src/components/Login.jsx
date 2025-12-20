import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async (e) => {
    try {
      e.preventDefault();

      const response = await axios.post(
        backendUrl + '/api/user/admin',
        { email, password }
      );

      console.log("LOGIN RESPONSE:", response.data);

      if (response.data.success) {
        localStorage.setItem("adminToken", response.data.token);
        toast.success("Admin Login Successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-2'>Admin Panel</h1>

        {/* ❌ removed onSubmit */}
        <form>
          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
            <input
              onChange={(e) => setEmail(e.target.value)}
              value={email}
              className='rounded-md w-full px-3 py-2 border border-gray-200 outline-none'
              type="email"
              placeholder='Your@email.com'
              required
            />
          </div>

          <div className='mb-3 min-w-72'>
            <p className='text-sm font-medium text-gray-700 mb-2'>Password</p>
            <input
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              className='rounded-md w-full px-3 py-2 border border-gray-200 outline-none'
              type="password"
              placeholder='enter your password'
              required
            />
          </div>

          {/* ✅ explicit click handler */}
          <button
            type="button"
            onClick={onSubmitHandler}
            className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer'
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
