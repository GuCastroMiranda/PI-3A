import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments, useRootNavigationState } from 'expo-router';
import { AuthProvider, useAuth } from '../contexts/AuthContext';
import * as SplashScreen from 'expo-splash-screen';

// 1. Impede que a tela de logo (Splash Screen) suma sozinha assim que o app abre
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const { user } = useAuth();
  const segments = useSegments();
  const router = useRouter();
  const navigationState = useRootNavigationState();
  
  // Criamos um estado para saber se o app terminou de "carregar"
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (!navigationState?.key) return;

    // Apenas aguarda o tempo do Splash Screen uma única vez
    if (!isReady) {
      const timer = setTimeout(() => {
        setIsReady(true);
        SplashScreen.hideAsync();
      }, 1500);
      return () => clearTimeout(timer);
    }

    // Depois que estiver pronto, verifica a rota correta
    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (user && inAuthGroup) {
      // Se tiver logado mas estiver na tela de auth, manda pro tabs
      router.replace('/(tabs)');
    }

  }, [user, segments, navigationState?.key, isReady]);

  if (!navigationState?.key || !isReady) {
    return null;
  }

  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(auth)" />
      <Stack.Screen name="(tabs)" />
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}