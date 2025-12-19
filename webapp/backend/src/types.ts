import { z } from 'zod';

export const EnvMonitorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  motionDetection: z.string(),
  waterLevel: z.string(),
  lastFeedTime: z.number(),
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
  .transform((data) => ({
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

export const DailyForecastAPIResponseSchema = z
  .object({
    daily: z.array(DailyForecastDaySchema),
  })
  .strip()
  .transform((data) => data.daily);

export type DailyForecasetAPIResponse = z.infer<typeof DailyForecastAPIResponseSchema>;

export const CurrentWeatherAPIResponseSchema = z
  .object({
    current: CurrentWeatherSchema,
    daily: z.array(DailyForecastDaySchema),
    weather_overview: z.string(),
  })
  .strip()
  .transform((data) => ({
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
  }));

export type CurrentWeatherAPIResponse = z.infer<typeof CurrentWeatherAPIResponseSchema>;
