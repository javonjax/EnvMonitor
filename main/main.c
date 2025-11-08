#include "nvs_flash.h"
#include "wifi.h"
#include "mqtt.h"
#include "DHT11.h"
#include "cJSON.h"
#include "esp_adc/adc_oneshot.h"
#include "DHT11_Task.h"

#define GPIO_LOW 0
#define GPIO_HIGH 1
#define DHT11_SIGNAL_PIN GPIO_NUM_2
#define DHT11_LED_PIN GPIO_NUM_40
#define MOTION_SENSOR_PIN GPIO_NUM_18
#define MOTION_SENSOR_LED_PIN GPIO_NUM_17
#define MOTION_SENSOR_BUTTON_PIN GPIO_NUM_16
#define WATER_LEVEL_SENSOR_CHANNEL ADC_CHANNEL_4         // PIN 5

extern esp_mqtt_client_handle_t mqtt_client;
volatile int isConnected = 0;

// Flags for controlling motion sensor behavior.
uint8_t lastButtonStatus = 1;
uint8_t useMotionDetection = 1;


/**
 * @brief Enables motion activated lighting and publishes the current motion activation
 *        setting.
 * 
 */
void vMotionSensor_Task(void *pvParameters) {
    static int counter = 0;
    while (1) {
        counter++;
        uint8_t buttonStatus = gpio_get_level(MOTION_SENSOR_BUTTON_PIN);
        if (buttonStatus == GPIO_HIGH) {
            if (lastButtonStatus == GPIO_LOW) {
                useMotionDetection = !useMotionDetection;
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_LOW);
                if (useMotionDetection) {
                    printf("Motion activated lights enabled.\n");
                } else {
                    printf("Motion activated lights disabled.\n");
                }
            }
        }
        lastButtonStatus = buttonStatus;

        if (useMotionDetection) {
            uint8_t motionDetected = gpio_get_level(MOTION_SENSOR_PIN);
            if (motionDetected) {
                printf("Motion detected.\n");
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_HIGH);
            } else {
                gpio_set_level(MOTION_SENSOR_LED_PIN, GPIO_LOW);
            }
        }

        if (counter == 80) {
            cJSON *root = cJSON_CreateObject();
            cJSON_AddBoolToObject(root, "motion detection enabled", useMotionDetection ? true : false);
            char *json_str = cJSON_PrintUnformatted(root);
            if (isConnected) {
                int msg_id = esp_mqtt_client_publish(mqtt_client, PUB_TOPIC, json_str, 0, 0, 0);
                if (msg_id != 0) {
                    ESP_LOGI(WIFI_STATION_TAG, "Error sending data. Message ID: %d\n", msg_id);
                } 
            }
            printf("Motion detection %s\n", useMotionDetection ? "on" : "off");
            cJSON_Delete(root);
            free(json_str);
            counter = 0;
        }
        vTaskDelay(pdMS_TO_TICKS(250));
    }
}

// void vWaterLevelSensor(void *pvParameters) {
//     while (1) {
//     int adc_raw;
//     while (1) {
//         adc_oneshot_read(adc1_handle, WATER_LEVEL_SENSOR_CHANNEL, &adc_raw);
//         printf("ADC Raw: %d\n", adc_raw);
//         vTaskDelay(pdMS_TO_TICKS(2000));
//     }
//     }
// }

void app_main(void)
{
    //Initialize NVS
    esp_err_t ret = nvs_flash_init();
    if (ret == ESP_ERR_NVS_NO_FREE_PAGES || ret == ESP_ERR_NVS_NEW_VERSION_FOUND) {
      ESP_ERROR_CHECK(nvs_flash_erase());
      ret = nvs_flash_init();
    }
    ESP_ERROR_CHECK(ret);

    if (CONFIG_LOG_MAXIMUM_LEVEL > CONFIG_LOG_DEFAULT_LEVEL) {
        /* If you only want to open more logs in the wifi module, you need to make the max level greater than the default level,
         * and call esp_log_level_set() before esp_wifi_init() to improve the log level of the wifi module. */
        esp_log_level_set("wifi", CONFIG_LOG_MAXIMUM_LEVEL);
    }

    // Start wifi station mode and mqtt client mode.
    wifi_init_sta();

    if (isConnected) {
      mqtt_app_start();
    }

    // Initialize necessary components.

    /* DHT11 start */
    static DHT11_t DHT11;
    static uint8_t temperature = 0;
    static uint8_t humidity = 0;

    DHT11 = DHT11_Create(
        DHT11_SIGNAL_PIN,
        GPIO_MODE_INPUT_OUTPUT_OD,
        GPIO_PULLUP_ENABLE,
        GPIO_PULLDOWN_DISABLE,
        GPIO_INTR_DISABLE
    );

    gpio_config_t dht11_led_pin_config = {
        .pin_bit_mask = (1ULL << DHT11_LED_PIN),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };    

    gpio_reset_pin(DHT11_LED_PIN);
    gpio_config(&dht11_led_pin_config);

    static DHT11_TaskParams_t DHT11_TaskParams = {
        .DHT11 = &DHT11,
        .temperature = &temperature,
        .humidity = &humidity,
        .led_pin = DHT11_LED_PIN
    };
    /* DHT11 end */

    /* Motion sensor start */
    gpio_config_t motion_sensor_pin_config = {
        .pin_bit_mask = (1ULL << MOTION_SENSOR_PIN),
        .mode = GPIO_MODE_INPUT,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };

    gpio_config_t motion_sensor_led_pin_config = {
        .pin_bit_mask = (1ULL << MOTION_SENSOR_LED_PIN),
        .mode = GPIO_MODE_OUTPUT,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };

    gpio_config_t motion_sensor_button_pin_config = {
        .pin_bit_mask = (1ULL << MOTION_SENSOR_BUTTON_PIN),
        .mode = GPIO_MODE_INPUT,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .pull_up_en = GPIO_PULLUP_ENABLE,
        .intr_type = GPIO_INTR_DISABLE
    };

    gpio_reset_pin(MOTION_SENSOR_PIN);
    gpio_config(&motion_sensor_pin_config);
    gpio_reset_pin(MOTION_SENSOR_LED_PIN);
    gpio_config(&motion_sensor_led_pin_config);
    gpio_reset_pin(MOTION_SENSOR_BUTTON_PIN);
    gpio_config(&motion_sensor_button_pin_config);
    /* Motion sensor end */

    /* Water level sensor start */
    adc_oneshot_unit_handle_t adc1_handle;
    adc_oneshot_unit_init_cfg_t adc1_init_config = {
        .unit_id = ADC_UNIT_1,
    };
    ESP_ERROR_CHECK(adc_oneshot_new_unit(&adc1_init_config, &adc1_handle));

    adc_oneshot_chan_cfg_t water_level_channel_config = {
        .atten = ADC_ATTEN_DB_12,
        .bitwidth = ADC_BITWIDTH_DEFAULT
    };

    adc_oneshot_config_channel(adc1_handle, WATER_LEVEL_SENSOR_CHANNEL, &water_level_channel_config); 
    /* Water level sensor end */

    // Create tasks.
    xTaskCreate(vDHT11_Task, "DHT11", 4096, &DHT11_TaskParams, 2, NULL);
    xTaskCreate(vMotionSensor_Task, "Motion activated lights", 4096, NULL, 1, NULL);
    
}
