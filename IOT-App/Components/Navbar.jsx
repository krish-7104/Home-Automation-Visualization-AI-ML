import {StyleSheet, Text, View} from 'react-native';
import React from 'react';
import {externalStyle} from './colors';

const Navbar = () => {
  return (
    <View style={styles.navigation}>
      <Text style={styles.navtext}>Home Automation</Text>
    </View>
  );
};

export default Navbar;

const styles = StyleSheet.create({
  navigation: {
    width: '100%',
    elevation: 10,
    backgroundColor: externalStyle.accent,
    // borderBottomEndRadius: 20,
    // borderBottomStartRadius: 20,
  },
  navtext: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 22,
    paddingHorizontal: 10,
    paddingVertical: 12,
    color: 'black',
    textAlign: 'center',
    color: 'white',
  },
});
