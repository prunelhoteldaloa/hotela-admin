"use client"

import { useState } from "react"
import { Search, Download, CheckCircle, XCircle, Clock, RotateCcw } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { saasPayments } from "@/lib/mock-admin-data"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " F"
}

export default function AdminPaymentsPage() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")

  const filteredPayments = saasPayments.filter((payment) => {
    const matchesSearch =
      payment.hotelName.toLowerCase().includes(search.toLowerCase()) ||
      payment.description.toLowerCase().includes(search.toLowerCase())
    const matchesStatus = statusFilter === "all" || payment.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalSucceeded = saasPayments.filter((p) => p.status === "succeeded").reduce((sum, p) => sum + p.amount, 0)

  const totalFailed = saasPayments.filter((p) => p.status === "failed").reduce((sum, p) => sum + p.amount, 0)

  const stats = {
    succeeded: saasPayments.filter((p) => p.status === "succeeded").length,
    pending: saasPayments.filter((p) => p.status === "pending").length,
    failed: saasPayments.filter((p) => p.status === "failed").length,
    refunded: saasPayments.filter((p) => p.status === "refunded").length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paiements</h1>
          <p className="text-muted-foreground">Historique des transactions de la plateforme</p>
        </div>
        <Button variant="outline">
          <Download className="w-4 h-4 mr-2" />
          Exporter
        </Button>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-green-100">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalSucceeded)}</p>
                <p className="text-sm text-muted-foreground">Réussis ({stats.succeeded})</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-amber-100">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.pending}</p>
                <p className="text-sm text-muted-foreground">En attente</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-red-100">
                <XCircle className="w-5 h-5 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{formatCurrency(totalFailed)}</p>
                <p className="text-sm text-muted-foreground">Échoués ({stats.failed})</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-slate-100">
                <RotateCcw className="w-5 h-5 text-slate-600" />
              </div>
              <div>
                <p className="text-2xl font-bold">{stats.refunded}</p>
                <p className="text-sm text-muted-foreground">Remboursés</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Rechercher par hôtel ou description..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Statut" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tous</SelectItem>
                <SelectItem value="succeeded">Réussi</SelectItem>
                <SelectItem value="pending">En attente</SelectItem>
                <SelectItem value="failed">Échoué</SelectItem>
                <SelectItem value="refunded">Remboursé</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Table */}
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Hôtel</TableHead>
                <TableHead>Description</TableHead>
                <TableHead>Montant</TableHead>
                <TableHead>Méthode</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="hidden md:table-cell">Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow key={payment.id}>
                  <TableCell>
                    <p className="font-medium">{payment.hotelName}</p>
                  </TableCell>
                  <TableCell>
                    <p className="text-sm text-muted-foreground">{payment.description}</p>
                  </TableCell>
                  <TableCell>
                    <p
                      className={`font-medium ${
                        payment.status === "succeeded"
                          ? "text-green-600"
                          : payment.status === "failed"
                            ? "text-red-600"
                            : ""
                      }`}
                    >
                      {formatCurrency(payment.amount)}
                    </p>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {payment.paymentMethod === "mobile-money"
                        ? "Mobile Money"
                        : payment.paymentMethod === "card"
                          ? "Carte"
                          : "Virement"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payment.status === "succeeded"
                          ? "bg-green-100 text-green-700"
                          : payment.status === "pending"
                            ? "bg-amber-100 text-amber-700"
                            : payment.status === "failed"
                              ? "bg-red-100 text-red-700"
                              : "bg-slate-100 text-slate-700"
                      }
                    >
                      {payment.status === "succeeded"
                        ? "Réussi"
                        : payment.status === "pending"
                          ? "En attente"
                          : payment.status === "failed"
                            ? "Échoué"
                            : "Remboursé"}
                    </Badge>
                  </TableCell>
                  <TableCell className="hidden md:table-cell">
                    <p className="text-sm">{new Date(payment.createdAt).toLocaleDateString("fr-FR")}</p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(payment.createdAt).toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
