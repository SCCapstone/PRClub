import { createStackNavigator } from '@react-navigation/stack';
import React from 'react';
import { Dimensions, View } from 'react-native';
import { ActivityIndicator, Snackbar } from 'react-native-paper';
import tw from 'twrnc';
import useAppDispatch from '../hooks/useAppDispatch';
import useAppSelector from '../hooks/useAppSelector';
import { clearFollowResult, clearUnfollowResult } from '../state/userSlice';
import {
  selectCurrentUser, selectCurrentUserStatus, selectFollowResult, selectUnfollowResult,
} from '../state/userSlice/selectors';
import { followUser, unfollowUser } from '../state/userSlice/thunks';
import User from '../types/shared/User';
import AuthStack from './stacks/auth';
import MainStack from './stacks/main';

const Stack = createStackNavigator();

export default function Navigator() {
  const dispatch = useAppDispatch();

  const currentUser: User | null = useAppSelector(selectCurrentUser);
  const currentUserStatus = useAppSelector(selectCurrentUserStatus);
  const followResult = useAppSelector(selectFollowResult);
  const unfollowResult = useAppSelector(selectUnfollowResult);

  if (currentUserStatus === 'fetching') {
    return <ActivityIndicator />;
  }

  return (
    <>
      <Stack.Navigator
        screenOptions={{ headerShown: false }}
      >
        {currentUser
          ? (
            <Stack.Screen
              name="Main"
              component={MainStack}
            />
          )
          : (
            <Stack.Screen
              name="Auth"
              component={AuthStack}
            />
          )}
      </Stack.Navigator>
      {
        currentUser
        && (
          <View
            style={{
              position: 'absolute',
              top: 0.75 * Dimensions.get('window').height,
              height: 0.175 * Dimensions.get('window').height,
              left: 0.025 * Dimensions.get('window').width,
              width: 0.95 * Dimensions.get('window').width,
            }}
          >
            {
              followResult
              && (
                <>
                  <Snackbar
                    visible={!!followResult && followResult.success}
                    duration={3000}
                    onDismiss={() => {
                      dispatch(clearFollowResult());
                    }}
                    action={{
                      label: 'Unfollow',
                      onPress() {
                        dispatch(unfollowUser(followResult.user?.id || ''));
                      },
                    }}
                  >
                    Followed user!
                  </Snackbar>
                  <Snackbar
                    visible={!!followResult && !followResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearFollowResult())}
                    style={tw`bg-red-500`}
                  >
                    {`Error following user: ${followResult.error?.message}`}
                  </Snackbar>
                </>
              )
            }
            {
              unfollowResult
              && (
                <>

                  <Snackbar
                    visible={!!unfollowResult && unfollowResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearUnfollowResult())}
                    action={{
                      label: 'Follow',
                      onPress() {
                        dispatch(followUser(unfollowResult.user?.id || ''));
                      },
                    }}
                  >
                    Unfollowed user!
                  </Snackbar>
                  <Snackbar
                    visible={!!unfollowResult && !unfollowResult.success}
                    duration={3000}
                    onDismiss={() => dispatch(clearUnfollowResult())}
                    style={tw`bg-red-500`}
                  >
                    {`Error unfollowing user: ${unfollowResult.error?.message}`}
                  </Snackbar>
                </>
              )
            }
          </View>
        )
      }
    </>
  );
}
