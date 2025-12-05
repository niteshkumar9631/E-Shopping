import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useContext } from 'react';
import { ShopContext } from '../context/ShopContext';

const EmailVerify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { backendUrl } = useContext(ShopContext);

  useEffect(() => {
    const token = searchParams.get('token');

    const verifyEmail = async () => {
      if (!token) {
        toast.error('Verification token is missing.');
        navigate('/login');
        return;
      }

      try {
        const response = await axios.post(
          backendUrl + '/api/user/verify',
          {},
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        if (response.data.success) {
          toast.success('Email verified successfully. You can now log in.');
          navigate('/login');
        } else {
          toast.error(response.data.message || 'Verification failed.');
          navigate('/login');
        }
      } catch (error) {
        console.error(error);
        const message = error.response?.data?.message || error.message;
        toast.error(message);
        navigate('/login');
      }
    };

    verifyEmail();
  }, [backendUrl, navigate, searchParams]);

  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <p className="text-gray-700 text-lg">Verifying your email, please wait...</p>
    </div>
  );
};

export default EmailVerify;


