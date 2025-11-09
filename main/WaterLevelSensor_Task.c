#include "WaterLevelSensor_Task.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

extern adc_oneshot_unit_handle_t adc1_handle;
extern adc_cali_handle_t adc_cali_handle;

void vWaterLevelSensor_Task(void *pvParameters) {
    int adc_raw, voltage;
    char *waterLevel;
    while (1) {
        adc_oneshot_read(adc1_handle, WATER_LEVEL_SENSOR_CHANNEL, &adc_raw);
        adc_cali_raw_to_voltage(adc_cali_handle, adc_raw, &voltage);
        if (adc_raw > 750) {
            waterLevel = "OK";
        } else if (adc_raw > 150) {
            waterLevel = "LOW";
        } else {
            waterLevel = "EMPTY";
        }
        printf("Current water level: %s\n", waterLevel);
        vTaskDelay(pdMS_TO_TICKS(200));
    }
};
