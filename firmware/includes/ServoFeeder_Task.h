#include "ServoFeeder.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mqtt.h"

// Base servo feeder task params struct.
typedef struct
{
  servo_feeder_t *servo_feeder;
  mqtt_client_t *mqtt_client_node;
} ServoFeeder_TaskParams_t;

/**
 * @brief Controls the servo auto feeder and sends data to
 *        the MQTT data queue.
 *
 * @param pvParameters ServoFeeder_TaskParams_t task params.
 */
void vServoFeeder_Task(void *pvParameters);