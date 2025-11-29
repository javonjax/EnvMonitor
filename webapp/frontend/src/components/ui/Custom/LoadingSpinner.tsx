import { Spinner } from '../spinner';

const LoadingSpinner = () => {
  return (
    <div className="flex h-full w-full grow items-center justify-center">
      <Spinner />
    </div>
  );
};

export default LoadingSpinner;
