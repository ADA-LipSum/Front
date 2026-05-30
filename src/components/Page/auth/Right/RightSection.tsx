import { LoginForm } from './LoginForm';
import { LoginHeader } from './LoginHeader';

export const RightSection = () => {
  return (
    <div className="fixed right-0 top-0 w-1/2 h-screen bg-gray-100 flex flex-col">
      <div className="flex-1 flex flex-col items-center justify-center px-16">
        <div className="w-full max-w-md">
          <LoginHeader />
          <LoginForm />
        </div>
      </div>
    </div>
  );
};
