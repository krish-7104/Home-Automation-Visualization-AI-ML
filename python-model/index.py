from flask import Flask, jsonify
from flask_cors import CORS 
import firebase_admin
from firebase_admin import credentials, db
import pandas as pd
from sklearn.linear_model import LinearRegression
from sklearn.model_selection import train_test_split
import numpy as np
from datetime import datetime, timedelta

app = Flask(__name__)

CORS(app) 

cred = credentials.Certificate('firebase-key.json')
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://home-automation-fecb5-default-rtdb.firebaseio.com/'
})

temp_ref = db.reference('/Temperature')
humidity_ref = db.reference('/Humidity')

def fetch_data(ref):
    firebase_data = ref.get()  
    data = {
        "timestamps": [],
        "values": []
    }
    for key, value in firebase_data.items():
        try:
            data["timestamps"].append(key)
            data["values"].append(float(value))  
        except ValueError:
            continue  
    return pd.DataFrame(data)

def train_model(data):
    data['timestamps'] = pd.to_datetime(data['timestamps'])
    data['timestamps'] = data['timestamps'].astype(np.int64) // 10**9  

    X = data[['timestamps']]
    y = data['values']

    X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

    model = LinearRegression()
    model.fit(X_train, y_train)

    return model

def predict_future(model, timestamp):
    future_value = model.predict(np.array([[timestamp]]))
    return future_value[0]

@app.route('/data', methods=['GET'])
def get_data():
    temp_data = fetch_data(temp_ref)  
    humidity_data = fetch_data(humidity_ref)  
    return jsonify({
        "temperature_data": temp_data.to_dict(),
        "humidity_data": humidity_data.to_dict()
    })

@app.route('/predict/<future_timestamp>', methods=['GET'])
def predict(future_timestamp):
    future_timestamp = int(pd.to_datetime(future_timestamp).timestamp())
    
    temp_data = fetch_data(temp_ref)  
    humidity_data = fetch_data(humidity_ref)  

    temp_model = train_model(temp_data)  
    humidity_model = train_model(humidity_data)  

    predicted_temp = predict_future(temp_model, future_timestamp)
    predicted_humidity = predict_future(humidity_model, future_timestamp)
    
    return jsonify({
        "predicted_temperature": predicted_temp,
        "predicted_humidity": predicted_humidity
    })

@app.route('/predict-future/<days>', methods=['GET'])
def predict_next_week(days):
    temp_data = fetch_data(temp_ref)  
    humidity_data = fetch_data(humidity_ref)  

    temp_model = train_model(temp_data)  
    humidity_model = train_model(humidity_data)

    predictions = []
    today = datetime.now()

    for i in range(int(days)): 
        future_date = today + timedelta(days=i)
        future_timestamp = int(future_date.timestamp())

        predicted_temp = predict_future(temp_model, future_timestamp)
        predicted_humidity = predict_future(humidity_model, future_timestamp)

        predictions.append({
            "date": future_date.strftime('%Y-%m-%d'),
            "predicted_temperature": predicted_temp,
            "predicted_humidity": predicted_humidity
        })
    
    return jsonify(predictions)

if __name__ == '__main__':
    app.run(debug=True)
