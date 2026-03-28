import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { writeFileSync, readFileSync } from 'fs'

const copyIndexTo404Plugin = () => {
    return {
        name: 'copy-index-to-404',
        closeBundle() {
            try {
                const indexHtml = readFileSync(path.resolve(__dirname, 'dist/index.html'), 'utf-8');
                writeFileSync(path.resolve(__dirname, 'dist/404.html'), indexHtml);
            } catch (error) {
                console.error('Error copying index.html to 404.html:', error);
            }
        }
    };
};

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react(), copyIndexTo404Plugin()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
})
