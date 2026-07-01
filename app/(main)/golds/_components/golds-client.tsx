"use client"

import React, { useState } from "react"
import { GoldInfoCard, GoldInfoTotalCard } from "./card"
import { AddGoldDialog, UpdateGoldDialog, DeleteGoldDialog, SellGoldDialog } from "./dialog"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { GoldPrice } from "./manual-price-table"

export interface Gold {
  id: string
  user_id: string
  brand: string
  quantity: number
  price: number
  buy_date: string
  notes: string | null
  created_at: string
}

interface GoldsClientProps {
  initialGolds: Gold[]
  goldPrices: GoldPrice[]
  accounts: { id: string; name: string; balance: number }[]
}

export function GoldsClient({ initialGolds, goldPrices, accounts }: GoldsClientProps) {
  const [isAddOpen, setIsAddOpen] = useState(false)
  const [editingGold, setEditingGold] = useState<Gold | null>(null)
  const [deletingGold, setDeletingGold] = useState<Gold | null>(null)
  const [sellingGold, setSellingGold] = useState<Gold | null>(null)

  // Hàm tính giá trị vàng hiện tại dựa trên bảng giá (lấy giá bán ra)
  const getCurrentGoldPrice = (brand: string) => {
    // Tìm trong bảng goldPrices xem có thương hiệu nào khớp (không phân biệt hoa thường)
    const matchedPrice = goldPrices.find(p => p.brand.toLowerCase() === brand.toLowerCase())
    if (matchedPrice) {
      return matchedPrice.sell_price; // Giá hiện tại = Giá bán ra
    }
    // Nếu không tìm thấy trong bảng giá, trả về giá mua ban đầu coi như chưa biến động
    const defaultPrice = initialGolds.find(g => g.brand === brand)?.price || 0;
    return defaultPrice;
  }

  // Tính toán tổng quan
  const tong_tien_goc = initialGolds.reduce((sum, g) => sum + (g.price * g.quantity), 0)
  const gia_tri_hien_tai = initialGolds.reduce((sum, g) => sum + (getCurrentGoldPrice(g.brand) * g.quantity), 0)
  const tong_so_luong = initialGolds.reduce((sum, g) => sum + Number(g.quantity), 0)
  const tich_luy = initialGolds.length
  
  const tien_lai_lo = gia_tri_hien_tai - tong_tien_goc
  const is_profit = tien_lai_lo >= 0
  const phan_tram_lai_lo = tong_tien_goc > 0 ? (tien_lai_lo / tong_tien_goc) * 100 : 0

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-xl font-semibold">Giao dịch của bạn</h1>
        <Button onClick={() => setIsAddOpen(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Thêm giao dịch vàng
        </Button>
      </div>

      <GoldInfoTotalCard 
        tong_tien_goc={tong_tien_goc}
        gia_tri_hien_tai={gia_tri_hien_tai}
        tong_so_luong={tong_so_luong}
        tich_luy={tich_luy}
        phan_tram_lai_lo={phan_tram_lai_lo}
        tien_lai_lo={tien_lai_lo}
        is_profit={is_profit}
      />

      {initialGolds.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4 border border-dashed rounded-xl bg-muted/20 mt-4">
          <p className="text-muted-foreground text-sm mb-2">Bạn chưa có giao dịch vàng nào.</p>
          <Button variant="outline" size="sm" onClick={() => setIsAddOpen(true)}>
            Thêm giao dịch đầu tiên
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 w-full gap-4 items-stretch mt-4">
          {initialGolds.map((gold) => (
            <GoldInfoCard
              key={gold.id}
              id={gold.id}
              gia_tien_goc={gold.price}
              so_luong={gold.quantity}
              gia_tien_hien_tai={getCurrentGoldPrice(gold.brand)}
              loai_vang={gold.brand}
              ngay_bat_dau={gold.buy_date}
              notes={gold.notes}
              onSell={() => setSellingGold(gold)}
              onEdit={() => setEditingGold(gold)}
              onDelete={() => setDeletingGold(gold)}
            />
          ))}
        </div>
      )}

      <AddGoldDialog 
        open={isAddOpen} 
        onOpenChange={setIsAddOpen} 
        availableBrands={goldPrices.map(p => p.brand)}
      />
      
      {editingGold && (
        <UpdateGoldDialog
          gold={editingGold}
          open={!!editingGold}
          onOpenChange={(open) => !open && setEditingGold(null)}
          availableBrands={goldPrices.map(p => p.brand)}
        />
      )}

      {deletingGold && (
        <DeleteGoldDialog
          gold={deletingGold}
          open={!!deletingGold}
          onOpenChange={(open) => !open && setDeletingGold(null)}
        />
      )}

      {sellingGold && (
        <SellGoldDialog
          gold={sellingGold}
          open={!!sellingGold}
          onOpenChange={(open) => !open && setSellingGold(null)}
          accounts={accounts}
          currentPrice={getCurrentGoldPrice(sellingGold.brand)}
        />
      )}
    </div>
  )
}
