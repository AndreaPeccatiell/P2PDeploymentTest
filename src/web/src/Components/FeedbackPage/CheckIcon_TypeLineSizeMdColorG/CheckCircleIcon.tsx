import { memo, SVGProps } from 'react';

const CheckCircleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M6.75 12L10.25 15.5L17.25 8.5M23.6667 12C23.6667 18.4433 18.4433 23.6667 12 23.6667C5.55668 23.6667 0.333333 18.4433 0.333333 12C0.333333 5.55668 5.55668 0.333333 12 0.333333C18.4433 0.333333 23.6667 5.55668 23.6667 12Z'
      stroke='#475467'
      strokeWidth={2.33333}
      strokeLinecap='round'
      strokeLinejoin='round'
    />
  </svg>
);

const Memo = memo(CheckCircleIcon);
export { Memo as CheckCircleIcon };
