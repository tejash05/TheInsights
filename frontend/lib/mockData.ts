// lib/mockData.ts

export const mockOverview = {
  totalCustomers: 1280,
  totalOrders: 563,
  totalRevenue: 74500,
};

export const mockOrders = [
  { date: "2025-01-01", orders: 25 },
  { date: "2025-01-02", orders: 32 },
  { date: "2025-01-03", orders: 18 },
  { date: "2025-01-04", orders: 40 },
  { date: "2025-01-05", orders: 30 },
];

export const mockRecentOrders = [
  { id: "1001", customer: "Alice Johnson", amount: "$250", date: "2025-01-01" },
  { id: "1002", customer: "Bob Smith", amount: "$320", date: "2025-01-02" },
  { id: "1003", customer: "Cathy Brown", amount: "$180", date: "2025-01-03" },
  { id: "1004", customer: "David Lee", amount: "$400", date: "2025-01-04" },
  { id: "1005", customer: "Ella Davis", amount: "$275", date: "2025-01-05" },
];



export const mockTopCustomers = [
  { name: "Alice Johnson", orders: 12, value: 3200 },
  { name: "Bob Smith", orders: 10, value: 2800 },
  { name: "Cathy Brown", orders: 8, value: 2100 },
  { name: "David Lee", orders: 6, value: 1700 },
  { name: "Ella Davis", orders: 5, value: 1500 },
];

// lib/mockData.ts (add this below existing exports)

export const mockTopProducts = [
  { name: "T-Shirt", units: 150, revenue: 4500 },
  { name: "Sneakers", units: 120, revenue: 7200 },
  { name: "Backpack", units: 90, revenue: 3600 },
  { name: "Wristwatch", units: 60, revenue: 5400 },
  { name: "Sunglasses", units: 45, revenue: 2250 },
];
