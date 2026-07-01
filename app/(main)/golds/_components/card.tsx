import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardHeader,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  BanknoteArrowUp,
  Banknote,
  Landmark,
  Boxes,
  Calendar,
  CircleDollarSign,
  Eye,
  Gem,
  Pen,
  Trash,
  TrendingDown,
  TrendingUp,
  PiggyBank,
  HandCoins,
} from "lucide-react";

interface GoldInfoCardProps {
  id: string;
  gia_tien_goc: number;
  so_luong: number;
  gia_tien_hien_tai: number;
  loai_vang: string;
  ngay_bat_dau: string;
  notes?: string | null;
  onSell?: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

export function GoldInfoCard({
  id,
  gia_tien_goc,
  so_luong,
  gia_tien_hien_tai,
  loai_vang,
  ngay_bat_dau,
  notes,
  onSell,
  onEdit,
  onDelete,
}: GoldInfoCardProps) {
  // 1. Tính toán giá trị trước
  const tongGoc = gia_tien_goc * so_luong;
  const tongHienTai = gia_tien_hien_tai * so_luong;
  const chenhLech = tongHienTai - tongGoc;

  // 2. Xác định trạng thái
  const isProfit = chenhLech >= 0;

  // 3. Xử lý chia cho 0 an toàn
  const phanTram = tongGoc !== 0 ? (chenhLech / tongGoc) * 100 : 0;

  // 4. Định nghĩa style dựa trên trạng thái
  const colorClass = isProfit ? "text-green-600" : "text-red-600";
  const bgClass = isProfit ? "bg-green-50" : "bg-red-50";
  const badgeClass = isProfit ? "bg-green-500" : "bg-red-500";

  return (
    <Card className="flex flex-col gap-2 relative">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <p className="text-sm">{new Date(ngay_bat_dau).toLocaleDateString('vi-VN')}</p>
          </div>
          <CardAction className="flex flex-row gap-2">
            {onSell && (
              <Button variant="ghost" className="h-8 w-8 p-0 rounded-full text-blue-600 hover:text-blue-700 hover:bg-blue-50" onClick={onSell}>
                <HandCoins className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full" onClick={onEdit}>
              <Pen className="h-4 w-4" />
            </Button>
            <Button variant="destructive" className="h-8 w-8 p-0 rounded-full" onClick={onDelete}>
              <Trash className="h-4 w-4" />
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent className="space-y-2 flex-grow">
        <div className="text-sm font-semibold flex items-center gap-2">
          <Gem className="h-4 w-4" /> {loai_vang}
        </div>

        {/* Helper để hiển thị các hàng thông tin */}
        <InfoRow
          icon={<CircleDollarSign className="h-4 w-4" />}
          label="Giá tiền gốc:"
          value={`${gia_tien_goc.toLocaleString("vi-VN")} đ/chỉ`}
        />
        <InfoRow
          icon={<Boxes className="h-4 w-4" />}
          label="Số lượng:"
          value={`${so_luong} chỉ`}
        />
        <InfoRow
          icon={<BanknoteArrowUp className="h-4 w-4" />}
          label="Tổng giá gốc:"
          value={`${tongGoc.toLocaleString("vi-VN")} đ`}
        />
        <InfoRow
          icon={<Banknote className="h-4 w-4" />}
          label="Tổng hiện tại:"
          value={`${tongHienTai.toLocaleString("vi-VN")} đ`}
        />
        
        {notes && (
          <p className="text-xs text-muted-foreground mt-2 italic">"{notes}"</p>
        )}
      </CardContent>

      <div
        className={`flex justify-between items-center gap-2 p-2 rounded-md mx-4 mb-4 ${bgClass} ${colorClass}`}
      >
        <div className="flex items-center gap-2 font-medium text-sm">
          {isProfit ? (
            <TrendingUp className="h-4 w-4" />
          ) : (
            <TrendingDown className="h-4 w-4" />
          )}
          <p>{isProfit ? "Lãi" : "Lỗ"}</p>
        </div>

        <p className="text-xs font-medium">
          {Math.abs(chenhLech).toLocaleString("vi-VN")} đ
        </p>

        <Badge className={`${badgeClass} text-white`}>
          {phanTram.toFixed(2)}%
        </Badge>
      </div>
    </Card>
  );
}

// Sub-component nhỏ để code gọn hơn
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="text-xs flex items-center gap-2">
      {icon}
      <p className="text-muted-foreground">{label}</p>
      <span className="font-medium">{value}</span>
    </div>
  );
}

interface GoldInfoTotalCardProps {
  tong_tien_goc: number;
  gia_tri_hien_tai: number;
  tong_so_luong: number;
  tich_luy: number;
  phan_tram_lai_lo: number;
  tien_lai_lo: number;
  is_profit: boolean;
}

export function GoldInfoTotalCard({
  tong_tien_goc,
  gia_tri_hien_tai,
  tong_so_luong,
  tich_luy,
  phan_tram_lai_lo,
  tien_lai_lo,
  is_profit,
}: GoldInfoTotalCardProps) {
  const tb_goc_chi = tong_so_luong > 0 ? tong_tien_goc / tong_so_luong : 0;
  const tb_hien_tai_chi = tong_so_luong > 0 ? gia_tri_hien_tai / tong_so_luong : 0;

  return (
    <Card>
      <CardHeader>
        <p className="font-semibold text-lg">Tổng quan đầu tư vàng</p>
      </CardHeader>
      <CardContent className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <div className="border rounded-md p-3 bg-muted/20">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <PiggyBank className="h-4 w-4" />
            Tổng tiền gốc
          </div>
          <p className="text-lg font-semibold text-center mb-1">{tong_tien_goc.toLocaleString("vi-VN")} đ</p>
          <p className="text-xs text-muted-foreground text-center">
            TB/chỉ: {tb_goc_chi.toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="border rounded-md p-3 bg-muted/20">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Landmark className="h-4 w-4" />
            Giá trị hiện tại
          </div>
          <p className="text-lg font-semibold text-center mb-1">{gia_tri_hien_tai.toLocaleString("vi-VN")} đ</p>
          <p className="text-xs text-muted-foreground text-center">
            TB/chỉ: {tb_hien_tai_chi.toLocaleString("vi-VN")} đ
          </p>
        </div>
        <div className="border rounded-md p-3 bg-muted/20">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Boxes className="h-4 w-4" />
            Tổng số lượng
          </div>
          <p className="text-lg font-semibold text-center flex-grow flex items-center justify-center h-full pb-4">{tong_so_luong} chỉ</p>
        </div>
        <div className="border rounded-md p-3 bg-muted/20">
          <div className="flex items-center gap-2 mb-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            Số lần tích lũy
          </div>
          <p className="text-lg font-semibold text-center flex-grow flex items-center justify-center h-full pb-4">{tich_luy} lần</p>
        </div>
        <div className={`border rounded-md p-3 ${is_profit ? 'bg-green-50/50 border-green-200' : 'bg-red-50/50 border-red-200'}`}>
          <div className="flex items-center justify-between mb-2">
            <div className={`flex items-center gap-2 text-sm ${is_profit ? 'text-green-700' : 'text-red-700'}`}>
              {is_profit ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
              Lãi/Lỗ
            </div>
            <Badge className={is_profit ? "bg-green-500 text-white" : "bg-red-500 text-white"}>
              {phan_tram_lai_lo.toFixed(2)}%
            </Badge>
          </div>
          <p className={`text-lg font-semibold text-center flex-grow flex items-center justify-center h-full pb-4 ${is_profit ? 'text-green-700' : 'text-red-700'}`}>
            {Math.abs(tien_lai_lo).toLocaleString("vi-VN")} đ
          </p>
        </div>
      </CardContent>
    </Card>
  );
}