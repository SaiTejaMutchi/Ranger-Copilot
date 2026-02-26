import { Link } from "react-router";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import {
    ListTodo,
    Loader2,
    ChevronRight,
    ImageIcon,
    CheckCircle2,
    Upload,
    Trash2,
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export default function ReviewQueuePage() {
    const batches = useQuery(api.batches.listBatches, { limit: 50 });
    const clearAll = useMutation(api.batches.clearAllTriagedData);
    const completedBatches = batches?.filter((b) => b.status === "completed") ?? [];

    const handleClear = async () => {
        await clearAll({});
    };

    return (
        <DashboardLayout>
            <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080909] px-6 py-4">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <h1 className="text-lg font-semibold text-white/90">Audit Trail</h1>
                        {completedBatches.length > 0 && (
                            <span className="inline-flex items-center justify-center h-5 min-w-[20px] px-1.5 rounded-full bg-orange-500/20 text-orange-400 text-xs font-bold">
                                {completedBatches.length}
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {completedBatches.length > 0 && (
                            <AlertDialog>
                                <AlertDialogTrigger asChild>
                                    <Button variant="outline" size="sm" className="gap-2 text-red-400 border-red-500/30 hover:bg-red-500/10">
                                        <Trash2 className="h-4 w-4" />
                                        Clear all
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
                        )}
                        <Link to="/upload">
                            <Button size="sm" className="gap-2 bg-white text-black hover:bg-white/90">
                                <Upload className="h-4 w-4" />
                                New Batch
                            </Button>
                        </Link>
                    </div>
                </div>
            </header>

            <div className="flex-1 p-6 overflow-auto bg-[#080909]">
                <div className="max-w-4xl mx-auto space-y-4">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="inline-flex p-2.5 rounded-xl bg-white/10">
                            <ListTodo className="h-7 w-7 text-emerald-400" />
                        </div>
                        <div>
                            <h2 className="text-xl font-bold text-white">Triaged Batches</h2>
                            <p className="text-sm text-white/50">All AI-processed field batches ready for ranger review.</p>
                        </div>
                    </div>

                    {batches === undefined ? (
                        <div className="flex items-center justify-center py-16">
                            <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                        </div>
                    ) : completedBatches.length === 0 ? (
                        <div className="flex flex-col items-center justify-center py-16 border-2 border-dashed border-white/20 rounded-2xl text-center bg-[#111213]">
                            <CheckCircle2 className="h-12 w-12 text-white/30 mb-3" />
                            <p className="text-white/70 font-semibold">Queue is clear</p>
                            <p className="text-sm text-white/40 mt-1 max-w-xs">
                                No processed batches yet. Upload field images to start AI triage.
                            </p>
                            <Link to="/upload" className="mt-4">
                                <Button className="gap-2 bg-white text-black hover:bg-white/90">
                                    <Upload className="h-4 w-4" />
                                    Upload images
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {completedBatches.map((batch) => (
                                <Link key={batch._id} to={`/results/${batch._id}`}>
                                    <Card className="border-white/[0.09] bg-[#111213] hover:border-white/20 hover:shadow-sm transition-all cursor-pointer">
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-4">
                                                <div className="h-10 w-10 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                                                    <ImageIcon className="h-5 w-5 text-emerald-400" />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                    <p className="text-sm font-semibold text-white truncate">{batch.name}</p>
                                                    <p className="text-xs text-white/50 mt-0.5">
                                                        {formatDistanceToNow(batch.createdAt, { addSuffix: true })}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-3 shrink-0">
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-white/10 text-emerald-400 border border-white/10">
                                                        Review
                                                    </span>
                                                    <ChevronRight className="h-4 w-4 text-white/40" />
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </Link>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </DashboardLayout>
    );
}
