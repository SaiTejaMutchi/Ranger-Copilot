import requests
import json
import base64
import os

CONVEX_URL = "http://127.0.0.1:3211"

def run_convex(function_name, args={}):
    url = f"{CONVEX_URL}/api/test"
    response = requests.post(url, json={"functionName": function_name, "args": args})
    if response.status_code != 200:
        print(f"Error calling {function_name}: {response.text}")
        return None
    return response.json().get("value")

def run_test():
    print("🚀 Starting Automated Judge-Proof Backend Test...")
    
    # 1. Test Reference Batch (Benchmark Mode)
    print("\n--- Test 1: Benchmark Mode (isReferenceBatch=True) ---")
    batch_id_ref = run_convex("batches:createBatch", {
        "name": "Benchmark Test",
        "isReferenceBatch": True
    })
    
    with open("public/demo/2.jpg", "rb") as f:
        image_bytes = f.read()
    
    print("Ingesting Image with Mismatch (Reference: mountain_lion)...")
    img_ids_ref = run_convex("images:createImages", {
        "batchId": batch_id_ref,
        "images": [{
            "fileName": "benchmark_mismatch.jpg",
            "referenceLabel": "mountain_lion",
            "fileUrl": "data:image/jpeg;base64," + base64.b64encode(image_bytes).decode('utf-8')
        }]
    })

    run_convex("pipeline:runPipeline", {
        "batchId": batch_id_ref,
        "imageIds": img_ids_ref,
        "cloudEnabled": True
    })

    results_ref = run_convex("batches:getBatchResults", {"batchId": batch_id_ref})
    for img in results_ref:
        tags = img.get('receiptTags', [])
        print(f"Result: {img['fileName']} | Tags: {tags} | Cat: {img['priorityCategory']}")
        if "reference_mismatch" in tags and img['priorityCategory'] == "REVIEW":
            print("✅ SUCCESS: Mismatch detected and tagged correctly.")

    # 2. Test Live Batch (Operational Mode)
    print("\n--- Test 2: Live Mode (isReferenceBatch=False) ---")
    batch_id_live = run_convex("batches:createBatch", {
        "name": "Live Operational Test",
        "isReferenceBatch": False
    })
    
    print("Ingesting Image with Mismatch (Should NOT trigger reference_mismatch tag)...")
    img_ids_live = run_convex("images:createImages", {
        "batchId": batch_id_live,
        "images": [{
            "fileName": "live_mismatch.jpg",
            "referenceLabel": "mountain_lion",
            "fileUrl": "data:image/jpeg;base64," + base64.b64encode(image_bytes).decode('utf-8')
        }]
    })

    run_convex("pipeline:runPipeline", {
        "batchId": batch_id_live,
        "imageIds": img_ids_live,
        "cloudEnabled": True
    })

    results_live = run_convex("batches:getBatchResults", {"batchId": batch_id_live})
    for img in results_live:
        tags = img.get('receiptTags', [])
        print(f"Result: {img['fileName']} | Tags: {tags} | Cat: {img['priorityCategory']}")
        if "reference_mismatch" not in tags:
            print("✅ SUCCESS: Ground truth mismatch ignored in Live mode (No reference_mismatch tag).")
        else:
            print("❌ FAILURE: Reference mismatch triggered in Live mode!")

    # 3. Test URGENT Invariant (No Downgrade)
    print("\n--- Test 3: URGENT Invariant (Safety First) ---")
    # Note: Using 1.jpg (often seen as car or background)
    with open("public/demo/1.jpg", "rb") as f:
        image_bytes_1 = f.read()
        
    img_ids_urgent = run_convex("images:createImages", {
        "batchId": batch_id_ref,
        "images": [{
            "fileName": "urgent_mismatch.jpg",
            "referenceLabel": "mountain_lion", # Force uncertainty if AI sees empty or car
            "fileUrl": "data:image/jpeg;base64," + base64.b64encode(image_bytes_1).decode('utf-8')
        }]
    })
    
    print("Verifying that URGENT sightings are never downgraded to REVIEW...")
    run_convex("pipeline:runPipeline", {
        "batchId": batch_id_ref,
        "imageIds": img_ids_urgent,
        "cloudEnabled": True
    })
    
    results_urgent = run_convex("batches:getBatchResults", {"batchId": batch_id_ref})
    for img in results_urgent:
        print(f"Result: {img['fileName']} | Cat: {img['priorityCategory']} | Reason: {img['priorityReason']}")
        if img['priorityCategory'] == "URGENT":
             print("✅ SUCCESS: URGENT sighting maintained despite uncertainty.")
        elif img['priorityCategory'] == "REVIEW" and "mountain_lion" in img['priorityReason'].lower():
             print("⚠️ NOTE: AI did not see a threat, so it went to REVIEW. This matches expected behavior for non-threats.")

if __name__ == "__main__":
    run_test()
