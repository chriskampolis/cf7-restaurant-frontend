import { useEffect, useState } from "react";
import api from "../services/api";
import type { MenuItem, Order, OrderItem } from "../types";
import MenuOrderCard from "../components/MenuOrderCard";

function OrderPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [table, setTable] = useState<number>(1);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  const fetchMenu = async () => {
    try {
      const res = await api.get("/api/menu-items/");
      setMenu(res.data);
    } catch (err) {
      console.error("Failed to fetch menu items", err);
    }
  };

  // load menu
  useEffect(() => {
    fetchMenu();
  }, []);

  // load existing in_progress order for table
  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/api/orders/?table=${table}`);
        const orders: Order[] = res.data;

        const activeOrder = orders.find((o) => o.status === "in_progress");

        if (activeOrder) {
          setCurrentOrder(activeOrder);
          const q: Record<number, number> = {};
          activeOrder.items.forEach((i: OrderItem) => {
            q[i.menu_item] = i.quantity;
          });
          setQuantities(q);
        } else {
          setCurrentOrder(null);
          setQuantities({});
        }
      } catch (err) {
        console.error("Failed to fetch order:", err);
        setCurrentOrder(null);
        setQuantities({});
      }
    };

    fetchOrder();
  }, [table]);

  const handleQuantityChange = (id: number, qty: number) => {
    setQuantities((prev) => ({ ...prev, [id]: qty }));
  };

  const handleSubmit = async () => {
    const items = Object.entries(quantities)
      .filter(([_, q]) => q > 0)
      .map(([id, q]) => ({
        menu_item: Number(id),
        quantity: q,
      }));

    if (items.length === 0) {
      alert("Please select at least one item before submitting.");
      return;
    }

    try {
      const res = await api.post("/api/orders/submit/", {
        table_number: table,
        items,
      });
      setCurrentOrder(res.data);
      alert("Order submitted!");

       // refresh menu to update availability dynamically
      await fetchMenu();

    } catch (err: any) {
      console.error("Submit failed:", err);
      alert("Error submitting order. Please try again.");
    }
  };

  const handleComplete = async () => {
    if (!currentOrder) return;

    const confirmComplete = window.confirm(
      "Are you sure you want to mark this order as completed?"
    );

    if (!confirmComplete) return;

    try {
      await api.patch(`/api/orders/${currentOrder.id}/complete/`);
      setCurrentOrder({ ...currentOrder, status: "completed" });
      alert(`Order ${currentOrder.id} marked as completed.`);
    } catch (err) {
      console.error("Failed to complete order:", err);
      alert("Could not complete order.");
    }
  };
  
  const total = Object.entries(quantities).reduce((sum, [id, qty]) => {
  const menuItem = menu.find((m) => m.id === Number(id));
  const price = menuItem ? Number(menuItem.price) : 0; // convert to number
  return sum + price * qty;
}, 0);

  // Sort by category without titles appearing in ui.
  const categoryOrder = ["APPETIZER", "MAIN", "DESSERT", "DRINK"];
  const sortedMenu = [...menu].sort(
  (a, b) => categoryOrder.indexOf(a.category) - categoryOrder.indexOf(b.category)
);

  return (
    <div className="p-6">
      <div className="flex items-center justify-center gap-4 mb-4">
        <h1 className="text-xl font-bold">Order for Table {table}
          {currentOrder && currentOrder.status === "in_progress" ? (
            <span className="text-yellow-600 ml-2">- In Progress -</span>
          ) : (
            <span className="text-green-600 ml-2">- New Order -</span>
          )}
        </h1>
        
        {/* Table selection */}
        <select
          value={table}
          onChange={(e) => setTable(Number(e.target.value))}
          className="border p-2 ml-2 rounded"
        >
          {[...Array(14)].map((_, i) => (
            <option key={i + 1} value={i + 1}>
              Table {i + 1}
            </option>
          ))}
        </select>
      </div>

      {/* Menu items */}
      <div className="grid gap-4">
        {sortedMenu.map((item) => (
          <MenuOrderCard
            key={item.id}
            item={item}
            quantity={quantities[item.id] || 0}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>
      
      <div className="flex justify-between items-center mt-4">
        {/* Total price */}
        <div className="text-lg font-bold text-gray-800">
          Total: {total.toFixed(2)}€
        </div>
        <div className="flex space-x-4">
          {currentOrder && currentOrder.status === "in_progress" && (
            <button
              onClick={handleComplete}
              className="ml-4 mt-4 bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition cursor-pointer"
            >
              Complete Order
            </button>
          )}
          <button
            onClick={handleSubmit}
            disabled={total === 0}
            className={`p-2 mt-4 rounded transition ${
              total === 0
                ? "bg-gray-400 text-gray-200 cursor-not-allowed"
                : "bg-green-700 text-white hover:bg-green-600 cursor-pointer"
            }`}
          >
            Submit Order
          </button>
        </div>
      </div>
    </div>
  );
}

export default OrderPage;

