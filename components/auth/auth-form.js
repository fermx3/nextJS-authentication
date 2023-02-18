import { useState } from 'react';
import { useRouter } from 'next/router';
import { signIn } from 'next-auth/client';
import FormError from '../ui/form-error';
import classes from './auth-form.module.css';

function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState(false);

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
    setErrorMessage();

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
      }
    } else {
      try {
        const data = await createUser(email, password);
        console.log(data);
      } catch (error) {
        console.log(error);
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
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        {/* {session && <h1>Signed in!!!!</h1>} */}
        {errorMessage && <FormError errorMessage={errorMessage} />}
        <div className={classes.actions}>
          <button>{isLogin ? 'Login' : 'Create Account'}</button>
          <button
            type='button'
            className={classes.toggle}
            onClick={switchAuthModeHandler}
          >
            {isLogin ? 'Create new account' : 'Login with existing account'}
          </button>
        </div>
      </form>
    </section>
  );
}

export default AuthForm;
