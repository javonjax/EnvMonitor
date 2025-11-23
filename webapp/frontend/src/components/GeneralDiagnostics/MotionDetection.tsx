export interface MotionDetectionProps {
  motionDetection: string | undefined;
}

const MotionDetection = ({ motionDetection }: MotionDetectionProps) => {
  return (
    <div className="h-[200px] w-[200px] shrink-0 border-2 border-blue-500">{motionDetection}</div>
  );
};

export default MotionDetection;
