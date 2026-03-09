/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            colors: {
                // Core pastel palette — inspired by reference images
                pastel: {
                    cream: '#FAF7F4',  // warm off-white background
                    snow: '#FFFFFF',  // pure white cards
                    blush: '#F2B8C6',  // rose pink
                    peach: '#F8C9A0',  // warm peach/orange
                    coral: '#EE9090',  // salmon coral
                    mint: '#8FC4B0',  // sage green
                    lavender: '#C9C0DE',  // soft purple
                    sky: '#A8CEDD',  // cool blue
                    amber: '#F5C771',  // warm yellow
                    surface: '#F5F1EC',  // card bg light
                    border: '#EDE8E2',  // subtle borders — bg-pastel-border, border-pastel-border
                    muted: '#B8AFA8',  // muted text — text-pastel-muted
                },
                // slate override for softer tones
            },
            backgroundImage: {
                // Hero gradients
                'gradient-blush-mint': 'linear-gradient(135deg, #F2B8C6 0%, #F8C9A0 50%, #8FC4B0 100%)',
                'gradient-blush-peach': 'linear-gradient(135deg, #F2B8C6 0%, #F8C9A0 100%)',
                'gradient-blush-lavender': 'linear-gradient(135deg, #F2B8C6 0%, #C9C0DE 100%)',
                'gradient-mint-sky': 'linear-gradient(135deg, #8FC4B0 0%, #A8CEDD 100%)',
                'gradient-peach-coral': 'linear-gradient(135deg, #F8C9A0 0%, #EE9090 100%)',
                'gradient-lavender-sky': 'linear-gradient(135deg, #C9C0DE 0%, #A8CEDD 100%)',
                'gradient-cream-peach': 'linear-gradient(160deg, #FAF7F4 0%, #F8C9A0 100%)',

                // Background canvas
                'app-bg': 'linear-gradient(160deg, #FAF7F4 0%, #F5EFE9 40%, #EEE8F0 100%)',

                // Wave-like organic blob gradients (card accents)
                'wave-mint': 'radial-gradient(ellipse at 20% 80%, rgba(143,196,176,0.35) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(168,206,221,0.25) 0%, transparent 60%)',
                'wave-peach': 'radial-gradient(ellipse at 20% 80%, rgba(248,201,160,0.40) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(238,144,144,0.20) 0%, transparent 60%)',
                'wave-blush': 'radial-gradient(ellipse at 20% 80%, rgba(242,184,198,0.40) 0%, transparent 60%), radial-gradient(ellipse at 80% 20%, rgba(201,192,222,0.25) 0%, transparent 60%)',
            },
            boxShadow: {
                'xs': '0 1px 3px rgba(0,0,0,0.04)',
                'sm': '0 2px 8px rgba(0,0,0,0.06)',
                'md': '0 4px 20px rgba(0,0,0,0.07)',
                'lg': '0 8px 40px rgba(0,0,0,0.08)',
                'xl': '0 16px 60px rgba(0,0,0,0.10)',
                'card': '0 2px 20px rgba(0,0,0,0.05), 0 0 0 1px rgba(255,255,255,0.6) inset',
                'card-hover': '0 8px 40px rgba(0,0,0,0.09), 0 0 0 1px rgba(255,255,255,0.7) inset',
                'btn': '0 2px 10px rgba(0,0,0,0.10)',
                'btn-primary': '0 4px 15px rgba(238,144,144,0.35)',
                'btn-mint': '0 4px 15px rgba(143,196,176,0.35)',
                'float': '0 20px 60px rgba(0,0,0,0.12)',
                'glow-mint': '0 0 24px rgba(143,196,176,0.40)',
                'glow-blush': '0 0 24px rgba(242,184,198,0.40)',
                'inner': 'inset 0 1px 3px rgba(0,0,0,0.04)',
            },
            borderRadius: {
                'xl': '16px',
                '2xl': '20px',
                '3xl': '28px',
                '4xl': '36px',
            },
            keyframes: {
                'float': {
                    '0%, 100%': { transform: 'translateY(0px)' },
                    '50%': { transform: 'translateY(-6px)' },
                },
                'pulse-soft': {
                    '0%, 100%': { opacity: '1', transform: 'scale(1)' },
                    '50%': { opacity: '0.7', transform: 'scale(0.97)' },
                },
                'shimmer': {
                    '0%': { backgroundPosition: '-200% 0' },
                    '100%': { backgroundPosition: '200% 0' },
                },
                'wave': {
                    '0%': { transform: 'translateX(-100%)' },
                    '100%': { transform: 'translateX(100%)' },
                },
                'fade-in': {
                    '0%': { opacity: '0', transform: 'translateY(10px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                'scale-in': {
                    '0%': { opacity: '0', transform: 'scale(0.95)' },
                    '100%': { opacity: '1', transform: 'scale(1)' },
                },
            },
            animation: {
                'float': 'float 3s ease-in-out infinite',
                'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
                'shimmer': 'shimmer 2s linear infinite',
                'fade-in': 'fade-in 0.3s ease-out',
                'scale-in': 'scale-in 0.2s ease-out',
            },
            transitionTimingFunction: {
                'bounce-soft': 'cubic-bezier(0.34, 1.3, 0.64, 1)',
                'smooth': 'cubic-bezier(0.4, 0, 0.2, 1)',
            },
        },
    },
    plugins: [],
}
