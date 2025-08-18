import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PagesTable from '@/components/admin/PagesTable';

export default function PagesManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Pages</h1>
        <Link href="/admin/pages/new">
          <Button>Create New Page</Button>
        </Link>
      </div>
      <PagesTable />
    </div>
  );
}