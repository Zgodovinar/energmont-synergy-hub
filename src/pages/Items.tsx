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
import { Plus, Pencil, Trash2, Search } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

interface Item {
  id: string;
  name: string;
  description: string | null;
  quantity: number;
  unit_price: number;
  category: string | null;
}

const Items = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [editingItem, setEditingItem] = useState<Item | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: items = [], isLoading } = useQuery({
    queryKey: ['items'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('items')
        .select('*');
      
      if (error) throw error;
      return data;
    }
  });

  const addItemMutation = useMutation({
    mutationFn: async (newItem: Omit<Item, 'id'>) => {
      const { data, error } = await supabase
        .from('items')
        .insert([newItem])
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({ title: "Item added successfully" });
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: async (item: Item) => {
      const { error } = await supabase
        .from('items')
        .update(item)
        .eq('id', item.id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({ title: "Item updated successfully" });
    }
  });

  const deleteItemMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('items')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['items'] });
      toast({ title: "Item deleted successfully" });
    }
  });

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const itemData = {
      name: formData.get("name") as string,
      description: formData.get("description") as string,
      quantity: parseInt(formData.get("quantity") as string),
      unit_price: parseFloat(formData.get("unit_price") as string),
      category: formData.get("category") as string,
    };

    if (editingItem) {
      updateItemMutation.mutate({ ...itemData, id: editingItem.id });
    } else {
      addItemMutation.mutate(itemData);
    }
    setEditingItem(null);
  };

  const handleDelete = (id: string) => {
    deleteItemMutation.mutate(id);
  };

  const filteredItems = items.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    item.category?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Electrical Items</h1>
          <div className="flex gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search items..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
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
                    <label className="text-sm font-medium">Description</label>
                    <Input 
                      name="description" 
                      defaultValue={editingItem?.description || ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Category</label>
                    <Input 
                      name="category" 
                      defaultValue={editingItem?.category || ''}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Unit Price</label>
                    <Input 
                      name="unit_price" 
                      type="number" 
                      step="0.01"
                      defaultValue={editingItem?.unit_price}
                      required 
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium">Quantity</label>
                    <Input 
                      name="quantity" 
                      type="number"
                      defaultValue={editingItem?.quantity}
                      required 
                    />
                  </div>
                  <Button type="submit">Save</Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredItems.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.category}</TableCell>
                  <TableCell>€{item.unit_price.toFixed(2)}</TableCell>
                  <TableCell>{item.quantity}</TableCell>
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
                              <label className="text-sm font-medium">Description</label>
                              <Input 
                                name="description" 
                                defaultValue={item.description || ''}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Category</label>
                              <Input 
                                name="category" 
                                defaultValue={item.category || ''}
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Unit Price</label>
                              <Input 
                                name="unit_price" 
                                type="number" 
                                step="0.01"
                                defaultValue={item.unit_price}
                                required 
                              />
                            </div>
                            <div>
                              <label className="text-sm font-medium">Quantity</label>
                              <Input 
                                name="quantity" 
                                type="number"
                                defaultValue={item.quantity}
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