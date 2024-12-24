import { useState } from "react";
import { NewOrderForm } from "../components/NewOrderForm";
import { OrderCard } from "../components/OrderCard";
import { Order } from "../types/order";
import { CrepeItem } from "../data/menu";
import { toast } from "../components/ui/use-toast";

const Index = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [lastOrderNumber, setLastOrderNumber] = useState(0);

  const handleNewOrder = ({ items, totalAmount }: {
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
    };
    setOrders([newOrder, ...orders]);
    setLastOrderNumber(newOrderNumber);
    printOrderTicket(newOrder);
  };

  const printOrderTicket = (order: Order) => {
    // Create a separator line
    const separator = "-".repeat(32);
    
    // Format the time to show only hours and minutes
    const time = new Date(order.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    // Create the ticket content with proper spacing and formatting
    const ticketContent = `
╔══════════════════════════════╗
║         CREPE SHOP           ║
╚══════════════════════════════╝

ORDER #${order.orderNumber.toString().padStart(3, '0')}
${time}

${separator}
ITEMS:
${order.items.map(item => `• ${item.name.padEnd(20, ' ')} $${item.price.toFixed(2)}`).join('\n')}
${separator}

TOTAL:${' '.repeat(14)}$${order.totalAmount.toFixed(2)}

Thank you!

`;

    // Create a hidden iframe for printing
    const printFrame = document.createElement('iframe');
    printFrame.style.display = 'none';
    document.body.appendChild(printFrame);
    
    printFrame.contentDocument?.write(`
      <html>
        <head>
          <style>
            @page {
              margin: 0;
              size: 80mm auto;  /* Standard thermal paper width */
            }
            body {
              margin: 0;
              padding: 8px;
              font-family: 'Courier New', monospace;
              font-size: 12px;
              line-height: 1.2;
              white-space: pre;
              width: 80mm;
            }
            .ticket {
              width: 100%;
            }
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
                onPrint={() => printOrderTicket(order)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;