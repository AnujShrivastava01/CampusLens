import React from 'react';
import { Button } from '@/components/ui/button';
import { useSmoothScrollContext } from './SmoothScrollProvider';

interface SmoothScrollButtonProps {
  to: string | number;
  children: React.ReactNode;
  className?: string;
  variant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  options?: Record<string, unknown>;
}

export const SmoothScrollButton: React.FC<SmoothScrollButtonProps> = ({
  to,
  children,
  className,
  variant = 'default',
  size = 'default',
  options = {},
}) => {
  const { scrollTo } = useSmoothScrollContext();

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    scrollTo(to, { duration: 1.5, ...options });
  };

  return (
    <Button
      onClick={handleClick}
      className={className}
      variant={variant}
      size={size}
    >
      {children}
    </Button>
  );
};
