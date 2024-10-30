import { memo, SVGProps } from 'react';

const CheckIconIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 12 8' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M0.75 4L4.25 7.5L11.25 0.5'
      stroke='white'
      strokeWidth={3.33333}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const Memo = memo(CheckIconIcon);
export { Memo as CheckIconIcon };
