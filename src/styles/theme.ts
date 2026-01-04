// ============ MEMO AI Theme System ============

export const theme = {
  // Brand Colors
  colors: {
    primary: {
      50: '#F5F3FF',
      100: '#EDE9FE',
      200: '#DDD6FE',
      300: '#C4B5FD',
      400: '#A78BFA',
      500: '#8B5CF6',  // Main Purple
      600: '#7C3AED',
      700: '#6D28D9',
      800: '#5B21B6',
      900: '#4C1D95',
    },
    secondary: {
      50: '#FDF2F8',
      100: '#FCE7F3',
      200: '#FBCFE8',
      300: '#F9A8D4',
      400: '#F472B6',
      500: '#EC4899',  // Main Pink
      600: '#DB2777',
      700: '#BE185D',
      800: '#9D174D',
      900: '#831843',
    },
    accent: {
      gold: '#F59E0B',
      emerald: '#10B981',
      sky: '#0EA5E9',
      rose: '#F43F5E',
    },
    success: '#4ADE80',
    warning: '#FBBF24',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Backgrounds
    background: {
      primary: '#0a0a0f',
      secondary: '#1a1025',
      tertiary: '#0f1729',
      card: 'rgba(30, 41, 59, 0.7)',
      glass: 'rgba(30, 41, 59, 0.5)',
    },
    
    // Text
    text: {
      primary: '#FFFFFF',
      secondary: '#A5B4FC',
      muted: '#64748B',
      disabled: '#475569',
    },
    
    // Borders
    border: {
      light: 'rgba(255, 255, 255, 0.1)',
      medium: 'rgba(139, 92, 246, 0.3)',
      strong: 'rgba(139, 92, 246, 0.5)',
    }
  },
  
  // Glassmorphism
  glass: {
    background: 'rgba(30, 41, 59, 0.7)',
    backgroundLight: 'rgba(30, 41, 59, 0.5)',
    blur: 'blur(20px)',
    blurStrong: 'blur(40px)',
    border: '1px solid rgba(139, 92, 246, 0.3)',
    borderLight: '1px solid rgba(255, 255, 255, 0.1)',
  },
  
  // Gradients
  gradients: {
    primary: 'linear-gradient(135deg, #8B5CF6, #EC4899)',
    secondary: 'linear-gradient(135deg, #3B82F6, #8B5CF6)',
    accent: 'linear-gradient(135deg, #F59E0B, #EC4899)',
    success: 'linear-gradient(135deg, #10B981, #4ADE80)',
    background: 'linear-gradient(135deg, #0a0a0f, #1a1025, #0f1729)',
    backgroundVertical: 'linear-gradient(180deg, #0a0a0f, #1a1025)',
    card: 'linear-gradient(135deg, rgba(139,92,246,0.2), rgba(236,72,153,0.1))',
    glow: 'radial-gradient(circle, rgba(139,92,246,0.4), transparent 70%)',
  },
  
  // Shadows
  shadows: {
    sm: '0 2px 8px rgba(0, 0, 0, 0.2)',
    md: '0 4px 20px rgba(0, 0, 0, 0.3)',
    lg: '0 8px 32px rgba(0, 0, 0, 0.4)',
    xl: '0 12px 48px rgba(0, 0, 0, 0.5)',
    glow: '0 8px 32px rgba(139, 92, 246, 0.5)',
    glowStrong: '0 12px 48px rgba(139, 92, 246, 0.6)',
    glowPink: '0 8px 32px rgba(236, 72, 153, 0.4)',
  },
  
  // Border Radius
  radius: {
    sm: '8px',
    md: '12px',
    lg: '16px',
    xl: '20px',
    '2xl': '24px',
    '3xl': '32px',
    full: '9999px',
  },
  
  // Spacing
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
    '2xl': '48px',
    '3xl': '64px',
  },
  
  // Typography
  typography: {
    fontFamily: "'Segoe UI', 'Cairo', 'Tajawal', sans-serif",
    fontSize: {
      xs: '12px',
      sm: '14px',
      base: '16px',
      lg: '18px',
      xl: '20px',
      '2xl': '24px',
      '3xl': '32px',
      '4xl': '40px',
      '5xl': '48px',
      '6xl': '64px',
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
      black: 900,
    },
    lineHeight: {
      tight: 1.1,
      normal: 1.5,
      relaxed: 1.8,
    },
  },
  
  // Transitions
  transitions: {
    fast: '0.15s ease',
    normal: '0.3s ease',
    slow: '0.5s ease',
    spring: '0.5s cubic-bezier(0.68, -0.55, 0.265, 1.55)',
  },
  
  // Z-Index
  zIndex: {
    dropdown: 100,
    modal: 200,
    tooltip: 300,
    toast: 400,
    max: 999,
  },
  
  // Breakpoints
  breakpoints: {
    sm: '640px',
    md: '768px',
    lg: '1024px',
    xl: '1280px',
    '2xl': '1536px',
  },
};

// Helper to get CSS variable
export const getCSSVar = (path: string): string => {
  const keys = path.split('.');
  let value: any = theme;
  for (const key of keys) {
    value = value[key];
  }
  return value;
};

// Export type
export type Theme = typeof theme;