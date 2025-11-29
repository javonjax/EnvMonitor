import { daysOfTheWeek, localeDateStringOptions } from '@/lib/utils';

export interface CurrentDateTimeProps {
  currentDateTime: Date;
}

const CurrentDateTime = ({ currentDateTime }: CurrentDateTimeProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col items-center justify-center rounded-xl">
      <div className="text-8xl font-semibold">
        {currentDateTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
      </div>
      <div>Riverview, FL</div>
      <div>{daysOfTheWeek[currentDateTime.getDay()]}</div>
      <div>{currentDateTime.toLocaleDateString('en-US', localeDateStringOptions)}</div>
    </div>
  );
};

export default CurrentDateTime;
