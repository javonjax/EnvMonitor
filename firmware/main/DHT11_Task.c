#include "DHT11_Task.h"

extern QueueHandle_t data_queue;

void vDHT11_Task(void *pvParameters)
{
  DHT11_TaskParams_t *params = (DHT11_TaskParams_t *)pvParameters;
  mqtt_client_t *client = params->mqtt_client_node;
  data_queue_msg_t msg = {.source = DHT11};
  while (1)
  {
    UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
    ESP_LOGI("DHT11", "Stack left: %u words", remaining);
    if (DHT11_ReadTemperatureAndHumidity(
            params->DHT11, params->temperature, params->humidity) == DHT_OK)
    {
      gpio_set_level(params->DHT11->led_pin_num, 1);
      vTaskDelay(pdMS_TO_TICKS(1000));
      gpio_set_level(params->DHT11->led_pin_num, 0);

      msg.msg_data.temp = (*params->temperature * 9 / 5) + 32;
      msg.msg_data.humidity = *params->humidity;

      if (client->is_connected)
      {
        xQueueSend(data_queue, &msg, portMAX_DELAY);
      }
    }
    vTaskDelay(pdMS_TO_TICKS(20000));
  }
}