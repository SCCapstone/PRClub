import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import Navigator from './navigation/Navigator';
import store from './redux/store';
import { hydrateInitialState } from './redux/slices/workoutsSlice';

store.dispatch(hydrateInitialState());

export default function App() {
  return (
    <Provider store={store}>
      <SelectProvider>
        <NavigationContainer>
          <Navigator />
        </NavigationContainer>
      </SelectProvider>
    </Provider>
  );
}
