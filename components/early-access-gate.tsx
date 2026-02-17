"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const STORAGE_KEY = "early_access_ok";

export function EarlyAccessGate({ children }: { children: React.ReactNode }) {
  const password = process.env.NEXT_PUBLIC_EARLY_ACCESS_PASSWORD;
  const [unlocked, setUnlocked] = useState(false);
  const [checking, setChecking] = useState(!!password);
  const [value, setValue] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!password) {
      setChecking(false);
      return;
    }
    setUnlocked(typeof window !== "undefined" && sessionStorage.getItem(STORAGE_KEY) === "1");
    setChecking(false);
  }, [password]);

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (value === password) {
      if (typeof window !== "undefined") sessionStorage.setItem(STORAGE_KEY, "1");
      setUnlocked(true);
      setError(false);
    } else {
      setError(true);
    }
  };

  if (!password || unlocked) return <>{children}</>;
  if (checking) return <div className="min-h-screen flex items-center justify-center bg-background"><div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-sm rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-center text-lg font-semibold text-foreground">Early Access</h1>
        <p className="mt-1 text-center text-sm text-muted-foreground">Passwort eingeben, um fortzufahren.</p>
        <form onSubmit={submit} className="mt-6 space-y-4">
          <Input
            type="password"
            placeholder="Passwort"
            value={value}
            onChange={(e) => { setValue(e.target.value); setError(false); }}
            autoFocus
            autoComplete="current-password"
          />
          {error && <p className="text-sm text-destructive">Falsches Passwort.</p>}
          <Button type="submit" className="w-full">Zugang</Button>
        </form>
      </div>
    </div>
  );
}
