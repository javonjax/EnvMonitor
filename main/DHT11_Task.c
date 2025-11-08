#include "DHT11_Task.h"

extern volatile int isConnected;
extern esp_mqtt_client_handle_t mqtt_client;

void vDHT11_Task(void *pvParameters) {
    DHT11_TaskParams_t *params = (DHT11_TaskParams_t *)pvParameters;
    while (1) {
        if (DHT11_ReadTemperatureAndHumidity(
            params->DHT11, params->temperature, params->humidity) == DHT_OK) {
            gpio_set_level(params->led_pin, 1);
            vTaskDelay(pdMS_TO_TICKS(200));
            gpio_set_level(params->led_pin, 0);
            cJSON *root = cJSON_CreateObject();
            cJSON_AddNumberToObject(root, "temperature", *params->temperature);
            cJSON_AddNumberToObject(root, "humidity", *params->humidity);
            char *json_str = cJSON_PrintUnformatted(root);
            if (isConnected) {
                int msg_id = esp_mqtt_client_publish(mqtt_client, PUB_TOPIC, json_str, 0, 0, 0);
                if (msg_id != 0) {
                    ESP_LOGI(WIFI_STATION_TAG, "Error sending data. Message ID: %d\n", msg_id);
                } 
            }
            printf("Temperature: %d\n", *params->temperature);
            printf("Humidity: %d\n", *params->humidity);
            cJSON_Delete(root);
            free(json_str);
        }
        vTaskDelay(pdMS_TO_TICKS(20000));
    }
}