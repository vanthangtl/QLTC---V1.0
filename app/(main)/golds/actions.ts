'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createGoldAction(data: {
  brand: string
  quantity: number
  price: number
  buy_date: string
  notes?: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.brand) {
      return { error: 'Thương hiệu không được để trống.' }
    }
    if (data.quantity <= 0) {
      return { error: 'Số lượng phải lớn hơn 0.' }
    }
    if (data.price < 0) {
      return { error: 'Đơn giá không hợp lệ.' }
    }
    if (!data.buy_date) {
      return { error: 'Ngày mua không được để trống.' }
    }

    const { error } = await supabase
      .from('golds')
      .insert([
        {
          user_id: user.id,
          brand: data.brand,
          quantity: data.quantity,
          price: data.price,
          buy_date: data.buy_date,
          notes: data.notes?.trim() || null,
        },
      ])

    if (error) {
      console.error('Error creating gold record:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in createGoldAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function updateGoldAction(
  id: string,
  data: {
    brand: string
    quantity: number
    price: number
    buy_date: string
    notes?: string
  }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.brand) {
      return { error: 'Thương hiệu không được để trống.' }
    }
    if (data.quantity <= 0) {
      return { error: 'Số lượng phải lớn hơn 0.' }
    }
    if (data.price < 0) {
      return { error: 'Đơn giá không hợp lệ.' }
    }
    if (!data.buy_date) {
      return { error: 'Ngày mua không được để trống.' }
    }

    const { error } = await supabase
      .from('golds')
      .update({
        brand: data.brand,
        quantity: data.quantity,
        price: data.price,
        buy_date: data.buy_date,
        notes: data.notes?.trim() || null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating gold record:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in updateGoldAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function deleteGoldAction(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    const { error } = await supabase
      .from('golds')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting gold record:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in deleteGoldAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function sellGoldAction(
  id: string,
  data: {
    quantity: number
    accountId: string
    sellPrice: number
    notes?: string
  }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (data.quantity <= 0) {
      return { error: 'Số lượng bán phải lớn hơn 0.' }
    }
    if (!data.accountId) {
      return { error: 'Vui lòng chọn tài khoản nhận tiền.' }
    }

    // 1. Get current gold info
    const { data: gold, error: fetchGoldError } = await supabase
      .from('golds')
      .select('*')
      .eq('id', id)
      .eq('user_id', user.id)
      .single()

    if (fetchGoldError || !gold) {
      return { error: 'Không tìm thấy thông tin giao dịch vàng.' }
    }

    if (data.quantity > gold.quantity) {
      return { error: 'Số lượng bán không được vượt quá số lượng hiện có.' }
    }

    // 2. Get account info
    const { data: account, error: fetchAccountError } = await supabase
      .from('accounts')
      .select('*')
      .eq('id', data.accountId)
      .eq('user_id', user.id)
      .single()

    if (fetchAccountError || !account) {
      return { error: 'Không tìm thấy tài khoản nhận tiền.' }
    }

    const totalMoney = data.quantity * data.sellPrice
    const newQuantity = gold.quantity - data.quantity

    // 3. Update gold quantity
    if (newQuantity === 0) {
      const { error: deleteError } = await supabase.from('golds').delete().eq('id', id).eq('user_id', user.id)
      if (deleteError) {
        console.error('Error deleting gold:', deleteError)
        return { error: 'Không thể xóa giao dịch vàng.' }
      }
    } else {
      const { error: updateGoldError } = await supabase.from('golds').update({ quantity: newQuantity, updated_at: new Date().toISOString() }).eq('id', id).eq('user_id', user.id)
      if (updateGoldError) {
        console.error('Error updating gold:', updateGoldError)
        return { error: 'Không thể cập nhật số lượng vàng.' }
      }
    }

    // 4. Update account balance
    const { error: updateAccountError } = await supabase.from('accounts').update({ balance: account.balance + totalMoney }).eq('id', data.accountId).eq('user_id', user.id)
    if (updateAccountError) {
      console.error('Error updating account balance:', updateAccountError)
      return { error: 'Không thể cập nhật số dư tài khoản.' }
    }

    revalidatePath('/gold')
    revalidatePath('/accounts')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in sellGoldAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

// ----------------------------------------------------------------------
// GOLD PRICES ACTIONS (Bảng giá tự nhập)
// ----------------------------------------------------------------------

export async function createGoldPriceAction(data: {
  brand: string
  buy_price: number
  sell_price: number
}) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.brand) {
      return { error: 'Thương hiệu không được để trống.' }
    }

    const { error } = await supabase
      .from('gold_prices')
      .insert([
        {
          user_id: user.id,
          brand: data.brand,
          buy_price: data.buy_price,
          sell_price: data.sell_price,
        },
      ])

    if (error) {
      console.error('Error creating gold price:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in createGoldPriceAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function updateGoldPriceAction(
  id: string,
  data: {
    brand: string
    buy_price: number
    sell_price: number
  }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.brand) {
      return { error: 'Thương hiệu không được để trống.' }
    }

    const { error } = await supabase
      .from('gold_prices')
      .update({
        brand: data.brand,
        buy_price: data.buy_price,
        sell_price: data.sell_price,
        updated_at: new Date().toISOString(),
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating gold price:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in updateGoldPriceAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function deleteGoldPriceAction(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    const { error } = await supabase
      .from('gold_prices')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting gold price:', error)
      return { error: error.message }
    }

    revalidatePath('/gold')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in deleteGoldPriceAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}
