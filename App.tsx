import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { Provider } from 'react-redux';
import Navigator from './navigation/Navigator';
import store from './redux/store';
import WgerService from './services/wger';

export default function App() {
  (async () => {
    // eslint-disable-next-line no-console
    console.log(await WgerService.getExerciseInfos(37)); // 37 to get top 10 english exercises
  })();

  return (
    <Provider store={store}>
      <NavigationContainer>
        <Navigator />
      </NavigationContainer>
    </Provider>
  );
}
