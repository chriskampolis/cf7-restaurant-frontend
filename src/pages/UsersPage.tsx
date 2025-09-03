import { useEffect, useState } from "react";
import api from "../services/api";
import type { User, UserRole }  from "../types";

export default function UsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // Create form state
  const [newUser, setNewUser] = useState({
    username: "",
    password: "",
    first_name: "",
    last_name: "",
    email: "",
    is_staff: true,
    is_active: true,
    role: "employee" as UserRole,    
  });

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

   // Create user
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/users/", newUser);
      setUsers((prev) => [...prev, res.data]);
      setNewUser({
        username: "",
        password: "",
        email: "",
        first_name: "",
        last_name: "",
        role: "employee",
        is_staff: true,
        is_active: true,        
      });
    } catch (err) {
      console.error("Create failed:", err);
      alert("Failed to create user.");
    }
  };

  // Edit state
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editValues, setEditValues] = useState<Partial<User>>({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await api.get("/api/users/");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch users:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

  // Edit user
  const handleEdit = (user: User) => {
    setEditingId(user.id);
    setEditValues({ ...user });
  };

  // Save edited user
  const handleSave = async (id: number) => {
    try {
      const res = await api.patch(`/api/users/${id}/`, editValues);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? res.data : u))
      );
      setEditingId(null);
      setEditValues({});
    } catch (err) {
      console.error("Update failed:", err);
      alert("Failed to update user.");
    }
  };

  // Cancel editing (restore original values)
  const handleCancel = (id: number) => {
    const original = users.find((user) => user.id === id);
    if (original) {
      setEditValues({ ...original });
    }
    setEditingId(null); // exit edit mode
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this user?")) return;
    try {
      await api.delete(`/api/users/${id}/`);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      console.error("Delete failed:", err);
      alert("Failed to delete user.");
    }
  };

  if (loading) return <div>Loading users...</div>;

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold mb-4">Users (Manager CRUD)</h1>
      {/* Create form */}
      <form onSubmit={handleCreate} className="mb-6 flex gap-4 flex-wrap">
        <input
          type="text"
          placeholder="Username"
          value={newUser.username}
          onChange={(e) => setNewUser({ ...newUser, username: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={newUser.password}
          onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={newUser.email}
          onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="text"
          placeholder="First name"
          value={newUser.first_name}
          onChange={(e) => setNewUser({ ...newUser, first_name: e.target.value })}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Last name"
          value={newUser.last_name}
          onChange={(e) => setNewUser({ ...newUser, last_name: e.target.value })}
          className="border p-2 rounded"
        />
        <select
          value={newUser.role}
          onChange={(e) => setNewUser({ ...newUser, role: e.target.value as User["role"] })}
          className="border p-2 rounded"
        >
          <option value="employee">Employee</option>
          <option value="manager">Manager</option>
        </select>
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer"
        >
          Add User
        </button>
      </form>

      {/* Table */}
      <table className="min-w-full border border-gray600">
        <thead>
          <tr className="bg-gray-200 text-left">
            <th className="px-4 py-2">Username</th>
            <th className="px-4 py-2">Email</th>
            <th className="px-4 py-2">First Name</th>
            <th className="px-4 py-2">Last Name</th>
            <th className="px-4 py-2">Role</th>
            {/* <th className="px-4 py-2">Is Staff</th> */}
            <th className="px-4 py-2">Is Active</th>
            <th className="px-4 py-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id} className="border-t">
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editValues.username || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, username: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.username
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <input
                    type="email"
                    value={editValues.email || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, email: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.email
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editValues.first_name || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, first_name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.first_name
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <input
                    type="text"
                    value={editValues.last_name || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, last_name: e.target.value })
                    }
                    className="border p-1 rounded"
                  />
                ) : (
                  user.last_name
                )}
              </td>
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <select
                    value={editValues.role || ""}
                    onChange={(e) =>
                      setEditValues({ ...editValues, role: e.target.value as User["role"] })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="employee">Employee</option>
                    <option value="manager">Manager</option>
                  </select>
                ) : (
                  user.role
                )}
              </td>
              {/* <td className="px-4 py-2">
                {editingId === user.id ? (
                  <select
                    value={editValues.is_staff ?? user.is_staff ? "true" : "false"}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        is_staff: e.target.value === "true",
                      })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  user.is_staff ? "Yes" : "No"
                )}
              </td> */}
              <td className="px-4 py-2">
                {editingId === user.id ? (
                  <select
                    value={editValues.is_active ?? user.is_active ? "true" : "false"}
                    onChange={(e) =>
                      setEditValues({
                        ...editValues,
                        is_active: e.target.value === "true",
                      })
                    }
                    className="border p-1 rounded"
                  >
                    <option value="true">Yes</option>
                    <option value="false">No</option>
                  </select>
                ) : (
                  user.is_active ? "Yes" : "No"
                )}
              </td>
              <td className="px-4 py-2 flex gap-2">
                {editingId === user.id ? (
                  <>
                    <button
                      onClick={() => handleSave(user.id)}
                      className="bg-green-600 text-white px-2 py-1 rounded hover:bg-green-500 cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => handleCancel(user.id)}
                      className="bg-gray-500 text-white px-2 py-1 rounded hover:bg-gray-400 cursor-pointer"
                    >
                      Cancel
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-blue-600 text-white px-2 py-1 rounded hover:bg-blue-500 cursor-pointer"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 text-white px-2 py-1 rounded hover:bg-red-500 cursor-pointer"
                    >
                      Delete
                    </button>
                  </>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}