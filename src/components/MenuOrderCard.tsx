import type { MenuItem } from "../types";

interface Props {
  item: MenuItem;
  quantity: number;
  onQuantityChange: (id: number, quantity: number) => void;
}

function MenuOrderCard({ item, quantity, onQuantityChange }: Props) {
  return (
    <div className="border rounded p-4 flex justify-between">
      <div>
        <h3 className="font-bold">{item.name}</h3>
        <p>{item.price} €</p>
        <p className="text-sm text-gray-500">Available: {item.availability}</p>
      </div>
      <input
        type="number"
        min={0}
        value={quantity}
        onChange={(e) => onQuantityChange(item.id, parseInt(e.target.value))}
        className="w-16 border p-1"
      />
    </div>
  );
}

export default MenuOrderCard;