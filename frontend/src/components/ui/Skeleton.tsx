import { cn } from "@/components/ui/Card"

function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn("animate-pulse rounded-md bg-slate-800", className)}
      {...props}
    />
  )
}

export { Skeleton }
