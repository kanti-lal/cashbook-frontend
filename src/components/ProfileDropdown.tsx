import { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import UserAvatar from "./UserAvatar";
import { LogOut, User, Moon, Sun, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { useOnClickOutside } from "../hooks/useOnClickOutside";

export default function ProfileDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  useOnClickOutside(dropdownRef, () => setIsOpen(false));

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 focus:outline-none"
      >
        <UserAvatar name={user?.name || ""} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5  z-10">
          <Link
            to="/profile"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <User size={16} className="mr-2" />
            Profile
          </Link>

          <button
            onClick={() => {
              toggleTheme();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            {theme === "dark" ? (
              <Sun size={16} className="mr-2" />
            ) : (
              <Moon size={16} className="mr-2" />
            )}
            {theme === "dark" ? "Light Mode" : "Dark Mode"}
          </button>

          <Link
            to="/contact"
            onClick={() => setIsOpen(false)}
            className="flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <Mail size={16} className="mr-2" />
            Contact
          </Link>

          <button
            onClick={() => {
              logout();
              setIsOpen(false);
            }}
            className="w-full flex items-center px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <LogOut size={16} className="mr-2" />
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
