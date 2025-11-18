#include "Publisher_Task.h"

extern QueueHandle_t dataQueue;
extern esp_mqtt_client_handle_t mqtt_client;
extern bool isMQTTConnected;

void vPublisher_Task(void *pvParameters) {
    data_queue_msg_t msg;
    bool flag_DHT11 = false, flag_motion_sensor = false, flag_water_level = false;
    uint8_t temp = 0, humidity = 0;
    char *waterLevel;
    char *motionDetectionStatus;

    while (1) {
        if (xQueueReceive(dataQueue, &msg, portMAX_DELAY)) {
            if (msg.source == DHT11) {
                flag_DHT11 = true;
                temp = msg.msg_data.DHT11_Data.temp;
                humidity = msg.msg_data.DHT11_Data.humidity;
                printf("Temp: %d Humidity: %d\n", msg.msg_data.DHT11_Data.temp, msg.msg_data.DHT11_Data.humidity);
            }
            if (msg.source == MOTION_SENSOR) {
                flag_motion_sensor = true;
                motionDetectionStatus = msg.msg_data.motionDetectionStatus;
                printf("Motion detection: %s\n", msg.msg_data.motionDetectionStatus);
            }
            if (msg.source == WATER_LEVEL_SENSOR) {
                flag_water_level = true;
                waterLevel = msg.msg_data.waterLevel;
                printf("Water level: %s\n", msg.msg_data.waterLevel);
            }
        }

        if (flag_DHT11 && flag_motion_sensor && flag_water_level) {
            flag_DHT11 = flag_motion_sensor = flag_water_level = false;
            cJSON *root = cJSON_CreateObject();
            cJSON_AddNumberToObject(root, "temperature", temp);
            cJSON_AddNumberToObject(root, "humidity", humidity);
            cJSON_AddStringToObject(root, "motionDetection", motionDetectionStatus);
            cJSON_AddStringToObject(root, "waterLevel", waterLevel);
            char *json_str = cJSON_PrintUnformatted(root);
            if (isMQTTConnected) {
                int msg_id = esp_mqtt_client_publish(mqtt_client, PUB_TOPIC, json_str, 0, 0, 0);
                if (msg_id != 0) {
                    ESP_LOGI(WIFI_STATION_TAG, "Error sending data. Message ID: %d\n", msg_id);
                } 
            }
            printf("MQTT sent\n");
            cJSON_Delete(root);
            free(json_str);
        }
    }
};