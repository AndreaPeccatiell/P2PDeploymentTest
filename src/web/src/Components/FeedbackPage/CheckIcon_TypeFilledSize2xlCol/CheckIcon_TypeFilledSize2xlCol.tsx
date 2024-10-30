import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CheckIcon_TypeFilledSize2xlCol.module.css';
import { TypeFilledSize2xlColorGrayIcon } from './TypeFilledSize2xlColorGrayIcon.tsx';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  swap?: {
    icon?: ReactNode;
  };
}
/* @figmaId 285:365 */
export const CheckIcon_TypeFilledSize2xlCol: FC<Props> = memo(function CheckIcon_TypeFilledSize2xlCol(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <div className={classes.icon}>
        {props.swap?.icon || <TypeFilledSize2xlColorGrayIcon className={classes.icon2} />}
      </div>
    </div>
  );
});
