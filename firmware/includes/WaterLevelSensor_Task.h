/**
 *  Datasheet for the water level sensor: hhttps://curtocircuito.com.br/datasheet/sensor/nivel_de_agua_analogico.pdf
 */

#pragma once

#include <mqtt.h>
#include "WaterLevelSensor.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"

// Base water level sensor task params struct.
typedef struct
{
  water_level_sensor_t *water_level_sensor;
  mqtt_client_t *mqtt_client_node;
} WaterLevelSensor_TaskParams_t;

/**
 * @brief Reads value from the water level sensor and sends data to MQTT queue.
 *
 * @param pvParameters WaterLevelSensor_TaskParams_t task params.
 */
void vWaterLevelSensor_Task(void *pvParameters);