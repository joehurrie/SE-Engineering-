"use client";

import { useEffect, useRef, type ReactNode } from "react";

const revealSelector = "h1, h2, h3, h4, p, article, figure, blockquote, a, button, nav, li";

export default function ScrollRevealPage({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  const pageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const page = pageRef.current;
    if (!page || window.matchMedia("(prefers-reduced-motion: reduce)").matches || !("IntersectionObserver" in window)) {
      return;
    }

    page.classList.add("is-scroll-reveal-ready");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        });
      },
      { threshold: 0, rootMargin: "0px 0px -32px 0px" },
    );

    const observeTargets = (scope: ParentNode) => {
      const targets = Array.from(scope.querySelectorAll<HTMLElement>(revealSelector));
      if (scope instanceof HTMLElement && scope.matches(revealSelector)) {
        targets.unshift(scope);
      }

      targets.forEach((target, index) => {
        if (
          target.parentElement?.closest(".scroll-reveal") ||
          target.closest('[aria-hidden="true"], [data-scroll-reveal-ignore]')
        ) {
          return;
        }

        target.classList.add("scroll-reveal");
        target.style.setProperty("--scroll-reveal-delay", `${(index % 5) * 60}ms`);
        observer.observe(target);
      });
    };

    observeTargets(page);

    const mutations = new MutationObserver((records) => {
      records.forEach((record) => {
        record.addedNodes.forEach((node) => {
          if (node instanceof HTMLElement) observeTargets(node);
        });
      });
    });
    mutations.observe(page, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutations.disconnect();
    };
  }, []);

  return (
    <div ref={pageRef} className={["scroll-reveal-page", className].filter(Boolean).join(" ")}>
      {children}
    </div>
  );
}
