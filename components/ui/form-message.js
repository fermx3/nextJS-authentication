import classes from './form-message.module.css';

const FormMessage = ({ errorMessage, successMessage }) => {
  if (errorMessage) {
    return <div className={classes.error}>{errorMessage}</div>;
  }

  if (successMessage) {
    return <div className={classes.success}>{successMessage}</div>;
  }
};

export default FormMessage;
