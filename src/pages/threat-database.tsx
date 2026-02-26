import { Link } from "react-router";
import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Loader2, Database, AlertCircle, ShieldCheck, AlertTriangle, ChevronRight, FileImage } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ThreatDatabasePage() {
  const data = useQuery(api.batches.getThreatDatabase, { limit: 100 });

  if (data === undefined)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] space-y-4 p-6 bg-[#080909]">
          <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
          <p className="text-white/50 animate-pulse">Loading threat database...</p>
        </div>
      </DashboardLayout>
    );

  const totalImages = data.reduce((acc, row) => acc + row.images.length, 0);
  const urgentCount = data.reduce((acc, row) => acc + row.images.filter((i) => i.priorityCategory === "URGENT").length, 0);
  const priorityCount = data.reduce((acc, row) => acc + row.images.filter((i) => i.priorityCategory === "PRIORITY").length, 0);

  return (
    <DashboardLayout>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080909] px-6 py-4">
        <h1 className="text-lg font-semibold text-white/90">Threat Database</h1>
        <p className="text-sm text-white/50 mt-0.5">
          All files and data across batches — images, threat levels, and analysis
        </p>
      </header>

      <div className="flex-1 p-6 overflow-auto bg-[#080909]">
        <div className="max-w-5xl mx-auto space-y-6">
          {/* Totals */}
          <Card className="border border-white/[0.09] bg-[#111213]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Database className="h-4 w-4" />
                Database Summary
              </CardTitle>
              <CardDescription className="text-white/50">
                Aggregated counts across all batches and files
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-semibold uppercase text-white/50">Batches</span>
                  <span className="text-2xl font-bold font-mono text-white">{data.length}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-white/5 border border-white/10">
                  <span className="text-xs font-semibold uppercase text-white/50">Total Files</span>
                  <span className="text-2xl font-bold font-mono text-white">{totalImages}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-destructive/10 border border-destructive/20">
                  <span className="text-xs font-semibold uppercase text-destructive">Critical</span>
                  <span className="text-2xl font-bold font-mono text-destructive">{urgentCount}</span>
                </div>
                <div className="flex flex-col gap-1 p-4 rounded-xl bg-orange-500/10 border border-orange-500/20">
                  <span className="text-xs font-semibold uppercase text-orange-700">High</span>
                  <span className="text-2xl font-bold font-mono text-orange-700">{priorityCount}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Per-batch files */}
          <div>
            <h2 className="text-base font-bold text-white mb-4">All Batches & Files</h2>
            {data.length === 0 ? (
              <Card className="border-dashed border-white/20 bg-[#111213]">
                <CardContent className="py-12 text-center">
                  <Database className="h-12 w-12 text-white/30 mx-auto mb-3" />
                  <p className="text-white/70 font-medium">No data yet</p>
                  <p className="text-sm text-white/40 mt-1">Upload images to populate the threat database.</p>
                  <Link to="/upload" className="mt-4 inline-block">
                    <Badge className="bg-emerald-600 hover:bg-emerald-500 px-4 py-2 cursor-pointer">Go to AI Triage</Badge>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {data.map((row) => {
                  const { batch, images } = row;
                  const irNum = "IR-" + batch._id.slice(-6).toUpperCase();
                  const byThreat = {
                    Critical: images.filter((i) => i.priorityCategory === "URGENT"),
                    High: images.filter((i) => i.priorityCategory === "PRIORITY"),
                    Medium: images.filter((i) => i.priorityCategory === "REVIEW"),
                    Low: images.filter((i) => i.priorityCategory === "ALL" || !["URGENT", "PRIORITY", "REVIEW"].includes(i.priorityCategory ?? "")),
                  };
                  return (
                    <Link key={batch._id} to={`/results/${batch._id}`}>
                      <Card className="border-white/[0.09] bg-[#111213] hover:border-white/20 hover:shadow-lg transition-all cursor-pointer">
                        <CardHeader className="pb-3">
                          <div className="flex items-start justify-between gap-4">
                            <div>
                              <CardTitle className="text-base text-white flex items-center gap-2">
                                <span className="font-mono text-emerald-400">{irNum}</span>
                                <span className="text-white/60 font-normal">·</span>
                                {batch.name}
                              </CardTitle>
                              <CardDescription className="text-xs mt-0.5 text-white/50">
                                {formatDistanceToNow(batch.createdAt, { addSuffix: true })} · {images.length} file{images.length !== 1 ? "s" : ""}
                              </CardDescription>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <Badge variant="destructive" className="gap-1 text-[10px]">
                                <AlertCircle className="h-2.5 w-2.5" /> {byThreat.Critical.length}
                              </Badge>
                              <Badge className="bg-orange-500 text-[10px] gap-1">{byThreat.High.length}</Badge>
                              <Badge variant="outline" className="text-blue-500 text-[10px]">{byThreat.Medium.length}</Badge>
                              <Badge variant="secondary" className="text-[10px]">{byThreat.Low.length}</Badge>
                              <ChevronRight className="h-4 w-4 text-white/40" />
                            </div>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-0">
                          <div className="space-y-2 max-h-48 overflow-y-auto">
                            {images.slice(0, 20).map((img) => (
                              <div
                                key={img._id}
                                className="flex items-center gap-3 py-2 px-3 rounded-lg bg-white/5 border border-white/5"
                              >
                                <FileImage className="h-4 w-4 text-white/40 shrink-0" />
                                <span className="text-xs font-mono text-white/80 truncate flex-1">{img.fileName}</span>
                                <Badge
                                  variant={
                                    img.priorityCategory === "URGENT"
                                      ? "destructive"
                                      : img.priorityCategory === "PRIORITY"
                                        ? "default"
                                        : "outline"
                                  }
                                  className="text-[9px] shrink-0"
                                >
                                  {img.priorityCategory === "URGENT"
                                    ? "Critical"
                                    : img.priorityCategory === "PRIORITY"
                                      ? "High"
                                      : img.priorityCategory === "REVIEW"
                                        ? "Medium"
                                        : "Low"}
                                </Badge>
                                <span className="text-[10px] font-mono text-white/40 shrink-0">
                                  Score: {(img.priorityScore ?? 0).toFixed(1)}
                                </span>
                              </div>
                            ))}
                            {images.length > 20 && (
                              <p className="text-xs text-white/40 py-2">+{images.length - 20} more files</p>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
