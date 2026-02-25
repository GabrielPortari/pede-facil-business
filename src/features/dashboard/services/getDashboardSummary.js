export async function getDashboardSummary() {
  await new Promise((resolve) => setTimeout(resolve, 250));

  return {
    openOrders: 8,
    totalCustomers: 124,
    revenueToday: "R$ 1.980,40",
  };
}
