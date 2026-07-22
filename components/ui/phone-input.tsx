"use client";

import * as React from "react";
import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { getCatalogService } from "@/services/catalog.service";

// ─── Métadonnées des pays (indicatif téléphonique) ────────────────────────────

export interface Country {
  /** Code ISO 3166-1 alpha-2 */
  iso2: string;
  /** Nom du pays en français */
  name: string;
  /** Indicatif téléphonique international sans le "+" */
  dialCode: string;
}

/**
 * Table de référence complète : nom (FR) → indicatif + ISO2.
 * Sert à retrouver l'indicatif et le drapeau des pays renvoyés par le
 * catalogue (qui ne fournit que le nom).
 */
export const COUNTRIES: Country[] = [
  { iso2: "CI", name: "Côte d'Ivoire", dialCode: "225" },
  { iso2: "SN", name: "Sénégal", dialCode: "221" },
  { iso2: "ML", name: "Mali", dialCode: "223" },
  { iso2: "BF", name: "Burkina Faso", dialCode: "226" },
  { iso2: "BJ", name: "Bénin", dialCode: "229" },
  { iso2: "TG", name: "Togo", dialCode: "228" },
  { iso2: "GN", name: "Guinée", dialCode: "224" },
  { iso2: "NE", name: "Niger", dialCode: "227" },
  { iso2: "GH", name: "Ghana", dialCode: "233" },
  { iso2: "NG", name: "Nigeria", dialCode: "234" },
  { iso2: "CM", name: "Cameroun", dialCode: "237" },
  { iso2: "GA", name: "Gabon", dialCode: "241" },
  { iso2: "CG", name: "Congo", dialCode: "242" },
  { iso2: "CD", name: "RD Congo", dialCode: "243" },
  { iso2: "TD", name: "Tchad", dialCode: "235" },
  { iso2: "CF", name: "Centrafrique", dialCode: "236" },
  { iso2: "MR", name: "Mauritanie", dialCode: "222" },
  { iso2: "MA", name: "Maroc", dialCode: "212" },
  { iso2: "DZ", name: "Algérie", dialCode: "213" },
  { iso2: "TN", name: "Tunisie", dialCode: "216" },
  { iso2: "EG", name: "Égypte", dialCode: "20" },
  { iso2: "ZA", name: "Afrique du Sud", dialCode: "27" },
  { iso2: "KE", name: "Kenya", dialCode: "254" },
  { iso2: "RW", name: "Rwanda", dialCode: "250" },
  { iso2: "FR", name: "France", dialCode: "33" },
  { iso2: "BE", name: "Belgique", dialCode: "32" },
  { iso2: "CH", name: "Suisse", dialCode: "41" },
  { iso2: "LU", name: "Luxembourg", dialCode: "352" },
  { iso2: "GB", name: "Royaume-Uni", dialCode: "44" },
  { iso2: "DE", name: "Allemagne", dialCode: "49" },
  { iso2: "ES", name: "Espagne", dialCode: "34" },
  { iso2: "IT", name: "Italie", dialCode: "39" },
  { iso2: "PT", name: "Portugal", dialCode: "351" },
  { iso2: "NL", name: "Pays-Bas", dialCode: "31" },
  { iso2: "US", name: "États-Unis", dialCode: "1" },
  { iso2: "CA", name: "Canada", dialCode: "1" },
  { iso2: "BR", name: "Brésil", dialCode: "55" },
  { iso2: "CN", name: "Chine", dialCode: "86" },
  { iso2: "IN", name: "Inde", dialCode: "91" },
  { iso2: "AE", name: "Émirats arabes unis", dialCode: "971" },
  { iso2: "SA", name: "Arabie saoudite", dialCode: "966" },
  { iso2: "TR", name: "Turquie", dialCode: "90" },
];

const DEFAULT_ISO2 = "CI";

// ─── Utilitaires ──────────────────────────────────────────────────────────────

/** Minuscule + suppression des accents pour une comparaison robuste. */
function normalize(s: string): string {
  return s
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim();
}

/** Convertit un code ISO2 en emoji drapeau (indicateurs régionaux). */
function isoToFlag(iso2: string): string {
  return iso2
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

/**
 * Alias de noms possibles renvoyés par le catalogue → ISO2 de référence.
 * Permet de faire correspondre des variantes ("Congo (RDC)", "RDC"...).
 */
const NAME_ALIASES: Record<string, string> = {
  "cote divoire": "CI",
  "cote d ivoire": "CI",
  "ivory coast": "CI",
  senegal: "SN",
  "rd congo": "CD",
  rdc: "CD",
  "republique democratique du congo": "CD",
  "congo (rdc)": "CD",
  "congo kinshasa": "CD",
  "republique du congo": "CG",
  "congo brazzaville": "CG",
  centrafrique: "CF",
  "republique centrafricaine": "CF",
  "etats unis": "US",
  "etats-unis": "US",
  "royaume uni": "GB",
  angleterre: "GB",
};

/** Index normalisé (nom + alias) → Country. */
const COUNTRY_INDEX: Map<string, Country> = (() => {
  const index = new Map<string, Country>();
  for (const c of COUNTRIES) {
    index.set(normalize(c.name), c);
  }
  for (const [alias, iso2] of Object.entries(NAME_ALIASES)) {
    const country = COUNTRIES.find((c) => c.iso2 === iso2);
    if (country) index.set(normalize(alias), country);
  }
  return index;
})();

/** Résout un nom de pays (catalogue) vers ses métadonnées téléphoniques. */
function resolveCountryByName(name: string): Country | undefined {
  return COUNTRY_INDEX.get(normalize(name));
}

/**
 * Sépare une valeur complète (ex: "+225 0700000000") en indicatif + numéro,
 * en cherchant dans la liste de pays fournie.
 */
function parseValue(
  value: string,
  list: Country[],
): { country: Country; nationalNumber: string } {
  const fallback =
    list.find((c) => c.iso2 === DEFAULT_ISO2) ?? list[0] ?? COUNTRIES[0];

  if (!value) return { country: fallback, nationalNumber: "" };

  const digits = value.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    const withoutPlus = digits.slice(1);
    // On cherche l'indicatif le plus long qui correspond (toute la table de
    // référence, pour toujours reconnaître un numéro déjà enregistré).
    const matches = COUNTRIES.filter((c) =>
      withoutPlus.startsWith(c.dialCode),
    ).sort((a, b) => b.dialCode.length - a.dialCode.length);
    if (matches.length > 0) {
      const country = matches[0];
      return {
        country,
        nationalNumber: withoutPlus.slice(country.dialCode.length),
      };
    }
  }

  return { country: fallback, nationalNumber: value.replace(/[^\d]/g, "") };
}

// ─── Récupération des pays disponibles (catalogue) ────────────────────────────

/**
 * Cache module : évite de refaire l'appel réseau pour chaque champ téléphone.
 * `null` = pas encore chargé. La promesse est mémorisée pour dédupliquer les
 * requêtes concurrentes.
 */
let cachedCountryNames: string[] | null = null;
let inflight: Promise<string[]> | null = null;

async function fetchAvailableCountryNames(): Promise<string[]> {
  if (cachedCountryNames) return cachedCountryNames;
  if (inflight) return inflight;

  inflight = (async () => {
    try {
      const service = getCatalogService();
      const countries = await service.getCountries(false);
      const names = countries.map((c) => c.name);
      cachedCountryNames = names;
      return names;
    } catch {
      // Silencieux : sur les pages publiques ou en cas d'erreur réseau, on
      // retombe simplement sur la liste complète par défaut.
      return [];
    } finally {
      inflight = null;
    }
  })();

  return inflight;
}

/**
 * Renvoie la liste des pays où le service est disponible (issue du catalogue),
 * résolus en métadonnées téléphoniques. Vide tant que le chargement n'est pas
 * terminé ou si le catalogue est inaccessible → l'appelant retombe alors sur
 * la liste complète.
 */
function useAvailableCountries(): Country[] {
  const [names, setNames] = React.useState<string[]>(
    () => cachedCountryNames ?? [],
  );

  React.useEffect(() => {
    let active = true;
    if (cachedCountryNames) {
      setNames(cachedCountryNames);
      return;
    }
    fetchAvailableCountryNames().then((result) => {
      if (active) setNames(result);
    });
    return () => {
      active = false;
    };
  }, []);

  return React.useMemo(() => {
    const resolved: Country[] = [];
    const seen = new Set<string>();
    for (const name of names) {
      const country = resolveCountryByName(name);
      if (country && !seen.has(country.iso2)) {
        resolved.push(country);
        seen.add(country.iso2);
      }
    }
    // On conserve l'ordre de la table de référence (Afrique de l'Ouest d'abord).
    return COUNTRIES.filter((c) => seen.has(c.iso2));
  }, [names]);
}

// ─── Composant ────────────────────────────────────────────────────────────────

export interface PhoneInputProps {
  value: string;
  onChange: (value: string) => void;
  id?: string;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  /** Applique un style d'erreur sur le champ. */
  error?: boolean;
}

export function PhoneInput({
  value,
  onChange,
  id,
  placeholder = "07 00 00 00 00",
  disabled,
  className,
  error,
}: PhoneInputProps) {
  const [open, setOpen] = React.useState(false);

  const availableCountries = useAvailableCountries();
  // Liste affichée : pays disponibles (catalogue) ou liste complète en secours.
  const list = availableCountries.length > 0 ? availableCountries : COUNTRIES;

  const { country, nationalNumber } = React.useMemo(
    () => parseValue(value, list),
    [value, list],
  );

  const emit = (nextCountry: Country, nextNumber: string) => {
    const cleaned = nextNumber.replace(/[^\d]/g, "");
    onChange(
      cleaned
        ? `+${nextCountry.dialCode} ${cleaned}`
        : `+${nextCountry.dialCode}`,
    );
  };

  const handleSelectCountry = (selected: Country) => {
    setOpen(false);
    emit(selected, nationalNumber);
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    emit(country, e.target.value);
  };

  return (
    <div
      className={cn(
        "flex items-stretch rounded-md border border-input bg-transparent shadow-xs transition-[color,box-shadow] focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50",
        error &&
          "border-destructive focus-within:border-destructive focus-within:ring-destructive/30",
        disabled && "opacity-50",
        className,
      )}
    >
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="ghost"
            role="combobox"
            aria-expanded={open}
            aria-label="Choisir un pays"
            disabled={disabled}
            className="h-11 shrink-0 gap-1.5 rounded-r-none rounded-l-md border-r border-input px-3 font-normal hover:bg-accent/50"
          >
            <span className="text-base leading-none" aria-hidden="true">
              {isoToFlag(country.iso2)}
            </span>
            <span className="text-sm text-muted-foreground">
              +{country.dialCode}
            </span>
            <ChevronsUpDown className="h-3.5 w-3.5 text-muted-foreground/70" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[280px] p-0" align="start">
          <Command
            filter={(value, search) =>
              normalize(value).includes(normalize(search)) ? 1 : 0
            }
          >
            <CommandInput placeholder="Rechercher un pays..." />
            <CommandList>
              <CommandEmpty>Aucun pays trouvé.</CommandEmpty>
              <CommandGroup>
                {list.map((c) => (
                  <CommandItem
                    key={c.iso2}
                    value={`${c.name} ${c.dialCode} ${c.iso2}`}
                    onSelect={() => handleSelectCountry(c)}
                    className="gap-2"
                  >
                    <span className="text-base leading-none" aria-hidden="true">
                      {isoToFlag(c.iso2)}
                    </span>
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-sm text-muted-foreground">
                      +{c.dialCode}
                    </span>
                    <Check
                      className={cn(
                        "h-4 w-4",
                        c.iso2 === country.iso2 ? "opacity-100" : "opacity-0",
                      )}
                    />
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Input
        id={id}
        type="tel"
        inputMode="tel"
        autoComplete="tel-national"
        placeholder={placeholder}
        value={nationalNumber}
        onChange={handleNumberChange}
        disabled={disabled}
        className="h-11 flex-1 rounded-l-none border-0 bg-transparent shadow-none focus-visible:ring-0"
      />
    </div>
  );
}
