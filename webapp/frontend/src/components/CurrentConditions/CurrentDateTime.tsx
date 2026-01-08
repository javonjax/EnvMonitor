export interface CurrentDateTimeProps {
  currentDateTime: Date;
}

const CurrentDateTime = ({ currentDateTime }: CurrentDateTimeProps) => {
  return (
    <div className="flex min-h-0 flex-col gap-y-2">
      <p className="text-6xl font-semibold">
        {currentDateTime.toLocaleString('en-US', {
          weekday: 'long',
        })}
      </p>
      <p className="text-3xl">
        {currentDateTime.toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        })}
      </p>
      <p className="text-3xl">
        {currentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}
      </p>
    </div>
  );
};

export default CurrentDateTime;
