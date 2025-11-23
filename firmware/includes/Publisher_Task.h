#pragma once

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mqtt.h"
#include "cJSON.h"
#include <string.h>
#include <time.h>
#include <sys/time.h>

/**
 * @brief Receives data messages from the queue and combines them into a single
 *        MQTT message.
 *
 * @param pvParameters Pointer an MQTT client node.
 */
void vPublisher_Task(void *pvParameters);