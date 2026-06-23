import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import { ClerkProvider } from '@clerk/clerk-react';
import { ThemeProvider } from '@mui/material/styles'
import { createTheme } from '@mui/material/styles'

const PUBLISHABLE_KEY = process.env.REACT_APP_VITE_CLERK_PUBLISHABLE_KEY;
if (!PUBLISHABLE_KEY) {
  throw new Error("Missing Publishable Key")
}


// Change this line from unregister() to register()
serviceWorker.register();

// ── Brand tokens ──────────────────────────────────────────────
export const C = {
  forest:   '#1B4332',
  forest2:  '#2D6A4F',
  forest3:  '#40916C',
  lime:     '#84BC41',
  lime2:    '#A3CC6C',
  lime3:    '#C8E6A0',
  limeBg:   '#EEF7E0',
  teal:     '#099EC8',
  tealBg:   '#E0F4FB',
  amber:    '#F4A522',
  amberBg:  '#FEF3DA',
  red:      '#E5363A',
  redBg:    '#FDEDEF',
  // Dark surfaces
  bg:       '#0D1A0B',   // deepest background
  surface:  '#0F1E0D',   // phone shell / nav bar
  card:     '#162B12',   // cards, inputs
  card2:    '#1A3215',   // hover states
  border:   'rgba(255,255,255,0.07)',
  // Text
  textPrimary:   '#FFFFFF',
  textSecondary: 'rgba(255,255,255,0.55)',
  textMuted:     'rgba(255,255,255,0.35)',
}

export const driverTheme = createTheme({
  palette: {
    mode: 'dark',
    primary:    { main: C.lime,    contrastText: C.forest },
    secondary:  { main: C.forest2, contrastText: '#ffffff' },
    success:    { main: C.lime,    light: C.limeBg, dark: C.forest },
    warning:    { main: C.amber,   light: C.amberBg },
    error:      { main: C.red,     light: C.redBg },
    info:       { main: C.teal,    light: C.tealBg },
    background: { default: C.bg, paper: C.surface },
    text:       { primary: C.textPrimary, secondary: C.textSecondary, disabled: C.textMuted },
    divider:    C.border,
  },

  typography: {
    fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
    fontWeightLight:   300,
    fontWeightRegular: 400,
    fontWeightMedium:  500,
    fontWeightBold:    700,
    h1: { fontSize: '1.75rem', fontWeight: 800, letterSpacing: '-0.5px' },
    h2: { fontSize: '1.375rem', fontWeight: 800, letterSpacing: '-0.4px' },
    h3: { fontSize: '1.125rem', fontWeight: 700, letterSpacing: '-0.3px' },
    h4: { fontSize: '0.9375rem', fontWeight: 700 },
    h5: { fontSize: '0.875rem',  fontWeight: 700 },
    h6: { fontSize: '0.8125rem', fontWeight: 600 },
    subtitle1: { fontSize: '0.8125rem', fontWeight: 500, color: C.textSecondary },
    subtitle2: { fontSize: '0.75rem',   fontWeight: 500, color: C.textMuted },
    body1: { fontSize: '0.875rem',  fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.8125rem', fontWeight: 400, color: C.textSecondary, lineHeight: 1.5 },
    caption: { fontSize: '0.6875rem', fontWeight: 500, color: C.textMuted, letterSpacing: '0.3px' },
    overline: { fontSize: '0.625rem', fontWeight: 700, letterSpacing: '0.8px', textTransform: 'uppercase', color: C.textMuted },
    button: { fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif", fontWeight: 600, fontSize: '0.875rem', textTransform: 'none', letterSpacing: '-0.1px' },
  },

  shape: { borderRadius: 12 },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: C.bg,
          WebkitFontSmoothing: 'antialiased',
          fontFamily: "'Plus Jakarta Sans', system-ui, sans-serif",
        },
        '*::-webkit-scrollbar': { width: '0px' },
      },
    },

    MuiBottomNavigation: {
      styleOverrides: {
        root: {
          background: C.surface,
          borderTop: `1px solid ${C.border}`,
          height: 64,
        },
      },
    },

    MuiBottomNavigationAction: {
      styleOverrides: {
        root: {
          color: C.textMuted,
          minWidth: 0,
          padding: '6px 0 8px',
          '&.Mui-selected': { color: C.lime2 },
          '& .MuiBottomNavigationAction-label': {
            fontSize: '0.625rem',
            fontWeight: 600,
            fontFamily: "'Plus Jakarta Sans', system-ui",
            marginTop: 3,
          },
        },
      },
    },

    MuiCard: {
      defaultProps: { elevation: 0 },
      styleOverrides: {
        root: {
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 14,
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: '14px 16px',
          '&:last-child': { paddingBottom: '14px' },
        },
      },
    },

    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: {
          borderRadius: 12,
          padding: '12px 20px',
          fontWeight: 600,
          fontSize: '0.9375rem',
          textTransform: 'none',
        },
        containedPrimary: {
          background: C.lime,
          color: C.forest,
          '&:hover': { background: C.lime2 },
          '&:active': { opacity: 0.85 },
        },
        containedError: {
          background: C.red,
          '&:hover': { background: '#c02020' },
        },
        outlinedPrimary: {
          borderColor: C.border,
          color: '#ffffff',
          background: 'rgba(255,255,255,0.07)',
          '&:hover': { background: 'rgba(255,255,255,0.1)', borderColor: 'rgba(255,255,255,0.15)' },
        },
        sizeLarge: { padding: '14px 24px', fontSize: '0.9375rem', borderRadius: 14 },
        sizeSmall: { padding: '6px 12px', fontSize: '0.8125rem' },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 700,
          fontSize: '0.6875rem',
          height: 22,
          borderRadius: 20,
          fontFamily: "'Plus Jakarta Sans', system-ui",
        },
        colorSuccess: { background: 'rgba(132,188,65,0.15)', color: C.lime2 },
        colorWarning: { background: 'rgba(244,165,34,0.15)', color: C.amber },
        colorError:   { background: 'rgba(229,54,58,0.15)',  color: '#F07074' },
        colorInfo:    { background: 'rgba(9,158,200,0.15)',   color: '#5AC8E8' },
        colorDefault: { background: 'rgba(255,255,255,0.08)', color: C.textSecondary },
      },
    },

    MuiTextField: {
      defaultProps: { size: 'medium', variant: 'outlined' },
      styleOverrides: {
        root: {
          '& .MuiOutlinedInput-root': {
            background: C.card,
            borderRadius: 12,
            fontSize: '0.9375rem',
            fontFamily: "'Plus Jakarta Sans', system-ui",
            fontWeight: 500,
            color: '#ffffff',
            '& fieldset': { borderColor: 'rgba(255,255,255,0.1)' },
            '&:hover fieldset': { borderColor: 'rgba(255,255,255,0.2)' },
            '&.Mui-focused fieldset': { borderColor: C.lime },
          },
          '& .MuiInputLabel-root': {
            fontSize: '0.75rem',
            fontWeight: 700,
            textTransform: 'uppercase',
            letterSpacing: '0.4px',
            color: 'rgba(255,255,255,0.45)',
          },
          '& .MuiInputLabel-root.Mui-focused': { color: C.lime2 },
          '& input::placeholder': { color: 'rgba(255,255,255,0.25)', opacity: 1 },
          '& input[type=number]': { fontFamily: "'JetBrains Mono', monospace" },
        },
      },
    },

    MuiSelect: {
      styleOverrides: {
        select: {
          background: C.card,
          fontSize: '0.9375rem',
          fontFamily: "'Plus Jakarta Sans', system-ui",
          color: '#ffffff',
        },
        icon: { color: 'rgba(255,255,255,0.4)' },
      },
    },

    MuiLinearProgress: {
      styleOverrides: {
        root: {
          height: 6,
          borderRadius: 10,
          background: 'rgba(255,255,255,0.08)',
        },
        bar: { borderRadius: 10 },
      },
    },

    MuiDivider: {
      styleOverrides: { root: { borderColor: C.border } },
    },

    MuiListItem: {
      styleOverrides: {
        root: {
          padding: '14px 0',
          borderBottom: `1px solid ${C.border}`,
          '&:last-child': { borderBottom: 'none' },
        },
      },
    },

    MuiListItemIcon: {
      styleOverrides: {
        root: {
          minWidth: 0,
          marginRight: 12,
          width: 36,
          height: 36,
          borderRadius: 10,
          background: C.card,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.125rem',
        },
      },
    },

    MuiIconButton: {
      styleOverrides: {
        root: {
          background: 'rgba(255,255,255,0.06)',
          color: '#ffffff',
          borderRadius: '50%',
          '&:hover': { background: 'rgba(255,255,255,0.1)' },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          background: C.surface,
          border: `1px solid ${C.border}`,
          borderRadius: 20,
          margin: 16,
          width: 'calc(100% - 32px)',
          maxHeight: 'calc(100% - 32px)',
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: { root: { fontSize: '1rem', fontWeight: 700, padding: '18px 20px 14px' } },
    },

    MuiDialogContent: {
      styleOverrides: { root: { padding: '0 20px 16px' } },
    },

    MuiDialogActions: {
      styleOverrides: { root: { padding: '12px 20px 18px', gap: 8 } },
    },

    MuiSnackbar: {
      defaultProps: { anchorOrigin: { vertical: 'bottom', horizontal: 'center' } },
    },

    MuiAlert: {
      styleOverrides: {
        root: {
          background: C.forest2,
          color: '#ffffff',
          fontWeight: 600,
          fontSize: '0.875rem',
          borderRadius: 12,
        },
        icon: { color: C.lime },
      },
    },

    MuiTabs: {
      styleOverrides: {
        root: { minHeight: 36 },
        indicator: { display: 'none' },
      },
    },

    MuiTab: {
      styleOverrides: {
        root: {
          minHeight: 36,
          padding: '7px 14px',
          borderRadius: 20,
          border: '1px solid rgba(255,255,255,0.1)',
          marginRight: 6,
          fontWeight: 600,
          fontSize: '0.8125rem',
          textTransform: 'none',
          color: 'rgba(255,255,255,0.45)',
          transition: 'all 0.15s',
          '&.Mui-selected': {
            background: C.lime,
            color: C.forest,
            borderColor: C.lime,
          },
        },
      },
    },
  },
})

export default driverTheme


const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <ThemeProvider theme={driverTheme}>
       <App />
      </ThemeProvider>
    </ClerkProvider>
  </React.StrictMode>
);
