/**
 *  Datasheet for the water level sensor: hhttps://curtocircuito.com.br/datasheet/sensor/nivel_de_agua_analogico.pdf
 */

#pragma once

#include <mqtt.h>
#include "WaterLevelSensor.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include <string.h>

extern adc_oneshot_unit_handle_t adc1_handle;
extern adc_cali_handle_t adc_cali_handle;
extern QueueHandle_t data_queue;
extern volatile int current_water_level;
extern volatile int last_water_level;
extern TaskHandle_t servo_task_handle;

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