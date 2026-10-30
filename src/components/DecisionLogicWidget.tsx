"use client";

import { createElement, useEffect, useId, useRef, useState } from "react";

const WIDGET_SCRIPT = "https://assets.decisionlogic.com/cdn/widgetui/widgetUI.js";
const SUCCESS_TEXT = /success,\s*you verified your banking information/i;

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

function asRecord(value: unknown): Record<string, unknown> | null {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as Record<string, unknown>;
  }
  return null;
}

function fromPayloadObject(wrapped: Record<string, unknown>): DecisionLogicWidgetResult {
  const statusRaw = wrapped.status ?? wrapped.Status;
  const statusNum =
    typeof statusRaw === "number" ? statusRaw : statusRaw != null ? Number(statusRaw) : undefined;
  const institution = String(wrapped.institutionName || wrapped.InstitutionName || "").trim();
  return {
    requestCode: String(wrapped.requestCode || wrapped.RequestCode || ""),
    status: Number.isFinite(statusNum) ? statusNum : undefined,
    institutionName: institution || undefined,
    numberOfAccounts: (wrapped.numberOfAccounts || wrapped.NumberOfAccounts) as number | undefined,
    isCheckingAccountFound: (wrapped.isCheckingAccountFound ||
      wrapped.IsCheckingAccountFound) as boolean | undefined,
    isPayrollFound: (wrapped.isPayrollFound || wrapped.IsPayrollFound) as boolean | undefined,
    isIDVSuccessful: (wrapped.isIDVSuccessful || wrapped.IsIDVSuccessful) as boolean | undefined,
    customerId: (wrapped.customerId || wrapped.CustomerId) as string | undefined,
    raw: wrapped,
  };
}

function parseWidgetDetail(detail: unknown): DecisionLogicWidgetResult | null {
  if (detail == null) return null;

  // Some profiles postMessage an object like { getEvent: "Json|{...}" } or the JSON itself.
  const wrapped = asRecord(detail);
  if (wrapped?.getEvent != null) {
    return parseWidgetDetail(wrapped.getEvent);
  }
  if (wrapped?.detail != null && wrapped.detail !== detail) {
    return parseWidgetDetail(wrapped.detail);
  }
  if (wrapped && (wrapped.requestCode || wrapped.RequestCode || wrapped.status != null || wrapped.Status != null)) {
    return fromPayloadObject(wrapped);
  }

  if (typeof detail !== "string") return null;

  let text = detail.trim();
  if (!text) return null;
  // Docs: payload may be prefixed as `Json|{ ... }`
  const pipe = text.indexOf("|");
  if (pipe >= 0 && /json/i.test(text.slice(0, pipe))) {
    text = text.slice(pipe + 1);
  }
  try {
    const parsed = JSON.parse(text) as unknown;
    if (parsed === detail) return null;
    return parseWidgetDetail(parsed);
  } catch {
    return null;
  }
}

function isVerifiedResult(parsed: DecisionLogicWidgetResult): boolean {
  if (parsed.status === 3 || parsed.status === 600) return true;
  // Some profiles return institution on success without a numeric status.
  if (parsed.institutionName && parsed.requestCode) return true;
  return false;
}

function looksLikeDecisionLogicMessage(data: unknown): boolean {
  if (typeof data === "string") {
    return /json\s*\|/i.test(data) || /requestCode|institutionName|"status"\s*:/i.test(data);
  }
  const obj = asRecord(data);
  if (!obj) return false;
  return Boolean(
    obj.getEvent != null ||
      obj.requestCode != null ||
      obj.RequestCode != null ||
      obj.status != null ||
      obj.Status != null,
  );
}

function reportLooksVerified(body: Record<string, unknown>): DecisionLogicWidgetResult | null {
  const data = asRecord(body.data) || body;
  const detailsRaw = data.reportsDetails ?? data.ReportsDetails;
  const details = Array.isArray(detailsRaw) ? asRecord(detailsRaw[0]) : null;
  const row = details || data;
  const statusRaw = row.status ?? row.Status;
  const status =
    typeof statusRaw === "number" ? statusRaw : statusRaw != null ? Number(statusRaw) : undefined;
  const institutionName = String(row.institutionName || row.InstitutionName || "").trim();
  const verifiedFlag = Boolean(row.isVerified || row.IsVerified || row.isLoginValid || row.IsLoginValid || row.isCompleted || row.IsCompleted);
  if (status === 3 || status === 600 || verifiedFlag) {
    return {
      requestCode: String(row.requestCode || row.RequestCode || ""),
      status: Number.isFinite(status) ? status : 3,
      institutionName: institutionName || undefined,
      raw: body,
    };
  }
  return null;
}

function collectText(root: ParentNode | null | undefined): string {
  if (!root) return "";
  const parts: string[] = [];
  const walk = (node: Node) => {
    if (node.nodeType === Node.TEXT_NODE) {
      const t = node.textContent?.trim();
      if (t) parts.push(t);
      return;
    }
    if (node.nodeType !== Node.ELEMENT_NODE) return;
    const el = node as Element & { shadowRoot?: ShadowRoot | null };
    if (el.shadowRoot) walk(el.shadowRoot);
    el.childNodes.forEach(walk);
  };
  walk(root as Node);
  return parts.join(" ");
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

    let finished = false;
    const complete = (parsed: DecisionLogicWidgetResult) => {
      if (finished) return;
      finished = true;
      onComplete?.({ ...parsed, requestCode: parsed.requestCode || requestCode });
    };

    const handleParsed = (parsed: DecisionLogicWidgetResult | null, fromWidgetEvent: boolean) => {
      if (!parsed) {
        if (fromWidgetEvent) onError?.("DecisionLogic widget returned an empty result.");
        return;
      }
      if (parsed.status != null && parsed.status < 0) {
        onError?.(
          `Bank verification failed (status ${parsed.status}). Please try another account.`,
        );
        return;
      }
      if (isVerifiedResult(parsed)) {
        complete(parsed);
      }
    };

    const onGetEvent = (event: Event) => {
      const custom = event as CustomEvent;
      handleParsed(parseWidgetDetail(custom.detail), true);
    };

    const onMessage = (event: MessageEvent) => {
      if (!looksLikeDecisionLogicMessage(event.data)) return;
      handleParsed(parseWidgetDetail(event.data), false);
    };

    // Docs attach on the widget element; some builds bubble poorly — listen both places.
    const el = document.getElementById(widgetId);
    el?.addEventListener("getEvent", onGetEvent);
    document.addEventListener("getEvent", onGetEvent, true);
    window.addEventListener("message", onMessage);

    // Fallback: profile may show Success UI without firing getEvent/JSON callback.
    const host = containerRef.current;
    const checkDomSuccess = () => {
      if (finished) return;
      const text = `${collectText(host)} ${collectText(el)}`;
      if (SUCCESS_TEXT.test(text)) {
        complete({
          requestCode,
          status: 3,
          institutionName: /WorldWide Savings/i.test(text) ? "WorldWide Savings" : undefined,
          raw: { source: "dom-success-text" },
        });
      }
    };
    checkDomSuccess();
    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(() => checkDomSuccess())
        : null;
    if (host) observer?.observe(host, { childList: true, subtree: true, characterData: true });
    const pollDom = window.setInterval(checkDomSuccess, 1500);

    // Fallback: poll report API until DecisionLogic marks the request verified.
    const pollReport = window.setInterval(() => {
      if (finished) return;
      void fetch("/api/decisionlogic/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ requestCode }),
      })
        .then(async (res) => {
          if (!res.ok) return;
          const body = (await res.json()) as Record<string, unknown>;
          const verified = reportLooksVerified(body);
          if (verified) complete({ ...verified, requestCode: verified.requestCode || requestCode });
        })
        .catch(() => {
          /* ignore transient poll errors */
        });
    }, 4000);

    return () => {
      el?.removeEventListener("getEvent", onGetEvent);
      document.removeEventListener("getEvent", onGetEvent, true);
      window.removeEventListener("message", onMessage);
      observer?.disconnect();
      window.clearInterval(pollDom);
      window.clearInterval(pollReport);
    };
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
