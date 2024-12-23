import { CrepeItem } from "../data/menu";

export type OrderStatus = "pending" | "preparing" | "ready" | "completed";

export type Order = {
  id: string;
  orderNumber: number;
  items: CrepeItem[];
  status: OrderStatus;
  totalAmount: number;
  createdAt: Date;
  customerName?: string;
};