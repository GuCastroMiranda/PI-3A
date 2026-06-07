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

    const inAuthGroup = segments[0] === '(auth)';

    // 2. Coloquei um temporizador de 1.5 segundos simulando o "carregamento" do app.
    // No futuro, se você for buscar dados do banco de dados, é aqui que o app espera!
    setTimeout(() => {
      if (!user && !inAuthGroup) {
        router.replace('/(auth)/login');
      } else if (user && inAuthGroup) {
        router.replace('/(tabs)');
      }

      // 3. Após direcionar o usuário para a tela certa, nós liberamos a tela de logo
      setIsReady(true);
      SplashScreen.hideAsync();
      
    }, 1500); // 1500 = 1,5 segundos. Pode aumentar ou diminuir como preferir.

  }, [user, segments, navigationState?.key]);

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