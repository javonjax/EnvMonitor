import { z } from 'zod';

export const EnvMonitorDataSchema = z.object({
  temperature: z.number(),
  humidity: z.number(),
  motionDetection: z.string(),
  waterLevel: z.string(),
  lastFeedTime: z.number(),
  timestamp: z.number(),
});

export type EnvMonitorData = z.infer<typeof EnvMonitorDataSchema>;

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
    current: data.current,
    weatherOverview: data.weather_overview,
  }));

export type CurrentWeatherAPIResponse = z.infer<typeof CurrentWeatherAPIResponseSchema>;

export const DailyForecastDataSchema = z
  .object({
    dt: z.number(),
    summary: z.string(),
    temp: z.object({
      min: z.number(),
      max: z.number(),
    }),
    humidity: z.number(),
    weather: z.array(WeatherDescriptionSchema),
  })
  .strip();

export type DailyForecastData = z.infer<typeof DailyForecastDataSchema>;

export const DailyForecastAPIResponseSchema = z
  .object({
    daily: z.array(DailyForecastDataSchema),
  })
  .strip();

export type DailyForecasetAPIResponse = z.infer<typeof DailyForecastAPIResponseSchema>;
