import protocol from "../config/park_safety_protocol.json";

export type PriorityCategory = "URGENT" | "PRIORITY" | "REVIEW" | "ALL";

export interface Prediction {
    label: string;
    prob: number;
}

export interface Finding {
    priorityCategory: PriorityCategory;
    priorityScore: number;
    priorityReason: string;
}

export class PriorityAgent {
    static rankFinding(predictions: Prediction[], confidence: number): Finding {
        const topPrediction = predictions[0];
        const label = topPrediction?.label?.toLowerCase() ?? "unknown";

        // Base score is confidence * 10
        let score = confidence * 10;
        let category: PriorityCategory = "ALL";
        let reason = "Standard observation.";

        // 1. Check for threats
        if (protocol.threatLabels.includes(label)) {
            category = "URGENT";
            score += 5;
            reason = `Possible threat detected: ${label}. Immediate patrol check recommended.`;
        }
        // 2. Check for priority species
        else if (protocol.prioritySpecies.includes(label)) {
            category = "PRIORITY";
            score += 3;
            reason = `Priority wildlife detected: ${label}. Data logged for ecological monitoring.`;
        }
        // 3. Special case for empty images
        else if (label === "empty") {
            category = "ALL";
            score = 0;
            reason = "No wildlife or activity detected in frame.";
        }
        // 4. Check for low confidence
        else if (confidence < protocol.lowConfidenceThreshold) {
            category = "REVIEW";
            reason = `Low confidence detection (${(confidence * 100).toFixed(1)}%). Needs human verification.`;
        }

        // Cap score at 10
        score = Math.min(score, 10);

        return {
            priorityCategory: category,
            priorityScore: parseFloat(score.toFixed(1)),
            priorityReason: reason,
        };
    }
}
