import * as React from 'react';

import { cn } from '@/shared/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          'animate-pulse rounded-md bg-muted',
          'dark:bg-muted/70',
          className
        )}
        {...props}
      />
    );
  }
);
Skeleton.displayName = 'Skeleton';