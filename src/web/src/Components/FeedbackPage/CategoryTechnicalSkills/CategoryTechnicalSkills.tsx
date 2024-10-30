import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryTechnicalSkills.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryTechnicalSkills?: ReactNode;
  };
}
/* @figmaId 264:158 */
export const CategoryTechnicalSkills: FC<Props> = memo(function CategoryTechnicalSkills(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryTechnicalSkills != null ? (
        props.text?.categoryTechnicalSkills
      ) : (
        <div className={classes.categoryTechnicalSkills}>🛠 Technical skills</div>
      )}
    </div>
  );
});
