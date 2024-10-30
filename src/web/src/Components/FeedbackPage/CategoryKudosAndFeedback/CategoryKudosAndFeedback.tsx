import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryKudosAndFeedback.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryKudosAndFeedback?: ReactNode;
  };
}
/* @figmaId 264:168 */
export const CategoryKudosAndFeedback: FC<Props> = memo(function CategoryKudosAndFeedback(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryKudosAndFeedback != null ? (
        props.text?.categoryKudosAndFeedback
      ) : (
        <div className={classes.categoryKudosAndFeedback}>🎉 Kudos &amp; feedback</div>
      )}
    </div>
  );
});
