import { memo, useState } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import classes from './InputLinearScale.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
}

export const InputLinearScale: FC<Props> = memo(function InputLinearScale(props = {}) {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);

  // Function to handle option click
  const handleOptionClick = (optionNumber: number) => {
    setSelectedOption(optionNumber);
  };

  // Function to determine the class name for each option
  const getOptionClassName = (optionNumber: number) => {
    return selectedOption === optionNumber ? `${classes.optionSelected}` : '';
  };

  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={`${classes.option} ${getOptionClassName(1)}`} onClick={() => handleOptionClick(1)}>
        <div className={classes._1}>1</div>
      </div>
      <div className={`${classes.option2} ${getOptionClassName(2)}`} onClick={() => handleOptionClick(2)}>
        <div className={classes._2}>2</div>
      </div>
      <div className={`${classes.option3} ${getOptionClassName(3)}`} onClick={() => handleOptionClick(3)}>
        <div className={classes._3}>3</div>
      </div>
      <div className={`${classes.option4} ${getOptionClassName(4)}`} onClick={() => handleOptionClick(4)}>
        <div className={classes._4}>4</div>
      </div>
      <div className={`${classes.option5} ${getOptionClassName(5)}`} onClick={() => handleOptionClick(5)}>
        <div className={classes._5}>5</div>
      </div>
    </div>
  );
});
