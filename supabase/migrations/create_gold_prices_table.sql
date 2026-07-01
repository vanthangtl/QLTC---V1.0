-- Bảng dữ liệu Giá Vàng (Tự nhập tay)
CREATE TABLE IF NOT EXISTS gold_prices (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand TEXT NOT NULL,
  buy_price NUMERIC NOT NULL,
  sell_price NUMERIC NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật tính năng Row Level Security (RLS)
ALTER TABLE gold_prices ENABLE ROW LEVEL SECURITY;

-- Chính sách: Người dùng chỉ được SELECT, INSERT, UPDATE, DELETE dữ liệu của chính mình
CREATE POLICY "Users can manage their own gold prices" ON gold_prices 
FOR ALL USING (auth.uid() = user_id);
