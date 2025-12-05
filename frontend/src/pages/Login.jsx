import React, { useState, useContext, useEffect } from 'react';
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {
  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext);

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');

  const onSubmitHandler = async (event) => {
    event.preventDefault();
    try {
      if (currentState === 'Sign Up') {
        const payload = { firstName, lastName, email, password };
        const response = await axios.post(backendUrl + '/api/user/register', payload);

        if (response.data.success) {
          toast.success('Registered successfully. Please verify your email.');
          setCurrentState('Login');
          setFirstName('');
          setLastName('');
          setEmail('');
          setPassword('');
        } else {
          toast.error(response.data.message);
        }
      } else {
        const response = await axios.post(backendUrl + '/api/user/login', { email, password });
        if (response.data.success) {
          // backend returns token (accessToken) for legacy flows
          const authToken = response.data.token;
          setToken(authToken);
          localStorage.setItem('token', authToken);

          toast.success('Login successful', {
            position: 'top-right',
            autoClose: 800,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
          });

          navigate('/');
        } else {
          toast.error(response.data.message);
        }
      }
    } catch (error) {
      console.error(error);
      const message = error.response?.data?.message || error.message;
      toast.error(message);
    }
  };

useEffect(() => {
  if (token) {
    setToken(token);
    navigate('/');
}
  }, [token, navigate, setToken]);

  return (
    <form
      onSubmit={onSubmitHandler}
      className="flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800"
    >
      <div className="inline-flex items-center gap-2 mb-2 mt-10">
        <p className="prata-regular text-3xl">{currentState}</p>
        <hr className="border-none h-[1.5px] w-8 bg-gray-800" />
      </div>

      {currentState === 'Sign Up' && (
        <div className="w-full flex gap-3">
          <input
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            className="w-full px-3 py-2 border border-gray-800 rounded-md"
            placeholder="First name"
            required
          />
        <input  
          type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
          className="w-full px-3 py-2 border border-gray-800 rounded-md"
            placeholder="Last name"
          required
        />
        </div>
      )}

      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800 rounded-md"
        placeholder="E-mail"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full px-3 py-2 border border-gray-800 rounded-md"
        placeholder="Password"
        required
      />

      <div className="w-full flex justify-between text-sm mt-[-8px]">
        <p className="cursor-pointer text-gray-600 hover:underline">
          Forgot your Password?
        </p>
        {currentState === 'Login' ? (
          <p
            onClick={() => setCurrentState('Sign Up')}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            Create account
          </p>
        ) : (
          <p
            onClick={() => setCurrentState('Login')}
            className="cursor-pointer text-gray-600 hover:underline"
          >
            Login Here
          </p>
        )}
      </div>

      <button className="bg-black text-white font-light px-8 py-2 mt-4">
        {currentState === 'Login' ? 'Sign In' : 'Sign Up'}
      </button>
    </form>
  );
};

export default Login;

