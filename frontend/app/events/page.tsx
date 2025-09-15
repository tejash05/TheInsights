"use client";

import Sidebar from "@/components/layout/Sidebar";
import Header from "@/components/layout/Header";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { apiFetch } from "@/lib/apiClient";
import { Table } from "@/components/ui/Table";

export default function EventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadEvents() {
      if (!session?.user?.tenantId) return;
      try {
        setLoading(true);

        const data = await apiFetch(`/events?tenantId=${session.user.tenantId}`);

        // ✅ Format events for table
        const formatted = data.map((e: any) => {
          if (e.type === "DRAFT_ORDER") {
            return {
              type: "Draft Order",
              createdAt: new Date(e.createdAt).toLocaleString(),
              customer: e.customerId || "Unknown",
              draftId: e.payload?.draftId || "-",
              total: `₹${parseFloat(e.payload?.total || 0).toFixed(2)}`,
              status: e.payload?.status || "-",
            };
          } else {
            // Fallback for other event types
            return {
              type: e.type,
              createdAt: new Date(e.createdAt).toLocaleString(),
              customer: "-",
              draftId: "-",
              total: "-",
              status: Object.entries(e.payload || {})
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ") || "-",
            };
          }
        });

        setEvents(formatted);
      } catch (err) {
        console.error("❌ Failed to fetch events:", err);
      } finally {
        setLoading(false);
      }
    }
    loadEvents();
  }, [session]);

  return (
    <div className="flex">
      <Sidebar />
      <main className="flex-1 bg-gray-50 min-h-screen">
        <Header title="Events" />

        <div className="p-6">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-400">No events yet</p>
          ) : (
            <Table
              columns={[
                { header: "Type", accessor: "type" },
                { header: "Created At", accessor: "createdAt" },
                { header: "Customer", accessor: "customer" },
                { header: "Draft ID", accessor: "draftId" },
                { header: "Total", accessor: "total" },
                { header: "Status", accessor: "status" },
              ]}
              data={events}
            />
          )}
        </div>
      </main>
    </div>
  );
}
