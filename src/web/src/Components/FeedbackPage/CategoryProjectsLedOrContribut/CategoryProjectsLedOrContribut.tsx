import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryProjectsLedOrContribut.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryProjectsLedOrContribut?: ReactNode;
  };
}
/* @figmaId 264:160 */
export const CategoryProjectsLedOrContribut: FC<Props> = memo(function CategoryProjectsLedOrContribut(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryProjectsLedOrContribut != null ? (
        props.text?.categoryProjectsLedOrContribut
      ) : (
        <div className={classes.categoryProjectsLedOrContribut}>💻 Projects led or contributed to</div>
      )}
    </div>
  );
});
