import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { menuItems, CrepeItem } from "../data/menu";
import { toast } from "./ui/use-toast";

interface NewOrderFormProps {
  onSubmit: (order: {
    items: CrepeItem[];
    totalAmount: number;
  }) => void;
}

export function NewOrderForm({ onSubmit }: NewOrderFormProps) {
  const [selectedItems, setSelectedItems] = useState<CrepeItem[]>([]);

  const handleAddItem = (item: CrepeItem) => {
    setSelectedItems([...selectedItems, item]);
  };

  const handleRemoveItem = (index: number) => {
    setSelectedItems(selectedItems.filter((_, i) => i !== index));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedItems.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one item",
        variant: "destructive",
      });
      return;
    }
    const totalAmount = selectedItems.reduce((sum, item) => sum + item.price, 0);
    onSubmit({ items: selectedItems, totalAmount });
    setSelectedItems([]);
    toast({
      title: "Success",
      description: "Order created successfully",
    });
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>New Order</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <h3 className="font-semibold">Menu Items</h3>
            <div className="grid grid-cols-2 gap-2">
              {menuItems.map((item) => (
                <Button
                  key={item.id}
                  type="button"
                  variant="outline"
                  onClick={() => handleAddItem(item)}
                  className="h-auto py-2 px-3 text-left flex flex-col items-start"
                >
                  <span className="font-semibold">{item.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ${item.price.toFixed(2)}
                  </span>
                </Button>
              ))}
            </div>
          </div>
          {selectedItems.length > 0 && (
            <div className="space-y-2">
              <h3 className="font-semibold">Selected Items</h3>
              <div className="space-y-1">
                {selectedItems.map((item, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <span>{item.name}</span>
                    <div className="flex items-center gap-2">
                      <span>${item.price.toFixed(2)}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                      >
                        ×
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="border-t pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span>
                  ${selectedItems.reduce((sum, item) => sum + item.price, 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
          <Button type="submit" className="w-full">
            Create Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}