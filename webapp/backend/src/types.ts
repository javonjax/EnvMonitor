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
    weather: z.array(WeatherDescriptionSchema),
  })
  .strip();

export const CurrentWeatherAPIResponseSchema = z
  .object({
    current: CurrentWeatherSchema,
    weather_overview: z.string(),
  })
  .strip()
  .transform((data) => ({
    dt: data.current.dt,
    feelsLike: Math.round(data.current.feels_like),
    temp: Math.round(data.current.temp),
    humidity: data.current.humidity,
    weatherDescription: data.current.weather[0]?.description,
    weatherIcon: data.current.weather[0]?.icon,
    weatherOverview: data.weather_overview,
  }));

export type CurrentWeatherAPIResponse = z.infer<typeof CurrentWeatherAPIResponseSchema>;

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
    dt: data.dt,
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
