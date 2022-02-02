import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
// import { LogBox } from 'react-native';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import Navigator from './navigation/Navigator';
import { store } from './state/store';

// LogBox.ignoreLogs(['Setting a timer']);

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
