/** @type {import('tailwindcss').Config} */
// eslint-disable-next-line no-undef
module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  // prefix: 'g-', // 类名前缀
  theme: {
    extend: {
      maxWidth: {
        'normal': 'var(--w-normal)', // 自定义类名 max-w-normal
        'sm': 'var(--w-sm)',
        'xs': 'var(--w-xs)'
      },
      minWidth: {
        'normal': 'var(--w-normal)', // 自定义类名 min-w-normal
        'sm': 'var(--w-sm)'
      },
      width: {
        'normal': 'var(--w-normal)', // 自定义类名 w-normal
        'sm': 'var(--w-sm)',
        'xs': 'var(--w-xs)'
      },
      colors: {
        'G100': 'var(--color-G100)', // text-G100 bg-G100 border-G100
        'G200': 'var(--color-G200)',
        'G300': 'var(--color-G300)',
        'G400': 'var(--color-G400)',
        'G500': 'var(--color-G500)',
        'G600': 'var(--color-G600)',
        'G700': 'var(--color-G700)',
        'G800': 'var(--color-G800)',
        'G900': 'var(--color-G900)',
        'G1000': 'var(--color-G1000)',
        'CG100': 'var(--color-CG100)',
        'CG200': 'var(--color-CG200)',
        'CG300': 'var(--color-CG300)',
        'CG400': 'var(--color-CG400)',
        'CG500': 'var(--color-CG500)',
        'CG600': 'var(--color-CG600)',
        'CG700': 'var(--color-CG700)',
        'CG800': 'var(--color-CG800)',
        'CG900': 'var(--color-CG900)',
        'CG950': 'var(--color-CG950)',
        'DP100': 'var(--color-DP100)',
        'DP200': 'var(--color-DP200)',
        'DP300': 'var(--color-DP300)',
        'DP400': 'var(--color-DP400)',
        'DP500': 'var(--color-DP500)',
        'DP600': 'var(--color-DP600)',
        'DP700': 'var(--color-DP700)',
        'DP800': 'var(--color-DP800)',
        'DP900': 'var(--color-DP900)',
        'Y100': 'var(--color-Y100)',
        'primary': 'var(--color-primary)',
        'link': 'var(--devui-link)',
        'danger': 'var(--color-danger)',
        'success': 'var(--color-success)',
        'warning': 'var(--color-warning)',
        'tip': 'var(--color-tip)',
        'light': 'var(--color-light)',
        'lighter': 'var(--color-lighter)'
      },
      fontSize: {
        'xs': '12px', // text-xs
        'sm': '14px',
        'base': '16px',
        'lg': '18px',
        'xl': '20px',
        '2xl': '22px'
      },
      spacing: {
        'xs': '8px',
        '10': '10px', // mt-10
        '20': '20px',
        '24': '24px',
        '30': '30px',
        '32': '32px',
        '40': '40px',
        'normal': 'var(--spacing-normal)'
      },
      screens: {
        'max-sm': { 'max': '375px' },
        'max-md': { 'max': '768px' },
        'max-lg': { 'max': '1024px' },
        'max-xl': { 'max': '1280px' },
        'max-2xl': { 'max': '1536px' }
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
};

