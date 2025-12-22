import MainPage from './components/MainPage';
import { Toaster } from './components/ui/sonner';

function App() {
  return (
    <>
      <main className="flex grow flex-col">
        <MainPage />
        <Toaster richColors closeButton visibleToasts={1} />
      </main>
    </>
  );
}

export default App;
