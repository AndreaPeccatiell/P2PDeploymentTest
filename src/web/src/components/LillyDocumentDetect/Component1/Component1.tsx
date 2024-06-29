import { memo } from 'react';
import type { FC, ReactNode } from 'react';


import classes from './Component1.module.css';
import { VectorIcon } from './VectorIcon.tsx';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    author?: ReactNode;
  };
}
/* @figmaId 1:44 */
export const Component1: FC<Props> = memo(function Component1(props = {}) {
  return (
    <div className={`${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.author != null ? (
        props.text?.author
      ) : (
        <div className={classes.author}>
          <p className={classes.labelWrapper}>Author</p>
        </div>
      )}
      <div className={classes.rectangle366}></div>
      <div className={classes.vector}>
        <VectorIcon className={classes.icon} />
      </div>
    </div>
  );
});
