import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'mint' | 'secondary' | 'outline' | 'ghost' | 'danger';
    size?: 'xs' | 'sm' | 'md' | 'lg';
    fullWidth?: boolean;
    loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ children, variant = 'primary', size = 'md', fullWidth, loading, className = '', disabled, ...props }, ref) => {

        const base = "btn font-semibold inline-flex items-center justify-center select-none focus-visible:ring-2";

        const variants: Record<string, string> = {
            primary: 'btn-primary text-white',
            mint: 'btn-mint text-white',
            secondary: 'bg-pastel-surface text-slate-700 border border-pastel-border hover:bg-white hover:shadow-sm',
            outline: 'bg-transparent border-2 border-pastel-border text-slate-600 hover:border-pastel-coral hover:text-pastel-coral hover:bg-white/50',
            ghost: 'btn-ghost text-slate-600',
            danger: 'bg-red-50 text-red-500 border border-red-200 hover:bg-red-100',
        };

        const sizes: Record<string, string> = {
            xs: 'h-7 px-3 text-xs gap-1',
            sm: 'h-9 px-4 text-sm gap-1.5',
            md: 'h-11 px-5 text-sm gap-2',
            lg: 'h-13 px-7 text-base gap-2.5',
        };

        const classes = [
            base,
            variants[variant],
            sizes[size],
            fullWidth ? 'w-full' : '',
            (disabled || loading) ? 'opacity-50 pointer-events-none' : '',
            className,
        ].filter(Boolean).join(' ');

        return (
            <button
                ref={ref}
                className={classes}
                disabled={disabled || loading}
                {...props}
            >
                {loading ? (
                    <>
                        <svg className="animate-spin w-4 h-4 opacity-80" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        Aguarde...
                    </>
                ) : children}
            </button>
        );
    }
);

Button.displayName = 'Button';
export default Button;
