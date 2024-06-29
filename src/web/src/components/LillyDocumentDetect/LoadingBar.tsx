import React from 'react';
import classes from './LoadingBar.module.css';

interface LoadingBarProps {
  show: boolean;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ show }) => {
  return (
    <div className={`${classes.loadingBar} ${show ? classes.show : ''}`}>
      <div className={classes.loadingBarProgress}>Processing...</div>
    </div>
  );
};

export default LoadingBar;
