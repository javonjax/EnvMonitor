import { MapPin } from 'lucide-react';

export interface CurrentDateTimeProps {
  currentDateTime: Date;
}

const CurrentDateTime = ({ currentDateTime }: CurrentDateTimeProps) => {
  return (
    <div className="bg-accent flex h-full w-full flex-col rounded-xl p-4">
      <div className="flex items-center gap-x-2">
        <MapPin size={32} />
        <p className="text-2xl font-semibold">Riverview, FL</p>
      </div>
      <div className="flex h-full w-full flex-col items-center justify-center">
        <p className="text-8xl font-semibold">
          {currentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
        </p>

        <p>
          {currentDateTime.toLocaleString('en-US', {
            weekday: 'long',
          })}
        </p>
        <p>
          {currentDateTime.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </p>
      </div>
    </div>
  );
};

export default CurrentDateTime;
