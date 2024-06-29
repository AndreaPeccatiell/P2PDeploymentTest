import { memo, SVGProps } from 'react';

const VectorIcon2 = (props: SVGProps<SVGSVGElement>) => (
  <svg preserveAspectRatio='none' viewBox='0 0 14 14' fill='none' xmlns='http://www.w3.org/2000/svg' {...props}>
    <path
      d='M7.58532 11.1646C7.66361 11.2426 7.72572 11.3353 7.7681 11.4374C7.81048 11.5395 7.8323 11.6489 7.8323 11.7594C7.8323 11.8699 7.81048 11.9794 7.7681 12.0814C7.72572 12.1835 7.66361 12.2762 7.58532 12.3542L7.16967 12.7699C6.38203 13.5575 5.31377 14 4.19989 14C3.08601 14 2.01775 13.5575 1.23012 12.7699C0.442487 11.9822 0 10.914 0 9.80011C0 8.68623 0.442487 7.61797 1.23012 6.83033L2.91794 5.14322C3.67471 4.38457 4.69293 3.94399 5.76401 3.91173C6.83509 3.87946 7.87798 4.25796 8.67904 4.96968C8.76175 5.04319 8.82916 5.13228 8.87744 5.23185C8.92571 5.33141 8.95391 5.43952 8.9604 5.54998C8.9669 5.66044 8.95158 5.77111 8.91531 5.87565C8.87904 5.98019 8.82253 6.07656 8.74902 6.15927C8.67551 6.24197 8.58642 6.30939 8.48685 6.35766C8.38728 6.40594 8.27918 6.43413 8.16872 6.44063C8.05825 6.44712 7.94759 6.4318 7.84305 6.39553C7.73851 6.35926 7.64214 6.30276 7.55943 6.22924C7.07906 5.80262 6.45384 5.57566 5.81166 5.59478C5.16947 5.6139 4.55886 5.87766 4.10473 6.33211L2.41831 8.01712C1.9458 8.48963 1.68035 9.13048 1.68035 9.79871C1.68035 10.4669 1.9458 11.1078 2.41831 11.5803C2.89081 12.0528 3.53167 12.3182 4.19989 12.3182C4.86812 12.3182 5.50897 12.0528 5.98148 11.5803L6.39713 11.1646C6.47512 11.0866 6.56773 11.0246 6.66967 10.9824C6.77161 10.9401 6.88088 10.9184 6.99123 10.9184C7.10158 10.9184 7.21085 10.9401 7.31279 10.9824C7.41473 11.0246 7.50734 11.0866 7.58532 11.1646ZM12.7691 1.22807C11.9809 0.441651 10.9128 0 9.79936 0C8.68588 0 7.61786 0.441651 6.82958 1.22807L6.41393 1.64373C6.25618 1.80148 6.16756 2.01543 6.16756 2.23852C6.16756 2.46161 6.25618 2.67557 6.41393 2.83332C6.57168 2.99107 6.78563 3.07969 7.00872 3.07969C7.23181 3.07969 7.44577 2.99107 7.60352 2.83332L8.01917 2.41766C8.49168 1.94516 9.13253 1.67971 9.80076 1.67971C10.469 1.67971 11.1098 1.94516 11.5823 2.41766C12.0548 2.89017 12.3203 3.53102 12.3203 4.19924C12.3203 4.86747 12.0548 5.50832 11.5823 5.98083L9.89522 7.66865C9.44069 8.1229 8.82974 8.38628 8.18739 8.40488C7.54505 8.42349 6.91988 8.1959 6.43982 7.76871C6.35711 7.6952 6.26074 7.63869 6.1562 7.60242C6.05166 7.56615 5.941 7.55083 5.83053 7.55733C5.72007 7.56382 5.61197 7.59202 5.5124 7.64029C5.41283 7.68857 5.32374 7.75598 5.25023 7.83869C5.17671 7.92139 5.12021 8.01776 5.08394 8.12231C5.04767 8.22685 5.03235 8.33751 5.03885 8.44797C5.04534 8.55844 5.07354 8.66654 5.12181 8.76611C5.17009 8.86567 5.2375 8.95476 5.32021 9.02827C6.12072 9.73984 7.1629 10.1186 8.23348 10.087C9.30406 10.0553 10.3221 9.61579 11.0792 8.85823L12.767 7.17112C13.5544 6.38303 13.9968 5.31472 13.9972 4.20073C13.9976 3.08674 13.5559 2.01811 12.7691 1.22947V1.22807Z'
      fill='white'
    />
  </svg>
);

const Memo = memo(VectorIcon2);
export { Memo as VectorIcon2 };
