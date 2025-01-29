import Sidebar from "@/components/Sidebar";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

interface Item {
  id: string;
  name: string;
  manufacturer: string;
  costPerUnit: number;
  stock: number;
}

const Items = () => {
  // Mock items data
  const items: Item[] = [
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
  ];

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Electrical Items</h1>
        
        <div className="bg-white rounded-lg shadow-sm">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Manufacturer/Shop</TableHead>
                <TableHead>Cost per Unit</TableHead>
                <TableHead>Stock</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.name}</TableCell>
                  <TableCell>{item.manufacturer}</TableCell>
                  <TableCell>€{item.costPerUnit.toFixed(2)}</TableCell>
                  <TableCell>{item.stock}</TableCell>
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