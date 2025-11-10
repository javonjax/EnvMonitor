idf_component_register(SRCS "Publisher_Task.c" "WaterLevelSensor_Task.c" "MotionSensor_Task.c" "DHT11_Task.c" "mqtt.c" "wifi.c" "DHT11.c" "main.c"
                       PRIV_REQUIRES "esp_wifi" "nvs_flash" "mqtt" "esp_driver_gpio" "esp_timer" "json" "esp_adc"
                       INCLUDE_DIRS "../includes"
                       EMBED_TXTFILES "certs/AmazonRootCA1.pem" "certs/certificate.pem.crt" "certs/private.pem.key"
                       )
