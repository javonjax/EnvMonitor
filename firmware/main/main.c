#include "nvs_flash.h"
#include "wifi.h"
#include "mqtt.h"
#include "DHT11.h"
#include "cJSON.h"
#include "DHT11_Task.h"
#include "MotionSensor_Task.h"
#include "WaterLevelSensor_Task.h"
#include "Publisher_Task.h"
#include "esp_adc/adc_cali.h"


extern esp_mqtt_client_handle_t mqtt_client;
bool isWifiConnected = false;
bool isMQTTConnected = false;
adc_cali_handle_t adc_cali_handle;
adc_oneshot_unit_handle_t adc1_handle;
QueueHandle_t dataQueue;

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

    // Calibrate ADC
    adc_cali_curve_fitting_config_t adc_cali_config = {
        .unit_id = ADC_UNIT_1,
        .atten = ADC_ATTEN_DB_12,
        .bitwidth = ADC_BITWIDTH_DEFAULT,
    };
    ESP_ERROR_CHECK(adc_cali_create_scheme_curve_fitting(&adc_cali_config, &adc_cali_handle));

    // Start wifi station mode and mqtt client mode.
    wifi_init_sta();

    if (isWifiConnected) {
        printf("starting mqtt\n");
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

    // Create queue for device messages. 
    dataQueue = xQueueCreate(10, sizeof(data_queue_msg_t));

    // Create tasks.
    printf("creating tasks\n");
    xTaskCreate(vPublisher_Task, "MQTT Publisher", 4096, NULL, 3, NULL);
    xTaskCreate(vDHT11_Task, "DHT11", 4096, &DHT11_TaskParams, 1, NULL);
    xTaskCreate(vMotionSensor_Task, "Motion activated lights", 4096, NULL, 1, NULL);
    xTaskCreate(vWaterLevelSensor_Task, "Water level sensor", 4096, NULL, 1, NULL);
}
