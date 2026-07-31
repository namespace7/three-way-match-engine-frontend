import React, { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

export type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card: React.FC<CardProps> = ({ className, children, ...props }) => {
  return (
    <div
      className={cn(
        'rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-zinc-100 shadow-sm',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

export type CardHeaderProps = HTMLAttributes<HTMLDivElement>;

export const CardHeader: React.FC<CardHeaderProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex flex-col space-y-1.5 mb-4', className)} {...props}>
      {children}
    </div>
  );
};

export type CardTitleProps = HTMLAttributes<HTMLHeadingElement>;

export const CardTitle: React.FC<CardTitleProps> = ({ className, children, ...props }) => {
  return (
    <h3 className={cn('text-lg font-semibold tracking-tight text-zinc-100', className)} {...props}>
      {children}
    </h3>
  );
};

export type CardDescriptionProps = HTMLAttributes<HTMLParagraphElement>;

export const CardDescription: React.FC<CardDescriptionProps> = ({ className, children, ...props }) => {
  return (
    <p className={cn('text-sm text-zinc-400', className)} {...props}>
      {children}
    </p>
  );
};

export type CardContentProps = HTMLAttributes<HTMLDivElement>;

export const CardContent: React.FC<CardContentProps> = ({ className, children, ...props }) => {
  return <div className={cn('', className)} {...props}>{children}</div>;
};

export type CardFooterProps = HTMLAttributes<HTMLDivElement>;

export const CardFooter: React.FC<CardFooterProps> = ({ className, children, ...props }) => {
  return (
    <div className={cn('flex items-center mt-6 pt-4 border-t border-zinc-800', className)} {...props}>
      {children}
    </div>
  );
};

export default Card;
