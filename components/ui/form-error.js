import classes from './form-error.module.css';

const FormError = ({ errorMessage }) => {
  return <div className={classes.error}>{errorMessage}</div>;
};

export default FormError;
