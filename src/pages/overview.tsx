import React, { useState, useRef } from "react";
import { useNavigate } from "react-router";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Loader2 } from "lucide-react";
import { extractImageMetadata } from "@/lib/exif";

export default function OverviewPage() {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const createBatch = useMutation(api.batches.createBatch);
  const createImages = useMutation(api.images.createImages);
  const getUploadUrls = useAction(api.images.getUploadUrls);
  const runPipeline = useAction(api.pipeline.runPipeline);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState("");
  const handleProcess = async (files?: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsUploading(true);
    setProgress("Initializing batch...");

    try {
      const irNum = "IR-" + Date.now().toString(36).toUpperCase().slice(-6);
      const batchId = await createBatch({ name: irNum, isReferenceBatch: false });
      setProgress(`Uploading ${files.length} images...`);
      const uploadUrls = await getUploadUrls({ count: files.length });
      const imageData = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const [uploadResult, metadata] = await Promise.all([
          fetch(uploadUrls[i], {
            method: "POST",
            headers: { "Content-Type": file.type },
            body: file,
          }).then((r) => r.json()),
          extractImageMetadata(file),
        ]);
        const { storageId } = uploadResult;
        imageData.push({
          fileName: file.name,
          storageId,
          captureDate: metadata.captureDate,
          location: metadata.location,
        });
      }
      setProgress("Generating image records...");
      const imageIds = await createImages({ batchId, images: imageData });
      setProgress("Running intelligence pipeline...");
      await runPipeline({ batchId, imageIds, cloudEnabled: true });
      setProgress("Finalizing report...");
      navigate(`/results/${batchId}`);
    } catch (error) {
      console.error(error);
      setProgress("Error occurred during processing.");
      setIsUploading(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isUploading && e.dataTransfer.files.length > 0) {
      handleProcess(e.dataTransfer.files);
    }
  };

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();

  const pills = [
    "🐆 Species detection",
    "🚗 Vehicle intrusion",
    "👤 Human presence alert",
    "📍 Auto-dispatch",
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col min-h-screen bg-[#080909]">
        {/* Topbar */}
        <div className="h-[52px] border-b border-white/[0.06] flex items-center px-8 gap-3 shrink-0">
          <span className="text-sm font-semibold text-white/70 flex-1">AI Triage</span>
          <div className="flex items-center gap-1.5 py-1.5 px-3 border border-white/10 rounded-full font-mono text-[11px] text-white/35 tracking-wide cursor-pointer hover:border-white/20 hover:text-white/60 transition-all">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            System Nominal
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="py-1.5 px-4 bg-white text-black rounded-lg font-semibold text-[12.5px] hover:opacity-90 transition-opacity disabled:opacity-50"
          >
            ↻ Sync
          </button>
        </div>

        {/* Hero */}
        <main className="flex-1 flex flex-col items-center justify-center text-center px-10 py-14">
          <div className="inline-flex items-center gap-1.5 py-1.5 px-3.5 border border-white/10 rounded-full font-mono text-[11px] text-white/40 tracking-wide mb-9 animate-[up_0.5s_0s_ease_forwards]">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Intelligence engine online
          </div>

          <h1 className="text-[clamp(44px,5.5vw,80px)] font-extrabold leading-[1.02] tracking-[-3px] max-w-[640px] mb-5 text-white animate-[up_0.6s_0.1s_ease_forwards]">
            Turn surveillance
            <br />
            into action.
          </h1>

          <p className="text-base text-white/35 max-w-[400px] leading-relaxed font-normal mb-11 animate-[up_0.6s_0.18s_ease_forwards]">
            AI triage for anti-poaching teams converts field imagery into ranked alerts with uncertainty flags and receipts, then dispatches only after ranger approval.
          </p>

          {/* Upload zone */}
          <div className="w-full max-w-[580px] animate-[up_0.6s_0.26s_ease_forwards]">
            <div className="bg-[#111213] border border-white/[0.09] rounded-2xl overflow-hidden transition-colors focus-within:border-white/20">
              <div
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onClick={() => fileInputRef.current?.click()}
                className="flex flex-col items-center justify-center min-h-[120px] p-5 cursor-pointer hover:bg-white/[0.02] transition-colors"
              >
                <p className="text-sm text-white/65">
                  Drop field assets here or click to select
                </p>
                <p className="text-xs text-white/20 mt-1">JPG, PNG, TIFF, MP4 • Max 500MB per batch</p>
              </div>
              <div className="flex items-center justify-between p-2.5 px-3.5 pb-3.5">
                <div className="flex gap-1.5">
                  <span className="py-1 px-2.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-xs text-white/30">
                    📡 Full-Stack
                  </span>
                  <span className="py-1 px-2.5 bg-white/[0.04] border border-white/[0.07] rounded-lg text-xs text-white/30">
                    🔒 Integrity Mode
                  </span>
                </div>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="w-9 h-9 bg-white text-black rounded-xl flex items-center justify-center text-base font-medium hover:opacity-80 transition-opacity disabled:opacity-50"
                >
                  ↑
                </button>
              </div>
            </div>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            accept="image/jpeg,image/png,image/tiff,video/mp4"
            className="hidden"
            onChange={(e) => handleProcess(e.target.files)}
            disabled={isUploading}
          />

          <div className="flex gap-2 mt-4 flex-wrap justify-center animate-[up_0.6s_0.34s_ease_forwards]">
            {pills.map((text) => (
              <span
                key={text}
                className="py-1.5 px-4 bg-white/[0.03] border border-white/[0.07] rounded-full text-xs text-white/35"
              >
                {text}
              </span>
            ))}
          </div>

          <button
            type="button"
            disabled
            className="w-full max-w-[580px] mt-6 py-5 px-6 rounded-2xl border-2 border-dashed border-white/15 bg-white/[0.02] text-white/40 text-sm font-medium cursor-not-allowed opacity-60 animate-[up_0.6s_0.34s_ease_forwards]"
          >
            Connect to your ranger camera system
          </button>

          {/* After image is processed */}
          <div className="w-full max-w-[580px] mt-14 animate-[up_0.6s_0.4s_ease_forwards]">
            <h3 className="text-xs font-semibold uppercase tracking-widest text-white/40 mb-4">
              After image is processed
            </h3>
            <div className="bg-[#111213] border border-white/[0.09] rounded-2xl p-6 space-y-4">
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">1</span>
                <div>
                  <p className="text-sm font-medium text-white">AI analyzes each image</p>
                  <p className="text-xs text-white/45 mt-0.5">AI detects poaching events and assigns threat level (Critical, High, Medium, Low).</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">2</span>
                <div>
                  <p className="text-sm font-medium text-white">View results & generate briefings</p>
                  <p className="text-xs text-white/45 mt-0.5">View poaching analysis by threat level, generate incident reports, and approve Critical findings for patrol dispatch.</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-emerald-500/20 text-emerald-400 text-sm font-bold">3</span>
                <div>
                  <p className="text-sm font-medium text-white">Patrol alert & Incident Reports</p>
                  <p className="text-xs text-white/45 mt-0.5">Send notifications to field teams for approved threats. Incident reports summarize all review queue activity.</p>
                </div>
              </div>
            </div>
          </div>

          {isUploading && (
            <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
              <div className="bg-[#111213] border border-white/10 rounded-2xl p-8 flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 text-emerald-400 animate-spin" />
                <div className="text-center space-y-1">
                  <h3 className="font-semibold text-lg text-white">{progress}</h3>
                  <p className="text-sm text-white/50">Analyzing pixels via neural network...</p>
                </div>
              </div>
            </div>
          )}
        </main>

        {/* Footer */}
        <footer className="py-4 px-8 border-t border-white/[0.05] flex items-center justify-between shrink-0">
          <span className="font-mono text-[10.5px] text-white/20 tracking-widest">
            SHIELDDISPATCH © 2025
          </span>
          <div className="flex gap-4">
            <a href="#" className="text-xs text-white/20 no-underline hover:text-white/50 transition-colors">
              Privacy
            </a>
            <a href="#" className="text-xs text-white/20 no-underline hover:text-white/50 transition-colors">
              Terms
            </a>
            <a href="#" className="text-xs text-white/20 no-underline hover:text-white/50 transition-colors">
              Contact
            </a>
          </div>
        </footer>
      </div>
      <style>{`
        @keyframes up {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </DashboardLayout>
  );
}
