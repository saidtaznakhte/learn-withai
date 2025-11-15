import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

type Theme = 'light' | 'dark';

type ThemeColors = {
  primary: string;
  background: string;
  card: string;
  text: string;
  textSecondary: string;
  border: string;
};

type ThemeContextType = {
  theme: Theme;
  colors: ThemeColors;
  toggleTheme: () => void;
};

const lightColors: ThemeColors = {
  primary: '#3B82F6',
  background: '#F9FAFB',
  card: '#FFFFFF',
  text: '#111827',
  textSecondary: '#6B7280',
  border: '#E5E7EB',
};

const darkColors: ThemeColors = {
  primary: '#3B82F6',
  background: '#111827',
  card: '#1F2937',
  text: '#F9FAFB',
  textSecondary: '#9CA3AF',
  border: '#374151',
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const systemColorScheme = useColorScheme();
  const [theme, setTheme] = useState<Theme>(systemColorScheme === 'dark' ? 'dark' : 'light');

  useEffect(() => {
    setTheme(systemColorScheme === 'dark' ? 'dark' : 'light');
  }, [systemColorScheme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const colors = theme === 'light' ? lightColors : darkColors;

  return (
    <ThemeContext.Provider value={{ theme, colors, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
}
