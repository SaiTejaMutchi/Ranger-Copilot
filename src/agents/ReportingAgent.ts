import { Finding, PriorityCategory } from "./PriorityAgent";

export interface ImageResult extends Finding {
    verificationStatus: "UNVERIFIED" | "VERIFIED" | "CORRECTED";
}

export interface PatrolBrief {
    text: string;
    kpis: {
        timeSavedSeconds: number;
        priorityCount: number;
        verificationRate: number;
    };
}

export class ReportingAgent {
    static generateBrief(batchName: string, images: ImageResult[]): PatrolBrief {
        const total = images.length;
        if (total === 0) {
            return {
                text: "No images found in this batch.",
                kpis: { timeSavedSeconds: 0, priorityCount: 0, verificationRate: 0 },
            };
        }

        const urgent = images.filter((img) => img.priorityCategory === "URGENT");
        const priority = images.filter((img) => img.priorityCategory === "PRIORITY");
        const verifiedOrCorrected = images.filter(
            (img) => img.verificationStatus === "VERIFIED" || img.verificationStatus === "CORRECTED"
        );

        const timeSavedSeconds = total * 20;
        const priorityCount = urgent.length + priority.length;
        const verificationRate = parseFloat(((verifiedOrCorrected.length / total) * 100).toFixed(1));

        let briefText = `### Patrol Brief: ${batchName}\n\n`;
        briefText += `**Summary of Observation:**\n`;
        briefText += `- Total detections processed: ${total}\n`;
        briefText += `- High-priority findings identified: ${priorityCount}\n`;
        briefText += `- Time saved via automated triage: ${Math.floor(timeSavedSeconds / 60)}m ${timeSavedSeconds % 60}s\n\n`;

        briefText += `**Top Recommended Actions:**\n`;
        if (urgent.length > 0) {
            briefText += `1. **IMMEDIATE:** Patrol zone(s) with ${urgent.length} urgent threat detections.\n`;
            briefText += `2. **ACTION:** Review the ${urgent.length} unverified threat logs.\n`;
        } else {
            briefText += `1. **MONITOR:** Continue routine monitoring; no immediate threats identified.\n`;
            briefText += `2. **ACTION:** Log priority wildlife sightings for ecological analysis.\n`;
        }
        briefText += `3. **SYSTEM:** Maintain current sensor deployment across the transit corridor.\n`;

        return {
            text: briefText,
            kpis: {
                timeSavedSeconds,
                priorityCount,
                verificationRate,
            },
        };
    }
}
