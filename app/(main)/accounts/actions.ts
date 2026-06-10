'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function createAccountAction(data: {
  name: string
  accountNumber?: string
  owner: string
  balance: number
  type: string
}) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.name.trim()) {
      return { error: 'Tên hiển thị không được để trống.' }
    }
    if (!data.owner.trim()) {
      return { error: 'Chủ tài khoản không được để trống.' }
    }
    if (!data.type) {
      return { error: 'Vui lòng chọn loại tài khoản.' }
    }

    const { error } = await supabase
      .from('accounts')
      .insert([
        {
          user_id: user.id,
          name: data.name.trim(),
          account_number: data.accountNumber?.trim() || null,
          owner: data.owner.trim().toUpperCase(),
          balance: data.balance,
          type: data.type,
        },
      ])

    if (error) {
      console.error('Error creating account:', error)
      return { error: error.message }
    }

    revalidatePath('/accounts')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in createAccountAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function updateAccountAction(
  id: string,
  data: {
    name: string
    accountNumber?: string
    owner: string
    balance: number
    type: string
  }
) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    if (!data.name.trim()) {
      return { error: 'Tên hiển thị không được để trống.' }
    }
    if (!data.owner.trim()) {
      return { error: 'Chủ tài khoản không được để trống.' }
    }
    if (!data.type) {
      return { error: 'Vui lòng chọn loại tài khoản.' }
    }

    const { error } = await supabase
      .from('accounts')
      .update({
        name: data.name.trim(),
        account_number: data.accountNumber?.trim() || null,
        owner: data.owner.trim().toUpperCase(),
        balance: data.balance,
        type: data.type,
      })
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error updating account:', error)
      return { error: error.message }
    }

    revalidatePath('/accounts')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in updateAccountAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}

export async function deleteAccountAction(id: string) {
  try {
    const supabase = await createClient()
    const { data: { user }, error: authError } = await supabase.auth.getUser()

    if (authError || !user) {
      return { error: 'Bạn phải đăng nhập để thực hiện tác vụ này.' }
    }

    const { error } = await supabase
      .from('accounts')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    if (error) {
      console.error('Error deleting account:', error)
      return { error: error.message }
    }

    revalidatePath('/accounts')
    return { success: true }
  } catch (err: any) {
    console.error('Unhandled error in deleteAccountAction:', err)
    return { error: 'Đã xảy ra lỗi ngoài ý muốn.' }
  }
}
