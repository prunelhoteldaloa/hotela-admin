"use client";

import { notFound } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ArrowLeft,
  FileText,
  Download,
  Printer,
  Send,
  CreditCard,
  AlertCircle,
  CheckCircle,
  Clock,
  Building2,
  User,
  Calendar,
  Loader2,
} from "lucide-react";
import { ButtonGroup } from "@/components/ui/button-group";
import { useInvoice } from "@/hooks/use-invoices";
import { useAuth } from "@/hooks/use-auth";
import { InvoiceStatus } from "@/services/invoices.service";
import { useAuthStore } from "@/stores/auth.store";

const statusConfig = {
  PENDING: {
    label: "En attente",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-amber-500",
  },
  PAID: {
    label: "Payée",
    variant: "default" as const,
    icon: CheckCircle,
    color: "text-green-500",
  },
  PARTIAL: {
    label: "Partielle",
    variant: "secondary" as const,
    icon: Clock,
    color: "text-blue-500",
  },
  OVERDUE: {
    label: "En retard",
    variant: "destructive" as const,
    icon: AlertCircle,
    color: "text-red-500",
  },
};

export default function InvoiceDetailPage({ id }: { id: string }) {
  const { user } = useAuth();
  const currentHotel = useAuthStore((state) => state.currentHotel);
  const hotelId = currentHotel?.id;
  const { invoice, isLoading, error } = useInvoice(hotelId, id);

  // Loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Chargement de la facture...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Card className="max-w-md">
          <CardContent className="pt-6">
            <div className="text-center space-y-4">
              <AlertCircle className="h-12 w-12 mx-auto text-destructive" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Erreur</h3>
                <p className="text-muted-foreground">{error}</p>
              </div>
              <Button asChild>
                <Link href="/dashboard/invoices">Retour aux factures</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Not found state
  const status = statusConfig[invoice?.status!];
  const StatusIcon = status?.icon;
  const reservation = invoice?.reservation;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold">
                Facture {invoice?.invoiceNumber}
              </h1>
              <Badge variant={status?.variant} className="gap-1">
                {/* <StatusIcon className="h-3 w-3" /> */}
                {status?.label}
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Émise le{" "}
              {new Date(invoice?.createdAt!).toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
        <ButtonGroup>
          <Button variant="outline">
            <Send className="mr-2 h-4 w-4" />
            Envoyer par email
          </Button>
          <Button>
            <Download className="mr-2 h-4 w-4" />
            Télécharger PDF
          </Button>
        </ButtonGroup>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Invoice Document */}
        <div className="lg:col-span-2">
          <Card className="border-border/50">
            <CardContent className="p-8">
              {/* Invoice Header */}
              <div className="flex justify-between items-start mb-8">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
                      <Building2 className="h-6 w-6 text-primary-foreground" />
                    </div>
                    <span className="text-xl font-bold">HotelPro</span>
                  </div>
                  <div className="text-sm text-muted-foreground space-y-1">
                    <p>{invoice?.hotel?.name || "Hôtel"}</p>
                    <p>{invoice?.hotel?.address}</p>
                    <p>{invoice?.hotel?.city.name}, Côte d'Ivoire</p>
                    <p>{invoice?.hotel?.phone}</p>
                    <p>{invoice?.hotel?.email}</p>
                  </div>
                </div>
                <div className="text-right">
                  <h2 className="text-3xl font-bold text-primary mb-2">
                    FACTURE
                  </h2>
                  <p className="text-lg font-semibold">
                    {invoice?.invoiceNumber}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Date:{" "}
                    {new Date(invoice?.createdAt!).toLocaleDateString("fr-FR")}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Échéance:{" "}
                    {new Date(invoice?.dueDate!).toLocaleDateString("fr-FR")}
                  </p>
                </div>
              </div>

              <Separator className="my-6" />

              {/* Client Info */}
              <div className="mb-8">
                <h3 className="text-sm font-semibold text-muted-foreground mb-2">
                  FACTURÉ À
                </h3>
                <div className="space-y-1">
                  <p className="font-semibold text-lg">{invoice?.guestName}</p>
                  {reservation && (
                    <>
                      <p className="text-sm text-muted-foreground">
                        {reservation.guestEmail}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {reservation.guestPhone}
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Items Table */}
              <div className="rounded-lg border border-border/50 overflow-hidden mb-6">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">
                        Description
                      </TableHead>
                      <TableHead className="text-center font-semibold">
                        Qté
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Prix unitaire
                      </TableHead>
                      <TableHead className="text-right font-semibold">
                        Total
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {invoice?.items.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>{item.description}</TableCell>
                        <TableCell className="text-center">
                          {item.quantity}
                        </TableCell>
                        <TableCell className="text-right">
                          {item.unitPrice.toLocaleString()} FCFA
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {item.total.toLocaleString()} FCFA
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Sous-total HT</span>
                    <span>{invoice?.subtotal.toLocaleString()} FCFA</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">TVA (18%)</span>
                    <span>{invoice?.taxAmount.toLocaleString()} FCFA</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between text-lg font-bold">
                    <span>Total TTC</span>
                    <span className="text-primary">
                      {invoice?.total.toLocaleString()} FCFA
                    </span>
                  </div>
                  {invoice?.paidAmount! > 0 && (
                    <>
                      <div className="flex justify-between text-green-600">
                        <span>Montant payé</span>
                        <span>
                          -{invoice?.paidAmount.toLocaleString()} FCFA
                        </span>
                      </div>
                      <div className="flex justify-between text-lg font-bold text-amber-600">
                        <span>Reste à payer</span>
                        <span>
                          {(
                            invoice?.total! - invoice?.paidAmount!
                          ).toLocaleString()}{" "}
                          FCFA
                        </span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Footer */}
              <div className="mt-8 pt-6 border-t border-border/50">
                <p className="text-sm text-muted-foreground text-center">
                  Merci pour votre confiance. Pour toute question concernant
                  cette facture, contactez-nous à {invoice?.hotel?.email}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Payment Status */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                Statut du paiement
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div
                className={`p-4 rounded-lg bg-muted/50 text-center ${status?.color}`}
              >
                {/* <StatusIcon className="h-8 w-8 mx-auto mb-2" /> */}
                <p className="font-semibold text-lg">{status?.label}</p>
              </div>

              {invoice?.status !== "PAID" && (
                <Button className="w-full">
                  <CreditCard className="mr-2 h-4 w-4" />
                  Enregistrer un paiement
                </Button>
              )}

              {invoice?.status === "OVERDUE" && (
                <Button variant="outline" className="w-full bg-transparent">
                  <Send className="mr-2 h-4 w-4" />
                  Envoyer un rappel
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Linked Reservation */}
          {reservation && (
            <Card className="border-border/50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Calendar className="h-5 w-5" />
                  Réservation liée
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Link href={`/dashboard/reservations/${reservation.id}`}>
                  <div className="p-4 rounded-lg border border-border/50 hover:bg-muted/50 transition-colors cursor-pointer">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-medium">{reservation.guestName}</p>
                        <p className="text-sm text-muted-foreground">
                          Chambre{" "}
                          {reservation.room?.roomNumber ||
                            reservation.roomNumber}
                        </p>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(reservation.checkIn).toLocaleDateString(
                        "fr-FR"
                      )}{" "}
                      -{" "}
                      {new Date(reservation.checkOut).toLocaleDateString(
                        "fr-FR"
                      )}
                    </div>
                  </div>
                </Link>
              </CardContent>
            </Card>
          )}

          {/* Payment History */}
          <Card className="border-border/50">
            <CardHeader>
              <CardTitle className="text-base">
                Historique des paiements
              </CardTitle>
            </CardHeader>
            <CardContent>
              {invoice?.payments && invoice?.payments.length > 0 ? (
                <div className="space-y-3">
                  {invoice?.payments.map((payment) => (
                    <div
                      key={payment.id}
                      className="flex items-center justify-between p-3 rounded-lg bg-green-500/10"
                    >
                      <div className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <div>
                          <p className="text-sm font-medium">
                            {payment.paymentMethod === "CASH" && "Espèces"}
                            {payment.paymentMethod === "CARD" &&
                              "Carte bancaire"}
                            {payment.paymentMethod === "TRANSFER" && "Virement"}
                            {payment.paymentMethod === "MOBILE_MONEY" &&
                              "Mobile Money"}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(payment.createdAt).toLocaleDateString(
                              "fr-FR"
                            )}
                          </p>
                        </div>
                      </div>
                      <span className="font-medium text-green-500">
                        {payment.amount.toLocaleString()} FCFA
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">Aucun paiement enregistré</p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          <Card className="border-border/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <FileText className="mr-2 h-4 w-4" />
                Dupliquer la facture
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start bg-transparent"
              >
                <Printer className="mr-2 h-4 w-4" />
                Imprimer
              </Button>
              <Button
                variant="outline"
                className="w-full justify-start text-destructive hover:text-destructive bg-transparent"
              >
                <AlertCircle className="mr-2 h-4 w-4" />
                Annuler la facture
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
