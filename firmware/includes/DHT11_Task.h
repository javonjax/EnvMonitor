#pragma once

#include "DHT11.h"
#include "mqtt.h"
#include "esp_log.h"
#include "cJSON.h"

// Base DHT11 task params struct.
typedef struct
{
  DHT11_t *DHT11;
  uint8_t *temperature;
  uint8_t *humidity;
  mqtt_client_t *mqtt_client_node;
} DHT11_TaskParams_t;

/**
 * @brief Reads temperature and humidity from DHT11 and publishes it to the
 *        appropriate MQTT topic.
 *
 * @param pvParameters DHT11_TaskParams_t task params.
 *
 */
void vDHT11_Task(void *pvParameters);