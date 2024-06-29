import { memo } from 'react';
import type { FC, ReactNode } from 'react';


import classes from './ArrowCircleRight.module.css';
import { ArrowCircleRightIcon } from './ArrowCircleRightIcon.tsx';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    icon?: ReactNode;
  };
}
/* @figmaId 317:341 */
export const ArrowCircleRight: FC<Props> = memo(function ArrowCircleRight(props = {}) {
  return (
    <div className={` ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.icon}>{props.swap?.icon || <ArrowCircleRightIcon className={classes.icon2} />}</div>
    </div>
  );
});
