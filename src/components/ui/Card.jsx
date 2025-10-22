import { cn } from '../../lib/utils';

export default function Card({ children, className, hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-xl bg-white p-6 shadow-soft transition-all duration-300',
        'border border-slate-200/50',
        hover && 'hover:-translate-y-1 hover:shadow-medium cursor-pointer',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}

export function CardHeader({ children, className, ...props }) {
  return (
    <div className={cn('mb-4', className)} {...props}>
      {children}
    </div>
  );
}

export function CardTitle({ children, className, ...props }) {
  return (
    <h3 className={cn('text-xl font-semibold text-slate-900', className)} {...props}>
      {children}
    </h3>
  );
}

export function CardDescription({ children, className, ...props }) {
  return (
    <p className={cn('mt-1 text-sm text-slate-600', className)} {...props}>
      {children}
    </p>
  );
}

export function CardContent({ children, className, ...props }) {
  return (
    <div className={cn('', className)} {...props}>
      {children}
    </div>
  );
}

export function CardFooter({ children, className, ...props }) {
  return (
    <div className={cn('mt-4 flex items-center gap-2', className)} {...props}>
      {children}
    </div>
  );
}
