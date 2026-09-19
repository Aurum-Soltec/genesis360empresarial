> **SUPERADO PARCIALMENTE PARA V1 (2026-08-18):** este documento permanece histórico. Em conflito, prevalecem `docs/v1/PRD_GENESIS_360_V1_CANONICO.md` e ADRs V1.

# GENESIS 360º — PACOTE MESTRE V3.0

**Data-base:** 25 de junho de 2026  
**Status:** baseline harmonizada para execução do MVP de 5 dias, MVP robusto de 30 dias e versão Starter de 45 dias  
**Classificação:** confidencial  
**Owner de produto provisório nos primeiros 45 dias:** Hudson Lopes Custódio  
**Tech Lead:** Fernando Lima  
**Administração/financeiro/compliance operacional:** Lilian Lopes  
**Comercial/parcerias e operação Unique:** Tatyanne Tavares  

## 1. Ordem de precedência documental

Em caso de conflito, prevalece a seguinte ordem:

1. `01_PRD_MASTER_V3_HARMONIZADO.md`
2. `GENESIS_360_MATRIZ_RASTREABILIDADE_BACKLOG_RISCOS_V3.xlsx`
3. `02_PLANO_MVP_5_30_45_DIAS.md`
4. `05_ARQUITETURA_SEGURANCA_LGPD_E_ADRS_V3.md`
5. `04_PROTOCOLO_PILOTO_UNIQUE_E_65_EMPRESAS.md`
6. `03_BACKLOG_SPRINT_READY_V3.md`
7. `06_HANDOFF_V3_IMPLEMENTACAO.md`
8. documentos V2 e anteriores, apenas como histórico

## 2. Documentos superados

Os documentos abaixo permanecem como fonte histórica, mas não devem orientar implementação sem validação contra a V3:

- PRD Técnico Master V2.0;
- handoff de 20/06/2026;
- roadmaps de 90 dias anteriores;
- backlog de 142 histórias sem corte 5/30/45;
- critérios de ranking que incluíam plano contratado;
- materiais que apresentem BNI, BEE4, aporte, piloto ou parceria como fatos sem contrato/evidência.

Não há evidência de marca física `SUPERADO` aplicada arquivo a arquivo neste repositório. Até essa marcação existir, os documentos antigos ficam subordinados pela ordem de precedência acima e devem ser tratados apenas como histórico.

## 3. Decisões executivas consolidadas

- O marco de 5 dias é uma **demo funcional controlada**, não produção.
- O marco de 30 dias é o **MVP robusto para piloto controlado**.
- O marco de 45 dias é a **versão Starter comercial inicial**, ainda sem BEE4, Capital Readiness, Conselho completo, agentes autônomos, marketplace aberto ou Outcome Graph preditivo.
- A Unique é tratada como **parceira patrocinadora de lançamento** para soluções tributárias, com disclosure explícito.
- O encaminhamento para a Unique somente ocorre após triagem, consentimento e critérios aprovados.
- Patrocínio, assinatura ou plano não entram no ranking orgânico.
- O CTO-Tax identifica sinais, organiza contexto e encaminha; não garante crédito, não calcula direito definitivo e não executa compensação.
- RLS é obrigatória em todas as tabelas pertencentes a tenant.
- O Bronze inclui um ciclo essencial de 30 dias para preservar a promessa de inteligência contínua.
- Hudson atua como Product Owner operacional provisório por 45 dias; Fernando atua como Tech Lead.
- BEE4 e Capital Readiness permanecem no roadmap posterior e não são apresentados como parceria confirmada.

## 4. Registro de verdade

### Fatos documentais

- O Genesis possui visão, PRD, dossiê, arquitetura conceitual e handoff.
- Não foi apresentada evidência de código, repositório, cloud, piloto executado ou contrato com BNI/BEE4.
- A Unique foi informada pelo fundador como empresa patrocinadora pretendida para o fluxo tributário.

### Hipóteses a validar

- A Unique aceitará o modelo de patrocínio, SLA, critérios e responsabilidade.
- Empresas concluirão o diagnóstico e aceitarão encaminhamento.
- Os planos anuais e fees terão disposição real de pagamento.
- A base de até 65 empresas poderá ser ativada em ondas.
- Uma equipe mínima estará disponível para cumprir 5/30/45 dias.

### Decisões pendentes críticas

- critérios formais de elegibilidade tributária fornecidos/aprovados pela Unique e especialista;
- contrato de patrocínio, referral, proteção de dados, SLA e remuneração;
- desenvolvedor sênior alocado em tempo integral;
- cloud e fornecedores gerenciados;
- orçamento e limites de custo;
- base legal e política de retenção;
- nomes dos revisores tributários habilitados;
- aprovação dos textos legais por profissional competente.

## 5. Conteúdo do pacote

- PRD Master V3 harmonizado;
- plano de entrega 5/30/45;
- backlog sprint-ready;
- protocolo de demo/piloto Unique e 65 empresas;
- arquitetura, dados, APIs, segurança, LGPD, IA e ADRs;
- handoff de implementação;
- termo-modelo de requisitos para a parceria Unique;
- workbook com matriz de rastreabilidade, backlog, riscos, ADRs, piloto e roadmap.

## 6. Regra de mudança

Mudança que altere segurança, tributário, dados, arquitetura, prazo, custo, escopo P0 ou promessa comercial exige:

1. registro em ADR;
2. impacto em prazo/custo/risco;
3. owner;
4. aprovação do PO e Tech Lead;
5. atualização da matriz de rastreabilidade;
6. comunicação aos envolvidos.
