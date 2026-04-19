import type { Config } from "tailwindcss"

export default {
	content: [
		"./pages/**/*.{js,ts,jsx,tsx,mdx}",
		"./components/**/*.{js,ts,jsx,tsx,mdx}",
		"./app/**/*.{js,ts,jsx,tsx,mdx}",
	],
	theme: {
		extend: {
			colors: {
				background: 'var(--background)',
				componentBackground: 'var(--secondary-background)',
				popover: 'var(--popover-background)',
				contrast: 'var(--contrast)',
				foreground: 'var(--foreground)',
				mutedForeground: 'var(--muted-foreground)',
				primary: 'rgb(var(--primary) / <alpha-value>)',
				primaryHover: 'rgb(var(--primary-hover) / <alpha-value>)',
				secondary: 'rgb(var(--secondary) / <alpha-value>)',
				secondaryHover: 'rgb(var(--secondary-hover) / <alpha-value>)',
				accent: 'rgb(var(--accent) / <alpha-value>)',
				success: 'var(--success)',
				font: 'var(--font)',
				dark: '#000000',
				light: '#ffffff',
				border: 'hsl(var(--border))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
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
				sm: 'var(--radius-sm)',
				md: 'var(--radius-md)',
				lg: 'var(--radius-lg)',
				full: 'var(--radius-full)'
			},
			animation: {
				'pulse-fast': 'pulse 1s cubic-bezier(0.4, 0, 0.6, 1) infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'heart-pop': 'heart-pop 320ms cubic-bezier(0.25, 0.46, 0.45, 0.94)'
			},
			keyframes: {
				'accordion-down': {
					from: {
						height: '0'
					},
					to: {
						height: 'var(--radix-accordion-content-height)'
					}
				},
				'accordion-up': {
					from: {
						height: 'var(--radix-accordion-content-height)'
					},
					to: {
						height: '0'
					}
				},
				'heart-pop': {
					'0%': { transform: 'scale(1)' },
					'35%': { transform: 'scale(1.18)' },
					'60%': { transform: 'scale(0.97)' },
					'80%': { transform: 'scale(1.03)' },
					'100%': { transform: 'scale(1)' }
				}
			},
			boxShadow: {
				sm: 'var(--shadow-sm)',
				md: 'var(--shadow-md)',
				lg: 'var(--shadow-lg)',
				tab: 'var(--shadow-tab-active)',
				'tab-inactive': 'var(--shadow-tab-inactive)'
			}
		}
	},
	darkMode: 'class',
	// eslint-disable-next-line @typescript-eslint/no-require-imports
	plugins: [require("tailwindcss-animate")],
} satisfies Config
