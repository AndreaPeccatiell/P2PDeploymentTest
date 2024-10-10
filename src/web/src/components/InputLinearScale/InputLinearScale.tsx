import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './InputLinearScale.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
    option?: string;
    option2?: string;
    option3?: string;
    option4?: string;
    option5?: string;
  };
  text?: {
    _1?: JSX.Element;
    _2?: JSX.Element;
    _3?: JSX.Element;
    _4?: JSX.Element;
    _5?: JSX.Element;
  };
  onClick?: {
    _1?: () => void; // Assuming you want to handle clicks on the first option for now
    // You can extend this to _2, _3, etc., as needed
        _3?: () => void; // Assuming you want to handle clicks on the first option for now
    // You can extend this to _2, _3, etc., as needed
    _5?: () => void; // Assuming you want to handle clicks on the first option for now
    // You can extend this to _2, _3, etc., as needed
    _4?: () => void; // Assuming you want to handle clicks on the first option for now
    // You can extend this to _2, _3, etc., as needed
    _2?: () => void; // Assuming you want to handle clicks on the first option for now
    // You can extend this to _2, _3, etc., as needed
  };
}

/* @figmaId 260:1133 */
export const InputLinearScale: FC<Props> = memo(function InputLinearScale(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={`${props.classes?.option || ''} ${classes.option}`} onClick={props.onClick?._1}>
        {props.text?._1 != null ? props.text?._1 : <div className={classes._1}>1</div>}
      </div>
      <div className={`${props.classes?.option2 || ''} ${classes.option2}`} onClick={props.onClick?._2}>
        {props.text?._2 != null ? props.text?._2 : <div className={classes._2}>2</div>}
      </div>
      <div className={`${props.classes?.option3 || ''} ${classes.option3}`}>
        {props.text?._3 != null ? props.text?._3 : <div className={classes._3}>3</div>}
      </div>
      <div className={`${props.classes?.option4 || ''} ${classes.option4}`} onClick={props.onClick?._4}>
        {props.text?._4 != null ? props.text?._4 : <div className={classes._4}>4</div>}
      </div>
      <div className={`${props.classes?.option5 || ''} ${classes.option5}`} onClick={props.onClick?._5}>
        {props.text?._5 != null ? props.text?._5 : <div className={classes._5}>5</div>}
      </div>
    </div>
  );
});
