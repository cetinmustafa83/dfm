import PageEditor from '@/components/admin/PageEditor';
import { notFound } from 'next/navigation';
import { Skeleton } from '@/components/ui/skeleton';

async function getPageData(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/pages?id=${id}`);
    if (!res.ok) return null;
    return res.json();
  } catch (error) {
    console.error('Failed to fetch page:', error);
    return null;
  }
}

export default async function EditPage({
  params,
}: {
  params: { id: string };
}) {
  const pageData = await getPageData(params.id);

  if (!pageData) {
    notFound();
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Edit Page: {pageData.title}</h1>
      <PageEditor initialData={pageData} />
    </div>
  );
}

export function EditPageLoading() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-8 w-[200px]" />
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-[300px] w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    </div>
  );
}