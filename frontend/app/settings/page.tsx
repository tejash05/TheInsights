"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { apiFetch } from "@/lib/apiClient"; // backend fetch wrapper

export default function SettingsPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const handleResync = async () => {
    if (!session?.user?.tenantId) {
      alert("No tenant ID found in session");
      return;
    }

    try {
      setLoading(true);
      // 👇 Hit /resync/:tenantId
      const data = await apiFetch(`/resync/${session.user.tenantId}`, {
        method: "POST",
      });

      setResult(data.counts); // backend returns counts {customers, products, orders}
    } catch (err) {
      console.error(" Resync failed:", err);
      alert("Re-sync failed. Check console for details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main content */}
      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Header title="Settings" />

        <div className="p-6 space-y-6">
          {/* Tenant Info */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Tenant Information
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Your account and tenant details are shown below
            </p>
            <div className="space-y-2 text-gray-700 text-sm">
              <p>
                <strong>Email:</strong>{" "}
                {session?.user?.email ?? "demo@tenant.com"}
              </p>
              <p>
                <strong>Tenant ID:</strong>{" "}
                {session?.user?.tenantId ?? "tenant_123"}
              </p>
            </div>
          </div>

          {/* Re-sync Button */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Data Management
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Trigger a manual re-sync of your Shopify data with our system
            </p>
            <button
              onClick={handleResync}
              disabled={loading}
              className={`px-4 py-2 rounded text-white transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {loading ? "Re-syncing..." : "Re-sync Shopify Data"}
            </button>

            {result && (
              <div className="mt-4 text-sm text-gray-700">
                <p>
                   Re-sync complete: {result.customers} customers,{" "}
                  {result.products} products, {result.orders} orders synced.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
