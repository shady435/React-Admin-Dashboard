import React, { useState, useEffect, useMemo } from 'react';
import axios from 'axios';
import OrdersHeader from './Ordersheader';
import OrdersFilters from './OrdersFilters';
import OrdersTable from './Orderstable';
import { OrderDetailsModal } from './orderdetailsmodalrow';
import { extractList, extractTotalCount, normalizeOrder } from './utils';
function Orders() {
  const [ordersList, setOrdersList] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [paymentFilter, setPaymentFilter] = useState('all');
  const [methodFilter, setMethodFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [updatingId, setUpdatingId] = useState(null);
  const token = localStorage.getItem('token'); 
  const fetchOrders = () => {
    setLoading(true);
    setError('');
    axios.get('https://e-commerce-api-3wara.vercel.app/orders/admin', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then((response) => {
      console.log("The data received from the back-end:", response.data);
      const list = extractList(response.data).map(normalizeOrder);
      setOrdersList(list);
      setTotalCount(extractTotalCount(response.data, list.length));
    })
    .catch((error) => {
      console.error("Error fetching orders:", error);
      setError(error.response?.data?.message || error.message || 'Unable to load requests; please try again.');
    })
    .finally(() => {
      setLoading(false);
    });
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return ordersList.filter((o) => {
      const matchesSearch =
        !term ||
        o.shortId.toLowerCase().includes(term) ||
        o.id.toLowerCase().includes(term) ||
        o.customerName?.toLowerCase().includes(term) ||
        o.customerEmail?.toLowerCase().includes(term);

      const matchesStatus = statusFilter === 'all' || o.status === statusFilter;
      const matchesPayment = paymentFilter === 'all' || o.paymentStatus === paymentFilter;
      const matchesMethod = methodFilter === 'all' || o.paymentMethod === methodFilter;
      return matchesSearch && matchesStatus && matchesPayment && matchesMethod;
    });
  }, [ordersList, search, statusFilter, paymentFilter, methodFilter]);

  const updateStatus = (order, newStatus) => {
    if (newStatus === order.status) return;

    const confirmed = window.confirm(`Confirm order status change${order.shortId} to "${newStatus}"؟`);
    if (!confirmed) return;

    setUpdatingId(order.id);

    axios.patch(`https://e-commerce-api-3wara.vercel.app/orders/admin/${order.id}/status`, { status: newStatus }, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    })
    .then(() => {
      setOrdersList((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: newStatus } : o)));
    })
    .catch((error) => {
      alert(error.response?.data?.message || error.message || 'Unable to update the order status.');
    })
    .finally(() => {
      setUpdatingId(null);
    });
  };

  return (
    <div className="min-h-screen bg-[#F1F5F9] dark:bg-slate-950">
      <main className="max-w-7xl mx-auto p-6">
        <OrdersHeader totalCount={totalCount} loading={loading} onRefresh={fetchOrders} />

        <OrdersFilters
          search={search}
          onSearchChange={setSearch}
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          paymentFilter={paymentFilter}
          onPaymentChange={setPaymentFilter}
          methodFilter={methodFilter}
          onMethodChange={setMethodFilter}
        />

        <OrdersTable
          orders={filtered}
          loading={loading}
          error={error}
          updatingId={updatingId}
          onRowClick={setSelectedOrder}
          onUpdateStatus={updateStatus}
        />
      </main>

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onUpdateStatus={updateStatus}
          updating={updatingId === selectedOrder.id}
        />
      )}
    </div>
  );
}

export default Orders;