import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Loader2, AlertCircle, ShieldCheck, AlertTriangle, ChevronRight, ImageIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function BriefsPage() {
  const summary = useQuery(api.briefs.getReviewQueueBriefsSummary, {});

  if (summary === undefined)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] space-y-4 p-6 bg-[#080909]">
          <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
          <p className="text-white/50 animate-pulse">Loading incident reports...</p>
        </div>
      </DashboardLayout>
    );

  const { items, totals } = summary;

  return (
    <DashboardLayout>
      <header className="sticky top-0 z-40 border-b bg-white px-6 py-4">
        <h1 className="text-lg font-semibold text-gray-900">Incident Reports</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          Summary of all review queue images and patrol incident reports
        </p>
      </header>

      <div className="flex-1 p-6 overflow-auto">
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Totals summary */}
          <Card className="border border-white/[0.09] bg-[#111213]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400">
                Audit Trail Summary
              </CardTitle>
              <CardDescription className="text-white/50">
                Aggregated counts across all completed batches
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-semibold uppercase text-white/50">Total Images</span>
                  <span className="text-2xl font-bold font-mono text-white">{totals.totalImages}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <span className="text-xs font-semibold uppercase text-destructive">Threat: Critical</span>
                  <span className="text-2xl font-bold font-mono text-destructive">{totals.urgentCount}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-xs font-semibold uppercase text-orange-700">Threat: High</span>
                  <span className="text-2xl font-bold font-mono text-orange-700">{totals.priorityCount}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-blue-500/10 border border-blue-500/20">
                  <span className="text-xs font-semibold uppercase text-blue-700">Threat: Medium</span>
                  <span className="text-2xl font-bold font-mono text-blue-700">{totals.reviewCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Per-batch briefs */}
          <div>
            <h2 className="text-lg font-bold text-white mb-4">Batch Incident Reports</h2>
            {items.length === 0 ? (
              <Card className="border-dashed border-white/20 bg-[#111213]">
                <CardContent className="py-12 text-center">
                  <FileText className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70 font-medium">No incident reports yet</p>
                  <p className="text-sm text-white/40 mt-1">
                    Upload images and generate incident reports from the results page.
                  </p>
                  <Link to="/upload" className="mt-4 inline-block">
                    <Button className="gap-2 bg-white text-black hover:bg-white/90">Go to AI Triage</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {items.map((item) => (
                  <Link key={item.batchId} to={`/results/${item.batchId}`}>
                    <Card className="border-white/[0.09] bg-[#111213] hover:border-white/20 hover:shadow-lg transition-all cursor-pointer">
                      <CardHeader className="pb-3">
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <CardTitle className="text-base text-white">IR-{item.batchId.slice(-6).toUpperCase()}</CardTitle>
                            <CardDescription className="text-xs mt-0.5 text-white/50">
                              {formatDistanceToNow(item.batchCreatedAt, { addSuffix: true })}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            <Badge variant="destructive" className="gap-1 text-[10px]">
                              <AlertCircle className="h-2.5 w-2.5" /> Critical: {item.urgentCount}
                            </Badge>
                            <Badge className="bg-orange-500 text-[10px] gap-1">
                              <ShieldCheck className="h-2.5 w-2.5" /> High: {item.priorityCount}
                            </Badge>
                            <Badge variant="outline" className="text-blue-500 text-[10px] gap-1">
                              <AlertTriangle className="h-2.5 w-2.5" /> Medium: {item.reviewCount}
                            </Badge>
                            <ChevronRight className="h-4 w-4 text-white/40" />
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <div className="rounded-lg bg-muted/40 p-4 border-l-4 border-primary/30">
                          <p className="text-sm text-foreground/90 whitespace-pre-wrap line-clamp-4 font-medium">
                            {item.briefText}
                          </p>
                        </div>
                        <div className="flex items-center gap-4 mt-3 text-xs text-white/40">
                          <span>Response -{item.kpis.timeSavedSeconds}s</span>
                          <span>Critical: {item.kpis.priorityCount}</span>
                          <span>Confidence: {item.kpis.verificationRate}%</span>
                          <span className="flex items-center gap-1">
                            <ImageIcon className="h-3 w-3" /> {item.totalImages} images
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
