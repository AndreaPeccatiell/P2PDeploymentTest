import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryDiscussionContribution.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryDiscussionContribution?: ReactNode;
  };
}
/* @figmaId 264:166 */
export const CategoryDiscussionContribution: FC<Props> = memo(function CategoryDiscussionContribution(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryDiscussionContribution != null ? (
        props.text?.categoryDiscussionContribution
      ) : (
        <div className={classes.categoryDiscussionContribution}>🗣 Discussion contributions</div>
      )}
    </div>
  );
});
