import { useState } from "react";
import { NewOrderForm } from "../components/NewOrderForm";
import { OrderCard } from "../components/OrderCard";
import { Order } from "../types/order";
import { CrepeItem } from "../data/menu";
import { toast } from "../components/ui/use-toast";
import { Button } from "../components/ui/button";
import { ProductManager } from "../components/ProductManager";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "../components/ui/sheet";

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
    const separator = "-".repeat(32);
    
    const time = new Date(order.createdAt).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });

    const ticketContent = `
╔══════════════════════════════╗
║         DRIWICH              ║
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

    const printFrame = document.createElement('iframe');
    printFrame.style.position = 'fixed';
    printFrame.style.right = '0';
    printFrame.style.bottom = '0';
    printFrame.style.width = '0';
    printFrame.style.height = '0';
    printFrame.style.border = '0';
    document.body.appendChild(printFrame);
    
    const printDocument = printFrame.contentWindow?.document;
    if (!printDocument) {
      document.body.removeChild(printFrame);
      toast({
        title: "Print error",
        description: "Could not prepare print document",
        variant: "destructive",
      });
      return;
    }
    
    printDocument.write(`
      <html>
        <head>
          <title>Print Order #${order.orderNumber}</title>
          <style>
            @page {
              margin: 0;
              size: 80mm auto;
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
    
    printDocument.close();
    
    printFrame.onload = () => {
      try {
        printFrame.contentWindow?.focus();
        
        setTimeout(() => {
          try {
            if (printFrame.contentWindow?.print) {
              printFrame.contentWindow.print();
            }
            
            setTimeout(() => {
              if (document.body.contains(printFrame)) {
                document.body.removeChild(printFrame);
              }
            }, 1000);
          } catch (err) {
            console.error("Print error:", err);
            document.body.removeChild(printFrame);
          }
        }, 200);
      } catch (err) {
        console.error("Print focus error:", err);
        document.body.removeChild(printFrame);
      }
    };

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
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Driwich Orders</h1>
        <Sheet>
          <SheetTrigger asChild>
            <Button>Manage Products</Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[400px] sm:w-[540px]">
            <SheetHeader>
              <SheetTitle>Manage Products</SheetTitle>
            </SheetHeader>
            <ProductManager />
          </SheetContent>
        </Sheet>
      </div>
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
