import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        'button': '6px -6px 15px rgba(0, 0, 0, 0.3), 6px 6px 15px rgba(0, 0, 0, 0.3)',
      },
      screens: {
        '2xl': '1441px',
        'sm' : '200px',
      },
      colors: {
        'smoke-white': 'rgba(0, 0, 0, 0.03)',
        green: {
          DEFAULT: "#11D984",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [],
};
export default config;
