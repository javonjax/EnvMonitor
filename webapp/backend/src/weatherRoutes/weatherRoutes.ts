import express, { type Request, response, type Response, Router } from 'express';
import dotenv from 'dotenv';
import {
  CurrentWeatherAPIResponseSchema,
  DailyForecastAPIResponseSchema,
  type CurrentWeatherAPIResponse,
  type DailyForecasetAPIResponse,
  type EnvConfig,
} from '../types.js';

const NODE_ENV: string = process.env.NODE_ENV as string;
const AWS_REGION: string = process.env.AWS_REGION as string;

export const weatherRoutes = (config: EnvConfig) => {
  const router: Router = express.Router();

  /**
   * GET the curreent weather for the given location.
   */
  router.get('/weather/current', async (req: Request, res: Response) => {
    try {
      let url: string = `${config.weather.apiUrl}?lat=${config.weather.latitude}&lon=${config.weather.longitude}&appid=${config.weather.apiKey}&units=imperial&exclude=hourly,minutely`;
      const apiResCurrentWeather: globalThis.Response = await fetch(url);
      const jsonResCurrentWeather = await apiResCurrentWeather.json();

      url = `${config.weather.apiUrl}/overview?lat=${config.weather.latitude}&lon=${config.weather.longitude}&appid=${config.weather.apiKey}&units=imperial`;
      const apiResWeatherOverview: globalThis.Response = await fetch(url);
      const jsonResWeatherOverview = await apiResWeatherOverview.json();

      const jsonRes = { ...jsonResCurrentWeather, ...jsonResWeatherOverview };
      const parsedJson = CurrentWeatherAPIResponseSchema.safeParse(jsonRes);
      if (!parsedJson.success) {
        throw new Error('API response does not fit the desired schema.');
      }

      const currentWeatherAPIRes: CurrentWeatherAPIResponse = parsedJson.data;

      res.status(200).json(currentWeatherAPIRes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
    }
  });

  /**
   * GET 8 day weather forecast.
   */
  router.get('/weather/forecast', async (req: Request, res: Response) => {
    try {
      let url: string = `${config.weather.apiUrl}?lat=${config.weather.latitude}&lon=${config.weather.longitude}&appid=${config.weather.apiKey}&units=imperial&exclude=current,hourly,minutely`;
      let apiRes: globalThis.Response = await fetch(url);
      const jsonRes = await apiRes.json();
      const parsedJson = DailyForecastAPIResponseSchema.safeParse(jsonRes);
      if (!parsedJson.success) {
        throw new Error('API response does not fit the desired schema.');
      }

      const forecastAPIRes: DailyForecasetAPIResponse = parsedJson.data;

      res.status(200).json(forecastAPIRes);
    } catch (error) {
      if (error instanceof Error) {
        res.status(500).json({ message: error.message });
        return;
      }
    }
  });

  return router;
};

export default weatherRoutes;
