
import { Button } from "./ui/button";

interface CrepeItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface SelectedItemsProps {
  items: CrepeItem[];
  onRemoveItem: (index: number) => void;
}

export function SelectedItems({ items, onRemoveItem }: SelectedItemsProps) {
  if (items.length === 0) return null;

  const totalAmount = items.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Selected Items</h3>
      <div className="space-y-1">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span>{item.name}</span>
            <div className="flex items-center gap-2">
              <span>${item.price.toFixed(2)}</span>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveItem(index)}
              >
                ×
              </Button>
            </div>
          </div>
        ))}
      </div>
      <div className="border-t pt-2 flex justify-between font-bold">
        <span>Total</span>
        <span>${totalAmount.toFixed(2)}</span>
      </div>
    </div>
  );
}
