import { AppNavigation } from "@/components/app-navigation";
import { getFeatureFlags } from "@/lib/feature-flags";

export function AppShell({ children }: { children: React.ReactNode }) {
  const flags = getFeatureFlags();

  return (
    <AppNavigation showEcosystem={flags.ecosystem} showDemo={flags.demoWorkspace}>
      {children}
    </AppNavigation>
  );
}
