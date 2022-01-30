import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider as ReduxProvider } from 'react-redux';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import Navigator from './navigation/Navigator';
import { store } from './state/store';

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
