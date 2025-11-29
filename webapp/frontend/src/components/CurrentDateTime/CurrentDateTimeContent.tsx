import CurrentDateTime from './CurrentDateTime';

export interface CurrentDateTimeContentProps {
  currentDateTime: Date;
}

const CurrentDateTimeContent = ({ currentDateTime }: CurrentDateTimeContentProps) => {
  return (
    <div className="col-span-full row-span-2 flex flex-col items-center p-4 lg:col-span-3">
      <CurrentDateTime currentDateTime={currentDateTime} />
    </div>
  );
};

export default CurrentDateTimeContent;
