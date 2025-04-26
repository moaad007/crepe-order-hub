
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { toast } from "./ui/use-toast";
import { MenuItem } from "./MenuItem";
import { SelectedItems } from "./SelectedItems";
import { supabase } from "@/integrations/supabase/client";

// Updated interface to match the database structure
interface CrepeItem {
  id: string;
  name: string;
  price: number;
  category: string;
  // We don't have description in the database table
}

interface NewOrderFormProps {
  onSubmit: (order: {
    items: CrepeItem[];
    totalAmount: number;
  }) => void;
}

export function NewOrderForm({ onSubmit }: NewOrderFormProps) {
  const [selectedItems, setSelectedItems] = useState<CrepeItem[]>([]);
  const [menuItems, setMenuItems] = useState<CrepeItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('category', { ascending: true });

      if (error) {
        throw error;
      }

      setMenuItems(data || []);
    } catch (error) {
      console.error('Error fetching products:', error);
      toast({
        title: "Error",
        description: "Failed to load menu items",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

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
            {loading ? (
              <div className="text-center py-4">Loading menu items...</div>
            ) : menuItems.length === 0 ? (
              <div className="text-center py-4 text-muted-foreground">No menu items available</div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                {menuItems.map((item) => (
                  <MenuItem
                    key={item.id}
                    item={item}
                    onAddItem={handleAddItem}
                  />
                ))}
              </div>
            )}
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
