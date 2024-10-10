import { memo, SVGProps } from 'react';

const VectorIcon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 21 21' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M19.8704 4.56917C20.4193 3.41751 19.3759 2.14685 18.1394 2.46228L3.02883 6.30736C1.78829 6.6234 1.48292 8.24386 2.52229 8.99054L6.91551 12.1447L11.4833 8.3934C11.6896 8.22989 11.9519 8.15395 12.2136 8.18195C12.4754 8.20995 12.7157 8.33964 12.8827 8.54308C13.0498 8.74653 13.1303 9.00746 13.1068 9.26966C13.0834 9.53187 12.9579 9.77439 12.7574 9.94497L8.18958 13.6963L10.4299 18.6194C10.9592 19.784 12.6081 19.7986 13.1592 18.6442L19.8704 4.56917Z'
      fill='white'
    />
  </svg>
);

const Memo = memo(VectorIcon2);
export { Memo as VectorIcon2 };
