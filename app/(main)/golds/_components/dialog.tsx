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
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "lucide-react";
import { useState, useTransition } from "react";
import { Gold } from "./golds-client";
import { createGoldAction, updateGoldAction, deleteGoldAction, sellGoldAction } from "../actions";

interface AddGoldDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBrands: string[];
}

export function AddGoldDialog({ open, onOpenChange, availableBrands }: AddGoldDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const brand = formData.get("brand") as string;
    const quantity = Number(formData.get("quantity"));
    const price = Number(formData.get("price"));
    const buy_date = formData.get("buy_date") as string;
    const notes = formData.get("notes") as string;

    startTransition(async () => {
      const res = await createGoldAction({
        brand,
        quantity,
        price,
        buy_date,
        notes,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Thêm giao dịch vàng mới</DialogTitle>
          <DialogDescription>
            Nhập thông tin chi tiết về giao dịch vàng của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            {/* Row 1: Loại vàng & Số lượng */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label
                  htmlFor="brand"
                  className="text-sm font-medium mb-2 block"
                >
                  Thương hiệu <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="brand"
                  name="brand"
                  list="brand-options"
                  required
                  placeholder="Chọn hoặc nhập thương hiệu..."
                  className="w-full"
                />
                <datalist id="brand-options">
                  {availableBrands.map(b => (
                    <option key={b} value={b} />
                  ))}
                  {availableBrands.length === 0 && (
                    <>
                      <option value="Vàng nhẫn SJC" />
                      <option value="Vàng miếng SJC" />
                      <option value="Vàng DOJI" />
                      <option value="Vàng PNJ" />
                      <option value="Bảo Tín Minh Châu" />
                    </>
                  )}
                </datalist>
              </div>
              <div>
                <Label
                  htmlFor="quantity"
                  className="text-sm font-medium mb-2 block"
                >
                  Số lượng (chỉ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  placeholder="0"
                  className="w-full"
                />
              </div>
            </div>

            {/* Row 2: Giá tiền gốc & Ngày bắt đầu */}
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label
                  htmlFor="price"
                  className="text-sm font-medium mb-2 block"
                >
                  Đơn giá (đ/chỉ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  placeholder="0"
                  className="w-full"
                />
              </div>
              <div>
                <Label
                  htmlFor="buy_date"
                  className="text-sm font-medium mb-2 block"
                >
                  Ngày mua <span className="text-red-500">*</span>
                </Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="buy_date"
                    name="buy_date"
                    type="date"
                    required
                    defaultValue={new Date().toISOString().split('T')[0]}
                    className="w-full pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Row 3: Ghi chú */}
            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">
                Ghi chú (tùy chọn)
              </Label>
              <Textarea
                id="notes"
                name="notes"
                placeholder="Thêm ghi chú về giao dịch này..."
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang lưu..." : "Lưu giao dịch"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

interface UpdateGoldDialogProps {
  gold: Gold;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  availableBrands: string[];
}

export function UpdateGoldDialog({ gold, open, onOpenChange, availableBrands }: UpdateGoldDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const brand = formData.get("brand") as string;
    const quantity = Number(formData.get("quantity"));
    const price = Number(formData.get("price"));
    const buy_date = formData.get("buy_date") as string;
    const notes = formData.get("notes") as string;

    startTransition(async () => {
      const res = await updateGoldAction(gold.id, {
        brand,
        quantity,
        price,
        buy_date,
        notes,
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
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Cập nhật giao dịch vàng</DialogTitle>
          <DialogDescription>
            Chỉnh sửa thông tin giao dịch vàng của bạn.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="brand" className="text-sm font-medium mb-2 block">Thương hiệu *</Label>
                <Input
                  id="brand"
                  name="brand"
                  list="brand-options-update"
                  required
                  defaultValue={gold.brand}
                  className="w-full"
                />
                <datalist id="brand-options-update">
                  {availableBrands.map(b => (
                    <option key={b} value={b} />
                  ))}
                </datalist>
              </div>
              <div>
                <Label htmlFor="quantity" className="text-sm font-medium mb-2 block">Số lượng (chỉ) *</Label>

                <Input
                  id="quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  required
                  defaultValue={gold.quantity}
                  className="w-full"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="price" className="text-sm font-medium mb-2 block">Đơn giá (đ/chỉ) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  min="0"
                  required
                  defaultValue={gold.price}
                  className="w-full"
                />
              </div>
              <div>
                <Label htmlFor="buy_date" className="text-sm font-medium mb-2 block">Ngày mua *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="buy_date"
                    name="buy_date"
                    type="date"
                    required
                    defaultValue={gold.buy_date}
                    className="w-full pl-10"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes" className="text-sm font-medium">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="notes"
                name="notes"
                defaultValue={gold.notes || ""}
                className="min-h-[100px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="mr-2"
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

interface DeleteGoldDialogProps {
  gold: Gold;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function DeleteGoldDialog({ gold, open, onOpenChange }: DeleteGoldDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleDelete = () => {
    setError(null);
    startTransition(async () => {
      const res = await deleteGoldAction(gold.id);
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
          <DialogTitle>Xóa giao dịch vàng</DialogTitle>
          <DialogDescription>
            Bạn có chắc chắn muốn xóa giao dịch <strong>{gold.quantity} chỉ</strong> với đơn giá <strong>{gold.price.toLocaleString('vi-VN')} đ</strong>? Hành động này không thể hoàn tác.
          </DialogDescription>
        </DialogHeader>

        {error && <div className="text-red-500 text-sm mt-2">{error}</div>}

        <DialogFooter className="mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            disabled={isPending}
            className="mr-2"
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

interface SellGoldDialogProps {
  gold: Gold;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  accounts: { id: string; name: string; balance: number }[];
  currentPrice: number;
}

export function SellGoldDialog({ gold, open, onOpenChange, accounts, currentPrice }: SellGoldDialogProps) {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [quantity, setQuantity] = useState<number>(gold.quantity);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    
    const qty = Number(formData.get("quantity"));
    const accountId = formData.get("accountId") as string;
    const notes = formData.get("notes") as string;

    startTransition(async () => {
      const res = await sellGoldAction(gold.id, {
        quantity: qty,
        accountId,
        sellPrice: currentPrice,
        notes,
      });

      if (res.error) {
        setError(res.error);
      } else {
        onOpenChange(false);
      }
    });
  };

  const estimatedTotal = quantity * currentPrice;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Bán vàng ({gold.brand})</DialogTitle>
          <DialogDescription>
            Nhập thông tin để ghi nhận giao dịch bán vàng.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {error && <div className="text-red-500 text-sm">{error}</div>}
            
            <div className="grid grid-cols-2 gap-4 items-end">
              <div>
                <Label htmlFor="sell_quantity" className="text-sm font-medium mb-2 block">
                  Số lượng bán (chỉ) <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="sell_quantity"
                  name="quantity"
                  type="number"
                  step="0.01"
                  min="0.01"
                  max={gold.quantity}
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(Number(e.target.value))}
                  className="w-full"
                />
                <p className="text-xs text-muted-foreground mt-1">Tối đa: {gold.quantity} chỉ</p>
              </div>
              <div>
                <Label htmlFor="accountId" className="text-sm font-medium mb-2 block">
                  Tài khoản nhận tiền <span className="text-red-500">*</span>
                </Label>
                <select
                  id="accountId"
                  name="accountId"
                  required
                  className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                  defaultValue=""
                >
                  <option value="" disabled>Chọn tài khoản...</option>
                  {accounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.name} - Số dư: {acc.balance.toLocaleString('vi-VN')} đ</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="p-3 bg-muted/20 border rounded-md">
              <div className="flex justify-between items-center text-sm mb-1">
                <span className="text-muted-foreground">Đơn giá bán hiện tại:</span>
                <span className="font-medium">{currentPrice.toLocaleString("vi-VN")} đ/chỉ</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Tổng tiền dự kiến nhận:</span>
                <span className="font-semibold text-green-600 text-base">{estimatedTotal.toLocaleString("vi-VN")} đ</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="sell_notes" className="text-sm font-medium">Ghi chú (tùy chọn)</Label>
              <Textarea
                id="sell_notes"
                name="notes"
                placeholder="Ví dụ: Bán chốt lời, Bán để mua xe..."
                className="min-h-[80px]"
              />
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
              className="mr-2"
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang xử lý..." : "Xác nhận bán"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}