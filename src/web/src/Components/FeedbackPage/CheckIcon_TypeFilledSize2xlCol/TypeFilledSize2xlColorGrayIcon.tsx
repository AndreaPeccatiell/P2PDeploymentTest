import { memo, SVGProps } from 'react';

const TypeFilledSize2xlColorGrayIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 16 10' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0.5 5L5.5 10L15.5 0' stroke='white' strokeWidth={3.33333} strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

const Memo = memo(TypeFilledSize2xlColorGrayIcon);
export { Memo as TypeFilledSize2xlColorGrayIcon };
