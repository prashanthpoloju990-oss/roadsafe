import React from 'react';
import { motion, HTMLMotionProps } from 'motion/react';

export interface IconButtonProps extends Omit<HTMLMotionProps<'button'>, 'children'> {
  icon: React.ReactNode;
  'aria-label': string;
  variant?: 'primary' | 'secondary' | 'ghost' | 'emergency';
  size?: 'sm' | 'md' | 'lg';
}

export const IconButton = React.forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      'aria-label': ariaLabel,
      variant = 'secondary',
      size = 'md',
      className = '',
      disabled,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      sm: 'w-8 h-8 rounded-md',
      md: 'w-10 h-10 rounded-lg',
      lg: 'w-12 h-12 rounded-lg',
    };

    const variantMap = {
      primary: 'bg-[#141517] text-white hover:bg-[#25282F]',
      secondary: 'bg-white text-[#141517] border border-[#E2E0D8] hover:bg-[#F4F3EE] hover:border-[#CEC9BD]',
      ghost: 'bg-transparent text-[#585A62] hover:text-[#141517] hover:bg-[#EFEFEA]',
      emergency: 'bg-[#C92A2A] text-white hover:bg-[#B02525]',
    };

    return (
      <motion.button
        ref={ref}
        whileTap={{ scale: disabled ? 1 : 0.94 }}
        transition={{ duration: 0.15 }}
        aria-label={ariaLabel}
        title={ariaLabel}
        disabled={disabled}
        className={`inline-flex items-center justify-center shrink-0 cursor-pointer focus-visible:outline-2 focus-visible:outline-[#141517] focus-visible:outline-offset-2 transition-colors disabled:opacity-40 disabled:cursor-not-allowed ${sizeMap[size]} ${variantMap[variant]} ${className}`}
        {...props}
      >
        {icon}
      </motion.button>
    );
  }
);

IconButton.displayName = 'IconButton';
