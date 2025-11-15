import { useEffect } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useFrameworkReady } from '../hooks/useFrameworkReady';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold } from '@expo-google-fonts/inter';
import * as SplashScreen from 'expo-splash-screen';
import { ThemeProvider } from '../contexts/ThemeContext';
import { Provider } from 'react-redux';
import { store } from './store';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useFrameworkReady();
  
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <Provider store={store}>
      <ThemeProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="(tabs)" />
          <Stack.Screen name="lesson/[id]" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Détail de la Leçon' }}/>
          <Stack.Screen name="quiz/[id]" options={{ presentation: 'fullScreenModal', headerShown: true, headerTitle: 'Quiz en cours' }}/>
          <Stack.Screen name="quiz/results" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Résultats du Quiz' }}/>
          <Stack.Screen name="flashcards/[id]" options={{ presentation: 'modal', headerShown: true, headerTitle: 'Flashcards' }}/>
          <Stack.Screen name="+not-found" />
        </Stack>
        <StatusBar style="auto" />
      </ThemeProvider>
    </Provider>
  );
}
