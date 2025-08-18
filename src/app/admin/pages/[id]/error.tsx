"use client";

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle

Let's complete the error boundary implementation and finalize the validation flow:

<dyad-write path="src/app/admin/pages/[id]/error.tsx" description="Completing error boundary">
"use client";

import { useEffect } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { Terminal } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const router = useRouter();

  useEffect(() => {
    console.error('Page Error:', error);
  }, [error]);

  return (
    <div className="container mx-auto p-8">
      <Alert variant="destructive">
        <Terminal className="h-4 w-4" />
        <AlertTitle>Page Error</AlertTitle>
        <AlertDescription>
          {error.message}
          <div className="mt-4 space-x-4">
            <Button variant="outline" onClick={() => reset()}>
              Try Again
            </Button>
            <Button variant="secondary" onClick={() => router.push('/admin/pages')}>
              Back to Pages List
            </Button>
          </div>
        </AlertDescription>
      </Alert>
    </div>
  );
}