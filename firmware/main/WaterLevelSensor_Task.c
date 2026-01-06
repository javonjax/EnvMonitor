#include "WaterLevelSensor_Task.h"

void vWaterLevelSensor_Task(void *pvParameters)
{
  WaterLevelSensor_TaskParams_t *params = (WaterLevelSensor_TaskParams_t *)pvParameters;
  mqtt_client_t *client = (mqtt_client_t *)params->mqtt_client_node;
  adc_channel_t sensor_channel = params->water_level_sensor->sensor_channel_num;
  int adc_raw, voltage;
  TickType_t xLastWakeTime = xTaskGetTickCount();
  const TickType_t xDelayPeriod = 10 * 1000 / portTICK_PERIOD_MS;
  data_queue_msg_t msg = {.source = WATER_LEVEL_SENSOR};
  while (1)
  {
    UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
    ESP_LOGI("Water Level Sensor", "Stack left: %u words", remaining);
    adc_oneshot_read(adc1_handle, sensor_channel, &adc_raw);
    adc_cali_raw_to_voltage(adc_cali_handle, adc_raw, &voltage);
    if (adc_raw > 150)
    {
      strcpy(msg.msg_data.water_level, adc_raw > 750 ? "High" : "Low");
      current_water_level = 1;
    }
    else
    {
      strcpy(msg.msg_data.water_level, "None");
      current_water_level = 0;
    }

    if (current_water_level != last_water_level)
    {
      if (servo_task_handle != NULL)
      {
        xTaskNotifyGive(servo_task_handle);
      }
    }

    last_water_level = current_water_level;

    if (client->is_connected)
    {
      xQueueSend(data_queue, &msg, portMAX_DELAY);
    }

    vTaskDelayUntil(&xLastWakeTime, xDelayPeriod);
  }
};
