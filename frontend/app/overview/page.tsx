"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Card } from "@/components/ui/Card";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";

export default function OverviewPage() {
  const { data: session } = useSession();
  const [overview, setOverview] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOverview() {
      if (!session?.user?.tenantId) return;
      try {
        setLoading(true);

        // ✅ TenantId auto-injected via apiFetch
        const overviewData = await apiFetch("/overview", {}, session.user.tenantId);
        setOverview(overviewData);

        const orderStats = await apiFetch("/orders/stats", {}, session.user.tenantId);
        const formatted = orderStats.map((o: any) => ({
          date: new Date(o.date).toLocaleDateString(),
          orders: o.orders,
        }));
        setOrders(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch overview:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOverview();
  }, [session]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Header title="Overview" />

        {/* Stats */}
        <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card
            title="Total Customers"
            value={
              loading ? (
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                overview?.totalCustomers ?? 0
              )
            }
            subtext="Across all time"
          />
          <Card
            title="Total Orders"
            value={
              loading ? (
                <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
              ) : (
                overview?.totalOrders ?? 0
              )
            }
            subtext="Across all time"
          />
          <Card
            title="Total Revenue"
            value={
              loading ? (
                <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
              ) : (
                `$${overview?.totalRevenue?.toFixed?.(2) ?? 0}`
              )
            }
            subtext="Across all time"
          />
        </div>

        {/* Orders Over Time */}
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Orders Over Time</h2>
          <div className="bg-white shadow-md rounded-xl p-4 h-80">
            {loading ? (
              <p className="text-gray-400">Loading chart…</p>
            ) : orders.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={orders}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                  <XAxis dataKey="date" tick={{ fill: "#374151", fontSize: 12 }} axisLine={{ stroke: "#d1d5db" }} />
                  <YAxis tick={{ fill: "#374151", fontSize: 12 }} axisLine={{ stroke: "#d1d5db" }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "white",
                      borderRadius: "0.5rem",
                      border: "1px solid #e5e7eb",
                      fontSize: "0.875rem",
                      color: "#111827",
                    }}
                  />
                  <Line
                    type="monotone"
                    dataKey="orders"
                    stroke="#6366f1"
                    strokeWidth={2}
                    dot={{ r: 4, fill: "#6366f1" }}
                    activeDot={{ r: 6, stroke: "#4f46e5", strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No orders data yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
