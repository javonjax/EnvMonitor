#include "MotionSensor_Task.h"

extern QueueHandle_t data_queue;

void vMotionSensor_Task(void *pvParameters)
{
  MotionSensor_TaskParams_t *params = (MotionSensor_TaskParams_t *)pvParameters;
  motion_sensor_t *motion_sensor = (motion_sensor_t *)params->motion_sensor;
  mqtt_client_t *client = (mqtt_client_t *)params->mqtt_client_node;
  gpio_num_t sensor_pin = motion_sensor->sensor_pin_num;
  gpio_num_t led_pin = motion_sensor->led_pin_num;
  gpio_num_t button_pin = motion_sensor->button_pin_num;
  uint8_t last_button_status = 1;
  uint8_t use_motion_detection = 1;
  int counter = 0;
  data_queue_msg_t msg = {
      .source = MOTION_SENSOR};

  while (1)
  {
    counter++;
    if (counter % 20 == 0)
    {
      UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
      ESP_LOGI("Motion sensor", "Stack left: %u words", remaining);
    }
    uint8_t button_status = gpio_get_level(button_pin);
    if (button_status == GPIO_HIGH)
    {
      if (last_button_status == GPIO_LOW)
      {
        use_motion_detection = !use_motion_detection;
        gpio_set_level(led_pin, GPIO_LOW);
        if (use_motion_detection)
        {
          printf("Motion activated lights enabled.\n");
        }
        else
        {
          printf("Motion activated lights disabled.\n");
        }
      }
    }
    last_button_status = button_status;

    if (use_motion_detection)
    {
      uint8_t motion_detected = gpio_get_level(sensor_pin);
      if (motion_detected)
      {
        gpio_set_level(led_pin, GPIO_HIGH);
      }
      else
      {
        gpio_set_level(sensor_pin, GPIO_LOW);
      }
    }

    if (counter == 80)
    {
      msg.msg_data.motion_detection_status = use_motion_detection ? "Enabled" : "Disabled";
      if (client->is_connected)
      {
        xQueueSend(data_queue, &msg, portMAX_DELAY);
      }
      counter = 0;
    }
    vTaskDelay(pdMS_TO_TICKS(250));
  }
}