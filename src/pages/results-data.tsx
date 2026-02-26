import { useParams, useSearchParams, Link } from "react-router";
import { DashboardLayout } from "@/components/DashboardLayout";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Id } from "../../convex/_generated/dataModel";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  AlertCircle,
  ShieldCheck,
  CheckCircle2,
  ChevronLeft,
  AlertTriangle,
  Volume2,
  Loader2,
  FolderOpen,
  Calendar,
  MapPin,
  Users,
  Car,
  PawPrint,
  Clock,
  Swords,
} from "lucide-react";
import { format } from "date-fns";
import { getSourceFromFileName } from "@/lib/source";

export default function ResultsDataPage() {
  const { batchId } = useParams<{ batchId: Id<"batches"> }>();
  const [searchParams] = useSearchParams();
  const sourceKey = searchParams.get("source") ?? "Field Upload";

  const images = useQuery(api.batches.getBatchResults, { batchId: batchId as Id<"batches"> });
  const verifyImage = useMutation(api.images.verifyImage);

  if (!images)
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center flex-1 min-h-[60vh] space-y-4 p-6 bg-[#080909]">
          <Loader2 className="h-10 w-10 text-emerald-400 animate-spin" />
          <p className="text-white/50 animate-pulse">Synchronizing field data...</p>
        </div>
      </DashboardLayout>
    );

  const filteredImages = images.filter((img) => getSourceFromFileName(img.fileName) === sourceKey);

  const getThreatBadge = (category: string, score: number) => {
    const isNone = (score ?? 0) === 0;
    const level = isNone ? "None" : category === "URGENT" ? "Critical" : category === "PRIORITY" ? "High" : category === "REVIEW" ? "Medium" : "Low";
    const variant = isNone ? "secondary" : category === "URGENT" ? "destructive" : category === "PRIORITY" ? "default" : category === "REVIEW" ? "outline" : "secondary";
    const cls = category === "PRIORITY" ? "gap-1 bg-orange-500 hover:bg-orange-600" : category === "REVIEW" ? "gap-1 text-blue-500 border-blue-500" : "gap-1";
    return (
      <Badge variant={variant as "destructive" | "default" | "outline" | "secondary"} className={cls}>
        <AlertCircle className="h-3 w-3" /> Threat: {level}
      </Badge>
    );
  };

  // Renders a full inline analysis panel — no click required
  const ImagePanel = ({ img }: { img: typeof filteredImages[0] }) => {
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
          {fileTime && img.captureDate && <p className="text-[10px] text-muted-foreground font-mono">File: {format(img.captureDate, "PPpp")}</p>}
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

  return (
    <DashboardLayout>
      <div className="flex-1 p-6 overflow-auto bg-[#080909]">
        <div className="w-full max-w-7xl mx-auto space-y-6 sm:space-y-8">
          {/* Header */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <Link
                to={`/results/${batchId}`}
                className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ChevronLeft className="h-5 w-5" />
                Back to AI Triage
              </Link>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
                  <FolderOpen className="h-6 w-6 text-primary" />
                  {sourceKey}
                </h1>
                <p className="text-muted-foreground text-sm">
                  {filteredImages.length} image{filteredImages.length !== 1 ? "s" : ""} in this source
                </p>
              </div>
            </div>
          </div>

          {/* Poaching analysis — by threat level */}
          <Card className="border-2 overflow-hidden">
            <CardHeader className="pb-4 bg-muted/20 border-b">
              <CardTitle className="text-sm font-bold uppercase tracking-widest text-foreground/70">
                Poaching analysis — by threat level
              </CardTitle>
              <CardDescription className="text-xs">
                {filteredImages.filter((i) => i.priorityCategory === "URGENT").length} Critical · {filteredImages.filter((i) => i.priorityCategory === "PRIORITY").length} High · {filteredImages.filter((i) => i.priorityCategory === "REVIEW").length} Medium · {filteredImages.filter((i) => !["URGENT", "PRIORITY", "REVIEW"].includes(i.priorityCategory)).length} Low
              </CardDescription>
            </CardHeader>
            <CardContent className="px-0 py-0">
              {filteredImages.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10 opacity-40 grayscale">
                  <ShieldCheck className="h-8 w-8 mb-2" />
                  <p className="text-xs font-medium">No detections</p>
                </div>
              ) : (
                <div className="divide-y divide-border/50">
                  {[...filteredImages.filter((i) => i.priorityCategory === "URGENT"), ...filteredImages.filter((i) => i.priorityCategory === "PRIORITY"), ...filteredImages.filter((i) => i.priorityCategory === "REVIEW"), ...filteredImages.filter((i) => !["URGENT", "PRIORITY", "REVIEW"].includes(i.priorityCategory))].map((img) => (
                    <ImagePanel key={img._id} img={img} />
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
