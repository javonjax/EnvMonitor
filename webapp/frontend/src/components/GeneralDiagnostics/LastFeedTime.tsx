export interface LastFeedTimeProps {
  lastFeedTime: number | undefined;
}

const LastFeedTime = ({ lastFeedTime }: LastFeedTimeProps) => {
  return (
    <div className="h-[200px] w-[200px] shrink-0 border-2 border-blue-500">
      {new Date(Number(lastFeedTime)).toLocaleString()}
    </div>
  );
};

export default LastFeedTime;
