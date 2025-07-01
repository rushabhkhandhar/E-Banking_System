import { createTheme } from '@mui/material/styles';

// Authentic JPMorgan Chase sophisticated color palette
const colors = {
  primary: {
    main: '#006CAE', // Authentic JPMorgan blue
    light: '#2985D6',
    dark: '#004A7D',
    contrastText: '#FFFFFF',
  },
  secondary: {
    main: '#FFFFFF',
    light: '#FFFFFF',
    dark: '#F7F9FA',
    contrastText: '#333333',
  },
  accent: {
    main: '#005A8A', // Darker blue for emphasis
    light: '#0E7BB8',
    dark: '#003A5D',
  },
  jpBlue: {
    50: '#E6F1FF',
    100: '#CCE3FF',
    200: '#99C7FF',
    300: '#66ABFF',
    400: '#338FFF',
    500: '#006CAE', // Main JPMorgan blue
    600: '#005A8A',
    700: '#004866',
    800: '#003642',
    900: '#00241E',
  },
  success: {
    main: '#00A84A',
    light: '#4FBB71',
    dark: '#007635',
  },
  warning: {
    main: '#FF6B35',
    light: '#FF8A60',
    dark: '#E5522A',
  },
  error: {
    main: '#D50000',
    light: '#FF3838',
    dark: '#B71C1C',
  },
  neutral: {
    50: '#FAFBFC',
    100: '#F4F6F8',
    200: '#E9ECEF',
    300: '#DEE2E6',
    400: '#CED4DA',
    500: '#A8B2BC',
    600: '#6C757D',
    700: '#495057',
    800: '#343A40',
    900: '#212529',
    950: '#0A0C0F',
  },
  text: {
    primary: '#212529',
    secondary: '#495057',
    disabled: '#A8B2BC',
    white: '#FFFFFF',
  },
  background: {
    default: '#FFFFFF',
    paper: '#FFFFFF',
    secondary: '#F4F6F8',
    tertiary: '#FAFBFC',
    dark: '#212529',
  },
  surfaces: {
    elevated: '#FFFFFF',
    container: '#F4F6F8',
    overlay: 'rgba(33, 37, 41, 0.8)',
  },
};

// Premium typography system matching JPMorgan Chase
const typography = {
  fontFamily: [
    '"SF Pro Display"',
    '"Helvetica Neue"',
    'Helvetica',
    'Arial',
    'system-ui',
    '-apple-system',
    'BlinkMacSystemFont',
    'sans-serif',
  ].join(','),
  h1: {
    fontWeight: 600,
    fontSize: '3.5rem',
    lineHeight: 1.2,
    letterSpacing: '-0.02em',
    color: colors.text.primary,
  },
  h2: {
    fontWeight: 600,
    fontSize: '2.75rem',
    lineHeight: 1.25,
    letterSpacing: '-0.015em',
    color: colors.text.primary,
  },
  h3: {
    fontWeight: 600,
    fontSize: '2.25rem',
    lineHeight: 1.3,
    letterSpacing: '-0.01em',
    color: colors.text.primary,
  },
  h4: {
    fontWeight: 600,
    fontSize: '1.875rem',
    lineHeight: 1.35,
    letterSpacing: '-0.005em',
    color: colors.text.primary,
  },
  h5: {
    fontWeight: 600,
    fontSize: '1.5rem',
    lineHeight: 1.4,
    letterSpacing: '0em',
    color: colors.text.primary,
  },
  h6: {
    fontWeight: 600,
    fontSize: '1.25rem',
    lineHeight: 1.45,
    letterSpacing: '0.005em',
    color: colors.text.primary,
  },
  subtitle1: {
    fontWeight: 500,
    fontSize: '1.125rem',
    lineHeight: 1.5,
    letterSpacing: '0.01em',
    color: colors.text.secondary,
  },
  subtitle2: {
    fontWeight: 500,
    fontSize: '1rem',
    lineHeight: 1.55,
    letterSpacing: '0.015em',
    color: colors.text.secondary,
  },
  body1: {
    fontWeight: 400,
    fontSize: '1rem',
    lineHeight: 1.6,
    letterSpacing: '0.02em',
    color: colors.text.primary,
  },
  body2: {
    fontWeight: 400,
    fontSize: '0.875rem',
    lineHeight: 1.65,
    letterSpacing: '0.025em',
    color: colors.text.secondary,
  },
  button: {
    fontWeight: 600,
    fontSize: '0.875rem',
    lineHeight: 1.2,
    letterSpacing: '0.05em',
    textTransform: 'none',
  },
  caption: {
    fontWeight: 400,
    fontSize: '0.75rem',
    lineHeight: 1.7,
    letterSpacing: '0.03em',
    color: colors.text.secondary,
  },
  overline: {
    fontWeight: 600,
    fontSize: '0.75rem',
    lineHeight: 2,
    letterSpacing: '0.15em',
    textTransform: 'uppercase',
    color: colors.text.secondary,
  },
};

// Sophisticated spacing and layout system
const spacing = 8;

const shadows = [
  'none',
  '0px 1px 2px rgba(0, 0, 0, 0.05)',
  '0px 1px 3px rgba(0, 0, 0, 0.1), 0px 1px 2px rgba(0, 0, 0, 0.06)',
  '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)',
  '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)',
  '0px 20px 25px -5px rgba(0, 0, 0, 0.1), 0px 10px 10px -5px rgba(0, 0, 0, 0.04)',
  '0px 25px 50px -12px rgba(0, 0, 0, 0.25)',
];

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: colors.primary,
    secondary: colors.secondary,
    accent: colors.accent,
    success: colors.success,
    warning: colors.warning,
    error: colors.error,
    background: colors.background,
    text: colors.text,
    grey: colors.neutral,
  },
  typography,
  spacing,
  shape: {
    borderRadius: 8,
  },
  shadows: shadows.concat(Array(18).fill(shadows[6])),
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        '@global': {
          '@keyframes fillBar': {
            '0%': { width: '0%' },
            '100%': { width: 'var(--target-width)' },
          },
        },
        body: {
          backgroundColor: colors.background.default,
          fontFamily: typography.fontFamily,
          color: colors.text.primary,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 6,
          padding: '12px 32px',
          fontSize: '0.875rem',
          fontWeight: 600,
          textTransform: 'none',
          letterSpacing: '0.02em',
          boxShadow: 'none',
          transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-1px)',
            boxShadow: '0px 4px 12px rgba(0, 108, 174, 0.25)',
          },
          '&:active': {
            transform: 'translateY(0)',
          },
        },
        contained: {
          background: `linear-gradient(135deg, ${colors.primary.main} 0%, ${colors.primary.dark} 100%)`,
          color: colors.primary.contrastText,
          '&:hover': {
            background: `linear-gradient(135deg, ${colors.primary.dark} 0%, ${colors.accent.dark} 100%)`,
            boxShadow: '0px 8px 25px rgba(0, 108, 174, 0.35)',
          },
        },
        outlined: {
          borderColor: colors.primary.main,
          borderWidth: '2px',
          color: colors.primary.main,
          backgroundColor: 'transparent',
          '&:hover': {
            borderColor: colors.primary.dark,
            backgroundColor: 'rgba(0, 108, 174, 0.04)',
            borderWidth: '2px',
          },
        },
        text: {
          color: colors.primary.main,
          '&:hover': {
            backgroundColor: 'rgba(0, 108, 174, 0.04)',
          },
        },
        sizeSmall: {
          padding: '8px 20px',
          fontSize: '0.8125rem',
        },
        sizeLarge: {
          padding: '16px 40px',
          fontSize: '0.9375rem',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.08)',
          border: `1px solid ${colors.neutral[200]}`,
          backgroundColor: colors.background.paper,
          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow: '0px 8px 30px rgba(0, 0, 0, 0.12)',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: colors.background.paper,
          backdropFilter: 'blur(20px)',
          borderBottom: `1px solid ${colors.neutral[200]}`,
          boxShadow: '0px 1px 0px rgba(0, 0, 0, 0.05)',
          color: colors.text.primary,
        },
      },
    },
    MuiTextField: {
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            borderRadius: 8,
            backgroundColor: colors.background.secondary,
            border: `1px solid ${colors.neutral[300]}`,
            transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              backgroundColor: colors.background.paper,
              borderColor: colors.primary.light,
            },
            '&.Mui-focused': {
              backgroundColor: colors.background.paper,
              borderColor: colors.primary.main,
              boxShadow: `0 0 0 3px rgba(0, 108, 174, 0.1)`,
            },
          },
        },
      },
    },
    MuiContainer: {
      styleOverrides: {
        root: {
          paddingLeft: 24,
          paddingRight: 24,
          '@media (min-width: 600px)': {
            paddingLeft: 32,
            paddingRight: 32,
          },
          '@media (min-width: 960px)': {
            paddingLeft: 48,
            paddingRight: 48,
          },
        },
      },
    },
    MuiPaper: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          backgroundColor: colors.background.paper,
        },
        elevation1: {
          boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.06)',
        },
        elevation2: {
          boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.08)',
        },
        elevation3: {
          boxShadow: '0px 8px 24px rgba(0, 0, 0, 0.1)',
        },
      },
    },
    MuiTypography: {
      styleOverrides: {
        root: {
          color: 'inherit',
        },
      },
    },
  },
});

// Export colors and theme utilities for styled-components
export { colors, spacing, shadows };
export default theme;
