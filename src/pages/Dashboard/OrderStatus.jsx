import React from "react";
export default function OrderStatus({ dashboard }) {
  const orders = dashboard?.orders || {};
  const statusCards = [
    {
      title: "Pending",
      value: orders.pending || 0,
      color: "text-orange-500 dark:text-orange-400",
      bg: "bg-orange-50 dark:bg-orange-500/10",
    },
    {
      title: "Processing",
      value: orders.processing || 0,
      color: "text-blue-500 dark:text-blue-400",
      bg: "bg-blue-50 dark:bg-blue-500/10",
    },
    {
      title: "Confirmed",
      value: orders.confirmed || 0,
      color: "text-cyan-500 dark:text-cyan-400",
      bg: "bg-cyan-50 dark:bg-cyan-500/10",
    },
    {
      title: "Shipped",
      value: orders.shipped || 0,
      color: "text-indigo-500 dark:text-indigo-400",
      bg: "bg-indigo-50 dark:bg-indigo-500/10",
    },
    {
      title: "Delivered",
      value: orders.delivered || 0,
      color: "text-green-500 dark:text-green-400",
      bg: "bg-green-50 dark:bg-green-500/10",
    },
    {
      title: "Cancelled",
      value: orders.cancelled || 0,
      color: "text-red-500 dark:text-red-400",
      bg: "bg-red-50 dark:bg-red-500/10",
    },
  ];
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-cyan-400 dark:text-cyan-300 text-sm tracking-[5px] uppercase">
            Order Status
          </h2>
          <h1 className="text-2xl font-semibold text-gray-800 dark:text-white mt-2">
            Live Fulfillment Breakdown
          </h1>
          <p className="text-gray-500 dark:text-gray-400 mt-2 mb-6">
            Current status of all customer orders.
          </p>
        </div>
        <span className="bg-cyan-100 dark:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 text-xs font-semibold px-4 py-2 rounded-full">
          Updated from API
        </span>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {statusCards.map((item) => (
          <div
            key={item.title}
            className={`${item.bg} rounded-xl p-5 transition-all duration-300 hover:shadow-lg hover:-translate-y-1`}
          >
            <h3 className={`text-sm font-semibold uppercase ${item.color}`}>
              {item.title}
            </h3>
            <p className={`text-4xl font-bold mt-3 ${item.color}`}>
              {item.value}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}