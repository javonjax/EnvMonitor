export interface CurrentDateTimeProps {
  currentDateTime: Date;
}

const CurrentDateTime = ({ currentDateTime }: CurrentDateTimeProps) => {
  return (
    <div className="bg-background flex h-full w-full rounded-xl p-4">
      <div className="flex h-full w-full flex-col justify-center border-2 border-black">
        <p className="text-6xl font-semibold">
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
