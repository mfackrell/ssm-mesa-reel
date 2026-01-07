import { Storage } from '@google-cloud/storage';

// Initialize GCS
const storage = new Storage();
const bucketName = process.env.GCS_BUCKET_NAME; 

export async function uploadToGCS(buffer, filename, contentType = 'image/png') {
  try {
    const bucket = storage.bucket(bucketName);
    const file = bucket.file(filename);

    console.log(`Uploading ${filename} to GCS as ${contentType}...`);

    await file.save(buffer, {
      contentType: contentType,
      resumable: false 
    });

    const publicUrl = `https://storage.googleapis.com/${bucketName}/${filename}`;
    console.log(`Upload successful: ${publicUrl}`);
    
    return publicUrl;

  } catch (error) {
    console.error("GCS Upload Error:", error);
    throw new Error("Failed to upload file to storage.");
  }
}
