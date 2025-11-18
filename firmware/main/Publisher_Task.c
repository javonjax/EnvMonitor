#include "Publisher_Task.h"

extern QueueHandle_t data_queue;
extern const char *MQTT_TAG;

void vPublisher_Task(void *pvParameters)
{
  mqtt_client_t *client = (mqtt_client_t *)pvParameters;
  data_queue_msg_t msg;
  bool flag_DHT11 = false, flag_motion_sensor = false, flag_water_level = false;
  uint8_t temp = 0, humidity = 0;
  char *water_level;
  char *motion_detection_status;

  while (1)
  {
    if (xQueueReceive(data_queue, &msg, portMAX_DELAY))
    {
      if (msg.source == DHT11)
      {
        flag_DHT11 = true;
        temp = msg.msg_data.DHT11_Data.temp;
        humidity = msg.msg_data.DHT11_Data.humidity;
        printf("Temp: %d Humidity: %d\n", msg.msg_data.DHT11_Data.temp, msg.msg_data.DHT11_Data.humidity);
      }
      if (msg.source == MOTION_SENSOR)
      {
        flag_motion_sensor = true;
        motion_detection_status = msg.msg_data.motion_detection_status;
        printf("Motion detection: %s\n", msg.msg_data.motion_detection_status);
      }
      if (msg.source == WATER_LEVEL_SENSOR)
      {
        flag_water_level = true;
        water_level = msg.msg_data.water_level;
        printf("Water level: %s\n", msg.msg_data.water_level);
      }
    }

    if (flag_DHT11 && flag_motion_sensor && flag_water_level)
    {
      flag_DHT11 = flag_motion_sensor = flag_water_level = false;
      time_t now = time(NULL);
      struct timeval tv;
      struct tm timeinfo = {0};
      // Ensure the SNTP sync has finished before getting a timestamp.
      while (timeinfo.tm_year < (2024 - 1900))
      {
        vTaskDelay(pdMS_TO_TICKS(150));
        time(&now);
        localtime_r(&now, &timeinfo);
      }
      gettimeofday(&tv, NULL);
      uint64_t timestamp = (uint64_t)(tv.tv_sec * 1000) + (tv.tv_usec / 1000);
      ESP_LOGI(MQTT_TAG, "MQTT message sent at time: %lld\n", timestamp);
      cJSON *root = cJSON_CreateObject();
      cJSON_AddStringToObject(root, "deviceName", client->client_id);
      cJSON_AddNumberToObject(root, "temperature", temp);
      cJSON_AddNumberToObject(root, "humidity", humidity);
      cJSON_AddStringToObject(root, "motionDetection", motion_detection_status);
      cJSON_AddStringToObject(root, "waterLevel", water_level);
      cJSON_AddNumberToObject(root, "timestamp", timestamp);
      char *json_str = cJSON_PrintUnformatted(root);
      if (client->is_connected)
      {
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