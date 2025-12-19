export interface CurrentDateTimeProps {
  currentDateTime: Date;
}

const CurrentDateTime = ({ currentDateTime }: CurrentDateTimeProps) => {
  return (
    <div className="flex min-h-0 flex-col gap-y-2">
      <p className="text-4xl font-semibold">
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
      <p>{currentDateTime.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })}</p>
    </div>
  );
};

export default CurrentDateTime;
