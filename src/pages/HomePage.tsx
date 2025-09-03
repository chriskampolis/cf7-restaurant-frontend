import { useEffect, useState } from "react";
import api from "../services/api";
import type { MenuItem } from "../types";
import MenuViewCard from "../components/MenuViewCard";

function HomePage() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);

  useEffect(() => {
    api.get("/api/menu-items/").then((res) => setMenuItems(res.data));
  }, []);

  // Group items by category
  const groupedItems = menuItems.reduce((acc, item) => {
    acc[item.category] = acc[item.category] || [];
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, MenuItem[]>);

  const categoryLabels: Record<string, string> = {
    APPETIZER: "Appetizers",
    MAIN: "Main Dishes",
    DESSERT: "Desserts",
    DRINK: "Drinks",
  };


  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6 text-center">Our Menu</h1>

      {Object.entries(groupedItems).map(([category, items]) => (
        <div key={category} className="mb-8">
          <h2 className="text-xl font-semibold mb-4 pb-2">
            {categoryLabels[category] || category}
          </h2>
          <div className="space-y-4">
            {items.map((item) => (
              <MenuViewCard key={item.id} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

export default HomePage;