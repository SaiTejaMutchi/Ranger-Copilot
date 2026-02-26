import React, { useState } from "react";
import { useNavigate } from "react-router";
import { useMutation, useAction } from "convex/react";
import { api } from "../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DashboardLayout } from "@/components/DashboardLayout";
import { Database, Loader2 } from "lucide-react";

export default function LiveFeedsPage() {
  const navigate = useNavigate();
  const createBatch = useMutation(api.batches.createBatch);
  const createImages = useMutation(api.images.createImages);
  const getUploadUrls = useAction(api.images.getUploadUrls);
  const runPipeline = useAction(api.pipeline.runPipeline);

  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState("");

  const handleIngestCCT = async () => {
    setIsUploading(true);
    setProgress("Extracting Caltech dataset slice...");

    try {
      const batchId = await createBatch({
        name: "Caltech Dataset Slice",
        isReferenceBatch: true,
      });

      const DEMO_FILES: Array<{ file: string; demoIndex: number; ref: string }> = [
        { file: "5858bf5a-23d2-11e8-a6a3-ec086b02610b.jpg", demoIndex: 9, ref: "raccoon" },
      ];

      setProgress(`Fetching and uploading ${DEMO_FILES.length} Caltech image(s)...`);
      const uploadUrls = await getUploadUrls({ count: DEMO_FILES.length });
      const imageData = [];

      for (let i = 0; i < DEMO_FILES.length; i++) {
        const { file: originalName, demoIndex, ref } = DEMO_FILES[i];
        const response = await fetch(`/demo/${demoIndex}.jpg`);
        const blob = await response.blob();
        const result = await fetch(uploadUrls[i], {
          method: "POST",
          headers: { "Content-Type": "image/jpeg" },
          body: blob,
        });
        const { storageId } = await result.json();
        imageData.push({
          fileName: originalName,
          storageId,
          fileUrl: `/demo/${demoIndex}.jpg`,
          referenceLabel: ref,
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

  return (
    <DashboardLayout>
      <header className="sticky top-0 z-40 border-b border-white/[0.06] bg-[#080909] px-8 py-4">
        <h1 className="text-lg font-semibold text-white/90">Live Surveillance</h1>
        <p className="text-sm text-white/50 mt-1">Ingest from CCT, camera traps, and live video streams</p>
      </header>

      <div className="flex-1 p-6 overflow-auto bg-[#080909]">
        <div className="max-w-2xl space-y-6">
          <Card className="border border-white/[0.09] bg-[#111213]">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="h-14 w-14 shrink-0 rounded-xl bg-white/10 flex items-center justify-center">
                  <Database className="h-7 w-7 text-emerald-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-semibold text-white mb-1">CCT Threat Intelligence Database</h3>
                  <p className="text-sm text-white/50 mb-4">
                    Ingest standardized Caltech Camera Traps (CCT) dataset slices for model validation.
                  </p>
                  <Button
                    onClick={handleIngestCCT}
                    disabled={isUploading}
                    className="gap-2 bg-white text-black hover:bg-white/90"
                  >
                    {isUploading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Database className="h-4 w-4" />
                    )}
                    {isUploading ? progress : "INGEST DATASET ☰"}
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="border border-white/[0.06] bg-[#0c0d0e]/50">
            <CardContent className="p-6">
              <p className="text-sm text-white/40">Additional live surveillance sources (camera traps, drone feeds, satellite) can be configured here.</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}
