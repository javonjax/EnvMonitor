/**
 *  Datasheet for the water level sensor: hhttps://curtocircuito.com.br/datasheet/sensor/nivel_de_agua_analogico.pdf
 */

#pragma once

#include <mqtt.h>
#include "WaterLevelSensor.h"

// Base water level sensor task params struct.
typedef struct
{
  water_level_sensor_t *water_level_sensor;
  mqtt_client_t *mqtt_client_node;
} WaterLevelSensor_TaskParams_t;

void vWaterLevelSensor_Task(void *pvParameters);