import { useState } from "react";
import Sidebar from "@/components/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Pencil, Trash2 } from "lucide-react";

interface Item {
  id: string;
  name: string;
  manufacturer: string;
  costPerUnit: number;
  stock: number;
}

const Items = () => {
  const [items, setItems] = useState<Item[]>([
    {
      id: "1",
      name: "Circuit Breaker",
      manufacturer: "Schneider Electric",
      costPerUnit: 45.99,
      stock: 50,
    },
    {
      id: "2",
      name: "LED Light Bulb",
      manufacturer: "Philips",
      costPerUnit: 12.99,
      stock: 200,
    },
    {
      id: "3",
      name: "Electrical Wire (100m)",
      manufacturer: "Southwire",
      costPerUnit: 89.99,
      stock: 30,
    },
  ]);

  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const newItem = {
      id: editingItem?.id || Math.random().toString(),
      name: formData.get("name") as string,
      manufacturer: formData.get("manufacturer") as string,
      costPerUnit: parseFloat(formData.get("costPerUnit") as string),
      stock: parseInt(formData.get("stock") as string),
    };

    if (editingItem) {
      setItems(items.map(item => item.id === editingItem.id ? newItem : item));
      toast({ title: "Item updated successfully" });
    } else {
      setItems([...items, newItem]);
      toast({ title: "Item added successfully" });
    }
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    setItems(items.filter(item => item.id !== id));
    toast({ title: "Item deleted successfully" });
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Electrical Items</h1>
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setEditingItem(null)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingItem ? "Edit Item" : "Add New Item"}</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Name</label>
                  <Input 
                    name="name" 
                    defaultValue={editingItem?.name}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Manufacturer/Shop</label>
                  <Input 
                    name="manufacturer" 
                    defaultValue={editingItem?.manufacturer}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Cost per Unit</label>
                  <Input 
                    name="costPerUnit" 
                    type="number" 
                    step="0.01"
                    defaultValue={editingItem?.costPerUnit}
                    required 
                  />
                </div>
                <div>
                  <label className="text-sm font-medium">Stock</label>
                  <Input 
                    name="stock" 
                    type="number"
                    defaultValue={editingItem?.stock}
                    required 
                  />
                </div>
                <Button type="submit">Save</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Manufacturer/Shop</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>€{item.costPerUnit.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            onClick={() => setEditingItem(item)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Edit Item</DialogTitle>
                          </DialogHeader>
                          <form onSubmit={handleSubmit} className="space-y-4">
                            <div>
                              <label className="text-sm font-medium">Name</label>
                              <Input 
                                name="name" 
                                defaultValue={item.name}
                                required 
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Manufacturer/Shop</label>
                              <Input 
                                name="manufacturer" 
                                defaultValue={item.manufacturer}
                                required 
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Cost per Unit</label>
                              <Input 
                                name="costPerUnit" 
                                type="number" 
                                step="0.01"
                                defaultValue={item.costPerUnit}
                                required 
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Stock</label>
                              <Input 
                                name="stock" 
                                type="number"
                                defaultValue={item.stock}
                                required 
                              />
                            </div>
                            <Button type="submit">Save Changes</Button>
                          </form>
                        </DialogContent>
                      </Dialog>
                      <Button 
                        variant="ghost" 
                        size="icon"
                        onClick={() => handleDelete(item.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </main>
    </div>
  );
};

export default Items;