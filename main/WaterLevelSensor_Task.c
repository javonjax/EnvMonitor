#include "WaterLevelSensor_Task.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern adc_oneshot_unit_handle_t adc1_handle;
extern adc_cali_handle_t adc_cali_handle;
extern bool isMQTTConnected;
extern QueueHandle_t dataQueue;

void vWaterLevelSensor_Task(void *pvParameters) {
    int adc_raw, voltage;
    data_queue_msg_t msg = { .source = WATER_LEVEL_SENSOR };
    while (1) {
        adc_oneshot_read(adc1_handle, WATER_LEVEL_SENSOR_CHANNEL, &adc_raw);
        adc_cali_raw_to_voltage(adc_cali_handle, adc_raw, &voltage);
        if (adc_raw > 750) {
            msg.msg_data.waterLevel = "OK";
        } else if (adc_raw > 150) {
            msg.msg_data.waterLevel = "LOW";
        } else {
            msg.msg_data.waterLevel = "EMPTY";
        }
        if (isMQTTConnected) {
                xQueueSend(dataQueue, &msg, portMAX_DELAY);
        }
        vTaskDelay(pdMS_TO_TICKS(20000));
    }
};
