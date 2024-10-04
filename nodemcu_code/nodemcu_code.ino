#include <TimeLib.h>
#include "DHT.h"
#define DHTPIN D1
#define FLAME_SENSOR_PIN D3
#define DHTTYPE DHT11
#include <Arduino.h>
#include <ESP8266WiFi.h>
#include <Firebase_ESP_Client.h>
#include <NTPClient.h>
#include <WiFiUdp.h>
DHT dht(DHTPIN, DHTTYPE);
#include "addons/TokenHelper.h"
#include "addons/RTDBHelper.h"
#define WIFI_SSID "Krish"
#define WIFI_PASSWORD "Krish@4017"
#define API_KEY "AIzaSyDS_AYzScEhYW3geHd9q0ofPggWHjSaGWo"
#define DATABASE_URL "https://home-automation-fecb5-default-rtdb.firebaseio.com"
#define NTP_SERVER "pool.ntp.org"
#define GMT_OFFSET_SEC 3600
#define DAYLIGHT_OFFSET_SEC 3600

FirebaseData fbdo;
FirebaseAuth auth;
FirebaseConfig config;
bool signupOK = false;

const int UPDATE_INTERVAL = 5000; 
const int BULB_UPDATE_INTERVAL = 10000; 

WiFiUDP ntpUDP;
NTPClient timeClient(ntpUDP, NTP_SERVER, GMT_OFFSET_SEC, DAYLIGHT_OFFSET_SEC);

int relayPin = D4; // Relay control pin
bool relayState = false;

unsigned long previousMillis = 0;
unsigned long bulbPreviousMillis = 0;




void setup() {
  pinMode(D4, OUTPUT);
  pinMode(DHTPIN, INPUT);
  pinMode(FLAME_SENSOR_PIN, INPUT);
  dht.begin();
  Serial.begin(115200);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED){
    Serial.print(".");
    delay(300);
  }
  Serial.println();
  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  config.api_key = API_KEY;
  config.database_url = DATABASE_URL;

  if (Firebase.signUp(&config, &auth, "", "")){
    Serial.println("ok");
    signupOK = true;
  }
  else{
    Serial.printf("%s\n", config.signer.signupError.message.c_str());
  }

  config.token_status_callback = tokenStatusCallback;

  Firebase.begin(&config, &auth);
  Firebase.reconnectWiFi(true);

  timeClient.begin();
}

void loop() {
  unsigned long currentMillis = millis();
  float h = dht.readHumidity();
  float t = dht.readTemperature();
  int flameValue = digitalRead(FLAME_SENSOR_PIN); 

  if (currentMillis - previousMillis >= UPDATE_INTERVAL) {
    previousMillis = currentMillis;

    timeClient.update();

   unsigned long currentEpochTime = timeClient.getEpochTime();

    currentEpochTime += 5 * 3600 + 30 * 60;

    tmElements_t ISTTime;
    breakTime(currentEpochTime, ISTTime);

    char formattedDateTime[20]; 
    snprintf(formattedDateTime, sizeof(formattedDateTime), "%04d-%02d-%02d %02d:%02d:%02d",
             ISTTime.Year + 1970, ISTTime.Month, ISTTime.Day, ISTTime.Hour, ISTTime.Minute, ISTTime.Second);
    
     if (Firebase.ready() && signupOK) {
      if (Firebase.RTDB.getInt(&fbdo, "/Bulb")) {
        if (fbdo.dataType() == "int") {
          int intValue = fbdo.intData();
          Serial.println(intValue);
          if (intValue == 1) {
           if (currentMillis - bulbPreviousMillis >= BULB_UPDATE_INTERVAL) {
              bulbPreviousMillis = currentMillis;
              digitalWrite(relayPin, HIGH); // Turn on the relay (bulb)
              relayState = true;
              Serial.println("Bulb turned ON");
            }
          } else {
            digitalWrite(relayPin, LOW); // Turn off the relay (bulb)
            relayState = false;
            Serial.println("Bulb turned OFF");
          }
        }
      }
      if (Firebase.RTDB.setFloat(&fbdo, "Humidity/" + String(formattedDateTime), h)) {
        Serial.print("Humidity: ");
        Serial.println(h);
      } else {
        Serial.println("FAILED to set Humidity");
        Serial.println("REASON: " + fbdo.errorReason());
      }
      
      if (Firebase.RTDB.setFloat(&fbdo, "Temperature/" + String(formattedDateTime), t)) {
        Serial.print("Temperature: ");
        Serial.println(t);
      } else {
        Serial.println("FAILED to set Temperature");
        Serial.println("REASON: " + fbdo.errorReason());
      }

      if (Firebase.RTDB.setFloat(&fbdo, "Flame/", flameValue)) {
        Serial.print("Flame Value: ");
        Serial.println(flameValue);
      } else {
        Serial.println("FAILED to set Flame Value");
        Serial.println("REASON: " + fbdo.errorReason());
      }
    }
  }
}
