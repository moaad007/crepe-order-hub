import { useState } from "react";
import { NewOrderForm } from "../components/NewOrderForm";
import { OrderCard } from "../components/OrderCard";
import { Order } from "../types/order";
import { CrepeItem } from "../data/menu";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderNumber, setLastOrderNumber] = useState(0);

  const handleNewOrder = ({ customerName, items, totalAmount }: {
    customerName: string;
    items: CrepeItem[];
    totalAmount: number;
  }) => {
    const newOrderNumber = lastOrderNumber + 1;
    const newOrder: Order = {
      id: (orders.length + 1).toString(),
      orderNumber: newOrderNumber,
      items,
      status: "pending",
      totalAmount,
      createdAt: new Date(),
      customerName,
    };
    setOrders([newOrder, ...orders]);
    setLastOrderNumber(newOrderNumber);
    printOrderTicket(newOrder);
  };

  const printOrderTicket = (order: Order) => {
    const ticketContent = `
      Order #${order.orderNumber}
      Customer: ${order.customerName}
      ${new Date(order.createdAt).toLocaleTimeString()}
      
      Items:
      ${order.items.map(item => `- ${item.name}`).join('\n')}
      
      Total: $${order.totalAmount.toFixed(2)}
    `;

    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    
    printFrame.contentDocument?.write(`
      <html>
        <head>
          <style>
            body { font-family: monospace; font-size: 14px; line-height: 1.5; }
            h1 { font-size: 16px; margin-bottom: 8px; }
            .ticket { padding: 20px; }
          </style>
        </head>
        <body>
          <div class="ticket">
            <pre>${ticketContent}</pre>
          </div>
        </body>
      </html>
    `);
    
    printFrame.contentDocument?.close();
    printFrame.contentWindow?.focus();
    printFrame.contentWindow?.print();
    
    // Remove the iframe after printing
    setTimeout(() => {
      document.body.removeChild(printFrame);
    }, 1000);

    toast({
      title: "Order Created",
      description: `Order #${order.orderNumber} has been created and sent to printer`,
    });
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