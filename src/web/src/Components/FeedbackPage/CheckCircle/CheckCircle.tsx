import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CheckCircle.module.css';
import { CheckCircleIcon } from './CheckCircleIcon.tsx';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    icon?: ReactNode;
  };
}
/* @figmaId 285:262 */
export const CheckCircle: FC<Props> = memo(function CheckCircle(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.icon}>{props.swap?.icon || <CheckCircleIcon className={classes.icon2} />}</div>
    </div>
  );
});
