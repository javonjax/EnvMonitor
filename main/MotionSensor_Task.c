#include "MotionSensor_Task.h"

extern bool isMQTTConnected;
extern QueueHandle_t dataQueue;

void vMotionSensor_Task(void *pvParameters) {
    uint8_t lastButtonStatus = 1;
    uint8_t useMotionDetection = 1;
    int counter = 0;
    data_queue_msg_t msg = { 
                .source = MOTION_SENSOR
    };

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
            msg.msg_data.motionDetectionStatus = useMotionDetection ? "enabled" : "disabled";
            if (isMQTTConnected) {
                xQueueSend(dataQueue, &msg, portMAX_DELAY);
            }
            counter = 0;
        }
        vTaskDelay(pdMS_TO_TICKS(250));
    }
}