import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import { StarBackgroundIcon } from './StarBackgroundIcon.tsx';
import { StarIcon } from './StarIcon.tsx';
import classes from './StarIcon_Fill100ColorYellow.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    star?: ReactNode;
  };
}
/* @figmaId 285:503 */
export const StarIcon_Fill100ColorYellow: FC<Props> = memo(function StarIcon_Fill100ColorYellow(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.starBackground}>
        <StarBackgroundIcon className={classes.icon} />
      </div>
      <div className={classes.star}>{props.swap?.star || <StarIcon className={classes.icon2} />}</div>
    </div>
  );
});
