// ... existing imports ...
import { Skeleton } from "@/components/ui/skeleton";

// Add loading state to table rows
{loading ? (
  Array(3).fill(0).map((_, index) => (
    <TableRow key={index}>
      <TableCell><Skeleton className="h-4 w-[200px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[100px]" /></TableCell>
      <TableCell><Skeleton className="h-4 w-[150px]" /></TableCell>
      <TableCell><Skeleton className="h-8 w-8 rounded-full" /></TableCell>
    </TableRow>
  ))
) : (
  pages.map((page) => (
    // ... existing table row implementation ...
  ))
)}