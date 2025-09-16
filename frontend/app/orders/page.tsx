"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Table } from "@/components/ui/Table";
import { apiFetch } from "@/lib/apiClient";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      if (!session?.user?.tenantId) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/orders?tenantId=${session.user.tenantId}`);

        // ✅ Use customerId directly from backend response
        const formatted = data.map((o: any) => ({
          id: o.id || o.shopifyId,
          customerId: o.customerId || "Unknown",
          amount: o.total || 0,
          date: new Date(o.createdAt).toLocaleDateString(),
        }));

        setOrders(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch orders:", err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, [session]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Header title="Orders" />
        <div className="p-6 space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-gray-800">
              Recent Orders
            </h2>
            <p className="text-sm text-gray-500">
              Track customer purchases and revenue trends.
            </p>
          </div>

          <div className="bg-white shadow rounded-lg p-4">
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : orders.length > 0 ? (
              <Table
                columns={[
                  { header: "Order ID", accessor: "id" },
                  { header: "Customer ID", accessor: "customerId" }, // ✅ fixed
                  { header: "Amount", accessor: "amount" },
                  { header: "Date", accessor: "date" },
                ]}
                data={orders}
              />
            ) : (
              <p className="text-gray-400">No orders yet</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
