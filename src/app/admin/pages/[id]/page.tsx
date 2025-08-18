import PageEditor from '@/components/admin/PageEditor';
import { notFound } from 'next/navigation';

async function getPageData(id: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/content/pages?id=${id}`);
  if (!res.ok) return null;
  return res.json();
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