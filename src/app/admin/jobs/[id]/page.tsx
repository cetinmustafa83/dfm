import JobEditor from '@/components/admin/JobEditor';
import { notFound } from 'next/navigation';

// This function should be defined in a lib or utils file for reusability,
// but for simplicity, it's here.
async function getJobData(id: string) {
  try {
    // Ensure you have NEXT_PUBLIC_API_URL in your .env.local
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/jobs?id=${id}`, {
      cache: 'no-store', // Important for data that changes often
    });
    if (!res.ok) {
      console.error(`Failed to fetch job ${id}, status: ${res.status}`);
      return null;
    }
    return res.json();
  } catch (error) {
    console.error('Error fetching job data:', error);
    return null;
  }
}

export default async function EditJobPage({
  params,
}: {
  params: { id:string };
}) {
  const jobData = await getJobData(params.id);

  if (!jobData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Job Posting</h1>
      <JobEditor initialData={jobData} />
    </div>
  );
}
