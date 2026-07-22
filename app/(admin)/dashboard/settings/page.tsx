"use client"

import { Badge } from "@/components/ui/badge"

import { useState } from "react"
import { Shield, Bell, Mail, Globe, Database, Key, Save } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

export default function AdminSettingsPage() {
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-2xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground">Configuration de la plateforme HotelSaaS</p>
        </div>
        <Button onClick={handleSave}>
          <Save className="w-4 h-4 mr-2" />
          {saved ? "Enregistré !" : "Enregistrer"}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 lg:w-auto lg:inline-grid">
          <TabsTrigger value="general">Général</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Sécurité</TabsTrigger>
          <TabsTrigger value="api">API</TabsTrigger>
          <TabsTrigger value="billing">Facturation</TabsTrigger>
        </TabsList>

        {/* General */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="w-5 h-5" />
                Informations générales
              </CardTitle>
              <CardDescription>Paramètres généraux de la plateforme</CardDescription>
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
                <Textarea defaultValue="Solution de gestion hôtelière pour la Côte d'Ivoire" rows={3} />
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
              <CardDescription>Configuration de la période d'essai pour les nouveaux comptes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Activer la période d'essai</Label>
                  <p className="text-sm text-muted-foreground">
                    Les nouveaux comptes bénéficient d'une période d'essai gratuite
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
              <CardDescription>Configurer les notifications pour les administrateurs</CardDescription>
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
                  <p className="text-sm text-muted-foreground">Être alerté lorsqu'un paiement échoue</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Fin de période d'essai</Label>
                  <p className="text-sm text-muted-foreground">Notification lorsqu'un essai se termine</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Demandes de support</Label>
                  <p className="text-sm text-muted-foreground">Recevoir les demandes de support des hôtels</p>
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
              <CardDescription>Paramètres de sécurité de la plateforme</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">Exiger 2FA pour les comptes admin</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Verrouillage après échecs</Label>
                  <p className="text-sm text-muted-foreground">Bloquer après 5 tentatives de connexion échouées</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Session timeout</Label>
                  <p className="text-sm text-muted-foreground">Déconnexion automatique après inactivité</p>
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
                  <p className="text-sm text-muted-foreground">Permettre l'accès à l'API pour les hôtels Premium</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="space-y-2">
                <Label>Limite de requêtes (par jour)</Label>
                <Input type="number" defaultValue="10000" className="w-[150px]" />
              </div>
              <div className="space-y-2">
                <Label>URL de l'API</Label>
                <Input defaultValue="https://api.hotelsaas.ci/v1" readOnly className="bg-muted" />
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
              <CardDescription>Configuration des plans d'abonnement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Essentiel</h4>
                  <Badge variant="outline" className="border-blue-300 bg-blue-50 text-blue-700">
                    Actif
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Prix mensuel (FCFA)</Label>
                    <Input type="number" defaultValue="10000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre max de chambres</Label>
                    <Input type="number" defaultValue="20" />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Multi</h4>
                  <Badge variant="outline" className="border-violet-300 bg-violet-50 text-violet-700">
                    Actif
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Prix mensuel (FCFA)</Label>
                    <Input type="number" defaultValue="20000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Nombre max d'établissements</Label>
                    <Input type="number" defaultValue="5" />
                  </div>
                </div>
              </div>

              <div className="p-4 border rounded-lg space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">Premium Web</h4>
                  <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
                    Actif
                  </Badge>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label>Prix mensuel (FCFA)</Label>
                    <Input type="number" defaultValue="35000" />
                  </div>
                  <div className="space-y-2">
                    <Label>Chambres illimitées</Label>
                    <Input defaultValue="Illimité" readOnly className="bg-muted" />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Méthodes de paiement</CardTitle>
              <CardDescription>Activer/désactiver les méthodes de paiement</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Mobile Money (Orange, MTN, Wave)</Label>
                  <p className="text-sm text-muted-foreground">Paiement via opérateurs mobile</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Carte bancaire</Label>
                  <p className="text-sm text-muted-foreground">Visa, Mastercard</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Virement bancaire</Label>
                  <p className="text-sm text-muted-foreground">Paiement par virement</p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
