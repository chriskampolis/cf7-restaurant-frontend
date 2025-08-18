import { useEffect, useState } from "react";
import api from "../services/api";
import type { MenuItem } from "../types";
import MenuViewCard from "../components/MenuViewCard";

function HomePage() {
  const [menu, setMenu] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.get("/api/menu-items/").then((res) => setMenu(res.data));
  }, []);

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-xl font-bold">Menu</h1>
      </div>

      <div className="grid gap-4">
        {menu.map((item) => (
          <MenuViewCard
            key={item.id}
            item={item}
          />
        ))}
      </div>
    </div>
  );
}

export default HomePage;