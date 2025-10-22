import { forwardRef } from 'react';

import { cn } from '../../lib/utils';

const buttonVariants = {
  variant: {
    primary:
      'bg-linear-to-r from-amber-700 to-amber-800 text-white hover:from-amber-800 hover:to-amber-900 shadow-md hover:shadow-lg',
    secondary:
      'bg-linear-to-r from-amber-600 to-amber-700 text-white hover:from-amber-700 hover:to-amber-800 shadow-md hover:shadow-lg',
    outline: 'border-2 border-amber-700 text-amber-800 hover:bg-amber-50 hover:border-amber-800',
    ghost: 'text-amber-900 hover:bg-amber-100 hover:text-amber-950',
    danger:
      'bg-linear-to-r from-danger-600 to-danger-700 text-white hover:from-danger-700 hover:to-danger-800 shadow-md hover:shadow-lg',
    success:
      'bg-linear-to-r from-success-600 to-success-700 text-white hover:from-success-700 hover:to-success-800 shadow-md hover:shadow-lg',
  },
  size: {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-base',
    lg: 'px-6 py-3 text-lg',
    xl: 'px-8 py-4 text-xl',
  },
};

const Button = forwardRef(
  ({ className, variant = 'primary', size = 'md', disabled = false, loading = false, children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled || loading}
        className={cn(
          'inline-flex items-center justify-center gap-2 rounded-lg font-medium transition-all duration-200',
          'focus:outline-hidden focus:ring-2 focus:ring-amber-500 focus:ring-offset-2',
          'disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:shadow-none',
          'active:scale-95',
          buttonVariants.variant[variant],
          buttonVariants.size[size],
          className
        )}
        {...props}
      >
        {loading && (
          <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            />
          </svg>
        )}
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;
