export type CrepeItem = {
  id: string;
  name: string;
  description: string;
  price: number;
  category: 'sweet' | 'savory';
};

export const menuItems: CrepeItem[] = [
  {
    id: "1",
    name: "Nutella & Banana",
    description: "Classic combination of chocolate hazelnut spread and fresh bananas",
    price: 8.99,
    category: "sweet"
  },
  {
    id: "2",
    name: "Ham & Cheese",
    description: "Traditional savory crepe with ham and melted cheese",
    price: 9.99,
    category: "savory"
  },
  {
    id: "3",
    name: "Lemon & Sugar",
    description: "Simple and classic with fresh lemon and powdered sugar",
    price: 7.99,
    category: "sweet"
  },
  {
    id: "4",
    name: "Spinach & Feta",
    description: "Mediterranean style with fresh spinach and feta cheese",
    price: 10.99,
    category: "savory"
  }
];