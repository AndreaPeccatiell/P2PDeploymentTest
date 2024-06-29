import { memo, SVGProps } from 'react';

const Rectangle365Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 399 866' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M0 9.99999C0 4.47714 4.47715 0 10 0H389C394.523 0 399 4.47715 399 10V856C399 861.523 394.523 866 389 866H10C4.47716 866 0 861.523 0 856V9.99999Z'
      fill='#AC2E2E'
    />
  </svg>
);

const Memo = memo(Rectangle365Icon);
export { Memo as Rectangle365Icon };
