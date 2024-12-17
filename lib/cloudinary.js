import { v2 as cloudinary } from "cloudinary";

if (!process.env.CLOUDINARY_CLOUD_NAME) {
  throw new Error("CLOUDINARY_CLOUD_NAME is not set");
}

if (!process.env.CLOUDINARY_API_KEY) {
  throw new Error("CLOUDINARY_API_KEY is not set");
}

if (!process.env.CLOUDINARY_API_SECRET) {
  throw new Error("CLOUDINARY_API_SECRET is not set");
}

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function uploadImage(image) {
  try {
    // Check if the input is a valid image file
    if (!image || !image.type.startsWith("image/")) {
      throw new Error("Invalid image file");
    }

    // Convert image to base64 (for server-side environments)
    const imageData = await image.arrayBuffer();
    const mime = image.type;
    const encoding = "base64";
    const base64Data = Buffer.from(imageData).toString("base64");
    const fileUri = `data:${mime};${encoding},${base64Data}`;

    const folder = "nextjs-course-mutations";
    const timestamp = Math.floor(Date.now() / 1000);

    // Generate signature
    const stringToSign = `folder=${folder}&timestamp=${timestamp}`;
    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(fileUri, {
      folder,
      timestamp,
      api_key: cloudinary.config().api_key, // Specify the folder
    });

    console.log({ result });
    return result.secure_url; // Return the secure URL of the uploaded image
  } catch (error) {
    console.error("Image upload failed:", error);
    throw error; // Re-throw the error for upstream handling
  }
}
