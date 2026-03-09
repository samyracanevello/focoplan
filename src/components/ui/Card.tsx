import React from 'react';

interface CardProps {
    children: React.ReactNode;
    className?: string;
    title?: string;
    action?: React.ReactNode;
    hover?: boolean;
    glass?: boolean;
    onClick?: () => void;
}

const Card = ({ children, className = '', title, action, hover = false, glass = false, onClick }: CardProps) => {
    return (
        <div onClick={onClick} className={`${glass ? 'card-glass' : 'card'} p-6 ${hover ? 'hover:-translate-y-0.5 hover:shadow-lg cursor-pointer' : ''} transition-all duration-300 ${className}`}>
            {(title || action) && (
                <div className="flex items-center justify-between mb-5">
                    {title && <h3 className="text-base font-bold text-slate-700 tracking-tight">{title}</h3>}
                    {action && <div>{action}</div>}
                </div>
            )}
            {children}
        </div>
    );
};

export default Card;
