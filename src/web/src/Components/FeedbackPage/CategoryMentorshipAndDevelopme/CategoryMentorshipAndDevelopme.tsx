import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryMentorshipAndDevelopme.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryMentorshipAndDevelopme?: ReactNode;
  };
}
/* @figmaId 264:162 */
export const CategoryMentorshipAndDevelopme: FC<Props> = memo(function CategoryMentorshipAndDevelopme(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryMentorshipAndDevelopme != null ? (
        props.text?.categoryMentorshipAndDevelopme
      ) : (
        <div className={classes.categoryMentorshipAndDevelopme}>📖 Mentorship &amp; development</div>
      )}
    </div>
  );
});
