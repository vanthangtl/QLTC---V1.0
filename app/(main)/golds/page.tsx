import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { GoldsClient } from "./_components/golds-client";
import { ManualPriceTable } from "./_components/manual-price-table";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export default async function GoldPage() {
  const supabase = await createClient();

  // Authenticate user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch golds (giao dịch vàng cá nhân)
  const { data: golds, error: goldsError } = await supabase
    .from("golds")
    .select("*")
    .order("buy_date", { ascending: false });

  if (goldsError) {
    console.error("Error fetching golds in GoldPage:", goldsError);
  }

  // Fetch gold_prices (bảng giá vàng)
  const { data: goldPrices, error: pricesError } = await supabase
    .from("gold_prices")
    .select("*")
    .order("updated_at", { ascending: false });

  if (pricesError) {
    console.error("Error fetching gold prices in GoldPage:", pricesError);
  }

  // Fetch accounts for selling
  const { data: accounts, error: accountsError } = await supabase
    .from("accounts")
    .select("id, name, balance")
    .order("name", { ascending: true });

  if (accountsError) {
    console.error("Error fetching accounts in GoldPage:", accountsError);
  }

  return (
    <>
      <div className="flex items-center gap-2 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/dashboard">Tổng quan</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Vàng</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <ManualPriceTable initialPrices={goldPrices || []} />
      
      <GoldsClient 
        initialGolds={golds || []} 
        goldPrices={goldPrices || []} 
        accounts={accounts || []} 
      />
    </>
  );
}
