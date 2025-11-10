#include "DHT11_Task.h"

extern bool isMQTTConnected;
extern QueueHandle_t dataQueue;

void vDHT11_Task(void *pvParameters) {
    DHT11_TaskParams_t *params = (DHT11_TaskParams_t *)pvParameters;
    data_queue_msg_t msg = { .source = DHT11 };
    while (1) {
        if (DHT11_ReadTemperatureAndHumidity(
            params->DHT11, params->temperature, params->humidity) == DHT_OK) {
            gpio_set_level(params->led_pin, 1);
            vTaskDelay(pdMS_TO_TICKS(200));
            gpio_set_level(params->led_pin, 0);
            
            msg.msg_data.DHT11_Data.temp = *params->temperature;
            msg.msg_data.DHT11_Data.humidity = *params->humidity;
            if (isMQTTConnected) {
                xQueueSend(dataQueue, &msg, portMAX_DELAY);
            }
        }
        vTaskDelay(pdMS_TO_TICKS(20000));
    }
}