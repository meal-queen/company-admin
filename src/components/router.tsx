import { FC, useEffect, useState } from 'react';
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from '../pages/home';
import axios from 'axios';
import { getCookie } from '../utils/cookies';
import Signup from '../pages/signup';
import Login from '../pages/login';

const Routers: FC = () => {
  const location = useLocation();
  const [user, setUser] = useState();

  useEffect(() => {
    axios('/api/auth/@me', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${getCookie('auth_token')}`,
      },
    })
      .then((res) => {
        setUser(res.data.data);
        if (location.pathname.startsWith('/auth')) window.location.href = '/';
      })
      .catch((err) => {
        if (!location.pathname.startsWith('/auth'))
          window.location.href = '/auth/login';
        console.log(err.error);
      });
  }, []);

  return (
    <Routes location={location} key={location.key}>
      {user == null ? (
        <>
          <Route path="/auth/login" element={<Login />} />
          <Route path="/auth/signup" element={<Signup />} />
        </>
      ) : (
        <>
          <Route path="/" element={<Home />} />
          <Route path="/:page" element={<Home />} />
        </>
      )}
    </Routes>
  );
};

export default Routers;
