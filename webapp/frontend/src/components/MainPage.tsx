import { useState, useEffect } from 'react';
import WeatherForecastContent from './WeatherForecast/WeatherForecastSection';
import CurrentConditionsSection from './CurrentConditions/CurrentConditionsSection';
import EnvironmentMonitorSection from './EnvironmentMonitor/EnvironmentMonitorSection';
import { errorToast, handleAPIError, handleAPIFetch } from '@/lib/utils';
import type { EnvMonitorData } from '@/lib/types';

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
      try {
        const url: string = `${BACKEND_DATA_LATEST_URL}1`;
        const res: globalThis.Response = await handleAPIFetch(await fetch(url));
        const data = await res.json();
        setWebSocketData(data);
        return;
      } catch (error) {
        if (error instanceof Error) {
          handleAPIError(error);
        } else {
          errorToast();
        }
      }
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
      <div className="grid grow grid-cols-12">
        {/* Temp and humidity */}

        <CurrentConditionsSection currentDateTime={currentDateTime} />

        <WeatherForecastContent />

        <EnvironmentMonitorSection websocketData={websocketData} />
      </div>
    </div>
  );
};

export default MainPage;
