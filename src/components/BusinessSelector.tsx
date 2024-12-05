import { ChevronLeft, Store } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';
import { getBusinesses } from '../utils/storage';

export default function BusinessSelector() {
  const { activeBusiness } = useBusiness();
  const businesses = getBusinesses();

  if (!activeBusiness) {
    return null;
  }

  return (
    <div className="bg-white border-b">
      <div className="max-w-md mx-auto px-4 py-2 flex items-center justify-between">
        <Link
          to="/"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
          <div className="flex items-center gap-2">
            <Store size={20} />
            <span className="font-medium">{activeBusiness.name}</span>
          </div>
        </Link>
        <div className="text-sm text-gray-500">
          {businesses.length} {businesses.length === 1 ? 'business' : 'businesses'}
        </div>
      </div>
    </div>
  );
}