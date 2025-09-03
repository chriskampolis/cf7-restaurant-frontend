import type { MenuItem } from "../types";

type Props = {
  item: MenuItem;
};

function MenuViewCard({ item }: Props) {
  return (
    <div className="p-4 border rounded shadow">
      <h2 className="font-bold">{item.name}</h2>
      <p>{item.price}€</p>
    </div>
  );
}

export default MenuViewCard;