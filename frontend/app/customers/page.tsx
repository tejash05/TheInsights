"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { PieChartComponent } from "@/components/ui/Chart";
import { Table } from "@/components/ui/Table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/apiClient"; // backend fetch wrapper

export default function CustomersPage() {
  const { data: session } = useSession();
  const [customers, setCustomers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadCustomers() {
      if (!session?.user?.tenantId) return;
      try {
        setLoading(true);
        const data = await apiFetch(`/customers/stats?tenantId=${session.user.tenantId}`);

        // Use backend-provided IDs directly
        const formatted = data.map((c: any) => ({
          id: c.last4Id, // short safe display ID
          fullId: c.customerId, // full Shopify ID (hidden)
          orders: c.ordersCount || 0,
          value: c.totalSpent || 0,
        }));

        setCustomers(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch customers:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCustomers();
  }, [session]);

  return (
    <div className="flex">
      <Sidebar />

      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Header title="Customers" />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Top 5 Customers Pie Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Top 5 Customers
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              By total revenue contribution
            </p>
            <div className="h-[300px] flex items-center justify-center">
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : customers.length > 0 ? (
                <PieChartComponent
                  data={customers.map((c) => ({
                    name: c.id, //  shows last4Id (…1234)
                    value: c.value,
                  }))}
                />
              ) : (
                <p className="text-gray-400">No customers yet</p>
              )}
            </div>
          </div>

          {/* Customers Table */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Customer Details
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Breakdown of top-performing customers
            </p>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <Table
                columns={[
                  { header: "Customer ID", accessor: "id" }, // short ID
                  { header: "Orders", accessor: "orders" },
                  { header: "Revenue", accessor: "value" },
                ]}
                data={customers}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
