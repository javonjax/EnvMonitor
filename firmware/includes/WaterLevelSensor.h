/**
 *  Datasheet for the water level sensor: hhttps://curtocircuito.com.br/datasheet/sensor/nivel_de_agua_analogico.pdf
 */

#pragma once

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_adc/adc_oneshot.h"
#include "esp_adc/adc_cali.h"

// Configure pin number here.
#define WATER_LEVEL_SENSOR_CHANNEL ADC_CHANNEL_4 // PIN 5

// Base motion sensor struct struct.
typedef struct
{
  adc_channel_t sensor_channel_num;
} water_level_sensor_t;

/**
 * @brief Create a new water level sensor struct.
 *
 * @param adc_unit ADC unit.
 * @param sensor_channel ADC channel.
 * @param adc_handle ADC oneshot handle.
 *
 * @return water level sensor struct.
 */
water_level_sensor_t WaterLevelSensor_Create(adc_unit_t adc_unit, adc_channel_t sensor_channel, adc_oneshot_unit_handle_t *adc_handle);