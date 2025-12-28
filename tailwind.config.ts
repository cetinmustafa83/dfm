import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

const config: Config = {
    darkMode: "class",
    content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
  	extend: {
  		colors: {
  			background: 'hsl(var(--background))',
  			foreground: 'hsl(var(--foreground))',
  			card: {
  				DEFAULT: 'hsl(var(--card))',
  				foreground: 'hsl(var(--card-foreground))'
  			},
  			popover: {
  				DEFAULT: 'hsl(var(--popover))',
  				foreground: 'hsl(var(--popover-foreground))'
  			},
  			primary: {
  				DEFAULT: 'hsl(var(--primary))',
  				foreground: 'hsl(var(--primary-foreground))'
  			},
  			secondary: {
  				DEFAULT: 'hsl(var(--secondary))',
  				foreground: 'hsl(var(--secondary-foreground))'
  			},
  			muted: {
  				DEFAULT: 'hsl(var(--muted))',
  				foreground: 'hsl(var(--muted-foreground))'
  			},
  			accent: {
  				DEFAULT: 'hsl(var(--accent))',
  				foreground: 'hsl(var(--accent-foreground))'
  			},
  			destructive: {
  				DEFAULT: 'hsl(var(--destructive))',
  				foreground: 'hsl(var(--destructive-foreground))'
  			},
  			border: 'hsl(var(--border))',
  			input: 'hsl(var(--input))',
  			ring: 'hsl(var(--ring))',
  			chart: {
  				'1': 'hsl(var(--chart-1))',
  				'2': 'hsl(var(--chart-2))',
  				'3': 'hsl(var(--chart-3))',
  				'4': 'hsl(var(--chart-4))',
  				'5': 'hsl(var(--chart-5))'
  			}
  		},
  		borderRadius: {
  			lg: 'var(--radius)',
  			md: 'calc(var(--radius) - 2px)',
  			sm: 'calc(var(--radius) - 4px)'
  		},
  		keyframes: {
  			liquid: {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1)' },
  				'25%': { transform: 'translate(5px, -8px) scale(1.02)' },
  				'50%': { transform: 'translate(-3px, 5px) scale(0.98)' },
  				'75%': { transform: 'translate(8px, 3px) scale(1.01)' }
  			},
  			'liquid-hover': {
  				'0%, 100%': { transform: 'translate(0, 0) scale(1.05)' },
  				'25%': { transform: 'translate(8px, -12px) scale(1.08)' },
  				'50%': { transform: 'translate(-5px, 8px) scale(1.03)' },
  				'75%': { transform: 'translate(12px, 5px) scale(1.06)' }
  			}
  		},
  		animation: {
  			liquid: 'liquid 8s ease-in-out infinite',
  			'liquid-hover': 'liquid-hover 4s ease-in-out infinite'
  		}
  	}
  },
  plugins: [tailwindcssAnimate],
};
export default config;
