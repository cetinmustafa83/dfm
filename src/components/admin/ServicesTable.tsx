"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, CheckCircle2, XCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { ConfirmDialog } from '@/components/admin/ConfirmDialog';

interface Service {
  id: string;
  title: string;
  image?: string;
  featured: boolean;
  // Assuming services will also have a creation/update timestamp for display
  createdAt: string; 
  updatedAt: string;
}

export default function ServicesTable() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await fetch('/api/content/services');
        const data = await response.json();
        setServices(data);
      } catch (error) {
        toast.error('Failed to load services');
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/content/services?id=${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        toast.success('Service deleted successfully');
        // Re-fetch services after successful deletion
        const refreshData = await fetch('/api/content/services');
        setServices(await refreshData.json());
      } else {
        const errorData = await response.json();
        toast.error(errorData.error || 'Failed to delete service');
      }
    } catch (error) {
      toast.error('Network error - please try again');
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
          <TableHead>Featured</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Image</TableHead>
          <TableHead>Last Updated</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {services.length === 0 ? (
          <TableRow>
            <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
              No services found.
            </TableCell>
          </TableRow>
        ) : (
          services.map((service) => (
            <TableRow key={service.id}>
              <TableCell>
                {service.featured ? (
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                ) : (
                  <XCircle className="h-4 w-4 text-muted-foreground" />
                )}
              </TableCell>
              <TableCell className="font-medium">{service.title}</TableCell>
              <TableCell>
                {service.image ? (
                  <img src={service.image} alt={service.title} className="h-10 w-10 object-cover rounded-md" />
                ) : (
                  <span className="text-muted-foreground">No Image</span>
                )}
              </TableCell>
              <TableCell>
                {new Date(service.updatedAt).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <Link href={`/admin/services/${service.id}`}>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                    </Link>
                    <ConfirmDialog
                      onConfirm={() => handleDelete(service.id)}
                      title="Delete Service"
                      description="Are you sure you want to delete this service? All associated data will be permanently removed."
                    >
                      <DropdownMenuItem
                        className="text-red-600"
                        onSelect={(e) => e.preventDefault()} // Prevent DropdownMenu closing immediately
                      >
                        Delete
                      </DropdownMenuItem>
                    </ConfirmDialog>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
}