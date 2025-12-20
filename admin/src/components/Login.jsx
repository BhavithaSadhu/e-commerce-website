import axios from 'axios';
import React, { useState } from 'react';
import { backendUrl } from '../App';
import { toast } from 'react-toastify';

const Login = ({ setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const onSubmitHandler = async () => {
    try {
      const response = await axios.post(
        backendUrl + '/api/user/admin',
        { email, password }
      );

      if (response.data.success) {
        // ✅ set BOTH state + localStorage
        localStorage.setItem("adminToken", response.data.token);
        setToken(response.data.token);

        toast.success("Admin Login Successful");
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className='min-h-screen flex items-center justify-center w-full'>
      <div className='bg-white shadow-md rounded-lg px-8 py-6 max-w-md'>
        <h1 className='text-2xl font-bold mb-2'>Admin Panel</h1>

        <div className='mb-3 min-w-72'>
          <p className='text-sm font-medium text-gray-700 mb-2'>Email Address</p>
          <input
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            className='rounded-md w-full px-3 py-2 border border-gray-200 outline-none'
            type="email"
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
            required
          />
        </div>

        <button
          type="button"
          onClick={onSubmitHandler}
          className='mt-2 w-full py-2 px-4 rounded-md text-white bg-black cursor-pointer'
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
