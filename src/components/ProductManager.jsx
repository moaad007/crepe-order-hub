
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ScrollArea } from "./ui/scroll-area";
import { toast } from "./ui/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

interface Product {
  id: string;
  name: string;
  price: number;
  category: string;
}

export function ProductManager() {
  const [products, setProducts] = useState<Product[]>([]);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [newProduct, setNewProduct] = useState({
    name: "",
    price: "",
    category: "savory" as "savory" | "sweet",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (error) {
      console.error("Error fetching products:", error);
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: "Error",
        description: "Please fill in all fields",
        variant: "destructive",
      });
      return;
    }

    try {
      const priceValue = parseFloat(newProduct.price);
      if (isNaN(priceValue)) {
        throw new Error("Invalid price");
      }

      const { data, error } = await supabase
        .from('products')
        .insert([
          {
            name: newProduct.name,
            price: priceValue,
            category: newProduct.category,
          }
        ])
        .select();

      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }

      if (data && data.length > 0) {
        setProducts([data[0], ...products]);
        setNewProduct({ name: "", price: "", category: "savory" });
        toast({
          title: "Success",
          description: "Product added successfully",
        });
      }
    } catch (error) {
      console.error("Error adding product:", error);
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product);
  };

  const handleUpdateProduct = async () => {
    if (!editingProduct) return;

    try {
      const { error } = await supabase
        .from('products')
        .update({
          name: editingProduct.name,
          price: editingProduct.price,
          category: editingProduct.category,
        })
        .eq('id', editingProduct.id);

      if (error) throw error;

      setProducts(products.map((p) =>
        p.id === editingProduct.id ? editingProduct : p
      ));
      setEditingProduct(null);
      toast({
        title: "Success",
        description: "Product updated successfully",
      });
    } catch (error) {
      console.error("Error updating product:", error);
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
    }
  };

  const handleDeleteProduct = async (id: string) => {
    try {
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setProducts(products.filter((p) => p.id !== id));
      toast({
        title: "Success",
        description: "Product deleted successfully",
      });
    } catch (error) {
      console.error("Error deleting product:", error);
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
    }
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
          <Select
            value={newProduct.category}
            onValueChange={(value) =>
              setNewProduct({ ...newProduct, category: value as "savory" | "sweet" })
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="savory">Savory</SelectItem>
              <SelectItem value="sweet">Sweet</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={handleAddProduct}>Add Product</Button>
        </div>
      </div>

      <div className="space-y-4">
        <h3 className="text-lg font-medium">Current Products</h3>
        <ScrollArea className="h-[300px] w-full border rounded-lg">
          <div className="space-y-4 p-4">
            {loading ? (
              <p>Loading products...</p>
            ) : products.length === 0 ? (
              <p className="text-center text-muted-foreground py-4">No products found</p>
            ) : (
              products.map((product) =>
                editingProduct?.id === product.id ? (
                  <div key={product.id} className="flex flex-col md:flex-row gap-2">
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
                      onChange={(e) => {
                        const value = parseFloat(e.target.value);
                        setEditingProduct({
                          ...editingProduct,
                          price: isNaN(value) ? 0 : value,
                        });
                      }}
                    />
                    <Select
                      value={editingProduct.category}
                      onValueChange={(value) =>
                        setEditingProduct({ ...editingProduct, category: value })
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="savory">Savory</SelectItem>
                        <SelectItem value="sweet">Sweet</SelectItem>
                      </SelectContent>
                    </Select>
                    <div className="flex gap-2">
                      <Button onClick={handleUpdateProduct}>Save</Button>
                      <Button
                        variant="ghost"
                        onClick={() => setEditingProduct(null)}
                      >
                        Cancel
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div
                    key={product.id}
                    className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-lg gap-4"
                  >
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="text-sm text-muted-foreground">
                        ${product.price.toFixed(2)}
                      </p>
                      <p className="text-sm text-muted-foreground capitalize">
                        {product.category}
                      </p>
                    </div>
                    <div className="flex gap-2 self-end sm:self-center">
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
              )
            )}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
