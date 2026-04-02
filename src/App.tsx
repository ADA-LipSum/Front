import Router from '@/Router';
import ToastProvider from './components/Library/Toast/ToastProvider';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <>
      <ToastProvider />
      <Router />
    </>
  );
}

export default App;
