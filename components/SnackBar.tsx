import React, { Component } from 'react';
import { AppRegistry, StyleSheet, Text, View, Button } from 'react-native';
import Snackbar from 'react-native-snackbar-component';

export default class SnackBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      snackIsVisible: false,
      distance: 0,
    };
  }

  render() {
    return (
      <View style={styles.container}>
        <Button
          onPress={() => {
            this.setState({ 
              snackIsVisible: !this.state.snackIsVisible
            });
          }}

          title="show snackbar"
          color="#114455"
          accessibilityLabel="toggle"
        />
    
        <Snackbar
          visible={this.state.snackIsVisible}
          textMessage="Workout Submitted!"
          actionHandler={() => {
            alert("OK");
            this.setState({ 
              snackIsVisible: !this.state.snackIsVisible 
            });
          }}
          actionText="OK"
          distanceCallback={distance => {
            this.setState({ distance: distance });
          }}
        />
      </View>
    );
  }
}


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
});