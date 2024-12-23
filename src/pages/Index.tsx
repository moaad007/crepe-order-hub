import { useState } from "react";
import { NewOrderForm } from "../components/NewOrderForm";
import { OrderCard } from "../components/OrderCard";
import { Order } from "../types/order";
import { CrepeItem } from "../data/menu";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const handleNewOrder = ({ customerName, items, totalAmount }: {
    customerName: string;
    items: CrepeItem[];
    totalAmount: number;
  }) => {
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      items,
      status: "pending",
      totalAmount,
      createdAt: new Date(),
      customerName,
    };
    setOrders([newOrder, ...orders]);
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrders(
      orders.map((order) =>
        order.id === orderId ? { ...order, status: newStatus } : order
      )
    );
  };

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-4xl font-bold text-center mb-8">Crepe Shop Orders</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">New Order</h2>
          <NewOrderForm onSubmit={handleNewOrder} />
        </div>
        <div>
          <h2 className="text-2xl font-semibold mb-4">Active Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <OrderCard
                key={order.id}
                order={order}
                onStatusUpdate={handleStatusUpdate}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;