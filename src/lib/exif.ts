import exifr from "exifr";

export interface ImageMetadata {
  captureDate?: number;
  location?: { lat: number; lng: number };
}

/**
 * Extract creation date and GPS location from image EXIF metadata.
 * Returns empty object if no metadata or extraction fails.
 */
export async function extractImageMetadata(file: File): Promise<ImageMetadata> {
  try {
    const result = await exifr.parse(file, {
      pick: ["DateTimeOriginal", "CreateDate"],
      gps: true,
    });
    if (!result) return {};

    const metadata: ImageMetadata = {};

    const date =
      result.DateTimeOriginal ?? result.CreateDate ?? result.DateTime;
    if (date instanceof Date && !isNaN(date.getTime())) {
      metadata.captureDate = date.getTime();
    }

    if (
      typeof result.latitude === "number" &&
      typeof result.longitude === "number" &&
      !isNaN(result.latitude) &&
      !isNaN(result.longitude)
    ) {
      metadata.location = { lat: result.latitude, lng: result.longitude };
    }

    return metadata;
  } catch {
    return {};
  }
}
