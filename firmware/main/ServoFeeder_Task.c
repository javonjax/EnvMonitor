#include "ServoFeeder_Task.h"
#include <stdio.h>

void vServoFeeder_Task(void *pvParameters)
{
  while (1)
  {
    ServoFeeder_TaskParams_t *params = (ServoFeeder_TaskParams_t *)pvParameters;
    servo_feeder_t *servo_feeder = params->servo_feeder;
    mqtt_client_t *client = params->mqtt_client_node;
    TickType_t xLastWakeTime = xTaskGetTickCount();
    // const TickType_t xDelayPeriod = 4 * 60 * 60 * 1000 / portTICK_PERIOD_MS;
    const TickType_t xDelayPeriod = 20 * 1000 / portTICK_PERIOD_MS;
    data_queue_msg_t msg = {.source = SERVO_FEEDER};
    while (1)
    {
      UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
      ESP_LOGI("Servo feeder", "Stack left: %u words", remaining);
      ServoFeeder_Feed(servo_feeder);
      struct timeval tv;
      gettimeofday(&tv, NULL);
      uint64_t timestamp = (uint64_t)(tv.tv_sec * 1000) + (tv.tv_usec / 1000);
      msg.msg_data.last_feed_timestamp = timestamp;

      if (client->is_connected)
      {
        xQueueSend(data_queue, &msg, portMAX_DELAY);
      }

      vTaskDelayUntil(&xLastWakeTime, xDelayPeriod);
    }
  }
};