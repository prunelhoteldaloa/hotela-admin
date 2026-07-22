"use client";

import { useEffect, useState } from "react";
import { Loader2, Plus, Save } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useAdmin } from "@/hooks/useAdmin";
import type { PlanConfig } from "@/services/admin.service";
import { planBadgeClassName, planLabel } from "@/lib/plans";

interface PlanCardProps {
  plan: PlanConfig;
  onRefresh: () => void;
}

function PlanCard({ plan, onRefresh }: PlanCardProps) {
  const { planMutating, updatePlan, updatePlanFeature, addPlanFeature } =
    useAdmin();

  const [name, setName] = useState(plan.name);
  const [monthlyPrice, setMonthlyPrice] = useState(String(plan.monthlyPrice));
  const [annualPrice, setAnnualPrice] = useState(String(plan.annualPrice));
  const [maxRooms, setMaxRooms] = useState(
    plan.maxRooms == null ? "" : String(plan.maxRooms),
  );
  const [maxHotels, setMaxHotels] = useState(
    plan.maxHotels == null ? "" : String(plan.maxHotels),
  );
  const [description, setDescription] = useState(plan.description ?? "");
  const [isActive, setIsActive] = useState(plan.isActive);
  const [isPopular, setIsPopular] = useState(plan.isPopular);

  // Nouvelle fonctionnalité
  const [featureOpen, setFeatureOpen] = useState(false);
  const [featureKey, setFeatureKey] = useState("");
  const [featureLabel, setFeatureLabel] = useState("");
  const [featureEnabled, setFeatureEnabled] = useState(true);

  const handleSavePlan = () => {
    updatePlan(
      plan.key,
      {
        name,
        monthlyPrice: Number(monthlyPrice),
        annualPrice: Number(annualPrice),
        maxRooms: maxRooms === "" ? null : Number(maxRooms),
        maxHotels: maxHotels === "" ? null : Number(maxHotels),
        description: description || null,
        isActive,
        isPopular,
      },
      () => {
        toast.success(`Plan « ${name} » mis à jour`);
        onRefresh();
      },
    ).catch(() => toast.error("Échec de la mise à jour du plan"));
  };

  const handleToggleFeature = (fKey: string, enabled: boolean) => {
    updatePlanFeature(
      plan.key,
      fKey,
      { enabled },
      () => {
        toast.success("Fonctionnalité mise à jour");
        onRefresh();
      },
    ).catch(() => toast.error("Échec de la mise à jour de la fonctionnalité"));
  };

  const handleAddFeature = () => {
    if (!featureKey.trim() || !featureLabel.trim()) {
      toast.error("Clé et libellé requis");
      return;
    }
    addPlanFeature(
      plan.key,
      {
        featureKey: featureKey.trim(),
        label: featureLabel.trim(),
        enabled: featureEnabled,
      },
      () => {
        toast.success("Fonctionnalité ajoutée");
        setFeatureOpen(false);
        setFeatureKey("");
        setFeatureLabel("");
        setFeatureEnabled(true);
        onRefresh();
      },
    ).catch(() => toast.error("Échec de l'ajout de la fonctionnalité"));
  };

  return (
    <div className="p-4 space-y-4 border rounded-lg">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <h4 className="font-medium">{plan.name}</h4>
          <Badge variant="outline" className={planBadgeClassName(plan.key)}>
            {planLabel(plan.key)}
          </Badge>
          {plan.isPopular && (
            <Badge variant="outline" className="border-amber-300 bg-amber-50 text-amber-700">
              Populaire
            </Badge>
          )}
        </div>
        <Badge
          variant="outline"
          className={
            isActive
              ? "border-green-300 bg-green-50 text-green-700"
              : "border-slate-300 bg-slate-50 text-slate-700"
          }
        >
          {isActive ? "Actif" : "Inactif"}
        </Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label>Nom affiché</Label>
          <Input value={name} onChange={(e) => setName(e.target.value)} />
        </div>
        <div className="space-y-2">
          <Label>Prix mensuel (FCFA)</Label>
          <Input
            type="number"
            value={monthlyPrice}
            onChange={(e) => setMonthlyPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Prix annuel (FCFA)</Label>
          <Input
            type="number"
            value={annualPrice}
            onChange={(e) => setAnnualPrice(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nombre max de chambres</Label>
          <Input
            type="number"
            placeholder="Illimité"
            value={maxRooms}
            onChange={(e) => setMaxRooms(e.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label>Nombre max d&apos;établissements</Label>
          <Input
            type="number"
            placeholder="Illimité"
            value={maxHotels}
            onChange={(e) => setMaxHotels(e.target.value)}
          />
        </div>
        <div className="space-y-2 md:col-span-2">
          <Label>Description</Label>
          <Input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>
      </div>

      <div className="flex flex-wrap gap-6">
        <div className="flex items-center gap-2">
          <Switch checked={isActive} onCheckedChange={setIsActive} />
          <Label className="cursor-pointer">Plan actif</Label>
        </div>
        <div className="flex items-center gap-2">
          <Switch checked={isPopular} onCheckedChange={setIsPopular} />
          <Label className="cursor-pointer">Mis en avant</Label>
        </div>
      </div>

      {/* Fonctionnalités */}
      <div className="pt-2 space-y-3 border-t">
        <div className="flex items-center justify-between pt-2">
          <span className="text-sm font-medium">Fonctionnalités</span>
          <Dialog open={featureOpen} onOpenChange={setFeatureOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-1" />
                Ajouter
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Nouvelle fonctionnalité</DialogTitle>
                <DialogDescription>
                  Ajouter une fonctionnalité au plan « {plan.name} »
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label>Clé technique</Label>
                  <Input
                    placeholder="ex: multi_hotel"
                    value={featureKey}
                    onChange={(e) => setFeatureKey(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Libellé</Label>
                  <Input
                    placeholder="ex: Gestion multi-établissements"
                    value={featureLabel}
                    onChange={(e) => setFeatureLabel(e.target.value)}
                  />
                </div>
                <div className="flex items-center gap-2">
                  <Switch
                    checked={featureEnabled}
                    onCheckedChange={setFeatureEnabled}
                  />
                  <Label className="cursor-pointer">Activée par défaut</Label>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => setFeatureOpen(false)}
                >
                  Annuler
                </Button>
                <Button onClick={handleAddFeature} disabled={planMutating}>
                  {planMutating && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  Ajouter
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {plan.features.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Aucune fonctionnalité configurée.
          </p>
        ) : (
          <div className="space-y-2">
            {plan.features.map((feature) => (
              <div
                key={feature.id}
                className="flex items-center justify-between gap-2"
              >
                <div>
                  <p className="text-sm font-medium">{feature.label}</p>
                  <p className="text-xs text-muted-foreground">
                    {feature.featureKey}
                    {feature.displayValue ? ` • ${feature.displayValue}` : ""}
                  </p>
                </div>
                <Switch
                  checked={feature.enabled}
                  disabled={planMutating}
                  onCheckedChange={(checked) =>
                    handleToggleFeature(feature.featureKey, checked)
                  }
                />
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end pt-2">
        <Button onClick={handleSavePlan} disabled={planMutating}>
          {planMutating ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Enregistrer le plan
        </Button>
      </div>
    </div>
  );
}

export function PlansConfig() {
  const { plans, plansLoading, plansError, fetchPlans } = useAdmin();

  useEffect(() => {
    fetchPlans();
  }, [fetchPlans]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Plans et tarifs</CardTitle>
        <CardDescription>
          Configuration des plans d&apos;abonnement (synchronisée avec le
          backend)
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {plansLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Skeleton key={i} className="w-full h-48 rounded-lg" />
            ))}
          </div>
        ) : plansError ? (
          <div className="flex flex-col items-center gap-3 py-8">
            <p className="text-sm text-muted-foreground">
              Erreur : {plansError}
            </p>
            <Button variant="outline" onClick={fetchPlans}>
              Réessayer
            </Button>
          </div>
        ) : !plans || plans.length === 0 ? (
          <p className="py-8 text-sm text-center text-muted-foreground">
            Aucun plan configuré.
          </p>
        ) : (
          plans.map((plan) => (
            <PlanCard key={plan.id} plan={plan} onRefresh={fetchPlans} />
          ))
        )}
      </CardContent>
    </Card>
  );
}
