#pragma once

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

// Configure pin numbers here.
#define MOTION_SENSOR_PIN GPIO_NUM_18
#define MOTION_SENSOR_LED_PIN GPIO_NUM_17
#define MOTION_SENSOR_BUTTON_PIN GPIO_NUM_16

// Base motion sensor struct struct.
typedef struct
{
  gpio_num_t sensor_pin_num;
  gpio_num_t led_pin_num;
  gpio_num_t button_pin_num;
} motion_sensor_t;

motion_sensor_t MotionSensor_Create(gpio_num_t sensor_pin, gpio_num_t led_pin, gpio_num_t button_pin);