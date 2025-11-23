/**
 *  Servo motor feeder driver.
 *  Datasheet: http://www.ee.ic.ac.uk/pcheung/teaching/DE1_EE/stores/sg90_datasheet.pdf
 *  IMPORTANT NOTE: In order to get the servo to work, I needed to add the following line to
 *  the CMakeLists file in managed_components/espressif_servo:
 *  PRIV_REQUIRES "esp_driver_ledc" "esp_driver_gpio"
 *  Then, I moved the espressif_servo folder into components instead of managed_components.

 */

#pragma once

#define SERVO_SPEED LEDC_LOW_SPEED_MODE
#define SERVO_FEEDER_PIN GPIO_NUM_41
#define SERVO_FEEDER_CHANNEL LEDC_CHANNEL_0

#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_log.h"
#include "iot_servo.h"
#include <time.h>
#include <sys/time.h>

/**
 * Base feeder struct.
 */
typedef struct
{
  gpio_num_t pin;
  ledc_channel_t channel;
} servo_feeder_t;

/**
 * @brief Create a new feeder struct.
 * This is passed into feeder functions so
 * multiple feeders can be configured and activated separately.
 *
 * @param pin GPIO pin number
 * @param channel LEDC_Channel
 *
 * @return Feeder struct.
 */
servo_feeder_t ServoFeeder_Create(gpio_num_t pin, ledc_channel_t channel);

/**
 * @brief Trigger the feeder.
 * Triggers one feed action
 *
 * @param feeder Pointer to existing feeder struct.
 *
 * @return esp_err_t status.
 */
esp_err_t ServoFeeder_Feed(servo_feeder_t *feeder);