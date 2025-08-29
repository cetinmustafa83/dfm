import JobEditor from '@/components/admin/JobEditor';

export default function NewJobPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Create New Job Posting</h1>
      <JobEditor />
    </div>
  );
}
