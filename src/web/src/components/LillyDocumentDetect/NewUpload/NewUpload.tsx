import { memo } from 'react';
import type { FC } from 'react';


import { Group5Icon } from './Group5Icon.tsx';
import classes from './NewUpload.module.css';
import { Toggle_StateLeft } from './Toggle_StateLeft/Toggle_StateLeft.tsx';

interface Props {
  className?: string;
}
/* @figmaId 87:35 */
export const NewUpload: FC<Props> = memo(function NewUpload() {
  return (
    <div className={` ${classes.root}`}>
      <div className={classes.bg}></div>
      <Toggle_StateLeft className={classes.toggle} />
      <div className={classes.group5}>
        <Group5Icon className={classes.icon} />
      </div>
      <div className={classes.dragArea}>
        <div className={classes.wrap}>
          <div className={classes.clickToBrowseOrDragAndDropYour}>
            <div className={classes.textBlock}>Click to browse or </div>
            <div className={classes.textBlock2}>drag and drop your files</div>
          </div>
        </div>
      </div>
      <div className={classes.li}></div>
    </div>
  );
});
