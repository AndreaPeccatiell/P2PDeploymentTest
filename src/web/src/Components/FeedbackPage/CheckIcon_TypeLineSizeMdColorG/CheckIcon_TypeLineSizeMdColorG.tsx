import { memo } from 'react';
import type { FC } from 'react';

import resets from '../../_resets.module.css';
import { CheckCircle } from '../CheckCircle/CheckCircle.tsx';
import { CheckCircleIcon } from './CheckCircleIcon.tsx';
import classes from './CheckIcon_TypeLineSizeMdColorG.module.css';

interface Props {
  className?: string;
  onClick?: () => void; // Add an onClick prop of type function
}
/* @figmaId 285:313 */
export const CheckIcon_TypeLineSizeMdColorG: FC<Props> = memo(function CheckIcon_TypeLineSizeMdColorG( {onClick}) {
  return (
    <div className={`${resets.clapyResets} ${classes.root}`} onClick={onClick}>
      <CheckCircle
        className={classes.checkCircle}
        swap={{
          icon: <CheckCircleIcon className={classes.icon} />,
        }}
      />
    </div>
  );
});
