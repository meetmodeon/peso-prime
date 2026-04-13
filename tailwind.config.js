/** @type {import('tailwindcss').Config} */
export const content = [
    "./src/**/*.{html,ts,scss}", // Angular components and templates
];
export const theme = {
    extend: {
        colors: {
            primary: '#3B82F6', // blue-500
            'accent-green': '#10B981', // green-500
            secondary: '#F59E0B', // amber-500
        },
        spacing: {
            18: '4.5rem', // custom spacing example
        },
        fontSize: {
            xxs: '0.65rem', // extra small font
        },
    },
};
export const plugins = [];