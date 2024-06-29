import React from 'react';
import classes from './Arrow.module.css';

const Arrow: React.FC = () => {
  return (
    <div className={classes.arrow}>
      <span>⇆</span> {/* Unicode arrow symbol */}
    </div>
  );
};

export default Arrow;
