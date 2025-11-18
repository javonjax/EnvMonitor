#include "DHT11.h"

DHT11_t DHT11_Create(
    gpio_num_t sensor_pin_num,
    gpio_num_t led_pin_num)
{
  gpio_reset_pin(sensor_pin_num);

  gpio_config_t dht11_pin_config = {
      .pin_bit_mask = (1ULL << sensor_pin_num),
      .mode = GPIO_MODE_INPUT_OUTPUT_OD,
      .pull_up_en = GPIO_PULLUP_ENABLE,
      .pull_down_en = GPIO_PULLDOWN_DISABLE,
      .intr_type = GPIO_INTR_DISABLE};

  gpio_config(&dht11_pin_config);

  gpio_config_t dht11_led_pin_config = {
      .pin_bit_mask = (1ULL << led_pin_num),
      .mode = GPIO_MODE_OUTPUT,
      .pull_up_en = GPIO_PULLUP_DISABLE,
      .pull_down_en = GPIO_PULLDOWN_DISABLE,
      .intr_type = GPIO_INTR_DISABLE};

  gpio_reset_pin(led_pin_num);
  gpio_config(&dht11_led_pin_config);

  DHT11_t DHT11 = {
      .sensor_pin_num = sensor_pin_num,
      .led_pin_num = led_pin_num};

  return DHT11;
}

DHT_Status DHT11_StartPulse(DHT11_t *DHT11)
{
  /**
   * Send start pulse for 18ms or more.
   */
  gpio_set_level(DHT11->sensor_pin_num, 0);
  vTaskDelay(pdMS_TO_TICKS(20));
  gpio_set_level(DHT11->sensor_pin_num, 1);

  /**
   * Wait 20-40us for DHT11 response signal.
   */
  uint64_t start_us = esp_timer_get_time();
  uint64_t timeout = 100;
  while (gpio_get_level(DHT11->sensor_pin_num) == 1)
  {
    if ((esp_timer_get_time() - start_us) > timeout)
    {
      return DHT_TIMEOUT;
    }
    vTaskDelay(0);
  }

  /**
   * Read response signal pulse 1. (80us LOW).
   */
  start_us = esp_timer_get_time();
  while (gpio_get_level(DHT11->sensor_pin_num) == 0)
  {
    if ((esp_timer_get_time() - start_us) > timeout)
    {
      return DHT_TIMEOUT;
    }
    vTaskDelay(0);
  }

  /**
   * Read response signal pulse 2. (80us HIGH).
   */
  start_us = esp_timer_get_time();
  while (gpio_get_level(DHT11->sensor_pin_num) == 1)
  {
    if ((esp_timer_get_time() - start_us) > timeout)
    {
      return DHT_TIMEOUT;
    }
    vTaskDelay(0);
  }

  return DHT_OK;
};

uint8_t DHT11_ReadBit(DHT11_t *DHT11)
{
  /**
   * DHT11 starts each bit transmission by pulling LOW for 50us.
   */
  uint64_t ready_us = esp_timer_get_time();
  uint64_t timeout = 200;
  while (gpio_get_level(DHT11->sensor_pin_num) == 0)
  {
    if (esp_timer_get_time() - ready_us > timeout)
    {
      return 0;
    }
    vTaskDelay(0);
  };

  /**
   * Measure the signal duration.
   */
  uint64_t start_us = esp_timer_get_time();

  while (gpio_get_level(DHT11->sensor_pin_num) == 1)
  {
    if (esp_timer_get_time() - start_us > timeout)
    {
      return 0;
    }
    vTaskDelay(0);
  };
  uint64_t duration = esp_timer_get_time() - start_us;
  return duration > 40 ? 1 : 0;
};

uint8_t DHT11_ReadByte(DHT11_t *DHT11)
{
  uint8_t data_byte = 0;
  for (uint8_t i = 0; i < 8; i++)
  {
    data_byte <<= 1;
    data_byte |= DHT11_ReadBit(DHT11);
  }
  return data_byte;
};

DHT_Status DHT11_ReadHumidity(DHT11_t *DHT11, uint8_t *humidity)
{
  DHT_Status dht11_status = DHT11_StartPulse(DHT11);
  if (dht11_status != DHT_OK)
  {
    printf("Error connecting to DHT11.\n");
    return dht11_status;
  }

  uint8_t humidity_int = DHT11_ReadByte(DHT11);

  uint8_t humidity_dec = DHT11_ReadByte(DHT11);

  uint8_t temperature_int = DHT11_ReadByte(DHT11);

  uint8_t temperature_dec = DHT11_ReadByte(DHT11);

  uint8_t parity = DHT11_ReadByte(DHT11);

  // Verify checksum.
  uint8_t checksum = humidity_int + humidity_dec + temperature_int + temperature_dec;
  if (checksum != parity)
  {
    printf("Error verifying data integrity.\n");
    return DHT_ERR;
  }

  *humidity = humidity_int;

  return DHT_OK;
};

DHT_Status DHT11_ReadTemperature(DHT11_t *DHT11, uint8_t *temperature)
{
  DHT_Status dht11_status = DHT11_StartPulse(DHT11);
  if (dht11_status != DHT_OK)
  {
    printf("Error connecting to DHT11.\n");
    return dht11_status;
  }

  uint8_t humidity_int = DHT11_ReadByte(DHT11);

  uint8_t humidity_dec = DHT11_ReadByte(DHT11);

  uint8_t temperature_int = DHT11_ReadByte(DHT11);

  uint8_t temperature_dec = DHT11_ReadByte(DHT11);

  uint8_t parity = DHT11_ReadByte(DHT11);

  // Verify checksum.
  uint8_t checksum = humidity_int + humidity_dec + temperature_int + temperature_dec;
  if (checksum != parity)
  {
    printf("Error verifying data integrity.\n");
    return DHT_ERR;
  }

  *temperature = temperature_int;

  return DHT_OK;
};

DHT_Status DHT11_ReadTemperatureAndHumidity(DHT11_t *DHT11, uint8_t *temperature, uint8_t *humidity)
{
  DHT_Status dht11_status = DHT11_StartPulse(DHT11);
  if (dht11_status != DHT_OK)
  {
    printf("Error connecting to DHT11.\n");
    return dht11_status;
  }

  uint8_t humidity_int = DHT11_ReadByte(DHT11);

  uint8_t humidity_dec = DHT11_ReadByte(DHT11);

  uint8_t temperature_int = DHT11_ReadByte(DHT11);

  uint8_t temperature_dec = DHT11_ReadByte(DHT11);

  uint8_t parity = DHT11_ReadByte(DHT11);

  // Verify checksum.
  uint8_t checksum = humidity_int + humidity_dec + temperature_int + temperature_dec;
  if (checksum != parity)
  {
    printf("Error verifying data integrity.\n");
    return DHT_ERR;
  }

  *temperature = temperature_int;
  *humidity = humidity_int;

  return DHT_OK;
};