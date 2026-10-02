import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';
import { Loader2 } from 'lucide-react';

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'emergency';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  children?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      children,
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const baseStyles =
      'inline-flex items-center justify-center font-medium transition-colors select-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#141517] disabled:opacity-50 disabled:pointer-events-none cursor-pointer';

    const sizeStyles: Record<ButtonSize, string> = {
      sm: 'text-xs px-3 py-1.5 h-8 gap-1.5 rounded-lg',
      md: 'text-sm px-4 py-2 h-10 gap-2 rounded-lg',
      lg: 'text-sm sm:text-base px-5 py-2.5 h-11 sm:h-12 gap-2.5 rounded-lg',
    };

    const variantStyles: Record<ButtonVariant, string> = {
      primary:
        'bg-[#141517] text-white hover:bg-[#25282F] active:bg-[#0D0E10]',
      secondary:
        'bg-white text-[#141517] border border-[#E2E0D8] hover:bg-[#F4F3EE] hover:border-[#CEC9BD] shadow-[0_1px_2px_rgba(0,0,0,0.03)]',
      ghost:
        'bg-transparent text-[#585A62] hover:text-[#141517] hover:bg-[#EFEFEA]',
      emergency:
        'bg-[#C92A2A] text-white hover:bg-[#B02525] active:bg-[#961F1F] shadow-[0_1px_2px_rgba(201,42,42,0.15)]',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled || isLoading ? 1 : 0.98 }}
        transition={{ duration: 0.15, ease: 'easeOut' }}
        disabled={disabled || isLoading}
        className={`${baseStyles} ${sizeStyles[size]} ${variantStyles[variant]} ${className}`}
        {...props}
      >
        {isLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-current" />
        ) : (
          leftIcon && <span className="inline-flex shrink-0">{leftIcon}</span>
        )}
        <span className="truncate">{children}</span>
        {!isLoading && rightIcon && (
          <span className="inline-flex shrink-0">{rightIcon}</span>
        )}
      </motion.button>
    );
  }
);

Button.displayName = 'Button';
