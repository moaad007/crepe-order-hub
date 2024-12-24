import { useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { menuItems, CrepeItem } from "../data/menu";
import { toast } from "./ui/use-toast";

export function ProductManager() {
  const [products, setProducts] = useState<CrepeItem[]>(menuItems);
  const [editingProduct, setEditingProduct] = useState<CrepeItem | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "savory" as const,
  });

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    const product: CrepeItem = {
      id: (products.length + 1).toString(),
      name: newProduct.name,
      description: "",
      price: parseFloat(newProduct.price),
      category: newProduct.category,
    };

    setProducts([...products, product]);
    setNewProduct({ name: "", price: "", category: "savory" });
    toast({
      title: "Success",
      description: "Product added successfully",
    });
  };

  const handleEditProduct = (product: CrepeItem) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = () => {
    if (!editingProduct) return;

    setProducts(
      products.map((p) =>
        p.id === editingProduct.id ? editingProduct : p
      )
    );
    setEditingProduct(null);
    toast({
      title: "Success",
      description: "Product updated successfully",
    });
  };

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter((p) => p.id !== id));
    toast({
      title: "Success",
      description: "Product deleted successfully",
    });
  };

  return (
    <div className="space-y-6 pt-6">
      <div className="space-y-4">
        <h3 className="text-lg font-medium">Add New Product</h3>
        <div className="grid gap-4">
          <Input
            placeholder="Product name"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
          <Input
            type="number"
            placeholder="Price"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({ ...newProduct, price: e.target.value })
            }
          />
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Products</h3>
        <div className="space-y-4">
          {products.map((product) =>
            editingProduct?.id === product.id ? (
              <div key={product.id} className="flex gap-2">
                <Input
                  value={editingProduct.name}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      name: e.target.value,
                    })
                  }
                />
                <Input
                  type="number"
                  value={editingProduct.price}
                  onChange={(e) =>
                    setEditingProduct({
                      ...editingProduct,
                      price: parseFloat(e.target.value),
                    })
                  }
                />
                <Button onClick={handleUpdateProduct}>Save</Button>
                <Button
                  variant="ghost"
                  onClick={() => setEditingProduct(null)}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <div
                key={product.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div>
                  <p className="font-medium">{product.name}</p>
                  <p className="text-sm text-muted-foreground">
                    ${product.price.toFixed(2)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleEditProduct(product)}
                  >
                    Edit
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteProduct(product.id)}
                  >
                    Delete
                  </Button>
                </div>
              </div>
            )
          )}
        </div>
      </div>
    </div>
  );
}