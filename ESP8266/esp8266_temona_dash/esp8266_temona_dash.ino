#include <ESP8266WiFi.h>
#include <WiFiClient.h>
#include <ESP8266HTTPClient.h>
#include <ESP8266WebServer.h>
#include <FS.h>
// モード切り替えピン
//#define MODE_PIN 5 // GPIO5
#define MODE_PIN 14 //GPIO14
// モード切り替えの待ち時間
#define MODE_CHANGE_TIME 5

// 開閉検知PIN
//#define OPEN_PIN 4 // GPIO4
// LED、デフォルトLED＿PINは１３番(ボード乗せている方)
#define LED_PIN 12
#define LED_PIN2 13
#define USE_SERIAL Serial

//温湿度センサーAdafruit_HDC1000
//GPIO4:SDA
//GPIO5:SCL
#include <Wire.h>
#include "Adafruit_HDC1000.h"
Adafruit_HDC1000 hdc = Adafruit_HDC1000();
#include "floatToString.h" //in same folder with .ino file

// Wi-Fi設定保存ファイル
const char* settings = "/wifi_settings.txt";

// サーバモードでのパスワード
const String pass = "esp8266wifi";

//int opened = 0;//開封かどうかを最初から測る
int counter = 0;//サーバーモードのカウンター、5分後サーバーモードがスリープに陥る

void led_blink_send_ok();
void led_blink_send_fail();
void led_blink_config_saved();
void led_blink_show_config_page();

//電力消耗:
//稼働中: 5V 0.07A
//Sleep: 5V 0.00A(<10mA)

// サーバーモード用
ESP8266WebServer server(80);
// クライアントモード用
//ESP8266WiFiMulti WiFiMulti;
/**
 * WiFi設定
 */
void handleRootGet() {
  String html = "";

  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  String host = f.readStringUntil('\n');
  //int port = f.parseInt();
  int sleep = f.parseInt();
  //Serial.println("sleep is : ");
  //Serial.println(sleep);
  //Serial.println(String(sleep));
  String sleep_str = sleep?String(sleep) : "30";
  //html += "<h1>WiFi Settings</h1>";
  //html += "<form method='post'>";
  //html += "<p>SSID : <input type='text' name='ssid' placeholder='SSID' value='"+ ssid +"'></p>";
  //html += "<p>PASS : <input type='text' name='pass' placeholder='Pass' value='"+ pass +"'></p>";
  //html += "<p>UUID : <input type='text' name='uuid' placeholder='UUID' value='"+ uuid +"'></p>";
  //html += "<p>HOST : <input type='text' name='host' placeholder='Host' value='"+ host +"'></p>";
  //html += "<p>WAIT : <input type='number' name='sleep' placeholder='Wait Time Sec' value='"+ sleep_str +"'><br>";
  //html += "  <input type='submit'><br>";
  //html += "</form>";
  html += "<!DOCTYPE html>";
  html += "<html>";
  html += "<head>";
  html += "<meta charset='utf-8'>";
  html += "<title>WiFi Settings</title>";
  html += "<style>input{width: 250px}</style>";
  html += "<style>.shop{display:none}</style>";
  html += "<script>";
  html += "console.log('%c TEMONA IoT ','color:#fff;background:rgba(250,151,0,1);font-size:5em');";
  html += "</script>";
  html += "<script>";
  html += "console.log('%cPlease Type Under Words to Active Advance Settings.','color:#A00');";
  html += "</script>";
  html += "<script>";
  html += "console.log('%c$$(\\'.shop\\').forEach((s)=>{s.style.display=\\'table-row\\'})','color:#0A0');";
  html += "</script>";
  html += "</head>";
  html += "<body>";
  html += "<h1>WiFi Settings</h1>";
  html += "<form method='post'>";
  html += "<table>";
  html += "<tr><td>SSID : </td><td><input type='text' name='ssid' placeholder='SSID' value='"+ ssid +"'></td></tr>";
  html += "<tr><td>PASS : </td><td><input type='text' name='pass' placeholder='Pass' value='"+ pass +"'></td></tr>";
  html += "<tr class='shop'><td>UUID : </td><td><input type='text' name='uuid' placeholder='UUID' value='"+ uuid +"'></td></tr>";
  html += "<tr class='shop'><td>HOST : </td><td><input type='text' name='host' placeholder='Host' value='"+ host +"'></td></tr>";
  html += "<tr class='shop'><td>WAIT : </td><td><input type='number' name='sleep' placeholder='Wait Time Sec' value='"+ sleep_str +"'></td></tr>";
  html += "<tr><td></td><td><input type='submit'></td></tr>";
  html += "</table>";
  html += "</form>";
  html += "</body>";
  html += "</html>";
  Serial.println("Get From User...");
  server.send(200, "text/html", html);
  led_blink_show_config_page();
}

void handleRootPost() {
  String ssid = server.arg("ssid");
  String pass = server.arg("pass");
  String uuid = server.arg("uuid");
  String host = server.arg("host");
  String sleep = server.arg("sleep");

  File f = SPIFFS.open(settings, "w");
  f.println(ssid);
  f.println(pass);
  f.println(uuid);
  f.println(host);
  f.println(sleep);
  f.close();

  String html = "";
  //html += "<h1>WiFi Settings</h1>";
  //html += "SSID: "+ssid + "<br>";
  //html += "PASS: "+pass + "<br>";
  //html += "UUID: "+uuid + "<br>";
  //html += "HOST: "+host + "<br>";
  //html += "WAIT TIME: "+sleep + " Sec<br>";
  html += "<!DOCTYPE html>";
  html += "<html>";
  html += "<head>";
  html += "<meta charset='utf-8'>";
  html += "<title>Confirm WiFi Settings</title>";
  html += "<style>.shop{display:none}</style>";
  html += "<script>console.log('%cAWESOME!!','color:rgba(250,100,0,1);font-size:5em');</script>";
  html += "<script>console.log('%cPlease Type Under Words to Confirm Advance Settings.','color:#A0A');</script>";
  html += "<script>console.log('%c$$(\\'.shop\\').forEach((s)=>{s.style.display=\\'block\\'})','color:#0A0');</script>";
  html += "</head>";
  html += "<body>";
  html += "<h1>Confirm WiFi Settings</h1>";
  html += "<p>SSID: "+ssid + "</p>";
  html += "<p>PASS: "+pass + "</p>";
  html += "<p class='shop'>UUID: "+uuid + "</p>";
  html += "<p class='shop'>HOST: "+host + "</p>";
  html += "<p class='shop'>WAIT TIME: "+sleep + " Sec</p>";
  html += "</body>";
  html += "</html>";
  server.send(200, "text/html", html);
  Serial.println("Config Saved !");
  led_blink_config_saved();
  //delay(15 * 1000);
  Serial.println("Plz Reboot Device...");

  //休眠1s
  //ESP.deepSleep(1000);
}

//void delete_crlf(char str[40]);
/* link to server */
void HTTP_GET_1(const char *url,const char *uuid,int remain_lvl,int battery_lvl,int opened)
{
    char S1[150];
    //delete_crlf(url);
    //delete_crlf(uuid);
    // wait for WiFi connection
    //ESP8266WiFiMulti WiFiMulti;
    if((WiFi.status() == WL_CONNECTED)) {

        HTTPClient http;
        //WiFiClient client;
        //USE_SERIAL.printf(url);
        USE_SERIAL.print("[HTTP] begin...\n");


        //温湿度センサーAdafruit_HDC1000
        //buffer for temp&hum floats to strings
        char temp[16];
        char hum[16];
        floatToString(temp, hdc.readTemperature() , 4);
        floatToString(hum, hdc.readHumidity() , 4);

        // configure traged server and url
        sprintf(S1,"%s/api?uuid=%s&remain_lvl=%d&battery_lvl=%d&opened=%d&temp=%s&hum=%s",url,uuid,remain_lvl,battery_lvl,opened,temp,hum);
        //sprintf(S1,"%s/api?uuid=%s&remain_lvl=%d&battery_lvl=%d&opened=%d",url,uuid,remain_lvl,battery_lvl,opened);
        USE_SERIAL.print(S1);
        USE_SERIAL.print("\n");
        http.begin(S1); //HTTP
        //http.begin("http://153.120.158.89:3033/api?uuid=test_esp_dev&remain_lvl=100&battery_lvl=4&opened=1");
        USE_SERIAL.print("[HTTP] GET...\n");
        // start connection and send HTTP header
        int httpCode = http.GET();

        // httpCode will be negative on error
        if(httpCode > 0) {
            // HTTP header has been send and Server response header has been handled
            USE_SERIAL.printf("[HTTP] GET... code: %d\n", httpCode);

            // file found at server
            if(httpCode == HTTP_CODE_OK) {
                String payload = http.getString();
                USE_SERIAL.println(payload);
                led_blink_send_ok();
            }else{
              led_blink_send_fail();
            }

        } else {
            USE_SERIAL.printf("[HTTP] GET... failed, error: %s\n", http.errorToString(httpCode).c_str());
            led_blink_send_fail();
        }

        http.end();
    }
}

/*
void delete_crlf(char str[40]){
  for(int i=0 ; i<40; i++){
    if(str[i] == '\n'){
      str[i] = '\0';
    }
  }
}
*/
/**
 * 初期化(クライアントモード)
 */
void setup_client() {

  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  String host = f.readStringUntil('\n');
  int sleep = f.parseInt();
  f.close();

  if(!sleep||sleep < 1){
    sleep = 30;
  }

  //空白を削除
  ssid.trim();
  pass.trim();
  uuid.trim();
  host.trim();

  Serial.println("SSID: " + ssid);
  Serial.println("PASS: " + pass);
  Serial.println("UUID: " + uuid);
  Serial.println("HOST: " + host);
  Serial.print("Sleep: " );
  Serial.print(sleep);
  Serial.println(" Sec.");

  //ESP8266WiFiMulti WiFiMulti;
  WiFi.begin(ssid.c_str(), pass.c_str());
  //WiFiMulti.addAP(ssid.c_str(), pass.c_str());
  while (WiFi.status() != WL_CONNECTED) {
  //while (WiFiMulti.run() != WL_CONNECTED) {
    //delay(1000);
    led_blink_waiting_wifi();
    Serial.print(".");
    counter++;
    //45秒接続がない場合は寝る
    if(counter > 45){
      Serial.println();
      Serial.println("Time Out! Fall into Sleep...");
      //ESP.deepSleep(20*1000*1000);
      led_wifi_timeout();
      ESP.deepSleep(0);
      delay(1000);
    }
  }
  //WiFiMulti.addAP("TEMONA Guest", "welcometotemona");
  delay(1000);
  digitalWrite(LED_PIN, HIGH);
  Serial.println("");

  Serial.println("WiFi connected");

  Serial.print("IP address: ");
  Serial.println(WiFi.localIP());

  // We now create a URI for the request
  int remain_lvl = 100;
  int battery_lvl = 4;

  host.trim();
  uuid.trim();
  HTTP_GET_1(host.c_str(),uuid.c_str(),remain_lvl,battery_lvl,1);

  delay(1 * 1000);
  Serial.println("Fall into Sleep...");
  //休眠、数分後ResetにIO16から負のパルスを発信して復帰
  //以下の場合は復帰しない★★
  ESP.deepSleep(0);
  //ESP.deepSleep(20 * 1000 * 1000);
  delay(1000);
}

/**
 * 初期化(サーバモード)
 */
void setup_server() {
  byte mac[6];
  WiFi.macAddress(mac);
  String ssid = "ESP_";
  for (int i = 0; i < 6; i++) {
    ssid += String(mac[i], HEX);
  }
  Serial.println("SSID: " + ssid);
  Serial.println("PASS: " + pass);

  /* You can remove the password parameter if you want the AP to be open. */
  WiFi.softAP(ssid.c_str(), pass.c_str());

  server.on("/", HTTP_GET, handleRootGet);
  server.on("/", HTTP_POST, handleRootPost);
  server.begin();
  Serial.println("HTTP server started.");
  Serial.println("Setup: http://192.168.4.1/");

}


/**
 * 初期化
 */
void setup() {
  Serial.begin(74880);
  // ファイルシステム初期化
  SPIFFS.begin();
  pinMode(LED_PIN, OUTPUT);
  pinMode(LED_PIN2, OUTPUT);
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(LED_PIN2, HIGH);
  Serial.println();
  File f = SPIFFS.open(settings, "r");
  String ssid = f.readStringUntil('\n');
  String pass = f.readStringUntil('\n');
  String uuid = f.readStringUntil('\n');
  String host = f.readStringUntil('\n');
  int sleep = f.parseInt();
  f.close();
  if(!sleep||sleep < MODE_CHANGE_TIME){
    sleep = 30;
  }
  //pinMode(4, INPUT);
  //Serial.print("Pin4: ");
  //Serial.println(digitalRead(4));

  Serial.println("Press Mode Button To Active Setting Mode...");
  Serial.print("PIN ");Serial.print(MODE_PIN);Serial.println(" as MODE PIN");
  Serial.println("LOW : Server Mode");
  Serial.println("HIGH : Client Mode");
  // 数秒以内にMODEを切り替える、デフォルト:10s
  // pin5 デフォルトは0
  //  0 : Server
  //  1 : Client
  delay(MODE_CHANGE_TIME*1000);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_PIN2, LOW);

  //温湿度センサーAdafruit_HDC1000
  if (!hdc.begin()) {
    Serial.println("Couldn't find sensor!");
    led_wifi_timeout();
    //while (1);
  }

  pinMode(MODE_PIN, INPUT);

  if (digitalRead(MODE_PIN) == 0) {
    // サーバモード初期化
    setup_server();
  } else {
    // クライアントモード初期化
    Serial.println("Client Mode ON !");
    Serial.print("Waiting ");
    Serial.print((sleep-MODE_CHANGE_TIME));
    Serial.println(" Sec...");
    //delay((sleep-10)* 1000); //使用が終わるまで、数秒待ち
    led_blink_wait_for_use((sleep-MODE_CHANGE_TIME));
    //pinMode(OPEN_PIN, INPUT);//check if closed
    //if(digitalRead(OPEN_PIN) == 0){
    if(true){
      digitalWrite(LED_PIN, LOW);
      setup_client();
    }else{
      Serial.println("Not Closed yet...");
      for(int i = 0; i< 10 ;i++){
        digitalWrite(LED_PIN, LOW);
        delay(500);
        digitalWrite(LED_PIN, HIGH);
        delay(500);
      }
      digitalWrite(LED_PIN, LOW);
      Serial.println("Time Out! Fall into Sleep...");
      ESP.deepSleep(0);
      delay(1000);
    }
  }
}

void loop() {
  server.handleClient();
  //pinMode(4, INPUT);
  //Serial.print("Pin 4: ");
  //Serial.println(digitalRead(4));
  Serial.print("Pin AD0: ");
  Serial.println(analogRead(A0));
  digitalWrite(LED_PIN, HIGH);
  digitalWrite(LED_PIN2, HIGH);
  delay(2500);
  digitalWrite(LED_PIN, LOW);
  digitalWrite(LED_PIN2, LOW);
  delay(2500);
  counter ++ ;
  if(counter > 60){
    Serial.println("Fall into Sleep...");
    //休眠、数分後ResetにIO16から負のパルスを発信して復帰
    //u32_t使っているため、最大は4,294,967,295us(約1h)
    //ESP.deepSleep(4294967295);
    digitalWrite(LED_PIN, LOW);
    ESP.deepSleep(0);
    delay(1000);
  }

  //温湿度センサーAdafruit_HDC1000
  Serial.print("Temp: "); Serial.print(hdc.readTemperature());
  Serial.print("\t\tHum: "); Serial.println(hdc.readHumidity());
  //delay(500);
}


// LED Settings
void led_blink_wait_for_use(int time_sec){
  digitalWrite(LED_PIN, LOW);
  for(int i=0; i < time_sec; i++){
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(LED_PIN2, HIGH);
    delay(850);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(LED_PIN2, LOW);
    delay(150);
  }
}

void led_blink_send_ok(){
  digitalWrite(LED_PIN, LOW);
  for(int i=0; i < 10; i++){
    digitalWrite(LED_PIN, HIGH);
    digitalWrite(LED_PIN2, HIGH);
    delay(100);
    digitalWrite(LED_PIN, LOW);
    digitalWrite(LED_PIN2, LOW);
    delay(100);
  }
}

void led_blink_send_fail(){
  digitalWrite(LED_PIN, LOW);
  for(int i=0; i < 10; i++){
    for(int j=0; j< 2; j++){
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
    delay(500);
  }
}

void led_blink_show_config_page(){
  digitalWrite(LED_PIN, LOW);
  for(int i=0; i < 3; i++){
    for(int j=0; j< 3; j++){
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
    delay(500);
  }
}


void led_blink_config_saved(){
  digitalWrite(LED_PIN, LOW);
  for(int i = 0; i< 10 ;i++){
    digitalWrite(LED_PIN, LOW);
    delay(250);
    digitalWrite(LED_PIN, HIGH);
    delay(250);
  }
}

void led_blink_waiting_wifi(){
  digitalWrite(LED_PIN, LOW);
    for(int j=0; j< 2; j++){
      digitalWrite(LED_PIN, HIGH);
      delay(300);
      digitalWrite(LED_PIN, LOW);
      delay(200);
    }
}

void led_wifi_timeout(){
  digitalWrite(LED_PIN, LOW);
  for(int i=0; i < 5; i++){
    for(int j=0; j< 3; j++){
      digitalWrite(LED_PIN, HIGH);
      delay(100);
      digitalWrite(LED_PIN, LOW);
      delay(100);
    }
    delay(500);
  }
}
