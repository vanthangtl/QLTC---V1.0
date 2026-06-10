import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"

export default async function Page() {
  return (
    <>
      <div className="flex items-center gap-2">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Bảng điều khiển</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <div className="grid auto-rows-min gap-4 md:grid-cols-3">
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4 border border-dashed">
            <span className="text-muted-foreground text-sm">Tính năng đang phát triển</span>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4 border border-dashed">
            <span className="text-muted-foreground text-sm">Tính năng đang phát triển</span>
          </div>
          <div className="aspect-video rounded-xl bg-muted/50 flex items-center justify-center p-4 border border-dashed">
            <span className="text-muted-foreground text-sm">Tính năng đang phát triển</span>
          </div>
        </div>
        <div className="min-h-screen flex-1 rounded-xl bg-muted/50 md:min-h-min flex items-center justify-center border border-dashed">
          <p className="text-muted-foreground">Chào mừng đến với trang quản lý tài chính cá nhân!</p>
        </div>
      </div>
    </>
  )
}
