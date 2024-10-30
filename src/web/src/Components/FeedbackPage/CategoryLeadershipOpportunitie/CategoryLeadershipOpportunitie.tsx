import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './CategoryLeadershipOpportunitie.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    categoryLeadershipOpportunitie?: ReactNode;
  };
}
/* @figmaId 264:164 */
export const CategoryLeadershipOpportunitie: FC<Props> = memo(function CategoryLeadershipOpportunitie(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?.categoryLeadershipOpportunitie != null ? (
        props.text?.categoryLeadershipOpportunitie
      ) : (
        <div className={classes.categoryLeadershipOpportunitie}>🚀 Leadership opportunities</div>
      )}
    </div>
  );
});
