import { memo } from 'react';
import type { FC, ReactNode } from 'react';

import resets from '../../_resets.module.css';
import classes from './TextElementsQuestionText.module.css';

interface Props {
  className?: string;
  classes?: {
    root?: string;
  };
  text?: {
    _1QuestionTextGoesHereOptionalE?: ReactNode;
  };
}
/* @figmaId 260:1129 */
export const TextElementsQuestionText: FC<Props> = memo(function TextElementsQuestionText(props = {}) {
  return (
    <div className={`${resets.clapyResets} ${props.classes?.root || ''} ${props.className || ''} ${classes.root}`}>
      {props.text?._1QuestionTextGoesHereOptionalE != null ? (
        props.text?._1QuestionTextGoesHereOptionalE
      ) : (
        <div className={classes._1QuestionTextGoesHereOptionalE}>
          <p className={classes.labelWrapper}>
            <span className={classes.label}>1.Question text goes here. </span>
            <span className={classes.label2}>Optional explainer text</span>
          </p>
        </div>
      )}
    </div>
  );
});
