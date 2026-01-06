#include "Publisher_Task.h"

void vPublisher_Task(void *pvParameters)
{
  mqtt_client_t *client = (mqtt_client_t *)pvParameters;
  data_queue_msg_t msg;
  bool flag_DHT11 = false, flag_motion_sensor = false, flag_water_level = false, flag_servo_motor = false;
  uint8_t temp = 0, humidity = 0;
  char water_level[16];
  char motion_detection_status[16];
  uint64_t last_motion_detected_timestamp = 0;
  uint64_t last_servo_trigger_timestamp = 0;

  while (1)
  {
    UBaseType_t remaining = uxTaskGetStackHighWaterMark(NULL);
    ESP_LOGI("Publisher", "Stack left: %u words", remaining);
    if (xQueueReceive(data_queue, &msg, portMAX_DELAY))
    {
      switch (msg.source)
      {
      case DHT11:
        flag_DHT11 = true;
        temp = msg.msg_data.temp;
        humidity = msg.msg_data.humidity;
        printf("Temp: %d Humidity: %d\n", msg.msg_data.temp, msg.msg_data.humidity);
        break;
      case MOTION_SENSOR:
        flag_motion_sensor = true;
        strcpy(motion_detection_status, msg.msg_data.motion_detection_status);
        last_motion_detected_timestamp = msg.msg_data.last_motion_detected_timestamp;
        printf("Motion detection: %s\n", msg.msg_data.motion_detection_status);
        printf("Last motion detected at: %llu\n", msg.msg_data.last_motion_detected_timestamp);
        break;
      case WATER_LEVEL_SENSOR:
        flag_water_level = true;
        strcpy(water_level, msg.msg_data.water_level);
        printf("Water level: %s\n", msg.msg_data.water_level);
        break;
      case SERVO_MOTOR:
        flag_servo_motor = true;
        last_servo_trigger_timestamp = msg.msg_data.last_servo_trigger_timestamp;
        printf("Servo triggered at: %llu\n", msg.msg_data.last_servo_trigger_timestamp);
        break;
      default:
        break;
      }
    }

    if (flag_DHT11 && flag_motion_sensor && flag_water_level && flag_servo_motor)
    {
      // NOTE: Don't worry about resetting the servo motor flag.
      flag_DHT11 = flag_motion_sensor = flag_water_level = false;
      struct timeval tv;
      gettimeofday(&tv, NULL);
      uint64_t timestamp = (uint64_t)(tv.tv_sec * 1000) + (tv.tv_usec / 1000);
      ESP_LOGI(MQTT_TAG, "MQTT message sent at time: %lld\n", timestamp);
      cJSON *root = cJSON_CreateObject();
      cJSON_AddStringToObject(root, "deviceName", client->client_id);
      cJSON_AddNumberToObject(root, "temperature", temp);
      cJSON_AddNumberToObject(root, "humidity", humidity);
      cJSON_AddStringToObject(root, "motionDetection", motion_detection_status);
      cJSON_AddNumberToObject(root, "lastMotionDetectedTime", last_motion_detected_timestamp);
      cJSON_AddStringToObject(root, "waterLevel", water_level);
      cJSON_AddNumberToObject(root, "lastServoTriggerTime", last_servo_trigger_timestamp);
      cJSON_AddNumberToObject(root, "timestamp", timestamp);
      char *json_str = cJSON_PrintUnformatted(root);
      if (client->is_connected)
      {
        printf("publish\n");
        int msg_id = esp_mqtt_client_publish(client->client, PUB_TOPIC, json_str, 0, 0, 0);
        if (msg_id != 0)
        {
          ESP_LOGI(MQTT_TAG, "Error sending data from client %s. Message ID: %d\n", client->client_id, msg_id);
        }
      }
      cJSON_Delete(root);
      free(json_str);
    }
  }
};