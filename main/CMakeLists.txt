idf_component_register(SRCS "mqtt.c" "wifi.c" "DHT11.c" "main.c"
                       PRIV_REQUIRES "esp_wifi" "nvs_flash" "mqtt" "esp_driver_gpio" "esp_timer" "json"
                       INCLUDE_DIRS "../includes"
                       EMBED_TXTFILES "certs/AmazonRootCA1.pem" "certs/certificate.pem.crt" "certs/private.pem.key"
                       )
