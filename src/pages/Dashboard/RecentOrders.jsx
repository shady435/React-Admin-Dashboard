import React from 'react';
function RecentOrders({ stats }) {
  const orders = stats?.dashboard?.recentOrders || [];
  const getStatusColor = (status) => {
    switch(status?.toLowerCase()){
      case 'delivered':
        return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
      case 'shipped':
        return 'bg-blue-100 dark:bg-blue-500/20 text-blue-800 dark:text-blue-300';
      case 'returned':
        return 'bg-gray-100 dark:bg-gray-500/20 text-gray-800 dark:text-gray-300';
      case 'cancelled': 
        return 'bg-red-100 dark:bg-red-500/20 text-red-800 dark:text-red-300';
      default:
        return 'bg-green-100 dark:bg-green-500/20 text-green-800 dark:text-green-300';
    }
  };
  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-soft mt-8 max-w-[1400px]">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h3 className="text-[#38bdf8] dark:text-[#7dd3fc] text-xs font-bold tracking-widest uppercase mb-1">Recent Orders</h3>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white">Latest customer activity</h2>
        </div>
        <span className="bg-[#e0f2fe] dark:bg-[#0284c7]/20 text-[#38bdf8] dark:text-[#7dd3fc] text-xs font-semibold px-4 py-1.5 rounded-full">
          {orders.length} orders
        </span>
      </div>
      <div className="flex flex-col gap-3">
        {orders.map((order, index) => (
          <div 
            key={index} 
            className="flex flex-col sm:flex-row justify-between sm:items-center p-4 rounded-2xl border border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 gap-4 sm:gap-0 bg-slate-50 dark:bg-gray-700/50"
          >
            <div>
              <h4 className="font-bold text-gray-800 dark:text-white text-sm mb-1">
                {order?.customerName || order?.user?.username || "Customer"}
              </h4>
              <p className="text-gray-500 dark:text-gray-400 text-xs">
                {order?.product || order?.items?.[0]?.name || "Product"} • {order?.date || new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center gap-6 justify-between sm:justify-end">
              <span className={`px-3 py-1 rounded-full text-xs font-semibold capitalize ${getStatusColor(order?.status)}`}>
                {order?.status || "delivered"}
              </span>
              <span className="font-semibold text-gray-600 dark:text-gray-300 text-sm min-w-[80px] text-right">
                ${(order?.price || order?.totalPrice || 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
export default RecentOrders;