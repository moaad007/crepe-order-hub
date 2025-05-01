

export const menuItems = [
  {
    id: "1",
    name: "Classic Nutella",
    description: "Crepe with Nutella spread",
    price: 8.99,
    category: "sweet",
  },
  {
    id: "2",
    name: "Ham & Cheese",
    description: "Savory crepe with ham and cheese",
    price: 10.99,
    category: "savory",
  },
  {
    id: "3",
    name: "Strawberry & Cream",
    description: "Fresh strawberries with whipped cream",
    price: 9.99,
    category: "sweet",
  },
  {
    id: "4",
    name: "Spinach & Feta",
    description: "Savory crepe with spinach and feta cheese",
    price: 11.99,
    category: "savory",
  },
];

export const updateMenuItems = (newItems: CrepeItem[]) => {
  menuItems = [...newItems];
};