import { CrepeItem } from "../data/menu";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export type Order = {
  id: string;
  items: CrepeItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  customerName: string;
};