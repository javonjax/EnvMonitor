import { useState, useEffect } from 'react';
import type { EnvMonitorData } from '../../../backend/src/types';
import DHT11Content from './DHT11/DHT11Content';
import WeatherForecastContent from './WeatherForecast/WeatherForecastContent';
import CurrentWeatherContent from './CurrentWeather/CurrentWeatherContent';
import GeneralDiagnosticsContent from './GeneralDiagnostics/GeneralDiagnosticsContent';
import CurrentDateTimeContent from './CurrentDateTime/CurrentDateTimeContent';
import CurrentConditionsSection from './CurrentConditions/CurrentConditionsSection';

const BACKEND_DATA_LATEST_URL: string = import.meta.env.VITE_BACKEND_DATA_LATEST_URL as string;
const BACKEND_WEBSOCKET_URL: string = import.meta.env.VITE_BACKEND_WEBSOCKET_URL as string;

const MainPage = () => {
  const [websocketData, setWebSocketData] = useState<EnvMonitorData>();
  const [currentDateTime, setCurrentDateTime] = useState<Date>(new Date());

  useEffect(() => {
    setCurrentDateTime(new Date());

    const interval = setInterval(() => {
      setCurrentDateTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Get the latest values from the DB then wait for websocket updates.
  useEffect(() => {
    const fetchInitialData = async (): Promise<void> => {
      const url: string = `${BACKEND_DATA_LATEST_URL}1`;
      const res: globalThis.Response = await fetch(url);
      const data = await res.json();
      setWebSocketData(data);
      return;
    };
    fetchInitialData();
  }, []);

  // WebSocket setup.
  useEffect(() => {
    const ws = new WebSocket(BACKEND_WEBSOCKET_URL);
    ws.onopen = () => console.log('WebSocket connected');
    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');
    ws.onmessage = (event) => {
      const messageData: EnvMonitorData = JSON.parse(event.data);
      setWebSocketData(messageData);
    };

    return () => ws.close();
  }, []);

  return (
    <div className="flex grow justify-center bg-black">
      <div className="grid grow grid-cols-12 grid-rows-[500px_500px_500px]">
        {/* Temp and humidity */}
        {/* <CurrentDateTimeContent currentDateTime={currentDateTime} /> */}
        <CurrentConditionsSection currentDateTime={currentDateTime} />
        {/* <CurrentWeatherContent /> */}

        <WeatherForecastContent />
        <DHT11Content humidity={websocketData?.humidity} temperature={websocketData?.temperature} />
        <GeneralDiagnosticsContent
          waterLevel={websocketData?.waterLevel}
          lastFeedTime={websocketData?.lastFeedTime}
        />
      </div>
    </div>
  );
};

export default MainPage;
