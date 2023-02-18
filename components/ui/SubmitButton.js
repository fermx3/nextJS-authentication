import classes from './SubmitButton.module.css';

const SubmitButton = ({ children, light, isLoading }) => {
  return (
    <button
      className={` ${light ? classes.light : classes.button} ${
        isLoading ? classes.disabled : undefined
      }`}
      disabled={isLoading}
    >
      {children}
    </button>
  );
};

export default SubmitButton;
