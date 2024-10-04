import {TouchableOpacity, Modal, StyleSheet, View, Text} from 'react-native';
import React, {useEffect, useState} from 'react';
import UpperView from './Components/UpperView';
import LowerView from './Components/LowerView';
import database from '@react-native-firebase/database';

const App = () => {
  const [showPopup, setShowPopup] = useState(false);
  useEffect(() => {
    const databaseRef = database().ref('/Flame');
    const onDataChange = snapshot => {
      if (snapshot.val() === 0) {
        setShowPopup(true);
      }
    };

    const onError = error => {
      console.error('Error fetching data: ', error);
    };

    databaseRef.on('value', onDataChange, onError);

    return () => {
      databaseRef.off('value', onDataChange);
    };
  }, []);
  return (
    <View style={styles.container}>
      <UpperView />
      <LowerView />
      <Modal visible={showPopup} transparent animationType="fade">
        <View style={styles.modalContainer}>
          <View style={styles.popup}>
            <Text style={styles.optionHead}>Fire Alert</Text>
            <TouchableOpacity
              style={styles.cancelOption}
              onPress={() => setShowPopup(!showPopup)}>
              <Text style={styles.cancelOptionText}>Dismiss</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    width: '80%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  option: {
    paddingVertical: 8,
    paddingHorizontal: 20,
  },
  optionHead: {
    fontSize: 30,
    color: 'black',
    fontFamily: 'Poppins-SemiBold',
    marginBottom: 10,
  },
  cancelOption: {
    paddingVertical: 4,
    borderColor: 'black',
    borderRadius: 10,
    borderWidth: 2,
    width: '40%',
  },
  cancelOptionText: {
    fontSize: 14,
    color: 'black',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
});
