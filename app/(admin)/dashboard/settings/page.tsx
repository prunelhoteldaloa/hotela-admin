"use client";

import { useState } from "react";
import {
  Shield,
  Bell,
  Mail,
  Globe,
  Database,
  Key,
  Save,
  User as UserIcon,
} from "lucide-react";
import { toast } from "sonner";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuthStore } from "@/stores/auth.store";
import { ALL_PLANS, planBadgeClassName, planLabel } from "@/lib/plans";
import { formatRole, getInitials } from "@/utils/format";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);

  const handleSave = () => {
    setSaving(true);
    setTimeout(() => {
      setSaving(false);
      toast.success("Paramètres enregistrés");
    }, 600);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-balance">Paramètres</h1>
          <p className="text-muted-foreground">
            Configuration de la plateforme HotelSaaS
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Enregistrement…" : "Enregistrer"}
        </Button>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-6 lg:w-auto lg:inline-grid">
          <TabsTrigger value="profile">Profil</TabsTrigger>
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        {/* Profile */}
        <TabsContent value="profile" className="space-y-6">
          <ProfileTab />
        </TabsContent>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Informations générales
              </CardTitle>
              <CardDescription>
                Paramètres généraux de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Nom de la plateforme</Label>
                  <Input defaultValue="HotelSaaS" />
                </div>
                <div className="space-y-2">
                  <Label>URL</Label>
                  <Input defaultValue="https://hotelsaas.ci" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Description</Label>
                <Textarea
                  defaultValue="Solution de gestion hôtelière pour la Côte d'Ivoire"
                  rows={3}
                />
              </div>
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email de support</Label>
                  <Input defaultValue="support@hotelsaas.ci" />
                </div>
                <div className="space-y-2">
                  <Label>Téléphone de support</Label>
                  <Input defaultValue="+225 07 07 07 07 07" />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Langue par défaut</Label>
                <Select defaultValue="fr">
                  <SelectTrigger className="w-[200px]">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Période d'essai</CardTitle>
              <CardDescription>
                Configuration de la période d'essai pour les nouveaux comptes
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Activer la période d'essai</Label>
                  <p className="text-sm text-muted-foreground">
                    Les nouveaux comptes bénéficient d'une période d'essai
                    gratuite
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Durée de l'essai (jours)</Label>
                <Input type="number" defaultValue="14" className="w-[100px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Notifications */}
        <TabsContent value="notifications" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notifications admin
              </CardTitle>
              <CardDescription>
                Configurer les notifications pour les administrateurs
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Nouvelle inscription</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir une notification à chaque nouvelle inscription
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Paiement échoué</Label>
                  <p className="text-sm text-muted-foreground">
                    Être alerté lorsqu'un paiement échoue
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fin de période d'essai</Label>
                  <p className="text-sm text-muted-foreground">
                    Notification lorsqu'un essai se termine
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Demandes de support</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevoir les demandes de support des hôtels
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Mail className="w-5 h-5" />
                Configuration email
              </CardTitle>
              <CardDescription>Paramètres d'envoi des emails</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label>Email expéditeur</Label>
                  <Input defaultValue="noreply@hotelsaas.ci" />
                </div>
                <div className="space-y-2">
                  <Label>Nom expéditeur</Label>
                  <Input defaultValue="HotelSaaS" />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security */}
        <TabsContent value="security" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Sécurité
              </CardTitle>
              <CardDescription>
                Paramètres de sécurité de la plateforme
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Exiger 2FA pour les comptes admin
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verrouillage après échecs</Label>
                  <p className="text-sm text-muted-foreground">
                    Bloquer après 5 tentatives de connexion échouées
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session timeout</Label>
                  <p className="text-sm text-muted-foreground">
                    Déconnexion automatique après inactivité
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Durée de session (heures)</Label>
                <Input type="number" defaultValue="24" className="w-[100px]" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* API */}
        <TabsContent value="api" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Key className="w-5 h-5" />
                Configuration API
              </CardTitle>
              <CardDescription>Paramètres de l'API publique</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>API activée</Label>
                  <p className="text-sm text-muted-foreground">
                    Permettre l'accès à l'API pour les hôtels Premium
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Limite de requêtes (par jour)</Label>
                <Input
                  type="number"
                  defaultValue="10000"
                  className="w-[150px]"
                />
              </div>
              <div className="space-y-2">
                <Label>URL de l'API</Label>
                <Input
                  defaultValue="https://api.hotelsaas.ci/v1"
                  readOnly
                  className="bg-muted"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Billing */}
        <TabsContent value="billing" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5" />
                Plans et tarifs
              </CardTitle>
              <CardDescription>
                Configuration des plans d'abonnement disponibles
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {ALL_PLANS.map((plan) => (
                <div
                  key={plan}
                  className="p-4 border rounded-lg space-y-4"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="font-medium">{planLabel(plan)}</h4>
                    <Badge
                      variant="outline"
                      className={planBadgeClassName(plan)}
                    >
                      {plan}
                    </Badge>
                  </div>
                  <div className="grid gap-4 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label>Prix mensuel (FCFA)</Label>
                      <Input type="number" placeholder="0" />
                    </div>
                    <div className="space-y-2">
                      <Label>Limite (chambres / établissements)</Label>
                      <Input placeholder="Illimité" />
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>
                Activer/désactiver les méthodes de paiement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mobile Money (Orange, MTN, Wave)</Label>
                  <p className="text-sm text-muted-foreground">
                    Paiement via opérateurs mobile
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Carte bancaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Visa, Mastercard
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Virement bancaire</Label>
                  <p className="text-sm text-muted-foreground">
                    Paiement par virement
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ProfileTab() {
  const user = useAuthStore((s) => s.user);
  const isLoading = useAuthStore((s) => s.isLoading);

  if (isLoading && !user) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-6 w-40" />
          <Skeleton className="h-4 w-64" />
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <Skeleton className="h-16 w-16 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-40" />
              <Skeleton className="h-4 w-52" />
            </div>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <Skeleton className="h-16 w-full" />
            <Skeleton className="h-16 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <UserIcon className="w-5 h-5" />
          Mon profil
        </CardTitle>
        <CardDescription>
          Informations du compte administrateur connecté
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center gap-4">
          <Avatar className="h-16 w-16">
            <AvatarImage
              src={user?.image ?? undefined}
              alt={user?.name ?? "Avatar"}
            />
            <AvatarFallback className="bg-primary/10 text-primary text-lg font-semibold">
              {getInitials(user?.name)}
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0">
            <p className="text-lg font-semibold truncate">
              {user?.name || "—"}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {user?.email || "—"}
            </p>
            <Badge variant="secondary" className="mt-1">
              {formatRole(user?.role)}
            </Badge>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-2">
            <Label>Nom complet</Label>
            <Input value={user?.name ?? ""} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Email</Label>
            <Input value={user?.email ?? ""} readOnly className="bg-muted" />
          </div>
          <div className="space-y-2">
            <Label>Téléphone</Label>
            <Input
              value={user?.phone ?? "Non renseigné"}
              readOnly
              className="bg-muted"
            />
          </div>
          <div className="space-y-2">
            <Label>Rôle</Label>
            <Input
              value={formatRole(user?.role)}
              readOnly
              className="bg-muted"
            />
          </div>
          {user?.country?.name ? (
            <div className="space-y-2">
              <Label>Pays</Label>
              <Input
                value={user.country.name}
                readOnly
                className="bg-muted"
              />
            </div>
          ) : null}
          <div className="space-y-2">
            <Label>Statut du compte</Label>
            <Input
              value={
                user?.emailVerified ? "Email vérifié" : "Email non vérifié"
              }
              readOnly
              className="bg-muted"
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
