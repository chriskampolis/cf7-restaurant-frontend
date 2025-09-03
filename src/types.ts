export interface MenuItem {
  id: number;
  name: string;
  price: string;
  availability: number;
  category: string;
}

export interface OrderItem {
  id: number;
  menu_item: number;
  menu_item_name: string;
  price: string;
  quantity: number;
}

export interface Order {
  id: number;
  table_number: number;
  placed_by: string;
  status: "in_progress" | "completed";
  created_at: string;
  total_price: number;
  items: OrderItem[];
}

export type UserRole = "manager" | "employee";

export interface User {
  id: number;
  username: string;
  email: string;
  first_name: string;
  last_name: string;
  role: UserRole;
  is_superuser: boolean;
  is_staff: boolean;
  is_active: boolean;
  password: string; // only for create
  is_manager?: () => boolean; // helper function
}