"use client";

import type React from "react";
import { useState } from "react";
import Link from "next/link";
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
import { ArrowLeft, Loader2, Mail } from "lucide-react";
import { authClient } from "@/lib/auth";
import { toast } from "sonner";

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setIsLoading(true);
      const res = await authClient.requestPasswordReset({
        email: email,
        // redirectTo: "/reset-password",
      });

      if (res.error) {
        toast.error(res.error.message);
      } else {
        setEmailSent(true);
        toast.success("Email de réinitialisation envoyé avec succès");
      }
    } catch (error: any) {
      console.log(error);
      toast.error(error.response?.data?.message || "Une erreur s'est produite");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md border-none bg-transparent shadow-none">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">
          Mot de passe oublié
        </CardTitle>
        <CardDescription>
          {emailSent
            ? "Un email de réinitialisation a été envoyé"
            : "Entrez votre email pour recevoir un lien de réinitialisation"}
        </CardDescription>
      </CardHeader>

      {emailSent ? (
        <CardContent className="space-y-4">
          <div className="flex flex-col items-center justify-center py-6 space-y-4">
            <div className="rounded-full bg-accent/10 p-3">
              <Mail className="h-8 w-8 text-accent" />
            </div>
            <p className="text-sm text-center text-muted-foreground">
              Nous avons envoyé un lien de réinitialisation à{" "}
              <span className="font-medium text-foreground">{email}</span>
            </p>
            <p className="text-xs text-center text-muted-foreground">
              Vérifiez votre boîte de réception et suivez les instructions pour
              réinitialiser votre mot de passe.
            </p>
          </div>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="nom@hotel.ci"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 mt-5">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Envoyer le lien de réinitialisation
            </Button>
          </CardFooter>
        </form>
      )}

      <CardFooter className="flex justify-center pt-0">
        <Link
          href="/"
          className="text-sm text-accent hover:underline font-medium inline-flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la connexion
        </Link>
      </CardFooter>
    </Card>
  );
}
