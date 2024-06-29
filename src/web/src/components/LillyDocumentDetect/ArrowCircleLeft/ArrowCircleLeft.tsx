import { memo } from 'react';
import type { FC, ReactNode } from 'react';


import classes from './ArrowCircleLeft.module.css';
import { ArrowCircleLeftIcon } from './ArrowCircleLeftIcon.tsx';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    icon?: ReactNode;
  };
}
/* @figmaId 317:346 */
export const ArrowCircleLeft: FC<Props> = memo(function ArrowCircleLeft(props = {}) {
  return (
    <div className={`${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.icon}>{props.swap?.icon || <ArrowCircleLeftIcon className={classes.icon2} />}</div>
    </div>
  );
});
