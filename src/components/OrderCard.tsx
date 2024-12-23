import { Order } from "../types/order";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { Printer } from "lucide-react";

interface OrderCardProps {
  order: Order;
  onStatusUpdate: (orderId: string, newStatus: Order["status"]) => void;
  onPrint: () => void;
}

const statusColors = {
  pending: "bg-yellow-200 text-yellow-800",
  preparing: "bg-blue-200 text-blue-800",
  ready: "bg-green-200 text-green-800",
  completed: "bg-gray-200 text-gray-800",
};

const nextStatus: Record<Order["status"], Order["status"]> = {
  pending: "preparing",
  preparing: "ready",
  ready: "completed",
  completed: "completed",
};

export function OrderCard({ order, onStatusUpdate, onPrint }: OrderCardProps) {
  const handleStatusUpdate = () => {
    const newStatus = nextStatus[order.status];
    onStatusUpdate(order.id, newStatus);
    toast({
      title: "Order Updated",
      description: `Order #${order.orderNumber} status changed to ${newStatus}`,
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-bold">Order #{order.orderNumber}</CardTitle>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={onPrint}
            title="Print ticket"
          >
            <Printer className="h-4 w-4" />
          </Button>
          <Badge className={statusColors[order.status]}>
            {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleString()}
            </p>
          </div>
          <div className="space-y-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name}</span>
                <span>${item.price.toFixed(2)}</span>
              </div>
            ))}
            <div className="border-t pt-2 flex justify-between font-bold">
              <span>Total</span>
              <span>${order.totalAmount.toFixed(2)}</span>
            </div>
          </div>
          {order.status !== "completed" && (
            <Button 
              className="w-full"
              onClick={handleStatusUpdate}
            >
              Mark as {nextStatus[order.status]}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}