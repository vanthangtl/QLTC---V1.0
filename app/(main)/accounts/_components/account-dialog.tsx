"use client"

import React, { useState, useEffect, useTransition } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { createAccountAction, updateAccountAction, deleteAccountAction } from "../actions"
import { Account, AccountType } from "./accounts-client"
import { Loader2 } from "lucide-react"

// Formatting helpers
const formatNumber = (value: string) => {
  const numericValue = value.replace(/\D/g, "")
  return numericValue.replace(/\B(?=(\d{3})+(?!\d))/g, ".")
}

const formatName = (value: string) => {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
}

interface AddAccountDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function AddAccountDialog({ open, onOpenChange }: AddAccountDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    owner: "",
    balance: "",
    type: "BANK" as AccountType,
  })

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (open) {
      setFormData({
        name: "",
        accountNumber: "",
        owner: "",
        balance: "0",
        type: "BANK",
      })
      setError(null)
    }
  }, [open])

  const handleChange = (id: string, value: string) => {
    let formattedValue = value

    if (id === "owner") formattedValue = formatName(value)
    if (id === "balance") formattedValue = formatNumber(value)

    setFormData((prev) => ({ ...prev, [id]: formattedValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError("Tên hiển thị không được để trống.")
      return
    }
    if (!formData.owner.trim()) {
      setError("Chủ tài khoản không được để trống.")
      return
    }

    const numericBalance = Number(formData.balance.replace(/\./g, ""))

    startTransition(async () => {
      const result = await createAccountAction({
        name: formData.name,
        accountNumber: formData.accountNumber,
        owner: formData.owner,
        balance: numericBalance,
        type: formData.type,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Thêm tài khoản</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* Loại tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Loại tài khoản
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={isPending}
              >
                <SelectTrigger id="type" className="h-9">
                  <SelectValue placeholder="Chọn loại tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK">Ngân hàng</SelectItem>
                  <SelectItem value="WALLET">Ví điện tử</SelectItem>
                  <SelectItem value="CASH">Tiền mặt</SelectItem>
                  <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                  <SelectItem value="DEBT">Nợ</SelectItem>
                  <SelectItem value="INVESTMENT">Đầu tư</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tên hiển thị */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên hiển thị <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                className="h-9"
                placeholder="Ví dụ: TPBank cá nhân, Ví Momo"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Số tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="accountNumber" className="text-sm font-medium">
                Số tài khoản / Số thẻ
              </Label>
              <Input
                id="accountNumber"
                className="h-9"
                placeholder="Ví dụ: 0123456789"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Chủ tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="owner" className="text-sm font-medium">
                Chủ tài khoản <span className="text-destructive">*</span>
              </Label>
              <Input
                id="owner"
                className="h-9"
                placeholder="NGUYEN VAN A"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Số dư ban đầu */}
            <div className="grid gap-2">
              <Label htmlFor="balance" className="text-sm font-medium">
                Số dư ban đầu (VND)
              </Label>
              <Input
                id="balance"
                className="h-9 font-mono"
                value={formData.balance}
                onChange={(e) => handleChange("balance", e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Thêm mới
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface UpdateAccountDialogProps {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function UpdateAccountDialog({ account, open, onOpenChange }: UpdateAccountDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  
  const [formData, setFormData] = useState({
    name: "",
    accountNumber: "",
    owner: "",
    balance: "",
    type: "BANK" as AccountType,
  })

  // Populates edit form with passed account values
  useEffect(() => {
    if (open && account) {
      setFormData({
        name: account.name,
        accountNumber: account.account_number || "",
        owner: account.owner,
        balance: formatNumber(String(account.balance)),
        type: account.type,
      })
      setError(null)
    }
  }, [account, open])

  const handleChange = (id: string, value: string) => {
    let formattedValue = value

    if (id === "owner") formattedValue = formatName(value)
    if (id === "balance") formattedValue = formatNumber(value)

    setFormData((prev) => ({ ...prev, [id]: formattedValue }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!formData.name.trim()) {
      setError("Tên hiển thị không được để trống.")
      return
    }
    if (!formData.owner.trim()) {
      setError("Chủ tài khoản không được để trống.")
      return
    }

    const numericBalance = Number(formData.balance.replace(/\./g, ""))

    startTransition(async () => {
      const result = await updateAccountAction(account.id, {
        name: formData.name,
        accountNumber: formData.accountNumber,
        owner: formData.owner,
        balance: numericBalance,
        type: formData.type,
      })

      if (result?.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Cập nhật tài khoản</DialogTitle>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            {error && (
              <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md border border-destructive/20">
                {error}
              </div>
            )}

            {/* Loại tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="type" className="text-sm font-medium">
                Loại tài khoản
              </Label>
              <Select
                value={formData.type}
                onValueChange={(value) => handleChange("type", value)}
                disabled={isPending}
              >
                <SelectTrigger id="type" className="h-9">
                  <SelectValue placeholder="Chọn loại tài khoản" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BANK">Ngân hàng</SelectItem>
                  <SelectItem value="WALLET">Ví điện tử</SelectItem>
                  <SelectItem value="CASH">Tiền mặt</SelectItem>
                  <SelectItem value="CREDIT_CARD">Thẻ tín dụng</SelectItem>
                  <SelectItem value="DEBT">Nợ</SelectItem>
                  <SelectItem value="INVESTMENT">Đầu tư</SelectItem>
                  <SelectItem value="OTHER">Khác</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tên hiển thị */}
            <div className="grid gap-2">
              <Label htmlFor="name" className="text-sm font-medium">
                Tên hiển thị <span className="text-destructive">*</span>
              </Label>
              <Input
                id="name"
                className="h-9"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Số tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="accountNumber" className="text-sm font-medium">
                Số tài khoản / Số thẻ
              </Label>
              <Input
                id="accountNumber"
                className="h-9"
                value={formData.accountNumber}
                onChange={(e) => handleChange("accountNumber", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Chủ tài khoản */}
            <div className="grid gap-2">
              <Label htmlFor="owner" className="text-sm font-medium">
                Chủ tài khoản <span className="text-destructive">*</span>
              </Label>
              <Input
                id="owner"
                className="h-9"
                value={formData.owner}
                onChange={(e) => handleChange("owner", e.target.value)}
                disabled={isPending}
              />
            </div>

            {/* Số dư */}
            <div className="grid gap-2">
              <Label htmlFor="balance" className="text-sm font-medium">
                Số dư (VND)
              </Label>
              <Input
                id="balance"
                className="h-9 font-mono"
                value={formData.balance}
                onChange={(e) => handleChange("balance", e.target.value)}
                disabled={isPending}
              />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline" disabled={isPending}>
                Hủy
              </Button>
            </DialogClose>
            <Button type="submit" disabled={isPending}>
              {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Lưu thay đổi
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

interface DeleteAccountDialogProps {
  account: Account
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteAccountDialog({ account, open, onOpenChange }: DeleteAccountDialogProps) {
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (open) {
      setError(null)
    }
  }, [open])

  const handleDelete = () => {
    setError(null)
    startTransition(async () => {
      const result = await deleteAccountAction(account.id)
      if (result?.error) {
        setError(result.error)
      } else {
        onOpenChange(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Xóa tài khoản</DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {error && (
            <div className="p-3 text-sm bg-destructive/15 text-destructive rounded-md border border-destructive/20">
              {error}
            </div>
          )}
          <p className="text-sm text-muted-foreground leading-relaxed">
            Bạn có chắc chắn muốn xóa tài khoản <strong className="text-foreground">{account.name}</strong> thuộc sở hữu của <strong className="text-foreground">{account.owner}</strong> không? Hành động này không thể hoàn tác và tất cả các giao dịch liên quan sẽ bị ảnh hưởng.
          </p>
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              Hủy
            </Button>
          </DialogClose>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Xóa tài khoản
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
