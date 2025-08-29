import { Button } from '@/components/ui/button';
import Link from 'next/link';
import JobsTable from '@/components/admin/JobsTable';

export default function JobsManager() {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Manage Job Postings</h1>
        <Link href="/admin/jobs/new">
          <Button>Create New Job</Button>
        </Link>
      </div>
      <JobsTable />
    </div>
  );
}
