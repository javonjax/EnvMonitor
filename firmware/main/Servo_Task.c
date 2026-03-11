#include "Servo_Task.h"
#include <stdio.h>

void vServo_Task(void *pvParameters)
{
  while (1)
  {
    Servo_TaskParams_t *params = (Servo_TaskParams_t *)pvParameters;
    servo_t *servo = params->servo;
    mqtt_client_t *client = params->mqtt_client_node;
    TickType_t xLastWakeTime = xTaskGetTickCount();
    // const TickType_t xDelayPeriod = 4 * 60 * 60 * 1000 / portTICK_PERIOD_MS;
    const TickType_t xDelayPeriod = 20 * 1000 / portTICK_PERIOD_MS;
    data_queue_msg_t msg = {.source = SERVO_MOTOR};
    Servo_Close(servo);
    while (1)
    {
      ulTaskNotifyTake(pdTRUE, portMAX_DELAY);
      UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
      ESP_LOGI("Servo motor", "Stack left: %u words", remaining);
      if (current_water_level > 0)
      {
        Servo_Open(servo);
        struct timeval tv;
        gettimeofday(&tv, NULL);
        uint64_t timestamp = (uint64_t)(tv.tv_sec * 1000) + (tv.tv_usec / 1000);
        msg.msg_data.last_servo_trigger_timestamp = timestamp;

        if (client->is_connected)
        {
          xQueueSend(data_queue, &msg, portMAX_DELAY);
        }
      }
      else
      {
        Servo_Close(servo);
      }

      vTaskDelayUntil(&xLastWakeTime, xDelayPeriod);
    }
  }
};