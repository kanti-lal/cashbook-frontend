import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { AlertCircle, Key, Eye, EyeOff } from "lucide-react";
import { authApi } from "../api/auth";
import { CashioLogo } from "../components/common/CashioLogo";

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (!token) {
        throw new Error("Reset token is missing");
      }
      await authApi.resetPassword(token, password);
      navigate("/login", {
        state: { message: "Password reset successful. Please login." },
      });
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to reset password");
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="h-[100dvh] flex items-center justify-center">
        <div className="text-red-600">Invalid reset token</div>
      </div>
    );
  }

  return (
    <div className="h-[100dvh] flex items-center justify-center bg-gradient-to-br from-purple-50 to-white dark:from-gray-900 dark:to-gray-800 px-2 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white dark:bg-gray-800 shadow-2xl rounded-xl p-3 md:p-6 border border-gray-100 dark:border-gray-700">
        <div className="text-center">
          <div className="flex items-center justify-center">
            <CashioLogo size="lg" className="w-auto mx-auto mb-1 md:mb-4" />
          </div>
          <h2 className="text-lg md:text-3xl font-bold text-gray-800 dark:text-white mb-1 md:mb-2">
            Reset Password
          </h2>
          <p className="text-xs md:text-sm text-gray-500 dark:text-gray-400 mb-3 md:mb-6">
            Enter your new password
          </p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {error && (
            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-300 px-4 py-3 rounded-lg flex items-center gap-3">
              <AlertCircle
                className="text-red-500 dark:text-red-400"
                size={20}
              />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
            >
              New Password
            </label>
            <div className="relative">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition duration-300 ease-in-out dark:bg-gray-700 dark:text-white"
                placeholder="Enter new password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg text-sm font-semibold text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-300 ease-in-out items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Key size={20} />
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
