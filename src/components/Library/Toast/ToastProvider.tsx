import { Bounce, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ToastProvider = () => {
  return (
    <ToastContainer
      position="top-center"
      autoClose={1200}
      hideProgressBar={true}
      newestOnTop={false}
      closeOnClick={true}
      theme="light"
      rtl={false} // right to left
      transition={Bounce}
    />
  );
};

export default ToastProvider;
