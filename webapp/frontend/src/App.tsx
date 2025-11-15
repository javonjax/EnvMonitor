import { useEffect, useState } from 'react';
import { type EnvMonitorData } from '../../backend/src/types';

function App() {
  const [data, setData] = useState<EnvMonitorData>();

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:3000/ws');
    ws.onopen = () => console.log('WebSocket connected');
    ws.onerror = (err) => console.error('WebSocket error:', err);
    ws.onclose = () => console.log('WebSocket closed');
    ws.onmessage = (event) => {
      const data: EnvMonitorData = JSON.parse(event.data);
      setData(data);
    };

    return () => ws.close();
  }, []);

  return (
    <>
      <main className="flex grow flex-col items-center">
        <div>
          <p>Temp: {data?.temperature}</p>
          <p>Humidity: {data?.humidity}</p>
          <p>Motion Detection: {data?.motionDetection}</p>
          <p>Water Level: {data?.waterLevel}</p>
        </div>
      </main>
    </>
  );
}

export default App;
