import type { SVGProps } from 'react';

import { catalogCategoryMap } from '@/catalog';
import type { TaskCategory } from '@/types/trip';

type CategoryIconProps = SVGProps<SVGSVGElement> & {
  category: TaskCategory | 'comfort_extras';
};

const baseProps = {
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
} as const;

export const CategoryIcon = ({
  category,
  className = 'h-4 w-4',
  ...props
}: CategoryIconProps) => {
  const icon =
    category === 'comfort_extras'
      ? 'sparkles'
      : catalogCategoryMap[category].icon;

  switch (icon) {
    case 'wallet':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="M8 8V6.75A3.75 3.75 0 0 1 11.75 3h.5A3.75 3.75 0 0 1 16 6.75V8" />
          <path d="M6.5 8.5h11A1.5 1.5 0 0 1 19 10v8.25A1.75 1.75 0 0 1 17.25 20h-10.5A1.75 1.75 0 0 1 5 18.25V10A1.5 1.5 0 0 1 6.5 8.5Z" />
          <path d="M10 12.5h4" />
        </svg>
      );
    case 'tent':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="M3.5 19 12 5l8.5 14" />
          <path d="M7.5 19 12 12l4.5 7" />
          <path d="M12 5v14" />
        </svg>
      );
    case 'utensils':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="M7 4.5v8" />
          <path d="M5.5 4.5v4.25M8.5 4.5v4.25" />
          <path d="M7 12.5V19" />
          <path d="M15.5 4.5c1.5 1.5 1.5 4 0 5.5l-1 1v8" />
        </svg>
      );
    case 'layers':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="m8 5 2.25 2h3.5L16 5l3 2.25-1.75 3V19H6.75v-8.5L5 7.25 8 5Z" />
        </svg>
      );
    case 'compass':
      return (
        <svg {...baseProps} {...props} className={className}>
          <circle cx="12" cy="12" r="7.5" />
          <path d="m10 14 2-6 2 2-4 4Z" />
        </svg>
      );
    case 'shield':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="M12 4 18 6.5v4.75c0 4.2-2.65 6.6-6 8.75-3.35-2.15-6-4.55-6-8.75V6.5L12 4Z" />
          <path d="M12 8.5v6M9 11.5h6" />
        </svg>
      );
    case 'droplet':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="M12 4.25c2.5 3 4.5 5.2 4.5 8a4.5 4.5 0 0 1-9 0c0-2.8 2-5 4.5-8Z" />
          <path d="m17.5 5.5.4.9.9.4-.9.4-.4.9-.4-.9-.9-.4.9-.4.4-.9Z" />
        </svg>
      );
    case 'paw':
      return (
        <svg {...baseProps} {...props} className={className}>
          <circle cx="8" cy="9" r="1.5" />
          <circle cx="12" cy="7" r="1.5" />
          <circle cx="16" cy="9" r="1.5" />
          <path d="M9 15.5c0-1.7 1.35-3 3-3s3 1.3 3 3c0 1.45-1.15 2.5-3 2.5s-3-1.05-3-2.5Z" />
        </svg>
      );
    case 'sparkles':
      return (
        <svg {...baseProps} {...props} className={className}>
          <path d="m12 4 1.4 3.35L17 8.75l-2.75 2.3.9 3.45L12 12.7 8.85 14.5l.9-3.45L7 8.75l3.6-1.4L12 4Z" />
        </svg>
      );
    default:
      return null;
  }
};
