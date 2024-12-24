export type CrepeItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sweet' | 'savory';
};

export let menuItems: CrepeItem[] = [
  {
    id: "1",
    name: "Classic Driwich",
    description: "Our signature sandwich",
    price: 8.99,
    category: "savory"
  },
  {
    id: "2",
    name: "Cheese Driwich",
    description: "Melted cheese sandwich",
    price: 9.99,
    category: "savory"
  },
  {
    id: "3",
    name: "Sweet Driwich",
    description: "Sweet and delicious",
    price: 7.99,
    category: "sweet"
  },
  {
    id: "4",
    name: "Special Driwich",
    description: "Our special recipe",
    price: 10.99,
    category: "savory"
  }
];