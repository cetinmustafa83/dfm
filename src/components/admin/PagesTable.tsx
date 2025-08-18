"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { Skeleton } from '@/components/ui/skeleton';

interface Page {
  id: string;
  title: string;
  slug: string;
  updatedAt: string;
}

export default function PagesTable() {
  const [pages, setPages] = useState<Page[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPages();
  }, []);

  const fetchPages = async () => {
    try {
      const response = await fetch('/api/content/pages');
      const data = await response.json();
      setPages(data);
    } catch (error) {
      toast.error('Failed to load pages');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this page?')) {
      try {
        const response = await fetch(`/api/content/pages?id=${id}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          toast.success('Page deleted successfully');
          fetchPages();
        }
      } catch (error) {
        toast.error('Failed to delete page');
      }
    }
  };

  if (loading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>URL Slug</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {pages.map((page) => (
          <TableRow key={page.id}>
            <TableCell className="font-medium">{page.title}</TableCell>
            <TableCell>/{page.slug}</TableCell>
            <TableCell>
              {new Date(page.updatedAt).toLocaleDateString()}
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-8 w-8 p-0">
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <Link href={`/admin/pages/${page.id}`}>
                    <DropdownMenuItem>Edit</DropdownMenuItem>
                  </Link>
                  <DropdownMenuItem
                    className="text-red-600"
                    onClick={() => handleDelete(page.id)}
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}