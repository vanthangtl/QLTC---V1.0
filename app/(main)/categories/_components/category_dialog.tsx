import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function AddCategoryDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Thêm danh mục</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Thêm danh mục</DialogTitle>
          <DialogDescription>
            Hãy thêm danh mục của bạn tại đây
          </DialogDescription>
        </DialogHeader>
        <form>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="title">Tên danh mục</Label>
              <Input id="title" placeholder="Tên danh mục" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="budget">Ngân sách</Label>
              <Input id="budget" placeholder="Ngân sách" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="icon">Icon</Label>
              <Input id="icon" placeholder="Icon" />
            </div>
            <div className="flex flex-col gap-2">
              <Label htmlFor="gradientClass">Gradient</Label>
              <Input id="gradientClass" placeholder="Gradient" />
            </div>
            <Button type="submit">Thêm</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
