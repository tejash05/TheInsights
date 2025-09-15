"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, Store, KeyRound } from "lucide-react";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const [tenantId, setTenantId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const form = e.currentTarget;
    const email = (form.elements.namedItem("email") as HTMLInputElement).value;
    const password = (form.elements.namedItem("password") as HTMLInputElement).value;
    const shopifyShop = (form.elements.namedItem("shopifyShop") as HTMLInputElement).value;
    const accessToken = (form.elements.namedItem("accessToken") as HTMLInputElement).value;

    try {
      const res = await fetch("https://theinsights-e7a0.onrender.com/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, shopifyShop, accessToken }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to register");

      setTenantId(data.tenantId);
    } catch (err: any) {
      console.error("Registration failed:", err);
      setError(err.message || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 dark:from-gray-900 dark:via-gray-800 dark:to-black">
      {/* Left side: branding */}
      <div className="hidden lg:flex w-1/2 items-center justify-center p-12">
        <motion.div
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center"
        >
          <h1 className="text-6xl font-extrabold text-white drop-shadow-lg">
            Shopify Insights
          </h1>
          <p className="mt-4 text-xl text-white/80 max-w-md mx-auto">
            Get started by creating your account and connecting your Shopify store.
          </p>
        </motion.div>
      </div>

      {/* Right side: register form */}
      <div className="flex w-full lg:w-1/2 items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md"
        >
          <div className="backdrop-blur-lg bg-white/80 dark:bg-gray-900/80 shadow-2xl rounded-2xl p-8">
            <h2 className="text-3xl font-bold text-center text-gray-900 dark:text-white">
              Create an Account
            </h2>
            <p className="mt-2 text-center text-gray-600 dark:text-gray-400">
              Register to access your personalized dashboard
            </p>

            <form onSubmit={handleSubmit} className="mt-6 space-y-5">
              {/* Email */}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Email
                </label>
                <div className="mt-1 relative">
                  <Mail
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="email"
                    name="email"
                    type="email"
                    required
                    placeholder="you@example.com"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Password */}
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Password
                </label>
                <div className="mt-1 relative">
                  <Lock
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="password"
                    name="password"
                    type="password"
                    required
                    placeholder="••••••••"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Shopify Shop */}
              <div>
                <label
                  htmlFor="shopifyShop"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Shopify Store Domain
                </label>
                <div className="mt-1 relative">
                  <Store
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="shopifyShop"
                    name="shopifyShop"
                    type="text"
                    required
                    placeholder="mystore.myshopify.com"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Access Token */}
              <div>
                <label
                  htmlFor="accessToken"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                >
                  Admin Access Token
                </label>
                <div className="mt-1 relative">
                  <KeyRound
                    className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                    size={18}
                  />
                  <input
                    id="accessToken"
                    name="accessToken"
                    type="text"
                    required
                    placeholder="shpat_xxxxxxx"
                    className="w-full rounded-xl border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 pl-10 pr-3 py-2 text-sm text-gray-900 dark:text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>

              {/* Error */}
              {error && <p className="text-sm text-red-600">{error}</p>}

              {/* Success */}
              {tenantId && (
                <p className="text-sm text-green-600">
                  ✅ Tenant created! Use this tenant ID: <strong>{tenantId}</strong>
                </p>
              )}

              {/* Submit */}
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full flex justify-center items-center gap-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white py-3 font-semibold shadow-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-70"
              >
                {loading ? "Registering..." : "Register"}
              </motion.button>
            </form>

            {/* Link to login */}
            <p className="mt-6 text-center text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <a
                href="/auth/login"
                className="text-indigo-600 hover:underline dark:text-indigo-400 font-medium"
              >
                Sign in
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
