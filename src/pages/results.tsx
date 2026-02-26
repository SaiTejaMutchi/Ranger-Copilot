import { useParams, Link } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery, useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, ShieldCheck, CheckCircle2, ChevronRight, ChevronDown, FileText, BarChart3, Clock, Volume2, Loader2, Play, Pause, Database, FolderOpen, Calendar, MapPin, AlertTriangle, Bell, Users, Car, PawPrint, Swords } from "lucide-react";
import { format } from "date-fns";
import { getSourceFromFileName } from "@/lib/source";
// Backend handles labels and triage mapping.
// Removed local MOCK_LABELS.

export default function ResultsPage() {
    const { batchId } = useParams<{ batchId: Id<"batches"> }>();
    const images = useQuery(api.batches.getBatchResults, { batchId: batchId as Id<"batches"> });
    const brief = useQuery(api.briefs.getBrief, { batchId: batchId as Id<"batches"> });

    const generateBrief = useMutation(api.briefs.generateBrief);
    const generateVoiceAction = useAction(api.elevenlabs.generateVoiceBrief);
    const verifyImage = useMutation(api.images.verifyImage);
    const approveForPatrol = useMutation(api.images.approveForPatrol);
    const sendPatrolNotifications = useMutation(api.images.sendPatrolNotifications);

    const exportTrainingData = useQuery(api.images.exportTrainingSet);

    const [isGeneratingVoice, setIsGeneratingVoice] = useState(false);
    const [expandedSource, setExpandedSource] = useState<string | null>(null);
    const [isSendingNotifications, setIsSendingNotifications] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const narrationRequestedFor = useRef<Id<"briefs"> | null>(null);

    // Generate narration by default when a brief exists and has no audio yet
    useEffect(() => {
        if (!brief || brief.audioUrl || isGeneratingVoice) return;
        if (narrationRequestedFor.current === brief._id) return;
        narrationRequestedFor.current = brief._id;
        setIsGeneratingVoice(true);
        generateVoiceAction({ briefId: brief._id })
            .catch((err) => console.error("Auto-narration failed:", err))
            .finally(() => setIsGeneratingVoice(false));
    }, [brief?._id, brief?.audioUrl, isGeneratingVoice, generateVoiceAction]);

    if (!images) return (
        <DashboardLayout>
            <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] space-y-4 p-6 bg-[#080909]">
                <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
                <p className="text-white/50 animate-pulse">Synchronizing field data...</p>
            </div>
        </DashboardLayout>
    );

    const getThreatLevel = (category: string) => {
        switch (category) {
            case "URGENT": return { level: "Critical", variant: "destructive" as const };
            case "PRIORITY": return { level: "High", variant: "default" as const };
            case "REVIEW": return { level: "Medium", variant: "outline" as const };
            default: return { level: "Low", variant: "secondary" as const };
        }
    };

    const getThreatBadge = (category: string, score: number) => {
        const isNone = (score ?? 0) === 0;
        const { level, variant } = isNone ? { level: "None" as const, variant: "secondary" as const } : getThreatLevel(category);
        const cls = variant === "destructive" ? "gap-1 text-[10px] animate-pulse" : variant === "default" ? "gap-1 text-[10px] bg-orange-500 hover:bg-orange-600" : variant === "outline" ? "gap-1 text-[10px] text-blue-500 border-blue-500" : "gap-1 text-[10px]";
        return <Badge variant={variant} className={cls}><AlertCircle className="h-2.5 w-2.5" /> Threat: {level}</Badge>;
    };

    const ImagePanel = ({ img, source }: { img: (typeof images)[0]; source: string }) => {
        const pa = (img as any).poachingAnalysis;
        const analysisPara = pa?.analysisParagraph ?? img.rationale ?? img.priorityReason;
        const fileTime = img.captureDate ? format(img.captureDate, "hh:mm a") : null;
        const timeStr = pa?.time ?? fileTime ?? "—";
        const animalNames = ["elephant", "rhino", "deer", "bobcat", "fox", "coyote", "raccoon", "opossum", "skunk", "mountain lion"];
        const extractAnimalType = (text: string) => {
            const lower = (text ?? "").toLowerCase();
            const found = animalNames.find((a) => lower.includes(a));
            return found ? found.charAt(0).toUpperCase() + found.slice(1).replace("_", " ") : null;
        };
        const animalType = pa?.species ?? extractAnimalType(analysisPara ?? "") ?? "—";
        const stats = [
            { icon: Users, label: "Humans", value: pa?.humans != null ? `${pa.humans} detected` : "—" },
            { icon: Car, label: "Vehicles", value: pa?.vehicles ?? "—" },
            { icon: PawPrint, label: "Animal type", value: animalType },
            { icon: Clock, label: "Time", value: timeStr },
            { icon: Swords, label: "Arms visible", value: pa?.armsVisible ?? "—" },
        ];
        const followUps = ["Verify tusk condition", "Check for conservation tags", "Confirm vehicle registration", "Request satellite overlay"];
        return (
            <div className="p-4 space-y-3 border-b last:border-b-0">
                <div className="flex items-center gap-2 flex-wrap">
                    {getThreatBadge(img.priorityCategory, img.priorityScore ?? 0)}
                    <Badge variant="secondary" className="font-mono text-[10px]">Score: {(img.priorityScore ?? 0).toFixed(1)}</Badge>
                </div>
                <div className="aspect-video max-h-[140px] w-full max-w-[220px] bg-muted rounded-lg overflow-hidden relative border border-background shadow-inner">
                    {img.fileUrl ? <img src={img.fileUrl} className="h-full w-full object-cover" alt={img.fileName} /> : <div className="h-full flex items-center justify-center"><Volume2 className="h-5 w-5 opacity-20" /></div>}
                    {img.verificationStatus !== "UNVERIFIED" && <div className="absolute inset-0 bg-green-500/20 flex items-center justify-center"><CheckCircle2 className="h-6 w-6 text-green-600 drop-shadow" /></div>}
                </div>
                <p className="text-[10px] font-mono text-muted-foreground truncate">{img.fileName}</p>
                {(img.captureDate ?? img.location) && (
                    <div className="flex flex-wrap gap-2 text-[9px] text-muted-foreground">
                        {img.captureDate && <span className="flex items-center gap-1"><Calendar className="h-2.5 w-2.5" />{format(img.captureDate, "PPp")}</span>}
                        {img.location && <a href={`https://www.google.com/maps?q=${img.location.lat},${img.location.lng}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 hover:text-primary"><MapPin className="h-2.5 w-2.5" />{img.location.lat.toFixed(5)}, {img.location.lng.toFixed(5)}</a>}
                    </div>
                )}
                <div className="p-3 bg-muted/40 rounded-xl space-y-2 border border-dashed border-primary/20">
                    <h4 className="text-[9px] font-black uppercase tracking-[0.2em] text-primary flex items-center gap-1">{img.uncertaintyFlag ? <AlertTriangle className="h-2.5 w-2.5 text-orange-500" /> : <AlertCircle className="h-2.5 w-2.5 text-sky-500" />} Poaching Analysis</h4>
                    <p className="text-xs leading-relaxed font-medium">{analysisPara || "No analysis available."}</p>
                    {fileTime && <p className="text-[10px] text-muted-foreground font-mono">File: {format(img.captureDate!, "PPpp")}</p>}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-2 border-t border-primary/10">
                        {stats.map(({ icon: Icon, label, value }) => (
                            <div key={label} className="flex items-center gap-1.5">
                                <Icon className="h-3 w-3 text-primary shrink-0" />
                                <div>
                                    <p className="text-[9px] uppercase text-muted-foreground">{label}</p>
                                    <p className="text-[10px] font-medium">{value}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                    {followUps.map((q) => (
                        <span key={q} className="inline-flex px-2 py-1 rounded-md bg-muted/50 text-[9px] text-muted-foreground border border-border/50">{q}</span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <Button size="sm" className="flex-1 gap-1.5 font-bold" onClick={() => verifyImage({ imageId: img._id })} disabled={img.verificationStatus !== "UNVERIFIED"}>
                        🚨 Dispatch Rangers
                    </Button>
                    <Button variant="outline" size="sm" className="flex-1 gap-1.5 font-bold" onClick={() => alert("Escalated to command center.")}>
                        ⚡ Escalate
                    </Button>
                </div>
            </div>
        );
    };

    const handleGenerateBrief = async () => {
        if (!batchId) return;
        await generateBrief({
            batchId: batchId as Id<"batches">,
        });
    };

    const handleNarrate = async () => {
        if (!brief) return;
        setIsGeneratingVoice(true);
        try {
            await generateVoiceAction({ briefId: brief._id });
        } catch (error) {
            console.error(error);
        } finally {
            setIsGeneratingVoice(false);
        }
    };

    const togglePlayback = () => {
        const audio = document.getElementById("brief-audio") as HTMLAudioElement;
        if (audio) {
            if (isPlaying) {
                audio.pause();
            } else {
                audio.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    return (
        <DashboardLayout>
        <div className="flex-1 p-6 overflow-auto bg-[#080909]">
        <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <span className="text-[10px] text-muted-foreground font-mono">v1.2.4-stable</span>
                    </div>
                    <h1 className="text-4xl font-extrabold tracking-tight">Operations Center</h1>
                    <p className="text-muted-foreground">Automated field triage for batch <span className="font-mono text-primary">{batchId?.slice(-8)}</span></p>
                </div>
                {!brief && images.length > 0 && (
                    <div className="flex gap-2">
                        <Button
                            variant="outline"
                            onClick={async () => {
                                console.log("Exported Training Set:", exportTrainingData);
                                alert(`Training set exported (${exportTrainingData?.length || 0} corrections). Check log for CSV metadata.`);
                            }}
                            className="gap-2 text-black hover:text-black hover:bg-muted"
                        >
                            <Database className="h-4 w-4" />
                            Export data
                        </Button>
                        <Button onClick={handleGenerateBrief} className="gap-2 shadow-lg" size="lg">
                            <FileText className="h-4 w-4" />
                            Summarize Findings
                        </Button>
                    </div>
                )}
            </div>

            {brief && (
                <Card className="border-primary/20 bg-background overflow-hidden relative shadow-xl">
                    <div className="absolute top-0 right-0 p-4">
                        {!brief.audioUrl ? (
                            <Button
                                variant="outline"
                                size="sm"
                                className="gap-2 bg-background/50 backdrop-blur-sm"
                                onClick={handleNarrate}
                                disabled={isGeneratingVoice}
                            >
                                {isGeneratingVoice ? <Loader2 className="h-3 w-3 animate-spin" /> : <Volume2 className="h-3 w-3" />}
                                {isGeneratingVoice ? "Calling ranger to send message" : "Retry voice"}
                            </Button>
                        ) : (
                            <div className="flex items-center gap-2 bg-background/80 backdrop-blur-sm border rounded-full px-4 py-1.5 shadow-sm">
                                <Volume2 className="h-3.5 w-3.5 text-primary" />
                                <span className="text-[10px] font-bold uppercase tracking-widest text-primary">Listen to voice message sent</span>
                                <audio
                                    id="brief-audio"
                                    src={brief.audioUrl}
                                    onEnded={() => setIsPlaying(false)}
                                    className="hidden"
                                />
                                <Button size="icon" variant="ghost" className="h-6 w-6 rounded-full" onClick={togglePlayback}>
                                    {isPlaying ? <Pause className="h-3 w-3" /> : <Play className="h-3 w-3 fill-primary text-primary" />}
                                </Button>
                            </div>
                        )}
                    </div>
                    <CardHeader className="bg-muted/30">
                        <CardTitle className="flex items-center gap-2 text-2xl">
                            <BarChart3 className="h-6 w-6 text-primary" />
                            Patrol Briefing
                        </CardTitle>
                        <CardDescription className="text-muted-foreground">AI-generated executive summary for rapid decision support.</CardDescription>
                    </CardHeader>
                    <CardContent className="grid gap-8 md:grid-cols-3">
                        <div className="space-y-4 prose prose-emerald dark:prose-invert max-w-none col-span-2 border-r pr-8">
                            <div
                                className="leading-relaxed whitespace-pre-wrap text-foreground/90 font-medium italic border-l-4 border-primary/20 pl-4 py-2"
                                dangerouslySetInnerHTML={{ __html: brief.text }}
                            />
                        </div>
                        <div className="space-y-6">
                            <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center">
                                <ShieldCheck className="mr-2 h-3 w-3" />
                                Mission Impact KPIs
                            </h4>
                            <div className="grid gap-4">
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border shadow-sm group hover:border-primary transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-primary/10 rounded-lg">
                                            <Clock className="h-5 w-5 text-primary" />
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Response Reduction</span>
                                    </div>
                                    <span className="text-xl font-bold font-mono">-{brief.kpis.timeSavedSeconds}s</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border shadow-sm group hover:border-destructive transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-destructive/10 rounded-lg">
                                            <AlertCircle className="h-5 w-5 text-destructive" />
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Critical Assets</span>
                                    </div>
                                    <span className="text-xl font-bold font-mono">{brief.kpis.priorityCount}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border shadow-sm group hover:border-green-500 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 bg-green-500/10 rounded-lg">
                                            <CheckCircle2 className="h-5 w-5 text-green-500" />
                                        </div>
                                        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Confidence Delta</span>
                                    </div>
                                    <span className="text-xl font-bold font-mono">{brief.kpis.verificationRate}%</span>
                                </div>
                            </div>
                            {(images.some((img) => img.captureDate) || images.some((img) => img.location)) && (
                                <>
                                    <h4 className="font-bold text-xs uppercase tracking-[0.2em] text-muted-foreground flex items-center pt-2">
                                        <MapPin className="mr-2 h-3 w-3" />
                                        Field Intelligence (EXIF)
                                    </h4>
                                    <div className="grid gap-4">
                                        {images.some((img) => img.captureDate) && (() => {
                                            const dates = images.filter((img) => img.captureDate).map((img) => img.captureDate!);
                                            const minT = Math.min(...dates);
                                            const maxT = Math.max(...dates);
                                            return (
                                                <div className="flex items-center justify-between p-4 bg-background rounded-xl border shadow-sm">
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <Calendar className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Capture Window</span>
                                                    </div>
                                                    <div className="text-right text-xs font-mono">
                                                        <div>{format(minT, "PP")} — {format(maxT, "PP")}</div>
                                                        <div className="text-muted-foreground">{dates.length} with timestamp</div>
                                                    </div>
                                                </div>
                                            );
                                        })()}
                                        {images.some((img) => img.location) && (() => {
                                            const coords = images.filter((img) => img.location).map((img) => img.location!);
                                            const lats = coords.map((c) => c.lat);
                                            const lngs = coords.map((c) => c.lng);
                                            const centerLat = (Math.min(...lats) + Math.max(...lats)) / 2;
                                            const centerLng = (Math.min(...lngs) + Math.max(...lngs)) / 2;
                                            return (
                                                <a
                                                    href={`https://www.google.com/maps?q=${centerLat},${centerLng}`}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center justify-between p-4 bg-background rounded-xl border shadow-sm hover:border-primary transition-colors"
                                                >
                                                    <div className="flex items-center gap-3">
                                                        <div className="p-2 bg-primary/10 rounded-lg">
                                                            <MapPin className="h-5 w-5 text-primary" />
                                                        </div>
                                                        <span className="text-xs font-semibold uppercase tracking-tight text-muted-foreground">Geographic Spread</span>
                                                    </div>
                                                    <div className="text-right text-xs font-mono">
                                                        <div>{centerLat.toFixed(5)}°, {centerLng.toFixed(5)}°</div>
                                                        <div className="text-muted-foreground">{coords.length} with GPS</div>
                                                    </div>
                                                </a>
                                            );
                                        })()}
                                    </div>
                                </>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Poaching Priority Index — approve and send notifications to patrol */}
            {images.some((img) => img.priorityCategory === "URGENT") && (
                <Card className="border-2 border-destructive/30 overflow-hidden">
                    <CardHeader className="pb-4 bg-destructive/5 border-b border-destructive/20">
                        <CardTitle className="text-sm font-bold uppercase tracking-widest flex items-center gap-2 text-destructive">
                            <AlertCircle className="h-4 w-4" />
                            Poaching Priority Index
                        </CardTitle>
                        <CardDescription className="text-xs">
                            Approve Critical-threat findings (poaching events) to send notifications to patrol.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="p-4">
                        <div className="space-y-3 mb-4">
                            {images
                                .filter((img) => img.priorityCategory === "URGENT")
                                .sort((a, b) => b.priorityScore - a.priorityScore)
                                .map((img) => (
                                    <div
                                        key={img._id}
                                        className="flex items-center gap-4 p-4 rounded-xl border-2 border-destructive/20 bg-background hover:bg-muted/40 transition-colors"
                                    >
                                        <Checkbox
                                            id={`approve-${img._id}`}
                                            checked={img.approvedForPatrol ?? false}
                                            onCheckedChange={(checked) =>
                                                approveForPatrol({ imageId: img._id, approved: checked === true })
                                            }
                                        />
                                        <label htmlFor={`approve-${img._id}`} className="flex-1 flex items-center gap-4 cursor-pointer">
                                            <div className="h-12 w-12 shrink-0 rounded-lg overflow-hidden bg-muted border">
                                                {img.fileUrl ? (
                                                    <img src={img.fileUrl} alt="" className="h-full w-full object-cover" />
                                                ) : (
                                                    <div className="h-full w-full flex items-center justify-center"><AlertCircle className="h-5 w-5 text-muted-foreground" /></div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-bold">
                                                    {img.fileName}
                                                </p>
                                                <p className="text-[10px] text-muted-foreground truncate">{img.fileName}</p>
                                            </div>
                                            <div className="shrink-0">
                                                <Badge variant="destructive" className="font-mono bg-red-600/90 text-white border-red-700">Threat Level: Critical</Badge>
                                            </div>
                                            {img.patrolNotifiedAt && (
                                                <Badge variant="secondary" className="gap-1 text-[10px] shrink-0">
                                                    <Bell className="h-3 w-3" /> Notified
                                                </Badge>
                                            )}
                                        </label>
                                    </div>
                                ))}
                        </div>
                        <Button
                            className="w-full gap-2 bg-destructive hover:bg-destructive/90"
                            disabled={
                                !images.some((img) => img.priorityCategory === "URGENT" && img.approvedForPatrol) ||
                                images.filter((img) => img.priorityCategory === "URGENT" && img.approvedForPatrol).every((img) => img.patrolNotifiedAt)
                            }
                            onClick={async () => {
                                if (!batchId) return;
                                setIsSendingNotifications(true);
                                try {
                                    const { notifiedCount } = await sendPatrolNotifications({ batchId: batchId as Id<"batches"> });
                                    alert(`Notification sent to patrol for ${notifiedCount} approved finding(s).`);
                                } catch (e) {
                                    console.error(e);
                                    alert("Failed to send notifications.");
                                } finally {
                                    setIsSendingNotifications(false);
                                }
                            }}
                        >
                            {isSendingNotifications ? <Loader2 className="h-4 w-4 animate-spin" /> : <Bell className="h-4 w-4" />}
                            {isSendingNotifications ? "Sending..." : "Send Notifications to Patrol"}
                        </Button>
                    </CardContent>
                </Card>
            )}

            <Card className="border-2 overflow-hidden">
                <button
                    type="button"
                    onClick={() => setExpandedSource(expandedSource ? null : "analysis")}
                    className="flex w-full items-center justify-between p-5 hover:bg-muted/80 group transition-colors text-left"
                >
                    <div className="flex items-center gap-3">
                        <FolderOpen className="h-5 w-5 text-muted-foreground group-hover:text-primary" />
                        <div>
                            <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/70">
                                Analysis
                            </CardTitle>
                            <CardDescription className="text-xs">
                                Click to expand and view poaching analysis by threat level.
                            </CardDescription>
                        </div>
                    </div>
                    <div className="p-1.5 rounded-full group-hover:bg-primary/10">
                        {expandedSource ? <ChevronDown className="h-4 w-4 text-muted-foreground group-hover:text-primary" /> : <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary" />}
                    </div>
                </button>
                {expandedSource && (
                    <CardContent className="px-0 pt-0 pb-4 border-t">
                        <div className="px-4 pt-4">
                            {(() => {
                                const byThreat = {
                                    Critical: images.filter((img) => img.priorityCategory === "URGENT"),
                                    High: images.filter((img) => img.priorityCategory === "PRIORITY"),
                                    Medium: images.filter((img) => img.priorityCategory === "REVIEW"),
                                    Low: images.filter((img) => img.priorityCategory === "ALL" || !["URGENT","PRIORITY","REVIEW"].includes(img.priorityCategory ?? "")),
                                };
                                const allImages = [...byThreat.Critical, ...byThreat.High, ...byThreat.Medium, ...byThreat.Low];
                                return allImages.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-10 opacity-40 grayscale">
                                        <ShieldCheck className="h-8 w-8 mb-2" />
                                        <p className="text-xs font-medium">No detections</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        <p className="text-[10px] font-mono text-muted-foreground uppercase">
                                            {byThreat.Critical.length} Critical · {byThreat.High.length} High · {byThreat.Medium.length} Medium · {byThreat.Low.length} Low
                                        </p>
                                        <div className="divide-y divide-border/50 rounded-lg border bg-muted/10 overflow-hidden">
                                            {allImages.map((img) => <ImagePanel key={img._id} img={img} source={getSourceFromFileName(img.fileName)} />)}
                                        </div>
                                    </div>
                                );
                            })()}
                        </div>
                    </CardContent>
                )}
            </Card>
        </div>
        </div>
        </DashboardLayout>
    );
}
