import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function ApplicationCardSkeleton() {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="flex-1">
        <Skeleton className="h-5 w-48 mb-2" />
        <Skeleton className="h-4 w-32 mb-1" />
        <Skeleton className="h-3 w-24" />
      </div>
      <div className="flex items-center gap-2">
        <Skeleton className="h-6 w-20 rounded-full" />
        <Skeleton className="h-8 w-16" />
      </div>
    </div>
  );
}

export function ApplicationTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="p-3 font-medium"><Skeleton className="h-4 w-20" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-24" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-16" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-20" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-16" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-3"><Skeleton className="h-4 w-32" /></td>
              <td className="p-3"><Skeleton className="h-4 w-28" /></td>
              <td className="p-3"><Skeleton className="h-6 w-20 rounded-full" /></td>
              <td className="p-3"><Skeleton className="h-4 w-24" /></td>
              <td className="p-3"><Skeleton className="h-8 w-20" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
