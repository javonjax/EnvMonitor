# ESP32 Environment Monitoring System
This application is hosted on [Vercel](https://vercel.com/)
https://iot-env-monitor-esp-32.vercel.app/

## Description
The ESP32 environment monitoring system is an IoT project that collects real-time environmentall data using an ESP32 microcontroller and siplays it through a React web page. The system monitors conditions such as temperature, humidity, 
and standing water level and sends data to the AWS cloud using MQTT. This project combines embedded systems, networking, and web technologies to create a complete end-to-end monitoring solution. 
The ESP32 reads sensor data at regular intervals, processes it locally, and transmits it to the cloud to be used for visualization and analysis.

## Technologiese Used
- [ESP-IDF](https://docs.espressif.com/projects/esp-idf/en/stable/esp32/get-started/index.html)
- [React](https://react.dev/)
- [Express.js](https://expressjs.com/)
- [TailwindCSS](https://tailwindcss.com/)
- [AWS Iot Core](https://aws.amazon.com/iot-core/)
- [AWS DynamoDB](https://aws.amazon.com/dynamodb/)
- [AWS Elastic Compute Cloud](https://aws.amazon.com/ec2/)
- [AWS Lambda](https://aws.amazon.com/lambda/)

## Features
- Real-time environment data collection.
- Temperature and humidity monitoring and graphing.
- WiFi connectivity and MQTT messaging.
- Web-based dashboard for analyzing live and historical data.
- Periodic sensor sampling and data updates.
- Servo controlled emergency relief valve for removing standing water.
- Motion activated lights for in-person monitoring.

## Hardware
- [ESP32-S3](https://www.amazon.com/dp/B0DG8L7MQ9?ref=ppx_yo2ov_dt_b_fed_asin_title&th=1) 
- [DHT11 Temperature and Humidity Sensor](https://www.aliexpress.us/item/3256808580772270.html?src=google&pdp_npi=4%40dis%21USD%211.74%211.74%21%21%21%21%21%40%2112000046580153991%21ppc%21%21%21&gatewayAdapt=glo2usa)
- [HC-SR501 PIR Motion Sensor](https://www.aliexpress.us/item/3256806000141886.html?src=google&pdp_npi=4%40dis%21USD%211.59%211.59%21%21%21%21%21%40%2112000036184485224%21ppc%21%21%21&gatewayAdapt=glo2usa)
- [SG90 Servo Motor](https://www.amazon.com/WWZMDiB-SG90-Control-Servos-Arduino/dp/B0BKPL2Y21?th=1)
- [Water Level Sensor](http://tinkersphere.com/sensors/2196-water-level-sensor.html?srsltid=AfmBOooob_0oDgB4s576PeH1b4sZ0JsbzsB-p1rb1TIRR7mPuoLo_c3wsQ8)

## Contact Me

👤 Javon Jackson  
🔗 [LinkedIn](https://www.linkedin.com/in/javon-jackson-02585933a)  
📫 [Email Me](mailto:javonjaxcode@gmail.com)
