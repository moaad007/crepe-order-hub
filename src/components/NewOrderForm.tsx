import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { menuItems, CrepeItem } from "../data/menu";
import { toast } from "./ui/use-toast";
import { MenuItem } from "./MenuItem";
import { SelectedItems } from "./SelectedItems";

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
                <MenuItem
                  key={item.id}
                  item={item}
                  onAddItem={handleAddItem}
                />
              ))}
            </div>
          </div>
          
          <SelectedItems
            items={selectedItems}
            onRemoveItem={handleRemoveItem}
          />

          <Button type="submit" className="w-full">
            Create Order
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}