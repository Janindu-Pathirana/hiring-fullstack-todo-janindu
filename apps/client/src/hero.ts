import { heroui } from '@heroui/react';

export default heroui({
  themes: {
    light: {
      colors: {
        background: { DEFAULT: '#F8FAFC' },
        foreground: { DEFAULT: '#0F172A' },
        content1: { DEFAULT: '#FFFFFF' },
        content2: { DEFAULT: '#F7F5F2' },
        divider: { DEFAULT: '#E2E8F0' },
        focus: { DEFAULT: '#0EA5E9' },
        primary: {
          50: '#F0F9FF',
          100: '#E0F2FE',
          200: '#BAE6FD',
          500: '#0EA5E9',
          600: '#0284C7',
          700: '#0369A1',
          DEFAULT: '#0284C7',
          foreground: '#FFFFFF',
        },
        success: { DEFAULT: '#10B981' },
        warning: { DEFAULT: '#F59E0B' },
        danger: { DEFAULT: '#EF4444' },
      },
    },
  },
});
