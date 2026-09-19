# Definition of Ready / Definition of Done

## Definition of Ready
Uma story está Ready quando:
- requisito/objetivo está identificado;
- owner de dados e boundary estão claros;
- dependências conhecidas;
- decisão pendente não bloqueia;
- critérios de aceite existem;
- riscos relevantes foram classificados;
- segurança/privacidade foram avaliadas;
- teste esperado está definido;
- rollback/migration path existe quando aplicável.

## Definition of Done
Uma story só pode ser Done quando:
- implementação concluída;
- testes de risco executados;
- evidência anexada;
- contratos atualizados;
- migrations validadas quando aplicável;
- logs/telemetria adequados;
- segurança/privacidade verificadas;
- docs sincronizadas;
- rollback conhecido;
- nenhum dado fake em superfície de produção;
- gate correspondente atualizado.

`implemented-by-contract` não equivale a `Done em produção`.
