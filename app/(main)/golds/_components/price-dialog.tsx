"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useState, useTransition } from "react";
import { createGoldPriceAction, updateGoldPriceAction, deleteGoldPriceAction } from "../actions";
import { GoldPrice } from "./manual-price-table";

interface AddPriceDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddPriceDialog({ open, onOpenChange }: AddPriceDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const brand = formData.get("brand") as string;
    const buy_price = Number(formData.get("buy_price"));
    const sell_price = Number(formData.get("sell_price"));

    startTransition(async () => {
      const res = await createGoldPriceAction({
        brand,
        buy_price,
        sell_price,
      });

      if (res.error) {
        setError(res.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm giá vàng</DialogTitle>
          <DialogDescription>
            Nhập thông tin giá mua và giá bán của một loại vàng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">Thương hiệu / Loại vàng <span className="text-red-500">*</span></Label>
              <Input
                id="brand"
                name="brand"
                required
                placeholder="VD: SJC 1L, Vàng nhẫn 9999..."
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buy_price" className="text-sm font-medium">Giá mua vào (VNĐ) <span className="text-red-500">*</span></Label>
                <Input
                  id="buy_price"
                  name="buy_price"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell_price" className="text-sm font-medium">Giá bán ra (VNĐ) <span className="text-red-500">*</span></Label>
                <Input
                  id="sell_price"
                  name="sell_price"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu giá"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface UpdatePriceDialogProps {
  goldPrice: GoldPrice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function UpdatePriceDialog({ goldPrice, open, onOpenChange }: UpdatePriceDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const brand = formData.get("brand") as string;
    const buy_price = Number(formData.get("buy_price"));
    const sell_price = Number(formData.get("sell_price"));

    startTransition(async () => {
      const res = await updateGoldPriceAction(goldPrice.id, {
        brand,
        buy_price,
        sell_price,
      });

      if (res.error) {
        setError(res.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Cập nhật giá vàng</DialogTitle>
          <DialogDescription>
            Sửa thông tin giá mua và giá bán của loại vàng này.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="space-y-2">
              <Label htmlFor="brand" className="text-sm font-medium">Thương hiệu / Loại vàng <span className="text-red-500">*</span></Label>
              <Input
                id="brand"
                name="brand"
                required
                defaultValue={goldPrice.brand}
                className="w-full"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="buy_price" className="text-sm font-medium">Giá mua vào (VNĐ) <span className="text-red-500">*</span></Label>
                <Input
                  id="buy_price"
                  name="buy_price"
                  type="number"
                  min="0"
                  required
                  defaultValue={goldPrice.buy_price}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sell_price" className="text-sm font-medium">Giá bán ra (VNĐ) <span className="text-red-500">*</span></Label>
                <Input
                  id="sell_price"
                  name="sell_price"
                  type="number"
                  min="0"
                  required
                  defaultValue={goldPrice.sell_price}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Cập nhật"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface DeletePriceDialogProps {
  goldPrice: GoldPrice;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeletePriceDialog({ goldPrice, open, onOpenChange }: DeletePriceDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteGoldPriceAction(goldPrice.id);
      if (res.error) {
        setError(res.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Xóa giá vàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa bản ghi giá của <strong>{goldPrice.brand}</strong>? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
          >
            Hủy
          </Button>
          <Button variant="destructive" onClick={handleDelete} disabled={isPending}>
            {isPending ? "Đang xóa..." : "Xóa"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
