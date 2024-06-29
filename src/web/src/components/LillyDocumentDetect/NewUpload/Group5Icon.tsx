import { memo, SVGProps } from 'react';

const Group5Icon = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 36 36' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <rect x={10} y={13.1333} width={16} height={1.06667} rx={0.533333} fill='black' />
    <rect x={10} y={21.1333} width={16} height={1.06667} rx={0.533333} fill='black' />
    <circle cx={20.6667} cy={21.6667} r={2.66667} fill='white' stroke='black' strokeWidth={1.6} />
    <circle cx={16.0848} cy={13.6667} r={2.66667} fill='white' stroke='black' strokeWidth={1.6} />
    <circle cx={18} cy={18} r={18} stroke='#EBEFF2' />
  </svg>
);

const Memo = memo(Group5Icon);
export { Memo as Group5Icon };
