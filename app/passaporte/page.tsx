import { GlassCard } from "@/components/glass-card";
import { PASSPORT_ESSENTIAL_KEYS, passportCompleteness } from "@/lib/business-passport";
import { requirePageTenantContext } from "@/lib/page-tenant-context";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function PassaportePage() {
  const context = await requirePageTenantContext("/passaporte");
  const supabase = await createSupabaseServerClient();

  const { data: company } = await supabase
    .from("companies").select("id,trade_name").eq("tenant_id", context.tenantId).limit(1).maybeSingle();

  if (!company) return <main className="p-6"><GlassCard><h1>Business Passport</h1><p>Cadastre uma empresa para iniciar seu Passport.</p></GlassCard></main>;

  const { data: facts } = await supabase
    .from("business_facts")
    .select("fact_key,source,captured_at,verification_status")
    .eq("tenant_id", context.tenantId).eq("company_id", company.id).is("valid_to", null);

  const keys = (facts ?? []).map((f) => f.fact_key);
  const completeness = Math.round(passportCompleteness(keys, [...PASSPORT_ESSENTIAL_KEYS]) * 100);

  return (
    <main className="p-6 space-y-6">
      <div>
        <p className="text-sm opacity-70">Genesis Business Passport</p>
        <h1 className="text-3xl font-semibold">{company.trade_name}</h1>
        <p className="mt-2">Memória empresarial estruturada, temporal e verificável.</p>
      </div>
      <GlassCard>
        <h2 className="text-xl font-semibold">Completude essencial</h2>
        <p className="text-4xl font-semibold mt-2">{completeness}%</p>
        <p className="mt-2 opacity-70">O Genesis solicitará novos dados progressivamente, apenas quando agregarem valor.</p>
      </GlassCard>
      <GlassCard>
        <h2 className="text-xl font-semibold">Dados atuais</h2>
        <p className="mt-2">{facts?.length ?? 0} fatos ativos no Business DNA.</p>
        <p className="opacity-70">Cada atualização preserva proveniência e histórico na Business Timeline.</p>
      </GlassCard>
    </main>
  );
}
