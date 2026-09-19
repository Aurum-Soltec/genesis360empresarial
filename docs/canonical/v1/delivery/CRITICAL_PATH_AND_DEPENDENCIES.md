# Critical Path & Dependencies

## Caminho crítico de produção

```text
ST-104 Repo
  ↓
ST-105 Migrations
  ↓
ST-106 pgTAP
  ↓
ST-107 Quality/Build
  ↓
ST-109 Adversarial Security
  ↓
ST-110 Restore/Rollback
  ↓
ST-113 Environments
  ↓
ST-108 Happy-path E2E
  ↓
ST-101 Browser UX/A11y
  ↓
ST-122 Production Readiness Review
  ↓
ST-123 Pilot
```

## Trilhas paralelas
### Rede
ST-116 → ST-117 → qualification feature enablement.

### Upload
ST-114 → ST-115 → `FEATURE_DATA_UPLOAD=true`.

### Calibration
ST-118 + ST-119 antes de transformar Confidence/sector logic em benchmark de longo prazo.

### Agentic
ST-120 pode ocorrer em paralelo depois que core deterministic está estável, mas não bloqueia V1 deterministic core.

## Regra
Nenhuma trilha sensível deve ser habilitada só para “completar demo”.
