import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Navigator from './navigation/Navigator';
import store from './redux/store';
import WgerService from './services/wger';

export default function App() {
  (async () => {
    console.log(await WgerService.getExerciseInfos());
  })();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
}
