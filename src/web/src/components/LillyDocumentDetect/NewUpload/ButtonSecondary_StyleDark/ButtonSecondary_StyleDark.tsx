import { memo } from 'react';
import type { FC, ReactNode } from 'react';


import classes from './ButtonSecondary_StyleDark.module.css';

interface Props {
  className?: string;
  text?: {
    label?: ReactNode;
  };
}
/* @figmaId 62:599 */
export const ButtonSecondary_StyleDark: FC<Props> = memo(function ButtonSecondary_StyleDark(props = {}) {
  return (
    <button className={`${classes.root}`}>
      {props.text?.label != null ? props.text?.label : <div className={classes.label}>Secondary</div>}
    </button>
  );
});
