import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import { Platform } from 'react-native';
import { LogBox } from 'react-native-web-log-box';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Navigator from './navigation/Navigator';
import { store } from './state/store';
import { CURRENT_USER_KEY } from './constants/async-storage';

if (Platform.OS === 'android') {
  LogBox.ignoreLogs(['Setting a timer']);
}

// caching current user is current broken, remove when fixed
AsyncStorage.removeItem(CURRENT_USER_KEY);

export default function App() {
  return (
    <ReduxProvider store={store}>
      <PaperProvider theme={{ ...DefaultTheme, dark: false }}>
        <SelectProvider>
          <NavigationContainer>
            <Navigator />
          </NavigationContainer>
        </SelectProvider>
      </PaperProvider>
    </ReduxProvider>
  );
}
