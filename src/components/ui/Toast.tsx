import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle } from 'lucide-react';

type ToastType = 'success' | 'error';

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
}

export default function Toast({ type, message, onClose }: ToastProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      setTimeout(onClose, 300);
    }, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const Icon = type === 'success' ? CheckCircle : AlertCircle;
  const colorClass =
    type === 'success'
      ? 'bg-primary-50 text-primary-700 border-primary-200'
      : 'bg-red-50 text-red-700 border-red-200';

  return (
    <div
      className={`fixed top-4 right-4 z-50 flex items-center gap-3 rounded-card border px-4 py-3 shadow-lg transition-all duration-300 ${colorClass} ${
        show ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
      }`}
    >
      <Icon className="h-5 w-5 shrink-0" />
      <span className="text-sm font-medium">{message}</span>
      <button onClick={() => { setShow(false); setTimeout(onClose, 300); }} className="ml-2 shrink-0 hover:opacity-70">
        <X className="h-4 w-4" />
      </button>
    </div>
  );
}
