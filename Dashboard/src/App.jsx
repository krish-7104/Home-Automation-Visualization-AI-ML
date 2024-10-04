import React, { useEffect, useState } from "react";
import TemperatureChart from "./TempChart";
import HumidityChart from "./HumidityChart";
import { database, ref, onValue } from "../firebase.js";
import { formateDate } from "./dateFromatter.js";
import axios from "axios";
import CombinedChart from "./CombinerChart.jsx";

const App = () => {
  const [temperatureData, setTemperatureData] = useState([]);
  const [humidityData, setHumidityData] = useState([]);
  const [humidityLabels, setHumidityLabels] = useState([]);
  const [tempLabels, setTempLabels] = useState([]);
  const [showTemperature, setShowTemperature] = useState(true);
  const [selectedDate, setSelectedDate] = useState("");
  const [predictedData, setPredictedData] = useState(null);
  const [days, setDays] = useState(10); // Default days to fetch future predictions
  const [futurePredictions, setFuturePredictions] = useState({
    labels: [],
    temperature: [],
    humidity: [],
  });

  // Function to fetch future predictions
  const fetchFuturePredictions = async (numOfDays) => {
    try {
      const response = await axios.get(
        `http://127.0.0.1:5000/predict-future/${numOfDays}`
      );
      const data = response.data;
      const labels = data.map((item) => item.date);
      const predictedTemperatures = data.map(
        (item) => item.predicted_temperature
      );
      const predictedHumidity = data.map((item) => item.predicted_humidity);

      setFuturePredictions({
        labels: labels,
        temperature: predictedTemperatures,
        humidity: predictedHumidity,
      });
    } catch (error) {
      console.error("Error fetching future predictions:", error);
    }
  };

  // Fetch initial data and default future predictions on component load
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

    fetchFuturePredictions(days); // Fetch default future predictions for 10 days
  }, []);

  // Handle search button click to fetch predictions based on the new 'days' value
  const handleSearch = () => {
    if (days > 0) {
      fetchFuturePredictions(days);
    }
  };

  const toggleChart = () => {
    setShowTemperature(!showTemperature);
  };

  const handleDateChange = async (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    try {
      const response = await axios.get(`http://127.0.0.1:5000/predict/${date}`);
      setPredictedData({
        temperature: response.data.predicted_temperature,
        humidity: response.data.predicted_humidity,
      });
    } catch (error) {
      console.error("Error fetching predicted humidity:", error);
    }
  };

  return (
    <section className="from-violet-600 to-violet-500 bg-gradient-to-tr min-h-[100vh] pb-10 w-full">
      <h1 className="text-center font-bold text-white text-3xl pt-10">
        Weather Data Visualization
      </h1>
      <main className="flex justify-evenly mt-12">
        <section className="w-[35%] gap-4 flex flex-col h-full">
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
              {humidityData.length > 0 ? humidityData[0] : "N/A"} %
            </p>
          </div>
          <div className="bg-white shadow-lg rounded-lg py-6 px-4">
            <div className="flex justify-between items-center">
              <label className="text-xl font-semibold text-gray-700">
                Select Future Date
              </label>
              <input
                type="date"
                className="border rounded-lg px-3 py-1"
                value={selectedDate}
                onChange={handleDateChange}
              />
            </div>
            {predictedData && (
              <div className="mt-4">
                <div className="flex justify-between items-center mb-2">
                  <p className="text-lg text-gray-800">
                    Predicted Temperature:
                  </p>
                  <p className="text-2xl font-bold text-violet-600">
                    {Math.floor(predictedData.temperature)} °C
                  </p>
                </div>
                <div className="flex justify-between items-center">
                  <p className="text-lg text-gray-800">Predicted Humidity:</p>
                  <p className="text-2xl font-bold text-violet-600">
                    {Math.floor(predictedData.humidity)} %
                  </p>
                </div>
              </div>
            )}
          </div>
        </section>
        <section className="flex justify-center items-center w-[60%]">
          <div className="grid grid-cols-1 text-white bg-white w-[100%] p-10 rounded-xl relative">
            <div className="text-center w-full mx-auto flex justify-end items-center absolute top-2 right-2">
              <button
                className="bg-white text-violet-600 font-bold py-2 px-4 rounded-lg"
                onClick={toggleChart}
              >
                {showTemperature ? "Show Humidity" : "Show Temperature"}
              </button>
            </div>
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
      <section className="flex justify-center items-center mt-12">
        <div className="w-[95%] bg-white p-10 rounded-xl">
          <div className="flex justify-between items-center">
            <h2 className="text-center text-2xl font-bold text-violet-600 mb-6">
              Future Weather Predictions (Next {days} Days)
            </h2>
            <div className="flex">
              <input
                type="number"
                className="border rounded-lg px-3 py-1 mr-2"
                value={days}
                onChange={(e) => setDays(e.target.value)}
              />
              <button
                className="bg-violet-600 text-white font-bold py-2 px-4 rounded-lg"
                onClick={handleSearch}
              >
                Search
              </button>
            </div>
          </div>
          <div className="w-full">
            <CombinedChart
              humidityData={futurePredictions.humidity}
              temperatureData={futurePredictions.temperature}
              labels={futurePredictions.labels}
            />
          </div>
        </div>
      </section>
    </section>
  );
};

export default App;
