/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                sans: ['Inter', 'SF Pro', 'sans-serif'],
            },
            colors: {
                pastel: {
                    blush: '#F7BFCB',
                    cream: '#E6DFD9',
                    peach: '#F4C696',
                    coral: '#EEA2A1',
                    mint: '#87B7A5',
                    lavender: '#D5CDE0',
                    amber: '#EBB557',
                }
            },
            backgroundImage: {
                'gradient-blush-peach': 'linear-gradient(135deg, #F7BFCB 0%, #F4C696 100%)',
                'gradient-blush-mint': 'linear-gradient(135deg, #F7BFCB 0%, #F4C696 50%, #87B7A5 100%)',
                'gradient-blush-lavender': 'linear-gradient(135deg, #F7BFCB 0%, #D5CDE0 100%)',
                'gradient-cream-peach': 'linear-gradient(135deg, #E6DFD9 0%, #F4C696 100%)',
            }
        },
    },
    plugins: [],
}
