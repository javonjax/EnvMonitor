/**
 * DHT11 Driver for the ESP32S3.
 * 
 * Datasheets:
 *      https://www.makerhero.com/img/files/download/DHT11-Datasheet.pdf
 *      https://www.mouser.com/datasheet/2/758/DHT11-Technical-Data-Sheet-Translated-Version-1143054.pdf
 */

#pragma once

#include "driver/gpio.h"
#include "freertos/FreeRTOS.h"
#include "freertos/task.h"
#include "esp_timer.h"

// Base DHT11 struct.
typedef struct {
    gpio_num_t pin_num;
} DHT11_t;

// Return status enum.
typedef enum {
	DHT_OK = 0,
	DHT_ERR = 1,
	DHT_TIMEOUT = 2
} DHT_Status;

// Base DHT11 task params struct.
typedef struct {
    DHT11_t *DHT11;
    uint8_t *temperature;
    uint8_t *humidity;
    gpio_num_t led_pin;
} DHT11_TaskParams_t;

/**
 * @brief Create a new DHT11 struct.
 * 
 * @param pin_num GPIO pin number.
 * @param pin_mode GPIO pin mode.
 * @param pull_up GPIO pull up mode.
 * @param pull_down GPIO pull down mode.
 * @param intr_type GPIO interrupt type.
 * 
 * @return New DHT11 struct.
 */
DHT11_t DHT11_Create(
    gpio_num_t pin_num, 
    gpio_mode_t pin_mode, 
    gpio_pullup_t pull_up,
    gpio_pulldown_t pull_down,
    gpio_int_type_t intr_type
);

/**
 * @brief Send a start pulse to the DHT11. This indicates that the MCU is ready 
 *        to read data.
 * 
 * @param DHT11 DHT11 struct pointer.
 * 
 * @return DHT_Status
 */
DHT_Status DHT11_StartPulse(DHT11_t *DHT11);

/**
 * @brief Read a bit.
 * 
 * @param DHT11 DHT11 struct pointer.
 * 
 * @return 0 or 1
 */
uint8_t DHT11_ReadBit(DHT11_t *DHT11);

/**
 * @brief Read a byte..
 * 
 * @param DHT11 DHT11 struct pointer.
 * 
 * @return A byte of data.
 */
uint8_t DHT11_ReadByte(DHT11_t *DHT11);

/**
 * @brief Read humidity.
 * 
 * @param DHT11 DHT11 struct pointer.
 * @param humidity Humidity pointer.
 * 
 * @return DHT_Status
 */
DHT_Status DHT11_ReadHumidity(DHT11_t *DHT11, uint8_t *humidity);

/**
 * @brief Read temperature.
 * 
 * @param DHT11 DHT11 struct pointer.
 * @param temperature Temperature pointer.
 * 
 * @return DHT_Status
 */
DHT_Status DHT11_ReadTemperature(DHT11_t *DHT11, uint8_t *temperature);

/**
 * @brief Read temperature and humidity.
 * 
 * @param DHT11 DHT11 struct pointer.
 * @param temperature Temperature pointer.
 * @param humidity Humidity pointer.
 * 
 * @return DHT_Status
 */
DHT_Status DHT11_ReadTemperatureAndHumidity(DHT11_t *DHT11, uint8_t *temperature, uint8_t *humidity);