import { memo } from 'react';
import type { FC } from 'react';
import classes from './BigFrame.module.css';

interface Props {
  className?: string;
  pdfUrl: string | null;
  pdfMetadata: Record<string, string | null>;
  pdfSignatures: any[];
  imageCount: number;
  showInfoFrame?: boolean;
}

export const BigFrame: FC<Props> = memo(function BigFrame({
  className,
  pdfUrl,
  pdfMetadata,
  pdfSignatures,
  imageCount,
  showInfoFrame = true,
}) {
  return (
    <div className={`${classes.root} ${className}`}>
      {pdfUrl ? (
        <div className={classes.pdfContainer}>
          <iframe src={pdfUrl} className={classes.pdfIframe}></iframe>
          {showInfoFrame && (
            <div className={classes.pdfInfoFrame}>
              <p>PDF has been decomposed into {imageCount} images</p>
              <h4>Metadata:</h4>
              {Object.entries(pdfMetadata).map(([key, value]) => (
                <p key={key}><strong>{key}:</strong> {value}</p>
              ))}
              <h4>Signatures:</h4>
              {pdfSignatures.map((sig, index) => (
                <p key={index}>{JSON.stringify(sig)}</p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <p className={classes.placeholderText}>Image will appear here</p>
      )}
    </div>
  );
});
