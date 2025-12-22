#include "ServoMotor.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "mqtt.h"

// Base servo task params struct.
typedef struct
{
  servo_t *servo;
  mqtt_client_t *mqtt_client_node;
} Servo_TaskParams_t;

/**
 * @brief Controls the servo motor and sends data to
 *        the MQTT data queue.
 *
 * @param pvParameters Servo_TaskParams_t task params.
 */
void vServo_Task(void *pvParameters);