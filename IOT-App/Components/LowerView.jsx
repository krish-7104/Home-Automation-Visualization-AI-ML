import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React, {useEffect, useState} from 'react';
import {Lightbulb, LightbulbOff} from 'lucide-react-native';
import database from '@react-native-firebase/database';
import {externalStyle} from './colors';

const LowerView = () => {
  const [data, setData] = useState();
  useEffect(() => {
    const databaseRef = database().ref('/Bulb');

    const onDataChange = snapshot => {
      setData(snapshot.val());
    };

    const onError = error => {
      console.error('Error fetching data: ', error);
    };

    databaseRef.on('value', onDataChange, onError);

    return () => {
      databaseRef.off('value', onDataChange);
    };
  }, []);
  const bulbChangeHandler = async () => {
    try {
      await database()
        .ref('/')
        .update({
          Bulb: data === 0 ? 1 : 0,
        });
      console.log('Data updated.');
    } catch (error) {
      console.error('Error updating data:', error);
    }
  };

  return (
    <View style={styles.lowerView}>
      <TouchableOpacity
        style={styles.buttonView}
        onPress={bulbChangeHandler}
        activeOpacity={0.7}>
        {data === 0 && <Lightbulb size={60} color="black" />}
        {data === 1 && <LightbulbOff size={60} color="black" />}
      </TouchableOpacity>
    </View>
  );
};

export default LowerView;

const styles = StyleSheet.create({
  lowerView: {
    backgroundColor: externalStyle.accent,
    height: '30%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 20,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonView: {
    backgroundColor: 'white',
    width: 140,
    height: 140,
    borderRadius: 100,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 20,
    shadowColor: 'white',
  },
});
