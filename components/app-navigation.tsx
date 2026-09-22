"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { BrandMark } from "@/components/brand-mark";

type NavItem = {
  label: string;
  href: string;
  exact?: boolean;
};

type Module = {
  code: "today" | "diagnostic" | "evolution" | "solutions" | "council" | "ecosystem" | "demo";
  label: string;
  href: string;
  match: (pathname: string) => boolean;
  items: NavItem[];
};

const utilities: NavItem[] = [
  { label: "Business Passport", href: "/passaporte" },
  { label: "Documentos", href: "/documentos" },
  { label: "Privacidade", href: "/privacidade" },
];

const modules: Module[] = [
  {
    code: "demo",
    label: "Demonstração",
    href: "/demonstracao",
    match: (pathname) => pathname.startsWith("/demonstracao"),
    items: [{ label: "Roteiro completo", href: "/demonstracao" }],
  },
  {
    code: "today",
    label: "Hoje",
    href: "/",
    match: (pathname) =>
      pathname === "/" ||
      pathname.startsWith("/prioridades") ||
      pathname.startsWith("/indicadores") ||
      pathname.startsWith("/historico"),
    items: [
      { label: "Visão executiva", href: "/", exact: true },
      { label: "Prioridades", href: "/prioridades" },
      { label: "Indicadores", href: "/indicadores" },
      { label: "Histórico", href: "/historico" },
    ],
  },
  {
    code: "diagnostic",
    label: "Diagnóstico",
    href: "/diagnostico-v1",
    match: (pathname) =>
      pathname.startsWith("/diagnostico-v1") ||
      pathname.startsWith("/resultado-v1"),
    items: [
      { label: "Diagnóstico atual", href: "/diagnostico-v1" },
      { label: "Resultado", href: "/resultado-v1" },
      { label: "Evidências", href: "/documentos" },
    ],
  },
  {
    code: "evolution",
    label: "Evolução",
    href: "/missoes",
    match: (pathname) => pathname.startsWith("/missoes"),
    items: [
      { label: "Missões", href: "/missoes" },
    ],
  },
  {
    code: "solutions",
    label: "Soluções",
    href: "/solucoes",
    match: (pathname) =>
      pathname.startsWith("/solucoes") || pathname.startsWith("/capacidades"),
    items: [
      { label: "Soluções qualificadas", href: "/solucoes" },
      { label: "Minhas capacidades", href: "/capacidades" },
    ],
  },
  {
    code: "council",
    label: "Conselho",
    href: "/conselho",
    match: (pathname) => pathname.startsWith("/conselho"),
    items: [{ label: "Conselho Genesis", href: "/conselho" }],
  },
  {
    code: "ecosystem",
    label: "Ecossistema",
    href: "/ecossistema",
    match: (pathname) => pathname.startsWith("/ecossistema"),
    items: [{ label: "Visão do ecossistema", href: "/ecossistema" }],
  },
];

function isCurrent(pathname: string, item: NavItem) {
  if (item.exact) return pathname === item.href;
  if (item.href === "/") return pathname === "/";
  return pathname === item.href || pathname.startsWith(`${item.href}/`);
}

function ContextLinks({
  module,
  pathname,
  onNavigate,
}: {
  module: Module;
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <>
      <section className="nav-section">
        <div className="nav-section-label">{module.label}</div>
        <nav className="context-nav" aria-label={`Navegação de ${module.label}`}>
          {module.items.map((item, index) => {
            const active = isCurrent(pathname, item) && index === module.items.findIndex(
              (candidate) => isCurrent(pathname, candidate),
            );
            return (
              <Link
                href={item.href}
                key={`${module.code}-${item.label}`}
                aria-current={active ? "page" : undefined}
                className={active ? "context-link is-active" : "context-link"}
                onClick={onNavigate}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </section>

      <section className="nav-section nav-utilities">
        <div className="nav-section-label">Empresa</div>
        <nav className="context-nav" aria-label="Empresa e privacidade">
          {utilities.map((item) => {
            const active = isCurrent(pathname, item);
            return (
              <Link
                href={item.href}
                key={item.href}
                aria-current={active ? "page" : undefined}
                className={active ? "context-link is-active" : "context-link"}
                onClick={onNavigate}
              >
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </section>
    </>
  );
}

export function AppNavigation({
  children,
  showEcosystem = false,
  showDemo = false,
}: {
  children: React.ReactNode;
  showEcosystem?: boolean;
  showDemo?: boolean;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const drawerRef = useRef<HTMLElement>(null);

  const availableModules = useMemo(
    () => modules.filter((module) =>
      (module.code !== "ecosystem" || showEcosystem) &&
      (module.code !== "demo" || showDemo)),
    [showDemo, showEcosystem],
  );

  const activeModule =
    availableModules.find((module) => module.match(pathname)) ??
    availableModules[0];

  useEffect(() => {
    if (!mobileOpen) return;

    const drawer = drawerRef.current;
    const trigger = triggerRef.current;
    const previous = document.activeElement as HTMLElement | null;

    const focusable = () =>
      drawer
        ? Array.from(
            drawer.querySelectorAll<HTMLElement>(
              'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
            ),
          )
        : [];

    focusable()[0]?.focus();

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setMobileOpen(false);
        return;
      }

      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;

      const first = items[0];
      const last = items[items.length - 1];

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      (previous ?? trigger)?.focus();
    };
  }, [mobileOpen]);

  return (
    <>
      <a className="skip-link" href="#main-content">
        Ir para o conteúdo
      </a>

      <header className="precision-topbar">
        <Link className="precision-brand-link" href="/" aria-label="Genesis 360 Empresarial — início">
          <BrandMark priority />
        </Link>

        <nav className="precision-topnav" aria-label="Módulos principais">
          {availableModules.map((module) => {
            const active = module.code === activeModule.code;
            return (
              <Link
                href={module.href}
                key={module.code}
                aria-current={active ? "page" : undefined}
                className={active ? "topnav-link is-active" : "topnav-link"}
              >
                {module.label}
              </Link>
            );
          })}
        </nav>

        <div className="precision-top-actions">
          <span className="company-context" aria-label="Contexto atual">
            Empresa ativa
          </span>
          <button
            ref={triggerRef}
            type="button"
            className="mobile-nav-trigger"
            aria-expanded={mobileOpen}
            aria-controls="genesis-mobile-navigation"
            aria-label={mobileOpen ? "Fechar menu" : "Abrir menu"}
            onClick={() => setMobileOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>
        </div>
      </header>

      <div className="precision-shell">
        <aside className="precision-sidebar" aria-label="Navegação contextual">
          <ContextLinks module={activeModule} pathname={pathname} />
        </aside>

        <main className="precision-main" id="main-content">
          <div className="precision-page">{children}</div>
        </main>
      </div>

      {mobileOpen ? (
        <div className="mobile-nav-layer" id="genesis-mobile-navigation">
          <button
            className="mobile-nav-backdrop"
            aria-label="Fechar menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside
            ref={drawerRef}
            className="mobile-nav-drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Menu principal"
          >
            <div className="mobile-nav-header">
              <BrandMark />
              <button
                type="button"
                className="mobile-close"
                aria-label="Fechar menu"
                onClick={() => setMobileOpen(false)}
              >
                ×
              </button>
            </div>

            <section className="nav-section">
              <div className="nav-section-label">Módulos</div>
              <nav className="mobile-module-nav">
                {availableModules.map((module) => {
                  const active = module.code === activeModule.code;
                  return (
                    <Link
                      href={module.href}
                      key={module.code}
                      className={active ? "mobile-module-link is-active" : "mobile-module-link"}
                      onClick={() => setMobileOpen(false)}
                    >
                      {module.label}
                    </Link>
                  );
                })}
              </nav>
            </section>

            <ContextLinks
              module={activeModule}
              pathname={pathname}
              onNavigate={() => setMobileOpen(false)}
            />
          </aside>
        </div>
      ) : null}
    </>
  );
}
