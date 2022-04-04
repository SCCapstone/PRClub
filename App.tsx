import { SelectProvider } from '@mobile-reality/react-native-select-pro';
import { NavigationContainer } from '@react-navigation/native';
import React from 'react';
import { DefaultTheme, Provider as PaperProvider } from 'react-native-paper';
import { Provider as ReduxProvider } from 'react-redux';
import {
  AuthProvider, DatabaseProvider, FirebaseAppProvider, FirestoreProvider, StorageProvider,
} from 'reactfire';
import {
  auth, database, firebaseConfig, firestore, storage,
} from './firebase-lib';
import Navigator from './navigation/Navigator';
import { store } from './state/store';

export default function App() {
  return (
    <FirebaseAppProvider firebaseConfig={firebaseConfig}>
      <FirestoreProvider sdk={firestore}>
        <AuthProvider sdk={auth}>
          <StorageProvider sdk={storage}>
            <DatabaseProvider sdk={database}>
              <ReduxProvider store={store}>
                <PaperProvider theme={{ ...DefaultTheme, dark: false }}>
                  <SelectProvider>
                    <NavigationContainer>
                      <Navigator />
                    </NavigationContainer>
                  </SelectProvider>
                </PaperProvider>
              </ReduxProvider>
            </DatabaseProvider>
          </StorageProvider>
        </AuthProvider>
      </FirestoreProvider>
    </FirebaseAppProvider>
  );
}
