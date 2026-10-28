"use client";

import { createElement, useEffect, useId, useRef, useState } from "react";

const WIDGET_SCRIPT = "https://assets.decisionlogic.com/cdn/widgetui/widgetUI.js";

export type DecisionLogicWidgetResult = {
  requestCode: string;
  status?: number;
  institutionName?: string;
  numberOfAccounts?: number;
  isCheckingAccountFound?: boolean;
  isPayrollFound?: boolean;
  isIDVSuccessful?: boolean;
  customerId?: string;
  raw?: unknown;
};

type Props = {
  requestCode: string;
  widgetMode?: "LIVE";
  onComplete?: (result: DecisionLogicWidgetResult) => void;
  onError?: (message: string) => void;
};

function parseWidgetDetail(detail: unknown): DecisionLogicWidgetResult | null {
  if (detail == null) return null;
  let text = typeof detail === "string" ? detail : JSON.stringify(detail);
  // Docs: payload may be prefixed as `Json|{ ... }`
  const pipe = text.indexOf("|");
  if (pipe >= 0 && /json/i.test(text.slice(0, pipe))) {
    text = text.slice(pipe + 1);
  }
  try {
    const obj = JSON.parse(text) as Record<string, unknown>;
    return {
      requestCode: String(obj.requestCode || obj.RequestCode || ""),
      status: typeof obj.status === "number" ? obj.status : Number(obj.Status),
      institutionName: (obj.institutionName || obj.InstitutionName) as string | undefined,
      numberOfAccounts: (obj.numberOfAccounts || obj.NumberOfAccounts) as number | undefined,
      isCheckingAccountFound: (obj.isCheckingAccountFound ||
        obj.IsCheckingAccountFound) as boolean | undefined,
      isPayrollFound: (obj.isPayrollFound || obj.IsPayrollFound) as boolean | undefined,
      isIDVSuccessful: (obj.isIDVSuccessful || obj.IsIDVSuccessful) as boolean | undefined,
      customerId: (obj.customerId || obj.CustomerId) as string | undefined,
      raw: obj,
    };
  } catch {
    return { requestCode: "", raw: detail };
  }
}

function ensureWidgetScript(): Promise<void> {
  if (typeof window === "undefined") return Promise.resolve();
  const existing = document.querySelector(`script[src="${WIDGET_SCRIPT}"]`);
  if (existing) {
    return Promise.resolve();
  }
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = WIDGET_SCRIPT;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load DecisionLogic widgetUI.js"));
    document.head.appendChild(script);
  });
}

/**
 * Embeds DecisionLogic Instant Account Verification widget.
 * Parent page URL must be whitelisted on the DecisionLogic Profile before LIVE use.
 */
export default function DecisionLogicWidget({
  requestCode,
  widgetMode = "LIVE",
  onComplete,
  onError,
}: Props) {
  const reactId = useId().replace(/:/g, "");
  const widgetId = `dl-widget-${reactId}`;
  const containerRef = useRef<HTMLDivElement>(null);
  const [ready, setReady] = useState(false);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let cancelled = false;
    ensureWidgetScript()
      .then(() => {
        if (!cancelled) setReady(true);
      })
      .catch((err: Error) => {
        if (!cancelled) {
          setLoadError(err.message);
          onError?.(err.message);
        }
      });
    return () => {
      cancelled = true;
    };
  }, [onError]);

  useEffect(() => {
    if (!ready || !requestCode) return;

    const el = document.getElementById(widgetId);
    if (!el) return;

    const handler = (event: Event) => {
      const custom = event as CustomEvent;
      const parsed = parseWidgetDetail(custom.detail);
      if (!parsed) {
        onError?.("DecisionLogic widget returned an empty result.");
        return;
      }
      // Status 3 = login verified (success). Also treat missing status with requestCode as done.
      if (parsed.status === 3 || (parsed.requestCode && parsed.status == null)) {
        onComplete?.({ ...parsed, requestCode: parsed.requestCode || requestCode });
      } else if (parsed.status != null && parsed.status < 0) {
        onError?.(
          `Bank verification failed (status ${parsed.status}). Please try another account.`,
        );
      } else {
        onComplete?.({ ...parsed, requestCode: parsed.requestCode || requestCode });
      }
    };

    el.addEventListener("getEvent", handler);
    return () => el.removeEventListener("getEvent", handler);
  }, [ready, requestCode, widgetId, onComplete, onError]);

  if (loadError) {
    return (
      <div className="dl-widget-error" role="alert">
        {loadError}
      </div>
    );
  }

  if (!ready) {
    return <div className="dl-widget-loading">Loading secure bank connection…</div>;
  }

  return (
    <div
      ref={containerRef}
      id={`widgetHeight-${reactId}`}
      className="widget_section dl-widget"
      style={{ height: 614, width: "100%", maxWidth: 480, margin: "0 auto" }}
    >
      {createElement("widget-ui", {
        id: widgetId,
        request_code: requestCode,
        widget_mode: widgetMode,
      })}
    </div>
  );
}
