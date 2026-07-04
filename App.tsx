import { View } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useFonts, RussoOne_400Regular } from '@expo-google-fonts/russo-one';
import { ChakraPetch_500Medium, ChakraPetch_700Bold } from '@expo-google-fonts/chakra-petch';
import { GameScreen } from './app/game/GameScreen';
import { COLORS } from './app/game/constants';

export default function App() {
  const [fontsLoaded] = useFonts({
    RussoOne_400Regular,
    ChakraPetch_500Medium,
    ChakraPetch_700Bold,
  });

  if (!fontsLoaded) {
    return <View style={{ flex: 1, backgroundColor: COLORS.surface }} />;
  }

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <GameScreen />
        <StatusBar style="light" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
