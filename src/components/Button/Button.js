"use client";

import * as React from 'react';
import { Loader2 } from 'lucide-react'; // Assuming lucide-react is installed
import { Button as ShadcnButton, buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export const Button = ({
  children,
  variant = 'primary', // 'primary', 'secondary', 'danger'
  size = 'medium',    // 'small', 'medium', 'large'
  disabled = false,
  isLoading = false,
  icon = null,
  trailingIcon = null,
  className, // Allow additional classes to be passed
  ...props
}) => {
  // Map old variants to ShadCN variants
  const shadcnVariant = {
    primary: 'default',
    secondary: 'outline',
    danger: 'destructive',
  }[variant] || 'default';

  // Map old sizes to ShadCN sizes
  const shadcnSize = {
    small: 'sm',
    medium: 'default',
    large: 'lg',
  }[size] || 'default';

  return (
    <ShadcnButton
      variant={shadcnVariant}
      size={shadcnSize}
      disabled={disabled || isLoading}
      className={cn(className)} // Apply any additional classes
      {...props}
    >
      {isLoading ? (
        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
      ) : (
        icon && <span className="mr-2">{icon}</span>
      )}
      {children}
      {!isLoading && trailingIcon && (
        <span className="ml-2">{trailingIcon}</span>
      )}
    </ShadcnButton>
  );
};

// Note: PropTypes are removed as per typical ShadCN integration,
// relying on TypeScript or JSDoc for type checking if needed.
// If PropTypes are still desired, they would need to be updated
// to reflect the new props and variants.
