import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import { StarBackgroundIcon } from './StarBackgroundIcon.tsx';
import classes from './StarIcon_FillColorGray.module.css';

interface Props {
  className?: string;
  classes?: {
    star?: string;
    root?: string;
  };
}
/* @figmaId 285:435 */
export const StarIcon_FillColorGray: FC<Props> = memo(function StarIcon_FillColorGray(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.starBackground}>
        <StarBackgroundIcon className={classes.icon} />
      </div>
    </div>
  );
});
