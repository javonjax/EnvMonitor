#include "MotionSensor.h"

motion_sensor_t MotionSensor_Create(gpio_num_t sensor_pin, gpio_num_t led_pin, gpio_num_t button_pin)
{
  gpio_config_t motion_sensor_pin_config = {
      .pin_bit_mask = (1ULL << sensor_pin),
      .mode = GPIO_MODE_INPUT,
      .pull_down_en = GPIO_PULLDOWN_DISABLE,
      .pull_up_en = GPIO_PULLUP_DISABLE,
      .intr_type = GPIO_INTR_DISABLE};

  gpio_config_t motion_sensor_led_pin_config = {
      .pin_bit_mask = (1ULL << led_pin),
      .mode = GPIO_MODE_OUTPUT,
      .pull_down_en = GPIO_PULLDOWN_DISABLE,
      .pull_up_en = GPIO_PULLUP_DISABLE,
      .intr_type = GPIO_INTR_DISABLE};

  gpio_config_t motion_sensor_button_pin_config = {
      .pin_bit_mask = (1ULL << button_pin),
      .mode = GPIO_MODE_INPUT,
      .pull_down_en = GPIO_PULLDOWN_DISABLE,
      .pull_up_en = GPIO_PULLUP_ENABLE,
      .intr_type = GPIO_INTR_DISABLE};

  gpio_reset_pin(MOTION_SENSOR_PIN);
  gpio_config(&motion_sensor_pin_config);
  gpio_reset_pin(MOTION_SENSOR_LED_PIN);
  gpio_config(&motion_sensor_led_pin_config);
  gpio_reset_pin(MOTION_SENSOR_BUTTON_PIN);
  gpio_config(&motion_sensor_button_pin_config);

  motion_sensor_t motion_sensor = {
      .sensor_pin_num = sensor_pin,
      .led_pin_num = led_pin,
      .button_pin_num = button_pin};
  return motion_sensor;
};