import { memo, SVGProps } from 'react';

const Rectangle360Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 659 907' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path d='M0 0H659V907H329.5H0V0Z' fill='#AC2E2E' />
  </svg>
);

const Memo = memo(Rectangle360Icon);
export { Memo as Rectangle360Icon };
