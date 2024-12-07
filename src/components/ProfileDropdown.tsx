import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import UserAvatar from "./UserAvatar";
import { LogOut, User } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  if (!user) return null;

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:bg-gray-100 p-2 rounded-full transition-colors"
      >
        <UserAvatar name={user.name} size="sm" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50">
          <div className="px-4 py-2 border-b">
            <p className="text-sm font-medium text-gray-900">{user.name}</p>
            <p className="text-xs text-gray-500">{user.email}</p>
          </div>

          <Link
            to="/profile"
            className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
            onClick={() => setIsOpen(false)}
          >
            <User size={16} />
            Profile
          </Link>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="flex items-center gap-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
          >
            <LogOut size={16} />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
