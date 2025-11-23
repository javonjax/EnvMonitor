/**
 *  Datasheet for the HC-SR501 PIR motion sensor: https://www.mpja.com/download/31227sc.pdf
 */

#pragma once

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "cJSON.h"
#include "esp_log.h"
#include "mqtt.h"
#include <string.h>
#include "MotionSensor.h"

#define GPIO_LOW 0
#define GPIO_HIGH 1

// Base motion sensor task params struct.
typedef struct
{
  motion_sensor_t *motion_sensor;
  mqtt_client_t *mqtt_client_node;
} MotionSensor_TaskParams_t;

/**
 * @brief Controls and monitors the motion activated lights and sends
 *        data messages to the MQTT data queue.
 *
 * @param pvParameters MotionSensor_TaskParams_t task params.
 */
void vMotionSensor_Task(void *pvParameters);