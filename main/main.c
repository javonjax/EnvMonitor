#include "nvs_flash.h"
#include "wifi.h"
#include "mqtt.h"


volatile int isConnected = 0;

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

    while (1) {
      if (isConnected) {
        printf("Connected.\n");
      } else {
        printf("Not Connected.\n");
      }
      vTaskDelay(pdMS_TO_TICKS(2000));
    }
}
