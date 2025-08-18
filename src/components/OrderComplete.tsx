import type { Order } from "../types";
import api from "../services/api";

interface Props {
  order: Order;
  onComplete: (id: number) => void;
}

function OrderComplete({ order, onComplete }: Props) {
  const handleComplete = async () => {
    try {
      await api.patch(`/api/orders/${order.id}/complete/`);
      onComplete(order.id);
    } catch (err) {
      console.error("Failed to complete order:", err);
      alert("Could not complete order.");
    }
  };

  return (
    <div className="border rounded p-4 shadow mb-4">
      <h2 className="font-bold text-lg mb-2">
        Table {order.table_number} — {order.status.toUpperCase()}
      </h2>
      <p className="text-sm text-gray-600">
        Placed by: {order.placed_by} •{" "}
        {new Date(order.created_at).toLocaleString()}
      </p>

      <ul className="mt-3 space-y-1">
        {order.items.map((item) => (
          <li key={item.id} className="flex justify-between">
            <span>
              {item.menu_item_name} × {item.quantity}
            </span>
            <span>€{Number(item.price).toFixed(2)}</span>
          </li>
        ))}
      </ul>

      <p className="font-semibold mt-3">
        Total: €{order.total_price.toFixed(2)}
      </p>

      {order.status === "in_progress" && (
        <button
          onClick={handleComplete}
          className="mt-4 bg-green-600 text-white px-3 py-1 rounded hover:bg-green-500"
        >
          Complete Order
        </button>
      )}
    </div>
  );
}

export default OrderComplete;