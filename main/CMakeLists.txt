idf_component_register(SRCS "mqtt.c" "wifi.c" "main.c"
                       PRIV_REQUIRES "esp_wifi" "nvs_flash" "mqtt"
                       INCLUDE_DIRS "../includes"
                       EMBED_TXTFILES "certs/AmazonRootCA1.pem" "certs/certificate.pem.crt" "certs/private.pem.key"
                       )
