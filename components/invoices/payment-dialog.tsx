"use client"

import type React from "react"

import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Loader2, Smartphone } from "lucide-react"
import type { Invoice, Reservation } from "@/lib/types"

interface PaymentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice: Invoice | null
  onSave: (amount: number, method: Reservation["paymentMethod"]) => void
}

export function PaymentDialog({ open, onOpenChange, invoice, onSave }: PaymentDialogProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [amount, setAmount] = useState("")
  const [method, setMethod] = useState<Reservation["paymentMethod"]>("mobile-money")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    await new Promise((resolve) => setTimeout(resolve, 500))
    onSave(Number.parseInt(amount), method)
    setIsLoading(false)
    onOpenChange(false)
    setAmount("")
  }

  if (!invoice) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enregistrer un paiement</DialogTitle>
          <DialogDescription>
            Facture {invoice.id} - Total: {invoice.total.toLocaleString("fr-FR")} FCFA
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="amount">Montant (FCFA)</Label>
              <Input
                id="amount"
                type="number"
                placeholder={invoice.total.toString()}
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                max={invoice.total}
                required
              />
              <p className="text-xs text-muted-foreground">Restant dû: {invoice.total.toLocaleString("fr-FR")} FCFA</p>
            </div>
            <div className="space-y-2">
              <Label htmlFor="method">Mode de paiement</Label>
              <Select value={method} onValueChange={(v: Reservation["paymentMethod"]) => setMethod(v)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="mobile-money">
                    <span className="flex items-center gap-2">
                      <Smartphone className="h-4 w-4" />
                      Mobile Money
                    </span>
                  </SelectItem>
                  <SelectItem value="cash">Espèces</SelectItem>
                  <SelectItem value="card">Carte bancaire</SelectItem>
                  <SelectItem value="transfer">Virement</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Annuler
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Enregistrer
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
