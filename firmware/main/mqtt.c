#include "mqtt.h"

extern bool isMQTTConnected;
const char *MQTT_TAG = "MQTT";

/*
 * @brief Event handler registered to receive MQTT events
 *
 *  This function is called by the MQTT client event loop.
 *
 * @param handler_args user data registered to the event.
 * @param base Event base for the handler(always MQTT Base in this example).
 * @param event_id The id for the received event.
 * @param event_data The data for the event, esp_mqtt_event_handle_t.
 */
static void mqtt_event_handler(void *handler_args, esp_event_base_t base, int32_t event_id, void *event_data)
{
  mqtt_client_t *client = (mqtt_client_t *)handler_args;
  const char *client_id = client->client_id;
  esp_mqtt_event_handle_t event = event_data;
  ESP_LOGD(MQTT_TAG, "Event dispatched from event loop base=%s, event_id=%" PRIi32, base, event_id);
  switch ((esp_mqtt_event_id_t)event_id)
  {
  case MQTT_EVENT_CONNECTED:
    client->is_connected = true;
    // esp_mqtt_client_subscribe(client->client, SUB_TOPIC, 0);    // Remove this line if theres no topic to subscribe to.
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_CONNECTED client: %s", client_id);
    break;

  case MQTT_EVENT_DISCONNECTED:
    client->is_connected = false;
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_DISCONNECTED client: ", client_id);
    break;

  case MQTT_EVENT_SUBSCRIBED:
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_SUBSCRIBED, msg_id=%d", event->msg_id);
    break;

  case MQTT_EVENT_UNSUBSCRIBED:
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_UNSUBSCRIBED, msg_id=%d", event->msg_id);
    break;

  case MQTT_EVENT_PUBLISHED:
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_PUBLISHED, msg_id=%d", event->msg_id);
    break;

  case MQTT_EVENT_DATA:
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_DATA");
    printf("TOPIC=%.*s\r\n", event->topic_len, event->topic);
    printf("DATA=%.*s\r\n", event->data_len, event->data);
    break;

  case MQTT_EVENT_ERROR:
    ESP_LOGI(MQTT_TAG, "MQTT_EVENT_ERROR client %s", client_id);
    if (event->error_handle->error_type == MQTT_ERROR_TYPE_TCP_TRANSPORT)
    {
      ESP_LOGI(MQTT_TAG, "Last error code reported from esp-tls: 0x%x", event->error_handle->esp_tls_last_esp_err);
      ESP_LOGI(MQTT_TAG, "Last tls stack error number: 0x%x", event->error_handle->esp_tls_stack_err);
      ESP_LOGI(MQTT_TAG, "Last captured errno : %d (%s)", event->error_handle->esp_transport_sock_errno,
               strerror(event->error_handle->esp_transport_sock_errno));
    }
    else if (event->error_handle->error_type == MQTT_ERROR_TYPE_CONNECTION_REFUSED)
    {
      ESP_LOGI(MQTT_TAG, "Connection refused error: 0x%x", event->error_handle->connect_return_code);
    }
    else
    {
      ESP_LOGW(MQTT_TAG, "Unknown error type: 0x%x", event->error_handle->error_type);
    }
    break;
  default:
    ESP_LOGI(MQTT_TAG, "Other event id:%d Client: %s", event->event_id, client_id);
    break;
  }
}

void mqtt_app_start(mqtt_client_t *mqtt_client)
{
  // Configure MQTT client. Remember to point to the appropriate certs.
  const esp_mqtt_client_config_t mqtt_cfg = {
      .broker = {
          .address.uri = "mqtts://" AWS_IOT_CORE_ENDPOINT,
          .address.port = AWS_IOT_CORE_PORT,
          .verification.certificate = (const char *)aws_root_ca_pem_start,
      },
      .credentials = {.authentication.certificate = (const char *)certificate_pem_crt_start, .authentication.key = (const char *)private_pem_key_start, .client_id = mqtt_client->client_id}};

  // Store a global version of MQTT client to use it in tasks.
  esp_mqtt_client_handle_t client = esp_mqtt_client_init(&mqtt_cfg);
  mqtt_client->client = client;

  // Pass the mqtt client struct to the event handler to log specific info for each client.
  esp_mqtt_client_register_event(client, ESP_EVENT_ANY_ID, mqtt_event_handler, mqtt_client);
  esp_mqtt_client_start(client);
}