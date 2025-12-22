/**
 *  Servo motor driver.
 *  Datasheet: http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf
 *  IMPORTANT NOTE: In order to get the servo to work, I needed to add the following line to
 *  the CMakeLists file in managed_components/espressif_servo:
 *  PRIV_REQUIRES "esp_driver_ledc" "esp_driver_gpio"
 *  Then, I moved the espressif_servo folder into components instead of managed_components.

 */

#pragma once

#define SERVO_SPEED LEDC_LOW_SPEED_MODE
#define SERVO_PIN GPIO_NUM_41
#define SERVO_CHANNEL LEDC_CHANNEL_0

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "iot_servo.h"
#include <time.h>
#include <sys/time.h>

/**
 * Base servo struct.
 */
typedef struct
{
  gpio_num_t pin;
  ledc_channel_t channel;
} servo_t;

/**
 * @brief Create a new servo struct.
 * This is passed into servo functions so
 * multiple servos can be configured and activated separately.
 *
 * @param pin GPIO pin number
 * @param channel LEDC_Channel
 *
 * @return Servo struct.
 */
servo_t Servo_Create(gpio_num_t pin, ledc_channel_t channel);

/**
 * @brief Set the servo to open position.
 *
 * @param servo Pointer to an existing servo struct.
 *
 * @return esp_err_t status;
 */
esp_err_t Servo_Open(servo_t *servo);

/**
 * @brief Set the servo to closed position.
 *
 * @param servo Pointer to an existing servo struct.
 *
 * @return esp_err_t status;
 */
esp_err_t Servo_Close(servo_t *servo);
