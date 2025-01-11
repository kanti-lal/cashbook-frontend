import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { AlertCircle, LogIn, Trash2, Eye, EyeOff } from "lucide-react";

interface SavedAccount {
  email: string;
  password: string;
}

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { login } = useAuth();
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
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white shadow-2xl rounded-xl p-10 border border-gray-100">
        <div className="text-center">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            {showLoginForm ? "Welcome Back" : "Pick an account"}
          </h2>
          <p className="text-gray-500 mb-6">
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
                className="flex items-center justify-between p-4 border rounded-lg cursor-pointer hover:bg-gray-50"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                    <span className="text-purple-600 text-lg">
                      {account.email[0].toUpperCase()}
                    </span>
                  </div>
                  <span className="ml-4">{account.email}</span>
                </div>
                <button
                  onClick={(e) => handleRemoveAccount(account, e)}
                  className="text-gray-400 hover:text-red-500 p-2"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <button
              onClick={handleUseAnotherAccount}
              className="w-full mt-4 flex items-center justify-center p-4 border rounded-lg hover:bg-gray-50"
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

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 mb-2"
                >
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                  placeholder="Enter your email"
                />
              </div>

              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 mb-2"
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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
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
                  className="h-4 w-4 text-purple-600 focus:ring-purple-500 border-gray-300 rounded"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <Link
                  to="/forgot-password"
                  className="font-medium text-purple-600 hover:text-purple-500"
                >
                  Forgot password?
                </Link>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out transform hover:scale-101 active:scale-99  items-center gap-2"
              >
                <LogIn size={20} />
                Sign In
              </button>
            </div>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Don't have an account?{" "}
                <Link
                  to="/register"
                  className="font-medium text-purple-600 hover:text-purple-500"
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
