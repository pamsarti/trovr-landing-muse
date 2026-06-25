// Server-only deployment service.
//
// ┌─────────────────────────────────────────────────────────────────────────┐
// │  THIS IS THE SINGLE INTEGRATION POINT FOR NETLIFY.                        │
// │                                                                           │
// │  `triggerDeploy()` is the only function the rest of the app calls. To go  │
// │  live, change its body from `return mockDeploy()` to                      │
// │  `return netlifyDeploy()`. Nothing else in the codebase needs to change.  │
// └─────────────────────────────────────────────────────────────────────────┘
import { getAdminConfig } from "./config.server";
import type { DeploymentState, DeployStatus } from "./types";

export interface DeployResult {
  status: DeployStatus;
  message: string;
  timestamp: string;
}

/**
 * Trigger a publish/deploy of the website.
 *
 * Swap the implementation here when connecting the real Netlify Deploy Hook.
 */
export async function triggerDeploy(): Promise<DeployResult> {
  // --- LOCAL MOCK (current) -------------------------------------------------
  return mockDeploy();

  // --- REAL NETLIFY (enable later) -----------------------------------------
  // return netlifyDeploy();
}

/**
 * Simulates a deployment so the full publish UX can be validated locally
 * without touching any production service. Succeeds after a short delay.
 */
export async function mockDeploy(): Promise<DeployResult> {
  await new Promise((resolve) => setTimeout(resolve, 1500));
  return {
    status: "success",
    message: "Mock deploy completed. (No real site was published.)",
    timestamp: new Date().toISOString(),
  };
}

/**
 * Real implementation: POSTs to the Netlify build hook to start a deploy.
 * Reads `NETLIFY_DEPLOY_HOOK` from the server environment only — the hook URL
 * is never exposed to the browser.
 *
 * Already written and ready: enabling it is a one-line change in
 * `triggerDeploy()` above.
 */
export async function netlifyDeploy(): Promise<DeployResult> {
  const { config } = getAdminConfig();
  const hook = config.netlifyDeployHook;

  if (!hook) {
    return {
      status: "failed",
      message: "NETLIFY_DEPLOY_HOOK is not configured.",
      timestamp: new Date().toISOString(),
    };
  }

  const res = await fetch(hook, { method: "POST" });
  if (!res.ok) {
    return {
      status: "failed",
      message: `Netlify build hook returned HTTP ${res.status}.`,
      timestamp: new Date().toISOString(),
    };
  }

  return {
    status: "success",
    message: "Deploy triggered on Netlify.",
    timestamp: new Date().toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Last-deployment tracking.
//
// For the local mock we remember the most recent deploy in module memory so the
// dashboard can display "Last deployment status/timestamp". This resets when
// the dev server restarts. A real implementation would instead read the latest
// deploy from the Netlify API.
// ---------------------------------------------------------------------------
let lastDeployment: DeploymentState = {
  status: "idle",
  timestamp: null,
  message: null,
};

export function getLastDeployment(): DeploymentState {
  return lastDeployment;
}

export function recordDeployment(result: DeployResult): DeploymentState {
  lastDeployment = {
    status: result.status,
    timestamp: result.timestamp,
    message: result.message,
  };
  return lastDeployment;
}
