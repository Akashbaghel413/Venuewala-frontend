import { ButtonHTMLAttributes, ReactNode } from 'react';

type Variant = 'primary' | 'secondary' | 'outline' | 'cta';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  children: ReactNode;
}

const variants: Record<Variant, string> = {
  primary:
    'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 shadow-sm',
  secondary:
    'bg-gray-100 text-gray-700 hover:bg-gray-200 active:bg-gray-300',
  outline:
    'border-2 border-primary-500 text-primary-500 hover:bg-primary-50 active:bg-primary-100',
  cta:
    'bg-coral-500 text-white hover:bg-coral-600 active:bg-coral-700 shadow-sm',
};

export default function Button({
  variant = 'cta',
  children,
  className = '',
  ...props
}: ButtonProps) {
  return (
    <button
      className={`inline-flex items-center justify-center gap-2 rounded-[8px] px-6 py-3 text-sm font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer hover:shadow-md ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
}
