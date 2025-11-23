#include "WaterLevelSensor.h"

water_level_sensor_t WaterLevelSensor_Create(adc_unit_t adc_unit, adc_channel_t sensor_channel, adc_oneshot_unit_handle_t *adc_handle)
{
  adc_oneshot_unit_init_cfg_t adc1_init_config = {
      .unit_id = adc_unit,
  };
  ESP_ERROR_CHECK(adc_oneshot_new_unit(&adc1_init_config, adc_handle));

  adc_oneshot_chan_cfg_t water_level_channel_config = {
      .atten = ADC_ATTEN_DB_12,
      .bitwidth = ADC_BITWIDTH_DEFAULT};

  adc_oneshot_config_channel(*adc_handle, sensor_channel, &water_level_channel_config);

  water_level_sensor_t water_level_sensor = {
      .sensor_channel_num = sensor_channel};
  return water_level_sensor;
};