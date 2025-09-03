import { useEffect, useState } from "react";
import api from "../services/api";
import type { Order } from "../types";


function CompletedOrdersPage () {
	const [orders, setOrders] = useState<Order[]>([]);
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    const fetchCompleted = async () => {
      try {
        const res = await api.get("/api/completed-orders/");
        setOrders(res.data);
      } catch (err) {
        console.error("Failed to fetch completed orders:", err);
      }
    };
    fetchCompleted();
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Completed Orders</h1>
      {orders.length === 0 && <p>No completed orders found.</p>}

      {orders.map((order) => (
        <div
          key={order.id}
          className="border rounded p-4 mb-4 shadow cursor-pointer"
        >
          <div
            className="flex justify-between"
            onClick={() =>
              setExpandedId(expandedId === order.id ? null : order.id)
            }
          >
            <span>
              Table {order.table_number} — {order.created_at}
            </span>
            <span className="font-bold">Total sum: {order.total_price}€</span>
          </div>

          {expandedId === order.id && (
            <div className="mt-4">
              <table className="w-full border">
                <thead>
                  <tr className="bg-gray-200 text-left">
                    <th className="px-2 py-1">Item</th>
                    <th className="px-2 py-1">Price</th>
                    <th className="px-2 py-1">Quantity</th>
                    <th className="px-2 py-1">Subtotal</th>
                  </tr>
                </thead>
                <tbody>
                  {order.items
                    .filter((it) => it.quantity > 0) // hide zero-quantity items
                    .map((it) => (
                      <tr key={it.id} className="border-t">
                        <td className="px-2 py-1">{it.menu_item_name}</td>
                        <td className="px-2 py-1">{it.price}€</td>
                        <td className="px-2 py-1">{it.quantity}</td>
                        <td className="px-2 py-1">                        
                          {(
                            Number(it.price) * it.quantity
                          ).toFixed(2)}
                          €
                        </td>
                      </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}

export default CompletedOrdersPage;
