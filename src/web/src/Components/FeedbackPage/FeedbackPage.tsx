import { memo } from 'react';
import type { FC } from 'react';

import resets from '../_resets.module.css';
import { CategoryTechnicalSkills } from './CategoryTechnicalSkills/CategoryTechnicalSkills.tsx';
import { CheckIcon_TypeLineSizeMdColorG } from './CheckIcon_TypeLineSizeMdColorG/CheckIcon_TypeLineSizeMdColorG.tsx';
import classes from './FeedbackPage.module.css';
import { Rectangle360Icon } from './Rectangle360Icon.tsx';
import { InputLinearScale } from './InputLinearScale/InputLinearScale.tsx';
import { TextElementsQuestionText } from './TextElementsQuestionText/TextElementsQuestionText.tsx';

interface Props {
  className?: string;
}

export const FeedbackPage: FC<Props> = memo(function FeedbackPage(props = {}) {
  const rules = Array.from({ length: 15 }, (_, i) => ({
    ruleNumber: i + 1,
    date: '01.10.21',
    description: 'Evaluate the differences in the emotional tone used between emails (e.g., professional, friendly).',

  }));

  return (
    <div className={`${resets.clapyResets} ${classes.root}`}>
      <div className={classes.rectangle360}>
        <Rectangle360Icon className={classes.icon5} />
      </div>
      <div className={classes.doNotEdit}>
        <div className={classes.sections}>
         
        </div>
        <div className={classes.titleInstructions}>
          <div className={classes.rules}>Rules</div>
          <div className={classes.useThisPageToScoreAndGiveFeedb}>
            Use this page to score and give feedback to the rules. Activate and deactivate based on your needs.
          </div>
        </div>
      </div>
      <div className={classes.frame7}>
        {rules.map((rule) => (
          <div key={rule.ruleNumber} className={classes.hypeItem1}>
            <CheckIcon_TypeLineSizeMdColorG />
            <div className={classes.rule}>{`Rule${rule.ruleNumber}`}</div>
            <div className={classes.date}>{rule.date}</div>
            <div className={classes.description}>{rule.description}</div>
            <CategoryTechnicalSkills
              className={classes.categoryTechnicalSkills}
              text={{
                categoryTechnicalSkills: <div className={classes.categoryTechnicalSkills}>{rule.category}</div>,
              }}
            />
          </div>
        ))}
      </div>

      <div className={classes.titleInstructions2}>
        <div className={classes.humanInTheLoop}>Human in the loop</div>
        <div className={classes.keepTheControlByAddingAndDeact}>
          Keep the control by adding and deactivating options
        </div>
      </div>

      <InputLinearScale className={classes.inputLinearScale} />
      <TextElementsQuestionText
        className={classes.textElementsQuestionText}
        text={{
          _1QuestionTextGoesHereOptionalE: (
            <div className={classes._1QuestionTextGoesHereOptionalE}>Add any feedback you think should be relevant</div>
          ),
        }}
      />
      <TextElementsQuestionText
        className={classes.textElementsQuestionText2}
        text={{
          _1QuestionTextGoesHereOptionalE: (
            <div className={classes._1QuestionTextGoesHereOptionalE2}>
              Which category of rules failed in your opinion?
            </div>
          ),
        }}
      />
      <div className={classes.rectangle370}></div>
    </div>
  );
});
