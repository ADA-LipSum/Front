import Router from '@/Router';
import ToastProvider from './components/toast/ToastProvider';

function App() {
  return (
    <>
      <ToastProvider />
      <Router />
    </>
  );
}

export default App;
