export type CrepeItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sweet' | 'savory';
};

export let menuItems: CrepeItem[] = [];

export const updateMenuItems = (newItems: CrepeItem[]) => {
  menuItems = [...newItems];
};