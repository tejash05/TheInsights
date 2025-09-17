"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { Table } from "@/components/ui/Table";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { apiFetch } from "@/lib/apiClient";
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";

export default function ProductsPage() {
  const { data: session } = useSession();
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      if (!session?.user?.tenantId) return;
      try {
        setLoading(true);

        // Try real product stats (with revenue + units)
        let data: any[] = [];
        try {
          data = await apiFetch(
            `/products/stats?tenantId=${session.user.tenantId}`
          );
        } catch (err) {
          console.warn("⚠️ Stats fetch failed, falling back to catalog:", err);
        }

        // If stats are empty → fallback to catalog products
        if (!data || data.length === 0) {
          const catalog = await apiFetch(
            `/products?tenantId=${session.user.tenantId}`
          );
          data = catalog.map((p: any) => ({
            name: p.title || "Unknown",
            units: 0,
            revenue: p.price || 0,
          }));
        }

        // Normalize for frontend
        const formatted = data.map((p: any) => ({
          name: p.name || p.title || "Unknown",
          units: p.units || 0,
          revenue: p.revenue || 0,
        }));

        setProducts(formatted);
      } catch (err) {
        console.error(" Failed to fetch products:", err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [session]);

  return (
    <div className="flex">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <main className="flex-1 flex flex-col bg-gray-50 min-h-screen">
        <Header title="Products" />

        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Revenue Contribution Bar Chart */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Revenue by Top Products
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Contribution of best-selling products to total revenue
            </p>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : products.length > 0 ? (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={products}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="revenue" fill="#2563eb" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <p className="text-gray-400">No products yet</p>
            )}
          </div>

          {/* Top Products Table */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-semibold text-gray-800 mb-2">
              Top-Selling Products
            </h2>
            <p className="text-sm text-gray-500 mb-4">
              Ranked by units sold and revenue generated
            </p>
            {loading ? (
              <p className="text-gray-400">Loading...</p>
            ) : (
              <Table
                columns={[
                  { header: "Product", accessor: "name" },
                  { header: "Units Sold", accessor: "units" },
                  { header: "Revenue", accessor: "revenue" },
                ]}
                data={products}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
