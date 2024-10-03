import React, { useEffect, useState } from "react";
import TemperatureChart from "./TempChart";
import HumidityChart from "./HumidityChart";
import { database, ref, onValue } from "../firebase.js";
import { formateDate } from "./dateFromatter.js";

const App = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [humidityLabels, setHumidityLabels] = useState([]);
  const [tempLabels, setTempLabels] = useState([]);
  const [showTemperature, setShowTemperature] = useState(true);

  useEffect(() => {
    const tempRef = ref(database, "Temperature");
    onValue(tempRef, (snapshot) => {
      const tempData = snapshot.val();
      const timestamps = Object.keys(tempData);
      const values = Object.values(tempData);

      const latestTempTimestamps = timestamps.slice(-10);
      const latestTempValues = values.slice(-10);

      setTempLabels(latestTempTimestamps);
      setTemperatureData(latestTempValues);
    });

    const humidityRef = ref(database, "Humidity");
    onValue(humidityRef, (snapshot) => {
      const humidityData = snapshot.val();
      const timestamps = Object.keys(humidityData);
      const values = Object.values(humidityData);

      const latestHumidityTimestamps = timestamps.slice(-10);
      const latestHumidityValues = values.slice(-10);

      setHumidityLabels(latestHumidityTimestamps);
      setHumidityData(latestHumidityValues);
    });
  }, []);

  const toggleChart = () => {
    setShowTemperature(!showTemperature);
  };

  return (
    <section className="from-violet-600 to-violet-500 bg-gradient-to-tr min-h-[100vh] pb-10 w-full">
      <h1 className="text-center font-bold text-white text-3xl pt-10">
        Weather Data Visualization
      </h1>
      <main className="flex justify-evenly mt-12">
        <section className="w-[35%] gap-4 flex flex-col">
          <div className="text-center w-full mx-auto flex justify-end items-center">
            <button
              className="bg-white text-violet-600 font-bold py-2 px-4 rounded-lg"
              onClick={toggleChart}
            >
              {showTemperature ? "Show Humidity" : "Show Temperature"}
            </button>
          </div>
          <div className="bg-white shadow-lg rounded-lg py-6 px-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-1">
                Latest Temperature
              </p>
              <p className="text-sm text-gray-800">
                {tempLabels.length > 0
                  ? formateDate(tempLabels[0], "full")
                  : "No timestamp available"}
              </p>
            </div>
            <p className="text-4xl font-bold text-violet-600">
              {temperatureData.length > 0 ? temperatureData[0] : "N/A"} °C
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg py-6 px-4 flex justify-between items-center">
            <div>
              <p className="text-xl font-semibold text-gray-700 mb-1">
                Latest Humidity
              </p>
              <p className="text-sm text-gray-800">
                {humidityLabels.length > 0
                  ? formateDate(humidityLabels[0], "full")
                  : "No timestamp available"}
              </p>
            </div>
            <p className="text-4xl font-bold text-violet-600">
              {humidityData.length > 0 ? humidityData[0] : "N/A"} °C
            </p>
          </div>
        </section>
        <section className="flex justify-center items-center w-[60%]">
          <div className="grid grid-cols-1 text-white bg-white w-[100%] p-10 rounded-xl">
            {showTemperature ? (
              <TemperatureChart
                labels={tempLabels}
                temperatureData={temperatureData}
              />
            ) : (
              <HumidityChart
                labels={humidityLabels}
                humidityData={humidityData}
              />
            )}
          </div>
        </section>
      </main>
    </section>
  );
};

export default App;
