
interface CrepeItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

interface MenuItemProps {
  item: CrepeItem;
  onAddItem: (item: CrepeItem) => void;
}

export function MenuItem({ item, onAddItem }: MenuItemProps) {
  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => onAddItem(item)}
      className="h-auto py-2 px-3 text-left flex flex-col items-start w-full"
    >
      <span className="font-semibold">{item.name}</span>
      <span className="text-sm text-muted-foreground">
        ${item.price.toFixed(2)}
      </span>
    </Button>
  );
}
