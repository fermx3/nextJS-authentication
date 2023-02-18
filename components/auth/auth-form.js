import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import FormMessage from '../ui/form-message';
import SubmitButton from '../ui/SubmitButton';

import classes from './auth-form.module.css';
import LoadingSpinner from '../ui/LoadingSpinner';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const router = useRouter();

  function switchAuthModeHandler() {
    setIsLogin((prevState) => !prevState);
  }

  const createUser = async (email, password) => {
    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      body: JSON.stringify({
        email,
        password,
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const currentError = data.message || 'Something went wrong!';
      setErrorMessage(currentError);
      throw new Error(currentError);
    }

    return data;
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage();
    setSuccessMessage();

    if (isLogin) {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (!result.error) {
        router.replace('/profile');
      } else {
        setErrorMessage(result.error);
        setIsLoading(false);
      }
    } else {
      try {
        const data = await createUser(email, password);
        setSuccessMessage(data.message);
        setIsLoading(false);
        setTimeout(() => {
          setIsLogin(true);
          setSuccessMessage();
        }, 3000);
      } catch (error) {
        setErrorMessage(error.message);
        setIsLoading(false);
      }
    }
  };

  return (
    <section className={classes.auth}>
      <h1>{isLogin ? 'Login' : 'Sign Up'}</h1>
      <form onSubmit={submitHandler}>
        <div className={classes.control}>
          <label htmlFor='email'>Your Email</label>
          <input
            type='email'
            id='email'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='password'>Your Password</label>
          <input
            type='password'
            id='password'
            minLength='7'
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {errorMessage && <FormMessage errorMessage={errorMessage} />}
        {successMessage && <FormMessage successMessage={successMessage} />}
        <div className={classes.actions}>
          <SubmitButton light isLoading={isLoading}>
            {isLogin ? 'Login' : 'Create Account'}
          </SubmitButton>
          {isLoading && <LoadingSpinner light />}
          {!isLoading && (
            <button
              type='button'
              className={classes.toggle}
              onClick={switchAuthModeHandler}
            >
              {isLogin ? 'Create new account' : 'Login with existing account'}
            </button>
          )}
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
