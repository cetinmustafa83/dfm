import { Button } from '@/components/ui/button';
import Link from 'next/link';
import ServicesTable from '@/components/admin/ServicesTable';

export default function ServicesManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Services</h1>
        <Link href="/admin/services/new">
          <Button>Create New Service</Button>
        </Link>
      </div>
      <ServicesTable />
    </div>
  );
}