# GENESIS 360 V1 --- TRACEABILITY MATRIX

  ----------------------------------------------------------------------------------------------------
  PRD/ADR         Implementação   Gap                                Stories V1     Gate
                  atual                                                             
  --------------- --------------- ---------------------------------- -------------- ------------------
  DEC-001 humano  não codificado  entitlement/copy                   026            Product
  fora dos planos                                                                   

  Passport        companies +     facts/timeline/provenance          006-009        Data
  ADR-011         answers                                                           

  RF-DIAG         JSON 144/24 +   workflow real                      010-014        Product
                  scoring + demo                                                    
                  UI                                                                

  GDS             demo/result     domain + persistence               015-017        Product
                  copy                                                              

  Mission ADR-013 card hardcoded  engine completo                    018-022        Product

  Qualification   referrals       capability/qualification/ranking   023-030        Product/Security
  ADR-012         tax-specific                                                      

  Agentic ADR-014 prompts/spec    runtime/tools/evals                031-036        AI
                  only                                                              

  Ecosystem       não             domain/analytics                   037-039        Privacy
                  implementado                                                      

  Multi-tenancy   RLS inicial     tenant context + tests             003-004        Tenant

  Consent         schema inicial  purpose lifecycle                  005/042        Privacy

  Audit           audit_events    coverage/append-only               041            Security
                  inicial                                                           

  OSS ADR-015     pnpm audit CI   license/SBOM policy                047            Security

  Production      CI mínimo       deploy/restore/obs/FinOps/E2E      045-052        Release
  ADR-016                                                                           
  ----------------------------------------------------------------------------------------------------
