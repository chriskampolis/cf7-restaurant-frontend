import { useEffect, useState } from "react";
import api from "../services/api";
import type { MenuItem }  from "../types";

export default function MenuItemsPage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [newItem, setNewItem] = useState({
    name: "",
    price: "",
    availability: 0,
  });

  // Track which item is being edited
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<MenuItem>>({});


  // Fetch menu items
  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await api.get("/api/menu-items/");
        setMenuItems(res.data);
      } catch (err) {
        console.error("Failed to fetch menu items:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, []);

  // Create new item
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/menu-items/", {
        name: newItem.name,
        price: newItem.price,
        availability: newItem.availability,
      });
      setMenuItems((prev) => [...prev, res.data]);
      setNewItem({ name: "", price: "", availability: 0 });
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create menu item.");
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this item?")) return;
    try {
      await api.delete(`/api/menu-items/${id}/`);
      setMenuItems((prev) => prev.filter((item) => item.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete menu item.");
    }
  };

  // Start editing
  const handleEdit = (item: MenuItem) => {
    setEditingId(item.id);
    setEditValues({ ...item });
  };

  // Save edited item
  const handleSave = async (id: number) => {
    try {
      const res = await api.put(`/api/menu-items/${id}/`, editValues);
      setMenuItems((prev) =>
        prev.map((item) => (item.id === id ? res.data : item))
      );
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update menu item.");
    }
  };

  if (loading) return <div>Loading menu items...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Menu Items (Manager CRUD)</h1>

      {/* Create form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-4">
        <input
          type="text"
          placeholder="Name"
          value={newItem.name}
          onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={newItem.price}
          onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          min="0"
          placeholder="Availability"
          value={newItem.availability}
          onChange={(e) =>
            setNewItem({ ...newItem, availability: Number(e.target.value) })
          }
          className="border p-2 rounded"
          required
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-200">
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Price</th>
            <th className="px-4 py-2">Availability</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {menuItems.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="text"
                    value={editValues.name || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  item.name
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="number"
                    step="0.01"
                    value={editValues.price || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, price: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  `€${item.price}`
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === item.id ? (
                  <input
                    type="number"
                    min="0"
                    value={editValues.availability || 0}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        availability: Number(e.target.value),
                      })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  item.availability
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                {editingId === item.id ? (
                  <button
                    onClick={() => handleSave(item.id)}
                    className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500"
                  >
                    Save
                  </button>
                ) : (
                  <button
                    onClick={() => handleEdit(item)}
                    className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500"
                  >
                    Edit
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}