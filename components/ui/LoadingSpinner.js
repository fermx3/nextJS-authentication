import classes from './LoadingSpinner.module.css';

const LoadingSpinner = ({ light }) => {
  return (
    <div className={`${classes.loader} ${light && classes.light}`}>
      <div></div>
      <div></div>
      <div></div>
      <div></div>
    </div>
  );
};

export default LoadingSpinner;
