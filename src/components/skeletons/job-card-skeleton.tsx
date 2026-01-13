import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export function JobCardSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48 mb-2" />
        <Skeleton className="h-4 w-32" />
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-4 w-20" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>
      </CardContent>
    </Card>
  );
}

export function JobTableSkeleton({ rows = 5 }: { rows?: number }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="p-3 font-medium"><Skeleton className="h-4 w-24" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-20" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-24" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-20" /></th>
            <th className="p-3 font-medium"><Skeleton className="h-4 w-16" /></th>
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <tr key={i} className="border-t">
              <td className="p-3"><Skeleton className="h-4 w-40" /></td>
              <td className="p-3"><Skeleton className="h-4 w-32" /></td>
              <td className="p-3"><Skeleton className="h-4 w-24" /></td>
              <td className="p-3"><Skeleton className="h-4 w-20" /></td>
              <td className="p-3"><Skeleton className="h-8 w-16" /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
