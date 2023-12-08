/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}',
	],
	theme: {
		colors: {
			primary: '#FF4600',
			wording: '#062A30',
			base: '#FDFDFD',
			transparent: 'transparent',
			white: '#FFFFFF',
			black: '#0F0F0F',
			background: {
				landing: '#031D21',
			},
			orange: '#FF4600',
			'orange-1': '#FF4E00',
			blue: '#0070FF',
			lavender: '#C972FF',
			green: '#00CB77',
			'green-1': '#00A500',
			yellow: '#FFB300',
			purple: '#5218FF',
			'dark-purple': '#2E1D57',
			'dark-purple-2': '#370DB4',
			red: '#BB0B00',
			grey: '#262626',
			'grey-1': '#999999',
			'grey-2': '#626262',
			'grey-3': '#4E4E4E',
			'grey-4': '#202020',
			'light-grey': '#D2D2D2',
			'super-light-grey': '#F5F5F5',
			'med-grey': '#AEAEAE',
			skeleton: '#e5e7eb',
			'soft-blue': '#8ECCCC',
			'soft-blue-2': '#77AAAA',
			'soft-blue-3': '#95D9D9',
			'soft-blue-4': '#E2EDED',
			cyan: '#A9FBFD',
			steel: '#062A30'
		},
		extend: {
			fontFamily: {
				barlow: ['var(--font-barlow)']
			},
			fontSize: {
				'10px': '10px',
				'22px': '22px',
				'28px': '28px',
				'32px': '32px',
				'34px': '34px',
				'40px': '40px',
				'44px': '44px',
				'74px': '74px',
			},
			letterSpacing: {
				'0.005em': '0.005em',
				'0.01em': '0.01em',
				'0.02em': '0.02em'
			},
			spacing: {
				'2px': '2px',
				'3.5px': '3.5px',
				'9px': '9px',
				'10px': '10px',
				'14px': '14px',
				'15px': '15px',
				'18px': '18px',
				'30px': '30px',
				'50px': '50px',
				'54px': '54px',
				'60px': '60px',
				'70px': '70px'
			},
			borderRadius: {
				'7px': '7px',
				'10px': '10px',
				'14px': '14px',
				'26px': '26px',
				'60px': '60px'
			},
			borderWidth: {
				'0.5px': '0.5px'
			},
			screens: {
				xxs: '300px',
				xs: '450px'
			},
			lineHeight: {
				'89%': '89%',
				'100%': '100%',
				'120%': '120%',
				'126%': '126%',
				'140%': '140%'
			},
			animation: {
				marquee: 'marquee 40s linear infinite',
				marquee2: 'marquee2 40s linear infinite',
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
			},
			keyframes: {
				marquee: {
					'0%': { transform: 'translateX(-100%)' },
					'100%': { transform: 'translateX(0%)' },
				},
				marquee2: {
					'0%': { transform: 'translateX(0%)' },
					'100%': { transform: 'translateX(100%)' },
				},
				'accordion-down': {
					from: { height: 0 },
					to: { height: 'var(--radix-accordion-content-height)' },
				},
				'accordion-up': {
					from: { height: 'var(--radix-accordion-content-height)' },
					to: { height: 0 },
				},
			},
			listStyleType: {
				'lower-alpha': 'lower-alpha',
				'lower-roman': 'lower-roman'
			},
			backgroundImage: {
				'linear-gradient-calendar-blue': 'linear-gradient(0, rgba(178, 223, 226, 0.00) 51.15%, #A9DADD 100%)',
				'linear-gradient-calendar-grey': 'linear-gradient(180deg, rgba(249, 249, 249, 0.00) 51.15%, #E9E9E9 100%)',
				'linear-gradient-calendar-grey-flip': 'linear-gradient(0, rgba(249, 249, 249, 0.00) 51.15%, #E9E9E9 100%)',
				'linear-gradient-calendar-panel': 'linear-gradient(127deg, #FDFDFD 20.95%, #F2F2F2 71.29%);',
				'main-gradient': 'linear-gradient(180deg, #A9FBFD 0%, #D0D2D3 100%)',
				'linear-gradient-base': 'linear-gradient(180deg, #A9FBFD 0%, #F2F2F2 100%)',
				'linar-gradient-white': 'linear-gradient(181deg, #FFF -12.63%, rgba(239, 239, 239, 0.00) 99.39%)',
				'linear-gradient-blue': 'linear-gradient(180deg, #A9FBFD -44.77%, rgba(255, 255, 255, 0.00) 99.87%)'
			},
			boxShadow: {
				'blur-1': '8px -11px 25px -1px rgba(188, 187, 187, 0.25)',
				'ds-1': '13px 11px 20px 1px rgba(197, 197, 197, 0.25)'
			},
			dropShadow: {
				'super-light-grey': '8px -11px 25px rgba(188, 187, 187, 0.25)'
			}
		}
	},
	plugins: [
		require('@tailwindcss/forms'),
		require('tailwindcss-animate'),
		({ addComponents }) => {
			addComponents(
				{
					'.container-center': { '@apply max-w-7xl mx-auto px-4 xxs:px-18px lg:px-[22px]': {} },
					'.absolute-center': { '@apply absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2': {} },
					'.btn': { '@apply rounded-lg text-center py-2 px-10 transition-all duration-100 hover:[&:not([disabled])]:-translate-y-[2px] active:[&:not([disabled])]:translate-y-0 focus:outline-0 focus:ring-0': {} },
					'.btn-primary': { '@apply btn text-white bg-primary hover:bg-purple active:bg-red disabled:bg-light-grey disabled:text-grey-2': {} },
					'.btn-purple': { '@apply btn text-white bg-purple hover:bg-purple/90 active:bg-purple disabled:bg-soft-blue disabled:text-grey-1': {} },
					'.text-heading-1': { '@apply font-bold text-34px sm:text-[40px] md:text-[50px] lg:text-[60px] leading-[104.5%] lg:leading-89% tracking-0.005em lg:tracking-0.02em': {} },
					'.text-heading-2': { '@apply font-semibold text-32px sm:text-[38px] md:text-[43px] lg:text-5xl leading-100% lg:leading-[102.5%] tracking-0.005em lg:tracking-0.02em': {} },
					'.text-heading-3': { '@apply font-bold lg:font-semibold text-22px md:text-[40px] lg:text-44px leading-[83%] lg:leading-[102.5%] tracking-0.005em lg:tracking-0.02em': {} },
					'.text-heading-4': { '@apply font-medium lg:font-semibold text-lg sm:text-22px md:text-[27px] lg:text-32px leading-[111%] lg:leading-100% lg:tracking-0.005em': {} },
					'.text-heading-5': { '@apply font-medium text-base md:text-lg lg:text-xl lg:leading-[111%]': {} },
					'.text-body-1': { '@apply font-normal text-2xl sm:text-[27px] md:text-3xl lg:text-32px leading-[115.5%] lg:leading-89% -tracking-0.01em lg:tracking-0.02em': {} },
					'.text-body-2': { '@apply font-normal text-xl md:text-2xl leading-120%': {} },
					'.text-body-3': { '@apply font-normal text-base md:text-lg leading-140%': {} },
					'.text-body-4': { '@apply font-normal text-sm leading-[17px] md:text-base md:leading-126%': {} },
					'.text-body-5': { '@apply font-medium text-lg leading-[130%]': {} },
					'.text-dtp-body-5': { '@apply font-normal text-10px leading-126%': {} },
					'.text-btn': { '@apply text-base font-medium sm:font-normal leading-120% sm:leading-126%': {} },
					'.text-dtp-btn': { '@apply text-sm font-medium leading-126%': {} },
					'.text-page-title': { '@apply text-xl sm:text-2xl md:text-4xl lg:text-5xl leading-89% lg:leading-[102.5%] tracking-0.02em font-bold lg:font-semibold': {} },
					'.text-heading-2-4': { '@apply font-semibold text-32px leading-100% tracking-0.005em': {} },
					'.back-underline': { '@apply relative before:absolute before:content-[""] before:left-1/2 before:-translate-x-1/2 before:-z-[1] before:w-full': {} }
				}
			);
		}
	],
};
