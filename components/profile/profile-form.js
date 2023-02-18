import { Fragment, useState } from 'react';
import FormMessage from '../ui/form-message';
import LoadingSpinner from '../ui/LoadingSpinner';
import SubmitButton from '../ui/SubmitButton';

import classes from './profile-form.module.css';

function ProfileForm() {
  const [newPassword, setNewPassword] = useState('');
  const [oldPassword, setOldPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage();
    setSuccessMessage();
    setIsLoading(true);

    const response = await fetch('/api/user/change-password', {
      method: 'PATCH',
      body: JSON.stringify({ oldPassword, newPassword }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      const currentError = data.message || 'Something went wrong!';
      setErrorMessage(currentError);
      setIsLoading(false);
    } else {
      setSuccessMessage(data.message);
      setNewPassword('');
      setOldPassword('');
      setIsLoading(false);
      setTimeout(() => {
        setSuccessMessage();
      }, 5000);
    }
  };

  return (
    <Fragment>
      <form className={classes.form} onSubmit={handleSubmit}>
        <div className={classes.control}>
          <label htmlFor='new-password'>New Password</label>
          <input
            type='password'
            id='new-password'
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            required
          />
        </div>
        <div className={classes.control}>
          <label htmlFor='old-password'>Old Password</label>
          <input
            type='password'
            id='old-password'
            value={oldPassword}
            onChange={(e) => setOldPassword(e.target.value)}
            required
          />
        </div>
        {errorMessage && <FormMessage errorMessage={errorMessage} />}
        {successMessage && <FormMessage successMessage={successMessage} />}
        <div className={classes.action}>
          <SubmitButton isLoading={isLoading}>Change Password</SubmitButton>
        </div>
      </form>
      {isLoading && <LoadingSpinner />}
    </Fragment>
  );
}

export default ProfileForm;
