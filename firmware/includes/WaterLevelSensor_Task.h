/**
 *  Datasheet for the water level sensor: hhttps://curtocircuito.com.br/datasheet/sensor/nivel_de_agua_analogico.pdf
 */

#pragma once

#include "esp_adc/adc_oneshot.h"
#include <mqtt.h>

// Configure pin number here.
#define WATER_LEVEL_SENSOR_CHANNEL ADC_CHANNEL_4         // PIN 5

void vWaterLevelSensor_Task(void *pvParameters);