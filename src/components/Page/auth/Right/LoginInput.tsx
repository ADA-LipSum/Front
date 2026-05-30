import type { InputHTMLAttributes, ReactNode } from 'react';

interface LoginInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  leftIcon: ReactNode;
  rightIcon?: ReactNode;
}

export const LoginInput = ({ label, leftIcon, rightIcon, ...props }: LoginInputProps) => {
  return (
    <div className="mb-5">
      <label className="block text-sm font-medium text-gray-700 mb-2">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-xl px-4 py-3 bg-white focus-within:border-gray-400 transition-colors">
        <span className="text-gray-400 mr-3 shrink-0">{leftIcon}</span>
        <input
          {...props}
          className="flex-1 outline-none text-sm text-gray-800 placeholder:text-gray-300 bg-transparent min-w-0"
        />
        {rightIcon && <span className="ml-2 shrink-0 text-gray-400">{rightIcon}</span>}
      </div>
    </div>
  );
};
