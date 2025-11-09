#pragma once

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "cJSON.h"
#include "esp_log.h"
#include "mqtt.h"

#define GPIO_LOW 0
#define GPIO_HIGH 1

// Configure pin numbers here.
#define MOTION_SENSOR_PIN GPIO_NUM_18
#define MOTION_SENSOR_LED_PIN GPIO_NUM_17
#define MOTION_SENSOR_BUTTON_PIN GPIO_NUM_16

/**
 * @brief Enables motion activated lighting and publishes the current motion activation
 *        setting.
 * 
 */
void vMotionSensor_Task(void *pvParameters);