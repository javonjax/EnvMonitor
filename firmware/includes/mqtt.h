#pragma once

#include "mqtt_client.h"
#include "esp_log.h"

/**
 * AWS IOT Core config.
 */
#define AWS_IOT_CORE_ENDPOINT CONFIG_AWS_IOT_CORE_ENDPOINT
#define AWS_IOT_CORE_PORT CONFIG_AWS_IOT_CORE_PORT
#define CLIENT_ID CONFIG_AWS_IOT_CORE_CLIENT_ID
#define PUB_TOPIC CONFIG_AWS_IOT_CORE_PUB_TOPIC
#define SUB_TOPIC CONFIG_AWS_IOT_CORE_SUB_TOPIC

/**
 * Queue message sources.
 */
typedef enum {
    DHT11,
    MOTION_SENSOR,
    WATER_LEVEL_SENSOR
} msg_source_t;

/**
 * Base struct for queue messages.
 */
typedef struct {
    msg_source_t source;
    union {
        struct {
            uint8_t temp;
            uint8_t humidity;
        } DHT11_Data;

        char *waterLevel;

        char *motionDetectionStatus;
    } msg_data;
} data_queue_msg_t;

extern QueueHandle_t dataQueue;

/**
 * Certs for AWS IoT Core.
 * Make sure to embed the text files in CMakeLists.txt if you use this method.
 */
extern const uint8_t aws_root_ca_pem_start[] asm("_binary_AmazonRootCA1_pem_start");
extern const uint8_t aws_root_ca_pem_end[]   asm("_binary_AmazonRootCA1_pem_end");
extern const uint8_t certificate_pem_crt_start[] asm("_binary_certificate_pem_crt_start");
extern const uint8_t certificate_pem_crt_end[]   asm("_binary_certificate_pem_crt_end");
extern const uint8_t private_pem_key_start[] asm("_binary_private_pem_key_start");
extern const uint8_t private_pem_key_end[]   asm("_binary_private_pem_key_end");

extern const char *WIFI_STATION_TAG;

/**
 * @brief Initialize and start the MQTT client.
 */
void mqtt_app_start(void);
