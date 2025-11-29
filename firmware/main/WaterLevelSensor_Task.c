#include "WaterLevelSensor_Task.h"

extern adc_oneshot_unit_handle_t adc1_handle;
extern adc_cali_handle_t adc_cali_handle;
extern QueueHandle_t data_queue;

void vWaterLevelSensor_Task(void *pvParameters)
{
  WaterLevelSensor_TaskParams_t *params = (WaterLevelSensor_TaskParams_t *)pvParameters;
  mqtt_client_t *client = (mqtt_client_t *)params->mqtt_client_node;
  adc_channel_t sensor_channel = params->water_level_sensor->sensor_channel_num;
  int adc_raw, voltage;
  data_queue_msg_t msg = {.source = WATER_LEVEL_SENSOR};
  while (1)
  {
    UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
    ESP_LOGI("Water Level Sensor", "Stack left: %u words", remaining);
    adc_oneshot_read(adc1_handle, sensor_channel, &adc_raw);
    adc_cali_raw_to_voltage(adc_cali_handle, adc_raw, &voltage);
    if (adc_raw > 750)
    {
      strcpy(msg.msg_data.water_level, "OK");
    }
    else if (adc_raw > 150)
    {
      strcpy(msg.msg_data.water_level, "Low");
    }
    else
    {
      strcpy(msg.msg_data.water_level, "Empty");
    }
    if (client->is_connected)
    {
      xQueueSend(data_queue, &msg, portMAX_DELAY);
    }
    vTaskDelay(pdMS_TO_TICKS(20000));
  }
};
