import {
  Dimensions,
  StyleSheet,
  View,
  TouchableOpacity,
  Text,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import CardContainer from './CardContainer';
import Navbar from './Navbar';
import database from '@react-native-firebase/database';
import {LineChart} from 'react-native-chart-kit';
import {externalStyle} from './colors';

const UpperView = () => {
  const [data, setData] = useState();
  const [select, setSelect] = useState('Temperature');
  useEffect(() => {
    const databaseRef = database().ref('/');

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

  const chartConfig = {
    color: (opacity = 1) => `rgb(0,0,0), ${opacity})`,
    strokeWidth: 2,
    backgroundGradientFrom: '#fff',
    backgroundGradientTo: '#fff',
  };

  return (
    <View style={styles.upperView}>
      <Navbar />
      {data && (
        <View style={styles.cardView}>
          <CardContainer title={'Temperature'} data={data?.Temperature} />
          <CardContainer title={'Humidity'} data={data?.Humidity} />
        </View>
      )}
      <View style={styles.btnMainView}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setSelect('Temperature')}
          style={
            select === 'Temperature' ? styles.btnViewActive : styles.btnView
          }>
          <Text
            style={
              select === 'Temperature' ? styles.btnTextActive : styles.btnText
            }>
            Temperature
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          activeOpacity={0.8}
          style={select === 'Humidity' ? styles.btnViewActive : styles.btnView}
          onPress={() => setSelect('Humidity')}>
          <Text
            style={
              select === 'Humidity' ? styles.btnTextActive : styles.btnText
            }>
            Humidity
          </Text>
        </TouchableOpacity>
      </View>
      {data && (
        <>
          {select === 'Temperature' ? (
            <LineChart
              style={styles.graphStyle}
              data={{
                labels: Object.entries(data.Temperature)
                  .map(([timestamp, value]) => ({
                    x: timestamp,
                    y: value,
                  }))
                  .slice(0, 5)
                  .map(
                    dataPoint =>
                      `${dataPoint.x.slice(11).split(':')[0] - 1}:${
                        dataPoint.x.slice(11).split(':')[1]
                      }:${dataPoint.x.slice(11).split(':')[2]}`,
                  ),
                datasets: [
                  {
                    data: Object.entries(data.Temperature)
                      .map(([timestamp, value]) => ({
                        x: timestamp,
                        y: value,
                      }))
                      .slice(0, 5)
                      .map(dataPoint => dataPoint.y),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 30}
              height={220}
              chartConfig={chartConfig}
            />
          ) : (
            <LineChart
              style={styles.graphStyle}
              data={{
                labels: Object.entries(data.Humidity)
                  .map(([timestamp, value]) => ({
                    x: timestamp,
                    y: value,
                  }))
                  .slice(0, 5)
                  .map(
                    dataPoint =>
                      `${dataPoint.x.slice(11).split(':')[0] - 1}:${
                        dataPoint.x.slice(11).split(':')[1]
                      }:${dataPoint.x.slice(11).split(':')[2]}`,
                  ),
                datasets: [
                  {
                    data: Object.entries(data.Humidity)
                      .map(([timestamp, value]) => ({
                        x: timestamp,
                        y: value,
                      }))
                      .slice(0, 5)
                      .map(dataPoint => dataPoint.y),
                  },
                ],
              }}
              width={Dimensions.get('window').width - 30}
              height={220}
              chartConfig={chartConfig}
            />
          )}
        </>
      )}
    </View>
  );
};

export default UpperView;

const styles = StyleSheet.create({
  upperView: {
    width: '100%',
    height: '70%',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  cardView: {
    marginVertical: 20,
    justifyContent: 'space-evenly',
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  graphStyle: {
    marginHorizontal: 'auto',
    borderRadius: 10,
    marginVertical: 30,
  },
  btnMainView: {
    justifyContent: 'space-evenly',
    alignItems: 'center',
    flexDirection: 'row',
    width: '100%',
    marginTop: 10,
  },
  btnView: {
    backgroundColor: '#fff',
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  btnText: {
    fontFamily: 'Poppins-Medium',
    color: externalStyle.accent,
    paddingVertical: 6,
  },
  btnViewActive: {
    backgroundColor: externalStyle.accent,
    width: '40%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
    elevation: 14,
    shadowColor: externalStyle.accent,
  },
  btnTextActive: {
    fontFamily: 'Poppins-Medium',
    color: 'white',
    paddingVertical: 6,
  },
});
