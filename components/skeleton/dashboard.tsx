import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <Skeleton className="h-8 w-[200px]" />
          <Skeleton className="h-4 w-[300px]" />
        </div>
        <Skeleton className="h-9 w-[120px]" />
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="border-border/50">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <Skeleton className="h-4 w-[120px]" />
              <Skeleton className="h-4 w-4 rounded" />
            </CardHeader>
            <CardContent className="space-y-2">
              <Skeleton className="h-8 w-[80px]" />
              <Skeleton className="h-3 w-[100px]" />
              <Skeleton className="h-3 w-[90px]" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Revenue Chart & Today Activity */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Chart */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardHeader>
              <Skeleton className="h-6 w-[180px]" />
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex flex-col justify-end gap-2">
                {/* Simulated chart bars */}
                <div className="flex items-end justify-between h-full gap-2">
                  {[...Array(7)].map((_, i) => (
                    <div
                      key={i}
                      className="flex-1 flex flex-col justify-end gap-2"
                    >
                      <Skeleton
                        className="w-full"
                        style={{ height: `${Math.random() * 60 + 40}%` }}
                      />
                      <Skeleton className="h-3 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Today Activity */}
        <Card className="border-border/50">
          <CardHeader>
            <Skeleton className="h-6 w-[140px]" />
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Check-ins Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-[150px]" />
              <div className="space-y-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-[50px] rounded-full" />
                  </div>
                ))}
              </div>
            </div>

            {/* Check-outs Section */}
            <div className="space-y-3">
              <Skeleton className="h-4 w-[160px]" />
              <div className="space-y-2">
                {[...Array(2)].map((_, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 rounded-lg bg-muted/50"
                  >
                    <div className="flex items-center gap-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="space-y-1">
                        <Skeleton className="h-4 w-[100px]" />
                        <Skeleton className="h-3 w-[80px]" />
                      </div>
                    </div>
                    <Skeleton className="h-6 w-[50px] rounded-full" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Room Status Grid */}
      <Card className="border-border/50">
        <CardHeader>
          <div className="flex items-center justify-between">
            <Skeleton className="h-6 w-[160px]" />
            <div className="flex gap-2">
              {[...Array(4)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-[80px] rounded-full" />
              ))}
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Floor 1 */}
          {[...Array(3)].map((floor, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[80px]" />
              <div className="grid grid-cols-4 md:grid-cols-5 lg:grid-cols-8 gap-2">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="p-3 rounded-lg border border-border/50 space-y-1"
                  >
                    <Skeleton className="h-6 w-[40px]" />
                    <Skeleton className="h-3 w-[50px]" />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
