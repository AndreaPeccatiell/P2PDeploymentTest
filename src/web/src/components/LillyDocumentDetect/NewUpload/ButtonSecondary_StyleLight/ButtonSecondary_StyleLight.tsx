import { memo } from 'react';
import type { FC, ReactNode } from 'react';


import classes from './ButtonSecondary_StyleLight.module.css';

interface Props {
  className?: string;
  text?: {
    label?: ReactNode;
  };
}
/* @figmaId 62:601 */
export const ButtonSecondary_StyleLight: FC<Props> = memo(function ButtonSecondary_StyleLight(props = {}) {
  return (
    <button className={` ${classes.root}`}>
      {props.text?.label != null ? props.text?.label : <div className={classes.label}>Secondary</div>}
    </button>
  );
});
