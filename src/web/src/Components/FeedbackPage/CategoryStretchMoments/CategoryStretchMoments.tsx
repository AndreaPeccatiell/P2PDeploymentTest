import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryStretchMoments.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryStretchMoments?: ReactNode;
  };
}
/* @figmaId 264:170 */
export const CategoryStretchMoments: FC<Props> = memo(function CategoryStretchMoments(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryStretchMoments != null ? (
        props.text?.categoryStretchMoments
      ) : (
        <div className={classes.categoryStretchMoments}>🔥 Stretch moments</div>
      )}
    </div>
  );
});
