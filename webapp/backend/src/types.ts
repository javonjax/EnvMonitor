import { z } from 'zod';

export interface EnvParams {
  '/certs/AmazonRootCA1.pem': string;
  '/certs/certificate.pem.crt': string;
  '/certs/private.pem.key': string;
  '/env/AWS_DYNAMO_TABLE': string;
  '/env/AWS_IOT_CORE_BACKEND_CLIENT_ID': string;
  '/env/AWS_IOT_CORE_DEVICE_NAME_BASE': string;
  '/env/AWS_IOT_CORE_ENDPOINT': string;
  '/env/ENV_MONITOR_DATA_TOPIC': string;
  '/env/OPEN_WEATHER_MAP_API_KEY': string;
  '/env/OPEN_WEATHER_MAP_ONECALL_URL': string;
  '/env/STATION_LATITUDE': string;
  '/env/STATION_LONGITUDE': string;
}

export type EnvConfig = {
  mqtt: {
    host: string;
    deviceNameBase: string;
    clientId: string;
    topic: string;
    key: Buffer<ArrayBufferLike>;
    cert: Buffer<ArrayBufferLike>;
    ca: Buffer<ArrayBufferLike>;
  };
  dynamo: {
    table: string;
  };
  weather: {
    apiUrl: string;
    apiKey: string;
    latitude: string;
    longitude: string;
  };
};

export const EnvMonitorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  motionDetection: z.string(),
  waterLevel: z.string(),
  lastServoTriggerTime: z.number(),
  lastMotionDetectedTime: z.number(),
  timestamp: z.number(),
});

export type EnvMonitorData = z.infer<typeof EnvMonitorDataSchema>;

export const EnvMonitorDataArraySchema = z.array(EnvMonitorDataSchema);

export type EnvMonitorDataArray = z.infer<typeof EnvMonitorDataArraySchema>;

export const WeatherDescriptionSchema = z
  .object({
    description: z.string(),
    icon: z.string(),
  })
  .strip();

export type WeatherDescription = z.infer<typeof WeatherDescriptionSchema>;

export const CurrentWeatherSchema = z
  .object({
    dt: z.number(),
    temp: z.number(),
    humidity: z.number(),
    feels_like: z.number(),
    sunrise: z.number(),
    sunset: z.number(),
    wind_speed: z.number(),
    wind_deg: z.number(),
    weather: z.array(WeatherDescriptionSchema),
  })
  .strip();

type DailyForecastDayInput = {
  dt: number;
  summary: string;
  temp: {
    day: number;
    min: number;
    max: number;
  };
  humidity: number;
  weather: z.infer<typeof WeatherDescriptionSchema>[];
};

export const DailyForecastDaySchema = z
  .object({
    dt: z.number(),
    summary: z.string(),
    temp: z.object({
      day: z.number(),
      min: z.number(),
      max: z.number(),
    }),
    humidity: z.number(),
    weather: z.array(WeatherDescriptionSchema),
  })
  .strip()
  .transform((data: DailyForecastDayInput) => ({
    dt: data.dt * 1000, // NOTE: Open weather map reports timestamps in seconds.
    summary: data.summary,
    temp: Math.round(data.temp.day),
    tempMin: Math.round(data.temp.min),
    tempMax: Math.round(data.temp.max),
    humidity: data.humidity,
    weatherDescription: data.weather[0]?.description,
    weatherIcon: data.weather[0]?.icon,
  }));

export type DailyForecastDay = z.infer<typeof DailyForecastDaySchema>;

type DailyForecastAPIResponseInput = {
  daily: z.infer<typeof DailyForecastDaySchema>[];
};

export const DailyForecastAPIResponseSchema = z
  .object({
    daily: z.array(DailyForecastDaySchema),
  })
  .strip()
  .transform((data: DailyForecastAPIResponseInput) => data.daily);

export type DailyForecasetAPIResponse = z.infer<typeof DailyForecastAPIResponseSchema>;

type CurrentWeatherAPIResponseInput = {
  current: z.infer<typeof CurrentWeatherSchema>;
  daily: z.infer<typeof DailyForecastDaySchema>[];
  weather_overview: string;
};

export const CurrentWeatherAPIResponseSchema = z
  .object({
    current: CurrentWeatherSchema,
    daily: z.array(DailyForecastDaySchema),
    weather_overview: z.string(),
  })
  .strip()
  .transform((data: CurrentWeatherAPIResponseInput) => ({
    dt: data.current.dt * 1000, // NOTE: Open weather map reports timestamps in seconds.
    feelsLike: Math.round(data.current.feels_like),
    temp: Math.round(data.current.temp),
    tempMin: Math.round(data.daily[0]?.tempMin ?? 0),
    tempMax: Math.round(data.daily[0]?.tempMax ?? 0),
    humidity: data.current.humidity,
    sunrise: data.current.sunrise * 1000,
    sunset: data.current.sunset * 1000,
    windSpeed: Math.round(data.current.wind_speed),
    windDirection: data.current.wind_deg,
    weatherDescription: data.current.weather[0]?.description,
    weatherIcon: data.current.weather[0]?.icon,
    weatherOverview: data.weather_overview,
    timestamp: Date.now(),
  }));

export type CurrentWeatherAPIResponse = z.infer<typeof CurrentWeatherAPIResponseSchema>;
