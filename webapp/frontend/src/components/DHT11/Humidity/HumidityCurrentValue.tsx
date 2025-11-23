import React from 'react';

export interface HumidityCurrentValueProps {
  humidity: number | undefined;
}

const HumidityCurrentValue = ({ humidity }: HumidityCurrentValueProps) => {
  return <div className="h-[200px] w-[200px] shrink-0 border-2 border-blue-500">{humidity}</div>;
};

export default HumidityCurrentValue;
