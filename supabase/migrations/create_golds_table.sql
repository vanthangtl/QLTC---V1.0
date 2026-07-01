-- Bảng dữ liệu Vàng
CREATE TABLE IF NOT EXISTS golds (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  brand TEXT NOT NULL,
  quantity NUMERIC NOT NULL,
  price NUMERIC NOT NULL,
  buy_date DATE NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Bật tính năng Row Level Security (RLS) để đảm bảo dữ liệu của ai người đó dùng
ALTER TABLE golds ENABLE ROW LEVEL SECURITY;

-- Chính sách: Người dùng chỉ được SELECT, INSERT, UPDATE, DELETE dữ liệu của chính mình
CREATE POLICY "Users can manage their own golds" ON golds 
FOR ALL USING (auth.uid() = user_id);
