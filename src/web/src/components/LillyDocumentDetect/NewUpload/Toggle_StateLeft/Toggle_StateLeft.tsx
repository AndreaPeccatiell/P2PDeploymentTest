import { memo } from 'react';
import type { FC } from 'react';


import { ButtonSecondary_StyleDark } from '../ButtonSecondary_StyleDark/ButtonSecondary_StyleDark.tsx';
import { ButtonSecondary_StyleLight } from '../ButtonSecondary_StyleLight/ButtonSecondary_StyleLight.tsx';
import classes from './Toggle_StateLeft.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
}
/* @figmaId 62:689 */
export const Toggle_StateLeft: FC<Props> = memo(function Toggle_StateLeft(props = {}) {
  return (
    <div className={` ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      <ButtonSecondary_StyleDark
        text={{
          label: <div className={classes.label}>New Upload</div>,
        }}
      />
      <ButtonSecondary_StyleLight
        text={{
          label: <div className={classes.label2}>Recent</div>,
        }}
      />
    </div>
  );
});
