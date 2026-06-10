import { Button } from "@/components/ui/button";
import CategoryCard from "./_components/category-card";
import { Utensils } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AddCategoryDialog } from "./_components/category_dialog";

export default function CategoriesPage() {
  return (
    <div className="space-y-4 flex flex-col w-full">
      <div className="flex items-center justify-between w-full">
        <div>
          <h1 className="text-2xl font-bold">Danh sách danh mục</h1>
          <p className="text-muted-foreground text-sm">
            Quản lý danh mục và thiết lập ngân sách
          </p>
        </div>
        <div className="flex items-center gap-2">
          <AddCategoryDialog />
          <Button>Thiết lập ngân sách</Button>
        </div>
      </div>

      <Tabs defaultValue="expenses" className="flex flex-col w-full">
        <TabsList className="flex items-center justify-start">
          <TabsTrigger value="expenses">Chi tiêu</TabsTrigger>
          <TabsTrigger value="income">Thu nhập</TabsTrigger>
        </TabsList>

        {/* Chi tiêu */}
        <TabsContent value="expenses" className="flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <CategoryCard
              title="Ăn uống"
              spent={8}
              budget={10}
              icon={Utensils}
              gradientClass="bg-gradient-to-r from-blue-500 to-blue-300"
            />
            <CategoryCard
              title="Ăn uống"
              spent={6}
              budget={8}
              icon={Utensils}
              gradientClass="bg-gradient-to-r from-amber-500 to-amber-700"
            />
            <CategoryCard
              title="Ăn uống"
              spent={1}
              budget={8}
              icon={Utensils}
              gradientClass="bg-amber-800"
            />
            <CategoryCard
              title="Ăn uống"
              spent={3}
              budget={8}
              icon={Utensils}
              gradientClass="bg-amber-800"
            />
          </div>
        </TabsContent>

        {/* Thu nhập */}
        <TabsContent value="income" className="flex flex-col w-full">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            <CategoryCard
              title="Tiền lương"
              spent={0}
              budget={0}
              icon={Utensils}
              gradientClass="bg-gradient-to-r from-amber-500 to-amber-700"
            />
            <CategoryCard
              title="Tiền lương"
              spent={6}
              budget={8}
              icon={Utensils}
              gradientClass="bg-gradient-to-r from-amber-500 to-amber-700"
            />
            <CategoryCard
              title="Tiền lương"
              spent={1}
              budget={8}
              icon={Utensils}
              gradientClass="bg-amber-800"
            />
            <CategoryCard
              title="Tiền lương"
              spent={3}
              budget={8}
              icon={Utensils}
              gradientClass="bg-amber-800"
            />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
