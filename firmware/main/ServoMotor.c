#include "ServoMotor.h"

static const char *SERVO_TAG = "Servo motor";

/**
 * Initialize a new servo with esp-idf iot_servo library.
 */
static esp_err_t Servo_Init(gpio_num_t pin, ledc_channel_t channel)
{
  ESP_LOGI(SERVO_TAG, "Initializing servo.");

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

servo_t Servo_Create(gpio_num_t pin, ledc_channel_t channel)
{
  if (Servo_Init(pin, channel) == ESP_OK)
  {
    servo_t servo = {
        .pin = pin,
        .channel = channel};
    iot_servo_write_angle(SERVO_SPEED, servo.channel, 0);
    ESP_LOGI(SERVO_TAG, "Servo initialized.");
    return servo;
  }
  else
  {
    ESP_LOGE(SERVO_TAG, "Failed to initialize servo.");
    return (servo_t){};
  }
}

esp_err_t Servo_Open(servo_t *servo)
{
  if (servo->pin == 0)
  {
    ESP_LOGE(SERVO_TAG, "Servo has not been initialized.");
    return ESP_FAIL;
  }
  iot_servo_write_angle(SERVO_SPEED, servo->channel, 90);
  return ESP_OK;
}

esp_err_t Servo_Close(servo_t *servo)
{
  if (servo->pin == 0)
  {
    ESP_LOGE(SERVO_TAG, "Servo has not been initialized.");
    return ESP_FAIL;
  }
  iot_servo_write_angle(SERVO_SPEED, servo->channel, 0);
  return ESP_OK;
}
