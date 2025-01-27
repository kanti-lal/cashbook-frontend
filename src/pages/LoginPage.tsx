import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  AlertCircle,
  LogIn,
  Trash2,
  Eye,
  EyeOff,
  LoaderCircle,
} from "lucide-react";
import { CashioLogo } from "../components/common/CashioLogo";

interface SavedAccount {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const [rememberMe, setRememberMe] = useState(false);
  const [savedAccounts, setSavedAccounts] = useState<SavedAccount[]>([]);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Load saved accounts on component mount
  useEffect(() => {
    const rememberedAccounts = localStorage.getItem("rememberedAccounts");
    if (rememberedAccounts) {
      try {
        const accounts = JSON.parse(rememberedAccounts);
        setSavedAccounts(accounts);
        setShowLoginForm(accounts.length === 0);
      } catch (error) {
        console.error("Error parsing remembered accounts:", error);
        localStorage.removeItem("rememberedAccounts");
      }
    } else {
      setShowLoginForm(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    try {
      await login(email, password);
      if (rememberMe) {
        const accounts = [...savedAccounts];
        // Update password if email exists, otherwise add new account
        const existingIndex = accounts.findIndex((acc) => acc.email === email);
        if (existingIndex >= 0) {
          accounts[existingIndex].password = password;
        } else {
          accounts.push({ email, password });
        }
        localStorage.setItem("rememberedAccounts", JSON.stringify(accounts));
      }
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  const handleSavedAccountClick = async (account: SavedAccount) => {
    try {
      await login(account.email, account.password);
      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
      // Remove invalid saved account
      const updatedAccounts = savedAccounts.filter(
        (acc) => acc.email !== account.email
      );
      setSavedAccounts(updatedAccounts);
      localStorage.setItem(
        "rememberedAccounts",
        JSON.stringify(updatedAccounts)
      );
      setShowLoginForm(true);
    }
  };

  const handleUseAnotherAccount = () => {
    setShowLoginForm(true);
    setEmail("");
    setPassword("");
    setError("");
  };

  const handleRemoveAccount = (
    accountToRemove: SavedAccount,
    e: React.MouseEvent
  ) => {
    e.stopPropagation();
    const updatedAccounts = savedAccounts.filter(
      (account) => account.email !== accountToRemove.email
    );
    setSavedAccounts(updatedAccounts);
    localStorage.setItem("rememberedAccounts", JSON.stringify(updatedAccounts));
    if (updatedAccounts.length === 0) {
      setShowLoginForm(true);
    }
  };

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 px-2 sm:px-4 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 md:p-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <CashioLogo size="lg" className="w-auto mx-auto mb-1 md:mb-4" />
          </div>
          <h2 className="text-lg md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">
            {showLoginForm ? "Welcome Back" : "Pick an account"}
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-2 md:mb-6">
            {showLoginForm
              ? "Sign in to continue to your account"
              : "Choose a saved account or use another"}
          </p>
        </div>

        {!showLoginForm && savedAccounts.length > 0 ? (
          <div className="space-y-4">
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            {savedAccounts.map((account, index) => (
              <div
                key={index}
                onClick={() => handleSavedAccountClick(account)}
                className="flex items-center justify-between p-4 border dark:border-gray-700 rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 dark:text-purple-300 text-lg">
                      {account.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-4 dark:text-gray-300">
                    {account.email}
                  </span>
                </div>
                <button
                  onClick={(e) => handleRemoveAccount(account, e)}
                  className="text-gray-400 hover:text-red-500 dark:text-gray-500 dark:hover:text-red-400 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={handleUseAnotherAccount}
              className="w-full mt-4 flex items-center justify-center p-4 border dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 dark:text-gray-300"
            >
              Use Another Account
            </button>
          </div>
        ) : (
          <form className="space-y-6" onSubmit={handleSubmit}>
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg flex items-center gap-3">
                <AlertCircle className="text-red-500" size={20} />
                <span className="text-sm">{error}</span>
              </div>
            )}

            <div className="space-y-4 md:space-y-6">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 dark:border-gray-600 rounded dark:bg-gray-700"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900 dark:text-gray-300"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-101 active:scale-99  items-center gap-2"
              >
                {" "}
                {isLoading ? (
                  <LoaderCircle className="animate-spin" size={20} />
                ) : (
                  <LogIn size={20} />
                )}
                {isLoading ? "Signing In..." : "Sign In"}
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-500 dark:text-purple-400 dark:hover:text-purple-300"
                >
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
