import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', size = 'md', fullWidth, className = '', ...props }, ref) => {

        const baseStyles = "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none rounded-[14px]";

        const variants = {
            primary: "bg-pastel-coral text-white hover:bg-opacity-90 shadow-sm focus:ring-pastel-coral ring-offset-pastel-cream",
            secondary: "bg-pastel-mint text-white hover:bg-opacity-90 shadow-sm focus:ring-pastel-mint ring-offset-pastel-cream",
            outline: "border-2 border-slate-200 text-slate-700 hover:bg-slate-50 focus:ring-slate-200",
            ghost: "text-slate-600 hover:bg-white/50 hover:text-slate-900 focus:ring-slate-200"
        };

        const sizes = {
            sm: "h-9 px-3 text-sm",
            md: "h-11 px-6 py-2 text-base",
            lg: "h-14 px-8 text-lg"
        };

        const classes = `${baseStyles} ${variants[variant]} ${sizes[size]} ${fullWidth ? 'w-full' : ''} ${className}`;

        return (
            <motion.button
                ref={ref}
                className={classes}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                {...props}
            >
                {children}
            </motion.button>
        );
    }
);

Button.displayName = 'Button';

export default Button;
