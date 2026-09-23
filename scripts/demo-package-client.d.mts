export function requestDemoEvidencePackage(
  apiJson: (
    page: unknown,
    method: string,
    pathname: string,
    data: unknown,
  ) => Promise<unknown>,
  page: unknown,
  companyId: string,
  diagnosticId: string,
): Promise<string[]>;
