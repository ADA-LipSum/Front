import { TooltipProvider } from '@/components/ui/tooltip';
import Router from '@/Router';
import ToastProvider from './components/Library/Toast/ToastProvider';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <TooltipProvider>
      <ToastProvider />
      <Router />
    </TooltipProvider>
  );
}

export default App;
