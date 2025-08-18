import { Button } from '@/components/ui/button';
import Link from 'next/link';
import PageEditor from '@/components/admin/PageEditor';

export default function PagesManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Pages</h1>
        <Link href="/admin/pages/new">
          <Button>Create New Page</Button>
        </Link>
      </div>
      
      {/* TODO: Add pages list table */}
      <div className="border rounded-lg p-4">
        <p className="text-gray-500">Pages list will appear here</p>
      </div>

      {/* Example editor - remove in final version */}
      <PageEditor />
    </div>
  );
}