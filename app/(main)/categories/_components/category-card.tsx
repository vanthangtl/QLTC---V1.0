import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon, Utensils } from "lucide-react";

interface CategoryCardProps {
  title: string;
  spent: number;
  budget?: number; // budget có thể không có
  icon: LucideIcon;
  gradientClass?: string;
}

export default function CategoryCard({
  title,
  spent,
  budget = 0,
  icon: Icon,
  gradientClass = "bg-gradient-to-r from-amber-500 to-amber-700",
}: CategoryCardProps) {
  // Kiểm tra nếu chưa thiết lập ngân sách
  const isBudgetSet = budget > 0;
  const percentage = isBudgetSet
    ? Math.min(Math.round((spent / budget) * 100), 100)
    : 0;

  return (
    <Card className="w-full min-w-80">
      <CardContent className="flex items-center gap-4">
        <div className="flex items-center gap-2 bg-primary rounded-lg p-2 text-primary-foreground">
          <Icon className="h-6 w-6" />
        </div>
        <div className="flex flex-col w-full gap-1">
          <div className="flex items-center justify-between w-full">
            <p className="font-bold text-lg">{title}</p>
            <p className="font-medium text-sm text-muted-foreground">
              {isBudgetSet
                ? `${spent}M / ${budget}M (${percentage}%)`
                : "Chưa thiết lập ngân sách"}
            </p>
          </div>

          {/* Thanh tiến độ */}
          <div className="w-full h-2 bg-muted rounded-full overflow-hidden">
            <div
              className={`h-full shadow-lg  ${isBudgetSet ? gradientClass : "bg-muted"} rounded-full transition-all duration-500`}
              style={{ width: isBudgetSet ? `${percentage}%` : "0%" }}
            ></div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
