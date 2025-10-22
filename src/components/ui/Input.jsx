import { forwardRef } from 'react';

import { cn } from '../../lib/utils';

const Input = forwardRef(({ className, type = 'text', error, label, helperText, ...props }, ref) => {
  return (
    <div className="w-full">
      {label && (
        <label className="mb-2 block text-sm font-medium text-amber-900">
          {label}
          {props.required && <span className="ml-1 text-danger-500">*</span>}
        </label>
      )}
      <input
        type={type}
        ref={ref}
        className={cn(
          'w-full rounded-lg border bg-white px-4 py-2.5 text-amber-900 transition-all duration-200',
          'placeholder:text-amber-400',
          'focus:outline-hidden focus:ring-2 focus:ring-offset-1',
          error
            ? 'border-danger-300 focus:border-danger-500 focus:ring-danger-500'
            : 'border-amber-300 focus:border-amber-600 focus:ring-amber-500',
          'disabled:cursor-not-allowed disabled:bg-amber-50 disabled:text-amber-500',
          className
        )}
        {...props}
      />
      {helperText && !error && <p className="mt-1.5 text-sm text-amber-600">{helperText}</p>}
      {error && <p className="mt-1.5 text-sm text-danger-600">{error}</p>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
