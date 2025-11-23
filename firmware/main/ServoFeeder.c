#include "ServoFeeder.h"

static const char *SERVO_FEEDER_TAG = "Feeder";

/**
 * Initialize a new servo with esp-idf iot_servo library.
 */
static esp_err_t Servo_Init(gpio_num_t pin, ledc_channel_t channel)
{
  ESP_LOGI(SERVO_FEEDER_TAG, "Initializing servo feeder.");

  // Configure the servo
  servo_config_t servo_cfg = {
      .max_angle = 180,
      .min_width_us = 500,
      .max_width_us = 2500,
      .freq = 50,
      .timer_number = LEDC_TIMER_0,
      .channels = {
          .servo_pin = {
              pin,
          },
          .ch = {
              channel,
          },
      },
      .channel_number = 1,
  };

  // Initialize the servo
  return iot_servo_init(SERVO_SPEED, &servo_cfg);
}

servo_feeder_t ServoFeeder_Create(gpio_num_t pin, ledc_channel_t channel)
{
  if (Servo_Init(pin, channel) == ESP_OK)
  {
    servo_feeder_t feeder = {
        .pin = pin,
        .channel = channel};
    iot_servo_write_angle(SERVO_SPEED, feeder.channel, 0);
    ESP_LOGI(SERVO_FEEDER_TAG, "Feeder initialized.");
    return feeder;
  }
  else
  {
    ESP_LOGE(SERVO_FEEDER_TAG, "Failed to initialize feeder.");
    return (servo_feeder_t){};
  }
}

esp_err_t ServoFeeder_Feed(servo_feeder_t *feeder)
{
  if (feeder->pin == 0)
  {
    ESP_LOGE(SERVO_FEEDER_TAG, "Feeder has not been initialized.");
    return ESP_FAIL;
  }
  iot_servo_write_angle(SERVO_SPEED, feeder->channel, 90);
  vTaskDelay(pdMS_TO_TICKS(1500));
  iot_servo_write_angle(SERVO_SPEED, feeder->channel, 0);
  return ESP_OK;
}