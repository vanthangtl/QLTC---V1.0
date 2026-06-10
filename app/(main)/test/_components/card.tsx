import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowDown, Calendar, CircleDollarSign, Eye, Gem, Pen, Trash } from "lucide-react";

export default function TestCard() {
  return (
    <Card className="flex flex-col gap-2 w-[400px]">
      <CardHeader>
        <div className="flex justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <p>08/06/2026</p>
          </div>

          <CardAction className="flex flex-row gap-2">
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Eye className="h-4 w-4" />
            </Button>
            <Button variant="ghost" className="h-8 w-8 p-0 rounded-full">
              <Pen className="h-4 w-4" />
            </Button>
            <Button variant="destructive" className="h-8 w-8 p-0 rounded-full">
              <Trash className="h-4 w-4" />
            </Button>
          </CardAction>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm font-semibold flex items-center gap-2"><Gem className="h-4 w-4" />Vàng nhẫn Bảo Tín Minh Châu</p>
        <p className="text-xs flex items-center gap-2"><CircleDollarSign className="h-4 w-4" />Giá tiền gốc: 500.000 đ/chỉ</p>
        <p className="text-xs flex items-center gap-2"><Layer className="h-4 w-4" />Số lượng: 1 chỉ</p>
        <p className="text-xs">Tổng giá tiền gốc: 500.000 đ</p>
        <p className="text-xs">Tổng giá hiện tại: 450.000 đ</p>
      </CardContent>
      <div className="flex justify-between items-center gap-2 bg-[#FFF0F0] p-2 rounded-md ml-4 mr-4">
        <div className="flex items-center gap-2 text-[#E34848] font-medium text-sm">
          <ArrowDown />
          <p>Lỗ</p>
        </div>
        <p className="text-xs text-[#E34848] font-medium">- 50.000 đ</p>
        <Badge variant="default" className="bg-[#E34848] text-white ">
          -10%
        </Badge>
      </div>
    </Card>
  );
}
