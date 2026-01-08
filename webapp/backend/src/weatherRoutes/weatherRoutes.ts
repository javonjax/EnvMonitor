import express, { type Request, response, type Response, Router } from 'express';
import dotenv from 'dotenv';
import {
  CurrentWeatherAPIResponseSchema,
  DailyForecastAPIResponseSchema,
  type CurrentWeatherAPIResponse,
  type DailyForecasetAPIResponse,
} from '../types.js';

const OPEN_WEATHER_MAP_API_KEY: string = process.env.OPEN_WEATHER_MAP_API_KEY as string;
const OPEN_WEATHER_MAP_ONECALL_URL: string = process.env.OPEN_WEATHER_MAP_ONECALL_URL as string;
const STATION_LATITUDE: string = process.env.STATION_LATITUDE as string;
const STATION_LONGITUDE: string = process.env.STATION_LONGITUDE as string;

dotenv.config();
const router: Router = express.Router();

router.get('/weather/current', async (req: Request, res: Response) => {
  try {
    let url: string = `${OPEN_WEATHER_MAP_ONECALL_URL}?lat=${STATION_LATITUDE}&lon=${STATION_LONGITUDE}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=imperial&exclude=hourly,minutely`;
    const apiResCurrentWeather: globalThis.Response = await fetch(url);
    const jsonResCurrentWeather = await apiResCurrentWeather.json();

    url = `${OPEN_WEATHER_MAP_ONECALL_URL}/overview?lat=${STATION_LATITUDE}&lon=${STATION_LONGITUDE}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=imperial`;
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

router.get('/weather/forecast', async (req: Request, res: Response) => {
  try {
    let url: string = `${OPEN_WEATHER_MAP_ONECALL_URL}?lat=${STATION_LATITUDE}&lon=${STATION_LONGITUDE}&appid=${OPEN_WEATHER_MAP_API_KEY}&units=imperial&exclude=current,hourly,minutely`;
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

export default router;
