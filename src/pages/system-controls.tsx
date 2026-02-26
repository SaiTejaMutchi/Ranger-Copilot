import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, Settings, ShieldCheck, Database, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function SystemControlsPage() {
  const batches = useQuery(api.batches.listBatches, { limit: 5 });
  const clearAll = useMutation(api.batches.clearAllTriagedData);

  const handleClear = async () => {
    await clearAll({});
  };

  return (
    <DashboardLayout>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080909] px-6 py-4">
        <h1 className="text-lg font-semibold text-white/90">System Controls</h1>
        <p className="text-sm text-white/50 mt-0.5">
          System configuration and data management
        </p>
      </header>

      <div className="flex-1 p-6 overflow-auto bg-[#080909]">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card className="border border-white/[0.09] bg-[#111213]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-emerald-400 flex items-center gap-2">
                <Settings className="h-4 w-4" />
                System Status
              </CardTitle>
              <CardDescription className="text-white/50">
                ShieldDispatch operational status and configuration
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <ShieldCheck className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">AI Triage Pipeline</p>
                  <p className="text-xs text-white/50">Active · GPT-4o-mini inference</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
                <Database className="h-5 w-5 text-emerald-400" />
                <div>
                  <p className="text-sm font-semibold text-white">Database</p>
                  <p className="text-xs text-white/50">
                    {batches === undefined ? "Loading..." : `${batches.length} recent batch(es)`}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/[0.09] bg-[#111213]">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-red-400 flex items-center gap-2">
                <Trash2 className="h-4 w-4" />
                Data Management
              </CardTitle>
              <CardDescription className="text-white/50">
                Clear all triaged data (batches, images, briefs, verifications)
              </CardDescription>
            </CardHeader>
            <CardContent>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline" size="sm" className="gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
                    <Trash2 className="h-4 w-4" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear all triaged data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all batches, images, briefs, and verifications. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleClear()}
                      className="bg-red-600 hover:bg-red-700 focus:ring-red-600"
                    >
                      Clear all
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
