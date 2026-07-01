"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, Pen, Trash, Clock } from "lucide-react";
import { AddPriceDialog, UpdatePriceDialog, DeletePriceDialog } from "./price-dialog";

export interface GoldPrice {
  id: string;
  user_id: string;
  brand: string;
  buy_price: number;
  sell_price: number;
  updated_at: string;
}

interface ManualPriceTableProps {
  initialPrices: GoldPrice[];
}

export function ManualPriceTable({ initialPrices }: ManualPriceTableProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingPrice, setEditingPrice] = useState<GoldPrice | null>(null);
  const [deletingPrice, setDeletingPrice] = useState<GoldPrice | null>(null);

  return (
    <Card className="mb-6 border-amber-200 bg-amber-50/10 shadow-sm">
      <CardHeader className="pb-3 border-b flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <CardTitle className="text-lg font-semibold text-amber-800">
            Bảng Giá Vàng (Tự cập nhật)
          </CardTitle>
          <p className="text-sm text-muted-foreground mt-1">
            Nhập giá thị trường để hệ thống tự động tính toán Lãi/Lỗ.
          </p>
        </div>
        <Button onClick={() => setIsAddOpen(true)} size="sm" className="bg-amber-600 hover:bg-amber-700 text-white">
          <Plus className="h-4 w-4 mr-2" /> Thêm giá mới
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground bg-muted/50 uppercase">
              <tr>
                <th className="px-4 py-3 font-medium">Thương hiệu / Loại vàng</th>
                <th className="px-4 py-3 font-medium text-right">Mua vào (đ)</th>
                <th className="px-4 py-3 font-medium text-right">Bán ra (đ)</th>
                <th className="px-4 py-3 font-medium text-center">Cập nhật</th>
                <th className="px-4 py-3 font-medium text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {initialPrices.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-4 py-8 text-center text-muted-foreground">
                    Chưa có dữ liệu giá vàng nào. Hãy thêm giá mới.
                  </td>
                </tr>
              ) : (
                initialPrices.map((item) => (
                  <tr key={item.id} className="border-b last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="px-4 py-3 font-semibold text-amber-900">
                      {item.brand}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-muted-foreground">
                      {item.buy_price.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-right font-medium text-green-700">
                      {item.sell_price.toLocaleString("vi-VN")}
                    </td>
                    <td className="px-4 py-3 text-center text-xs text-muted-foreground">
                      <div className="flex items-center justify-center gap-1">
                        <Clock className="h-3 w-3" />
                        {new Date(item.updated_at).toLocaleDateString("vi-VN")} {new Date(item.updated_at).toLocaleTimeString("vi-VN", {hour: '2-digit', minute:'2-digit'})}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex justify-end gap-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setEditingPrice(item)}>
                          <Pen className="h-4 w-4 text-blue-600" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setDeletingPrice(item)}>
                          <Trash className="h-4 w-4 text-red-600" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardContent>

      <AddPriceDialog open={isAddOpen} onOpenChange={setIsAddOpen} />
      
      {editingPrice && (
        <UpdatePriceDialog
          goldPrice={editingPrice}
          open={!!editingPrice}
          onOpenChange={(open) => !open && setEditingPrice(null)}
        />
      )}

      {deletingPrice && (
        <DeletePriceDialog
          goldPrice={deletingPrice}
          open={!!deletingPrice}
          onOpenChange={(open) => !open && setDeletingPrice(null)}
        />
      )}
    </Card>
  );
}
