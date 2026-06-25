import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { toast } from "sonner";
import { Loader2, Rocket } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { publishFn } from "@/lib/admin/functions";
import type { DeploymentState } from "@/lib/admin/types";

const STATUS_LABEL: Record<DeploymentState["status"], string> = {
  idle: "Never published",
  building: "Publishing…",
  success: "Published",
  failed: "Failed",
};

function statusVariant(
  status: DeploymentState["status"],
): "default" | "secondary" | "destructive" {
  if (status === "success") return "default";
  if (status === "failed") return "destructive";
  return "secondary";
}

function formatTimestamp(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  });
}

/**
 * The primary publish action plus the last-deployment readout.
 * `publishFn` runs entirely on the server; this component never sees any
 * deployment secret.
 */
export function PublishPanel({ initial }: { initial: DeploymentState }) {
  const publish = useServerFn(publishFn);
  const [deployment, setDeployment] = useState<DeploymentState>(initial);
  const [isPublishing, setIsPublishing] = useState(false);

  async function handlePublish() {
    setIsPublishing(true);
    setDeployment((d) => ({ ...d, status: "building" }));
    try {
      const result = await publish();
      setDeployment(result);
      if (result.status === "success") {
        toast.success("Published", { description: result.message ?? undefined });
      } else {
        toast.error("Publish failed", { description: result.message ?? undefined });
      }
    } catch (err) {
      setDeployment((d) => ({ ...d, status: "failed" }));
      toast.error("Publish failed", {
        description: err instanceof Error ? err.message : "Unexpected error.",
      });
    } finally {
      setIsPublishing(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between rounded-lg border border-line bg-paper-card px-4 py-3">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-mid">
            Last deployment
          </p>
          <p className="mt-1 text-sm text-ink">
            {formatTimestamp(deployment.timestamp)}
          </p>
        </div>
        <Badge variant={statusVariant(deployment.status)}>
          {STATUS_LABEL[deployment.status]}
        </Badge>
      </div>

      <Button
        size="lg"
        className="w-full"
        onClick={handlePublish}
        disabled={isPublishing}
        aria-busy={isPublishing}
      >
        {isPublishing ? (
          <>
            <Loader2 className="animate-spin" />
            Publishing…
          </>
        ) : (
          <>
            <Rocket />
            Publish website
          </>
        )}
      </Button>

      <p className="text-center text-xs text-mid">
        Publishing rebuilds and deploys the live site. No GitHub or Netlify
        access required.
      </p>
    </div>
  );
}
