/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts,scss}"
    ],
    darkMode: 'class', // We'll use class-based dark mode
    theme: {
        extend: {
            colors: {
                primary: {
                    50: '#f0f4ff',
                    100: '#e0e9ff',
                    500: '#3b5bdb',
                    600: '#3451c7',
                    700: '#2f48b0',
                    900: '#1e3a8a',
                },

                danger: {
                    50: '#fef2f2',
                    100: '#fee2e2',
                    200: '#fecaca',
                    300: '#fca5a5',
                    400: '#f87171',
                    500: '#ef4444',
                    600: '#dc2626',
                    700: '#b91c1c',
                    800: '#991b1b',
                    900: '#7f1d1d',
                },


                surface: {
                    DEFAULT: '#ffffff',
                    secondary: '#f8fafc',
                    dark: '#0f172a',
                }
            },
            fontFamily: {
                sans: ['Poppins', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                'xl': '0.75rem',
                '2xl': '1rem',
            }
        },
    },
    plugins: [
        require('@tailwindcss/forms'),
        require('@tailwindcss/typography'),
    ],
}
