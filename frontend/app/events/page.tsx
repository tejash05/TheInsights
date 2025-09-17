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

        // Cleanly format for the table
        const formatted = data.map((e: any) => {
          return {
            type: e.type.replace(/_/g, " "), // prettier labels
            createdAt: new Date(e.createdAt).toLocaleString(),
            customer: e.customerId ? `•••${String(e.customerId).slice(-4)}` : "-",
            draftId: e.payload?.draftId || "-",
            total: e.payload?.total ? `₹${parseFloat(e.payload.total).toFixed(2)}` : "-",
            status: e.payload?.status || "-",
          };
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
      <main className="flex-1 bg-gray-50 min-h-screen flex flex-col">
        <Header title="Events" />

        <div className="p-6 flex-1 flex flex-col">
          {loading ? (
            <p className="text-gray-400">Loading...</p>
          ) : events.length === 0 ? (
            <p className="text-gray-400">No events yet</p>
          ) : (
            <div className="bg-white shadow-md rounded-xl border border-gray-200 overflow-hidden flex flex-col">
              {/* Scrollable Table */}
              <div className="overflow-y-auto max-h-[70vh]">
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
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
