#include "nvs_flash.h"
#include "wifi.h"
#include "mqtt.h"
#include "DHT11.h"
#include "MotionSensor.h"
#include "WaterLevelSensor.h"
#include "ServoMotor.h"
#include "cJSON.h"
#include "DHT11_Task.h"
#include "MotionSensor_Task.h"
#include "WaterLevelSensor_Task.h"
#include "Servo_Task.h"
#include "Publisher_Task.h"
#include <esp_sntp.h>
#include <esp_netif_sntp.h>

#define CLIENT_ID_NODE_1 CONFIG_AWS_IOT_CORE_CLIENT_ID

bool is_wifi_connected = false;
mqtt_client_t mqtt_client_Node1;
adc_cali_handle_t adc_cali_handle;
adc_oneshot_unit_handle_t adc1_handle;
QueueHandle_t data_queue;

void app_main(void)
{
  // Initialize NVS
  esp_err_t ret = nvs_flash_init();
  if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND)
  {
    ESP_ERROR_CHECK(nvs_flash_erase());
    ret = nvs_flash_init();
  }
  ESP_ERROR_CHECK(ret);

  if (CONFIG_LOG_MAXIMUM_LEVEL > CONFIG_LOG_DEFAULT_LEVEL)
  {
    /* If you only want to open more logs in the wifi module, you need to make the max level greater than the default level,
     * and call esp_log_level_set() before esp_wifi_init() to improve the log level of the wifi module. */
    esp_log_level_set("wifi", CONFIG_LOG_MAXIMUM_LEVEL);
  }

  // Calibrate ADC
  adc_cali_curve_fitting_config_t adc_cali_config = {
      .unit_id = ADC_UNIT_1,
      .atten = ADC_ATTEN_DB_12,
      .bitwidth = ADC_BITWIDTH_DEFAULT,
  };
  ESP_ERROR_CHECK(adc_cali_create_scheme_curve_fitting(&adc_cali_config, &adc_cali_handle));

  // Start wifi station mode and mqtt client mode.
  wifi_init_sta();

  if (is_wifi_connected)
  {
    mqtt_client_Node1.client_id = CLIENT_ID_NODE_1;
    mqtt_app_start(&mqtt_client_Node1);
  }

  // Initialize SNTP
  esp_sntp_config_t config = ESP_NETIF_SNTP_DEFAULT_CONFIG("pool.ntp.org");
  esp_netif_sntp_init(&config);
  while (esp_netif_sntp_sync_wait(pdMS_TO_TICKS(10000)))
  {
    printf("MAIN: Failed to update system time.\n");
  }

  // Initialize necessary components.
  /* DHT11 start */
  static DHT11_t DHT11;
  static uint8_t temperature = 0;
  static uint8_t humidity = 0;

  DHT11 = DHT11_Create(
      DHT11_SIGNAL_PIN,
      DHT11_LED_PIN);

  static DHT11_TaskParams_t DHT11_TaskParams = {
      .DHT11 = &DHT11,
      .temperature = &temperature,
      .humidity = &humidity,
      .mqtt_client_node = &mqtt_client_Node1};
  /* DHT11 end */

  /* Motion sensor start */
  static motion_sensor_t motion_sensor;
  motion_sensor = MotionSensor_Create(MOTION_SENSOR_PIN, MOTION_SENSOR_LED_PIN, MOTION_SENSOR_BUTTON_PIN);
  static MotionSensor_TaskParams_t MotionSensor_TaskParams = {
      .motion_sensor = &motion_sensor,
      .mqtt_client_node = &mqtt_client_Node1};
  /* Motion sensor end */

  /* Water level sensor start */
  static water_level_sensor_t water_level_sensor;
  water_level_sensor = WaterLevelSensor_Create(ADC_UNIT_1, WATER_LEVEL_SENSOR_CHANNEL, &adc1_handle);
  static WaterLevelSensor_TaskParams_t WaterLevelSensor_TaskParams = {
      .water_level_sensor = &water_level_sensor,
      .mqtt_client_node = &mqtt_client_Node1};
  /* Water level sensor end */

  /* Servo motor start */
  static servo_t servo_motor;
  servo_motor = Servo_Create(SERVO_PIN, SERVO_CHANNEL);
  static Servo_TaskParams_t Servo_TaskParams = {
      .servo = &servo_motor,
      .mqtt_client_node = &mqtt_client_Node1};
  /* Servo motor end */

  // Create queue for device messages.
  data_queue = xQueueCreate(10, sizeof(data_queue_msg_t));

  // Create tasks.
  printf("Creating %s tasks\n", mqtt_client_Node1.client_id);
  xTaskCreate(vPublisher_Task, "MQTT Publisher", 4096, &mqtt_client_Node1, 3, NULL);
  xTaskCreate(vDHT11_Task, "DHT11", 2048, &DHT11_TaskParams, 1, NULL);
  xTaskCreate(vMotionSensor_Task, "Motion activated lights", 2400, &MotionSensor_TaskParams, 1, NULL);
  xTaskCreate(vWaterLevelSensor_Task, "Water level sensor", 2048, &WaterLevelSensor_TaskParams, 1, NULL);
  xTaskCreate(vServo_Task, "Servo task", 2400, &Servo_TaskParams, 1, NULL);
}
