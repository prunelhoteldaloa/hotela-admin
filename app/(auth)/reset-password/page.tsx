"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Loader2, CheckCircle2 } from "lucide-react";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    confirmPassword: "",
  });

  const token = searchParams.get("token");

  useEffect(() => {
    if (!token) {
      toast.error("Lien de réinitialisation invalide");
      router.push("/forgot-password");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!token) {
      toast.error("Token manquant");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Le mot de passe doit contenir au moins 8 caractères");
      return;
    }

    try {
      setIsLoading(true);
      const res = await authClient.resetPassword({
        newPassword: formData.password,
        token: token, // 🔑 AJOUT DU TOKEN ICI
      });

      if (res.error) {
        toast.error(res.error.message || "Erreur lors de la réinitialisation");
      } else {
        setResetSuccess(true);
        toast.success("Mot de passe réinitialisé avec succès");
        setTimeout(() => {
          router.push("/");
        }, 3000);
      }
    } catch (error: any) {
      console.error("Erreur reset password:", error);
      toast.error(
        error.response?.data?.message ||
          error.message ||
          "Une erreur s'est produite",
      );
    } finally {
      setIsLoading(false);
    }
  };

  if (resetSuccess) {
    return (
      <Card className="w-full max-w-md border-none bg-transparent shadow-none">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">
            Réinitialisation réussie
          </CardTitle>
          <CardDescription>
            Votre mot de passe a été modifié avec succès
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-green-500/10 p-3">
              <CheckCircle2 className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Vous allez être redirigé vers la page de connexion dans quelques
              instants...
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button onClick={() => router.push("/login")} className="w-full">
            Se connecter maintenant
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md border-border/50 shadow-xl">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          Nouveau mot de passe
        </CardTitle>
        <CardDescription>
          Choisissez un nouveau mot de passe sécurisé
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="password">Nouveau mot de passe</Label>
            <div className="relative">
              <Input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
            <p className="text-xs text-muted-foreground">
              Minimum 8 caractères
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
            <div className="relative">
              <Input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={(e) =>
                  setFormData({ ...formData, confirmPassword: e.target.value })
                }
                required
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-0 top-0 h-full px-3 hover:bg-transparent"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                {showConfirmPassword ? (
                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                ) : (
                  <Eye className="h-4 w-4 text-muted-foreground" />
                )}
              </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 mt-5">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Réinitialiser le mot de passe
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
