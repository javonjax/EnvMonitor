#include "MotionSensor_Task.h"

extern volatile int isConnected;
extern esp_mqtt_client_handle_t mqtt_client;

void vMotionSensor_Task(void *pvParameters) {
    // Flags for controlling motion sensor behavior.
    static uint8_t lastButtonStatus = 1;
    static uint8_t useMotionDetection = 1;
    static int counter = 0;
    
    while (1) {
        counter++;
        uint8_t buttonStatus = gpio_get_level(MOTION_SENSOR_BUTTON_PIN);
        if (buttonStatus == GPIO_HIGH) {
            if (lastButtonStatus == GPIO_LOW) {
                useMotionDetection = !useMotionDetection;
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_LOW);
                if (useMotionDetection) {
                    printf("Motion activated lights enabled.\n");
                } else {
                    printf("Motion activated lights disabled.\n");
                }
            }
        }
        lastButtonStatus = buttonStatus;

        if (useMotionDetection) {
            uint8_t motionDetected = gpio_get_level(MOTION_SENSOR_PIN);
            if (motionDetected) {
                printf("Motion detected.\n");
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_HIGH);
            } else {
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_LOW);
            }
        }

        if (counter == 80) {
            cJSON *root = cJSON_CreateObject();
            cJSON_AddBoolToObject(root, "motion detection enabled", useMotionDetection ? true : false);
            char *json_str = cJSON_PrintUnformatted(root);
            if (isConnected) {
                int msg_id = esp_mqtt_client_publish(mqtt_client, PUB_TOPIC, json_str, 0, 0, 0);
                if (msg_id != 0) {
                    ESP_LOGI(WIFI_STATION_TAG, "Error sending data. Message ID: %d\n", msg_id);
                } 
            }
            printf("Motion detection %s\n", useMotionDetection ? "on" : "off");
            cJSON_Delete(root);
            free(json_str);
            counter = 0;
        }
        vTaskDelay(pdMS_TO_TICKS(250));
    }
}