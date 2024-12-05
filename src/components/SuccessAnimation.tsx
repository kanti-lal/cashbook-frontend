import { Check } from 'lucide-react';
import { useEffect, useState } from 'react';

interface SuccessAnimationProps {
  onComplete: () => void;
  inModal?: boolean;
}

export default function SuccessAnimation({ onComplete, inModal = false }: SuccessAnimationProps) {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShow(false);
      onComplete();
    }, 2000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!show) return null;

  return (
    <div className={`${
      inModal 
        ? 'absolute inset-0 flex items-center justify-center bg-white/80' 
        : 'fixed inset-0 flex items-center justify-center bg-black/50 z-50'
    }`}>
      <div className="transform scale-0 animate-[scale-in_0.3s_ease-out_forwards]">
        <div className="bg-green-100 rounded-full p-3">
          <Check className="w-12 h-12 text-green-500 animate-[check-mark_0.4s_ease-out_forwards]" />
        </div>
      </div>
    </div>
  );
}