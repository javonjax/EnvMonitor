#include "nvs_flash.h"
#include "wifi.h"
#include "mqtt.h"
#include "DHT11.h"
#include "cJSON.h"

#define DHT11_SIGNAL_PIN GPIO_NUM_2
#define LED_PIN GPIO_NUM_40

extern esp_mqtt_client_handle_t mqtt_client;
volatile int isConnected = 0;

void vReadTempAndHumidity(void *pvParameters) {
    DHT11_TaskParams_t *params = (DHT11_TaskParams_t *)pvParameters;
    while (1) {
        if (DHT11_ReadTemperatureAndHumidity(
            params->DHT11, params->temperature, params->humidity) == DHT_OK) {
            gpio_set_level(LED_PIN, 1);
            vTaskDelay(pdMS_TO_TICKS(200));
            gpio_set_level(LED_PIN, 0);
            cJSON *root = cJSON_CreateObject();
            cJSON_AddNumberToObject(root, "temperature", *params->temperature);
            cJSON_AddNumberToObject(root, "humidity", *params->humidity);
            char *json_str = cJSON_PrintUnformatted(root);
            if (isConnected) {
                int msg_id = esp_mqtt_client_publish(mqtt_client, PUB_TOPIC, json_str, 0, 0, 0);
                if (msg_id != 0) {
                    ESP_LOGI(TAG, "Error sending data. Message ID: %d\n", msg_id);
                } 
            }
            printf("Temperature: %d\n", *params->temperature);
            printf("Humidity: %d\n", *params->humidity);
        }
        vTaskDelay(pdMS_TO_TICKS(20000));
    }
}

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

    wifi_init_sta();

    if (isConnected) {
      mqtt_app_start();
    }

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

    gpio_config_t led_pin_config = {
        .pin_bit_mask = (1ULL << LED_PIN),
        .mode = GPIO_MODE_OUTPUT,
        .pull_up_en = GPIO_PULLUP_DISABLE,
        .pull_down_en = GPIO_PULLDOWN_DISABLE,
        .intr_type = GPIO_INTR_DISABLE
    };    

    gpio_reset_pin(LED_PIN);
    gpio_config(&led_pin_config);
    static DHT11_TaskParams_t DHT11_TaskParams = {
        .DHT11 = &DHT11,
        .temperature = &temperature,
        .humidity = &humidity,
        .led_pin = LED_PIN
    };

    xTaskCreate(vReadTempAndHumidity, "DHT11", 2048, &DHT11_TaskParams, 1, NULL);
}
