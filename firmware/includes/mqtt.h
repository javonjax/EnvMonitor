#pragma once

#include "mqtt_client.h"
#include "esp_log.h"

/**
 * AWS IOT Core config.
 */
#define AWS_IOT_CORE_ENDPOINT CONFIG_AWS_IOT_CORE_ENDPOINT
#define AWS_IOT_CORE_PORT CONFIG_AWS_IOT_CORE_PORT
#define PUB_TOPIC CONFIG_AWS_IOT_CORE_PUB_TOPIC
#define SUB_TOPIC CONFIG_AWS_IOT_CORE_SUB_TOPIC

/**
 * MQTT client struct.
 */
typedef struct
{
  const char *client_id;
  esp_mqtt_client_handle_t client;
  bool is_connected;
} mqtt_client_t;

/**
 * Queue message sources.
 */
typedef enum
{
  DHT11,
  MOTION_SENSOR,
  WATER_LEVEL_SENSOR,
  SERVO_FEEDER
} msg_source_t;

/**
 * Base struct for queue messages.
 */
typedef struct
{
  msg_source_t source;
  struct
  {

    uint8_t temp;
    uint8_t humidity;

    char water_level[16];

    char motion_detection_status[16];

    uint64_t last_feed_timestamp;

    uint64_t last_motion_detected_time;
  } msg_data;
} data_queue_msg_t;

extern QueueHandle_t data_queue;

/**
 * Certs for AWS IoT Core.
 * Make sure to embed the text files in CMakeLists.txt if you use this method.
 */
extern const uint8_t aws_root_ca_pem_start[] asm("_binary_AmazonRootCA1_pem_start");
extern const uint8_t aws_root_ca_pem_end[] asm("_binary_AmazonRootCA1_pem_end");
extern const uint8_t certificate_pem_crt_start[] asm("_binary_certificate_pem_crt_start");
extern const uint8_t certificate_pem_crt_end[] asm("_binary_certificate_pem_crt_end");
extern const uint8_t private_pem_key_start[] asm("_binary_private_pem_key_start");
extern const uint8_t private_pem_key_end[] asm("_binary_private_pem_key_end");

/**
 * @brief Initialize and start the MQTT client.
 *
 * @param mqtt_client pointer to an mqtt client.
 */
void mqtt_app_start(mqtt_client_t *mqtt_client);
