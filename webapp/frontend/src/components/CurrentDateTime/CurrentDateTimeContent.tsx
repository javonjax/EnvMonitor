import { MapPin } from 'lucide-react';
import CurrentDateTime from './CurrentDateTime';

export interface CurrentDateTimeContentProps {
  currentDateTime: Date;
}

const CurrentDateTimeContent = ({ currentDateTime }: CurrentDateTimeContentProps) => {
  return (
    <div className="col-span-full row-span-2 p-4 lg:col-span-6">
      <CurrentDateTime currentDateTime={currentDateTime} />
    </div>
  );
};

export default CurrentDateTimeContent;
