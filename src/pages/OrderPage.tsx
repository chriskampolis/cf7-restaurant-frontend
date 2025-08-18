import { useEffect, useState } from "react";
import api from "../services/api";
import type { MenuItem, Order, OrderItem } from "../types";
import MenuOrderCard from "../components/MenuOrderCard";

function OrderPage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);
  const [quantities, setQuantities] = useState<Record<number, number>>({});
  const [table, setTable] = useState<number>(1);
  const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

  // load menu
  useEffect(() => {
    api.get("/api/menu-items/").then((res) => setMenu(res.data));
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
    } catch (err: any) {
      console.error("Submit failed:", err);
      alert("Error submitting order. Please try again.");
    }
  };

  const handleComplete = async () => {
    if (!currentOrder) return;

    try {
      await api.patch(`/api/orders/${currentOrder.id}/complete/`);
      setCurrentOrder({ ...currentOrder, status: "completed" });
      alert(`Order ${currentOrder.id} marked as completed.`);
    } catch (err) {
      console.error("Failed to complete order:", err);
      alert("Could not complete order.");
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Order for Table {table}</h1>
      
      {/* Table selection */}
      <select
        value={table}
        onChange={(e) => setTable(Number(e.target.value))}
        className="border p-2 mb-4"
      >
        {[...Array(10)].map((_, i) => (
          <option key={i + 1} value={i + 1}>
            Table {i + 1}
          </option>
        ))}
      </select>

      {/* Menu items */}
      <div className="grid gap-4">
        {menu.map((item) => (
          <MenuOrderCard
            key={item.id}
            item={item}
            quantity={quantities[item.id] || 0}
            onQuantityChange={handleQuantityChange}
          />
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 bg-green-700 text-white p-2 rounded hover:bg-green-600 transition"
      >
        Submit Order
      </button>

      {/* Complete order button */}
      {currentOrder && currentOrder.status === "in_progress" && (
        <button
          onClick={handleComplete}
          className="ml-4 mt-4 bg-blue-700 text-white p-2 rounded hover:bg-blue-600 transition"
        >
          Complete Order
        </button>
      )}
    </div>
  );
}

export default OrderPage;

// import { useEffect, useState } from "react";
// import api from "../services/api";
// import type { MenuItem, Order, OrderItem } from "../types";
// import MenuOrderCard from "../components/MenuOrderCard";

// function OrderPage() {
//   const [menu, setMenu] = useState<MenuItem[]>([]);
//   const [quantities, setQuantities] = useState<Record<number, number>>({});
//   const [table, setTable] = useState<number>(1);
//   const [currentOrder, setCurrentOrder] = useState<Order | null>(null);

//   // load menu
//   useEffect(() => {
//     api.get("/api/menu-items/").then((res) => setMenu(res.data));
//   }, []);

//   // load existing in_progress order for table
//   useEffect(() => {
//     const fetchOrder = async () => {
//       try {
//         const res = await api.get(`/api/orders/?table=${table}`);
//         const orders: Order[] = res.data;

//         // Look for in_progress order
//         const activeOrder = orders.find((o) => o.status === "in_progress");

//         if (activeOrder) {
//           setCurrentOrder(activeOrder);
//           const q: Record<number, number> = {};
//           activeOrder.items.forEach((i: OrderItem) => {
//             q[i.menu_item] = i.quantity;
//           });
//           setQuantities(q);
//         } else {
//           // No in_progress order → reset
//           setCurrentOrder(null);
//           setQuantities({});
//         }
//       } catch (err) {
//         console.error("Failed to fetch order:", err);
//         setCurrentOrder(null);
//         setQuantities({});
//       }
//     };

//     fetchOrder();
//   }, [table]);

//   const handleQuantityChange = (id: number, qty: number) => {
//     setQuantities((prev) => ({ ...prev, [id]: qty }));
//   };

//   const handleSubmit = async () => {
//     const items = Object.entries(quantities)
//       .filter(([_, q]) => q > 0)
//       .map(([id, q]) => ({
//         menu_item: Number(id),
//         quantity: q,
//       }));

//     if (items.length === 0) {
//       alert("Please select at least one item before submitting.");
//       return;
//     }

//     try {
//       const res = await api.post("/api/orders/submit/", {
//         table_number: table,
//         items,
//       });
//       setCurrentOrder(res.data);
//       alert("Order submitted!");
//     } catch (err: any) {
//       console.error("Submit failed:", err);
//       alert("Error submitting order. Please try again.");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-xl font-bold mb-4">Order for Table {table}</h1>
      
//       {/* Table selection */}
//       <select
//         value={table}
//         onChange={(e) => setTable(Number(e.target.value))}
//         className="border p-2 mb-4"
//       >
//         {[...Array(10)].map((_, i) => (
//           <option key={i + 1} value={i + 1}>
//             Table {i + 1}
//           </option>
//         ))}
//       </select>

//       {/* Menu items */}
//       <div className="grid gap-4">
//         {menu.map((item) => (
//           <MenuOrderCard
//             key={item.id}
//             item={item}
//             quantity={quantities[item.id] || 0}
//             onQuantityChange={handleQuantityChange}
//           />
//         ))}
//       </div>

//       <button
//         onClick={handleSubmit}
//         className="mt-4 bg-green-700 text-white p-2 rounded hover:bg-green-600 transition"
//       >
//         Submit Order
//       </button>
//     </div>
//   );
// }

// export default OrderPage;