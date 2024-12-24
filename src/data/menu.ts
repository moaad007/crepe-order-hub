export type CrepeItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sweet' | 'savory';
};

export let menuItems: CrepeItem[] = [];

// Add a function to update the menu items
export const updateMenuItems = (newItems: CrepeItem[]) => {
  menuItems = newItems;
};