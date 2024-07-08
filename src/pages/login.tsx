import { FC, SetStateAction, useState, useRef, FormEvent } from 'react';
import loginStyle from './login.module.css';
import axios from 'axios';
import toast from 'react-hot-toast';
import { setCookie } from '../utils/cookies';
import { useNavigate } from 'react-router-dom';

const Login: FC = () => {
  const navigate = useNavigate();
  const [id, setId] = useState('');
  const [pw, setPw] = useState('');

  const idInputRef = useRef<HTMLInputElement>(null);
  const pwInputRef = useRef<HTMLInputElement>(null);

  const handleId = (e: { target: { value: SetStateAction<string> } }) => {
    setId(e.target.value);
  };

  const handlePw = (e: { target: { value: SetStateAction<string> } }) => {
    setPw(e.target.value);
  };

  const handleIdKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      if (pwInputRef.current) pwInputRef.current.focus();
    }
  };

  const loginSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    axios('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      data: {
        username: id,
        password: pw,
      },
    })
      .then((res) => {
        setCookie('auth_token', res.data.data, { path: '/' });
        window.location.href = '/';
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  };

  return (
    <form className={loginStyle.page} onSubmit={loginSubmit}>
      <div className={loginStyle.titleWrap}>Login</div>
      <div className={loginStyle.contentWrap}>
        <div className={loginStyle.inputTitleId}>ID</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={idInputRef}
            type="text"
            className={loginStyle.input}
            placeholder="ID"
            value={id}
            onChange={handleId}
            onKeyDown={handleIdKeyDown}
          />
        </div>
        <div className={loginStyle.inputTitlePw}>PASSWORD</div>
        <div className={loginStyle.inputWrap}>
          <input
            ref={pwInputRef}
            type="password"
            className={loginStyle.input}
            placeholder="PASSWORD"
            value={pw}
            onChange={handlePw}
          />
        </div>
        <div className={loginStyle.navSignupWrap}>
          <div
            className={loginStyle.navSignupText}
            onClick={() => {
              navigate('/auth/signup');
            }}
          >
            signup
          </div>
        </div>
      </div>
      <div>
        <input
          type="submit"
          className={loginStyle.bottomButton}
          value={'Submit'}
        />
      </div>
    </form>
  );
};

export default Login;
