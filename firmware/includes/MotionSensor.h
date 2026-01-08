/**
 *  Datasheet for the HC-SR501 PIR motion sensor: https://www.mpja.com/download/31227sc.pdf
 */

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

/**
 *  @brief Create a new motion sensor struct.
 *
 *  @param sensor_pin Sensor GPIO pin num.
 *  @param led_pin LED pin num.
 *  @param button_pin Button pin num.
 *
 *  @return new motion sensor struct.
 *
 */
motion_sensor_t MotionSensor_Create(gpio_num_t sensor_pin, gpio_num_t led_pin, gpio_num_t button_pin);