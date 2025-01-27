import Sidebar from "@/components/Sidebar";
import { Card } from "@/components/ui/card";

const Contacts = () => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <h1 className="text-3xl font-bold mb-8">Contacts</h1>
        <Card className="p-6">
          <p className="text-gray-500">Contacts management coming soon...</p>
        </Card>
      </main>
    </div>
  );
};

export default Contacts;