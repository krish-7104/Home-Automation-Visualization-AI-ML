import {StyleSheet, Text, View} from 'react-native';
import React from 'react';

const CardContainer = props => {
  const sortedKeys = Object.keys(props.data).sort().reverse();
  return (
    <View style={styles.card}>
      <Text style={styles.title}>{props.title}</Text>
      <Text style={styles.data}>
        {props.data[sortedKeys[0]]}
        {props.title === 'Temperature' ? `${'\u00b0'}C` : '%'}
      </Text>
    </View>
  );
};

export default CardContainer;

const styles = StyleSheet.create({
  card: {
    elevation: 10,
    width: '45%',
    backgroundColor: '#fff',
    borderRadius: 10,
    display: 'flex',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 20,
  },
  title: {
    fontFamily: 'Poppins-Medium',
    fontSize: 16,
    color: '#000000',
    opacity: 0.8,
  },
  data: {
    fontFamily: 'Poppins-SemiBold',
    fontSize: 26,
    color: 'black',
    letterSpacing: 2,
  },
});
