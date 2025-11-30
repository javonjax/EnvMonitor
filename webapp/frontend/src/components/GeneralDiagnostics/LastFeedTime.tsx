export interface LastFeedTimeProps {
  lastFeedTime: number | undefined;
}

const LastFeedTime = ({ lastFeedTime }: LastFeedTimeProps) => {
  return (
    <div className="h-[200px] w-[200px] shrink-0">
      <div className="bg-test flex h-full w-full flex-col items-center justify-center gap-y-4 rounded-xl p-4">
        <p>Last Feed</p>
        <p>
          {new Date(Number(lastFeedTime)).toLocaleString('en-US', {
            weekday: 'long',
          })}
        </p>
        <p>
          {new Date(Number(lastFeedTime)).toLocaleString('en-US', {
            month: 'long',
            year: 'numeric',
            day: 'numeric',
          })}
        </p>
        <p>
          {new Date(Number(lastFeedTime)).toLocaleTimeString('en-US', {
            hour: 'numeric',
            minute: '2-digit',
          })}
        </p>
      </div>
    </div>
  );
};

export default LastFeedTime;
