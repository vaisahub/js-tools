import { NextResponse } from 'next/server';
import sharp from 'sharp';
import { Buffer } from 'node:buffer';

// Disable Next.js' default body parser for this API route to handle raw form data
export const config = {
  api: {
    bodyParser: false,
  },
};

export async function POST(req) {
  try {
    // Parse the incoming form data from the request
    const formData = await req.formData();
    
    // Retrieve the file from the form data (adjust the key name if needed)
    const file = formData.get('file'); // The 'file' key should match the form field name

    // Check if a file was uploaded; if not, return a 400 error response
    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    // Convert the file from a Blob to a Buffer (sharp requires a Buffer for image processing)
    const fileBuffer = Buffer.from(await file.arrayBuffer());

    // Use sharp to process the image and convert it to WebP format
    const webpBuffer = await sharp(fileBuffer)
      .toFormat('webp')  // Convert to WebP format
      .toBuffer();       // Return the result as a Buffer

    // Send the processed WebP image back in the response with the correct headers
    return new NextResponse(webpBuffer, {
      headers: {
        'Content-Type': 'image/webp',       // Set content type to WebP
        'Content-Length': webpBuffer.length.toString(), // Include the file size
      },
    });
  } catch (error) {
    // Log the error to the console for debugging
    console.error('Error processing file:', error);

    // Return a 500 error response if something goes wrong during image processing
    return NextResponse.json({ error: 'Failed to process image' }, { status: 500 });
  }
}

## How to invoke

/*
    let webpBlob;
    const formData = new FormData();
    formData.append("file", file);
    try {
      /* for a next js applicaition with App router */
      const response = await fetch('/pages/api/', {
        method: 'POST',
        body: formData, 
      });

      if (!response.ok) {
        throw new Error('Failed to convert image');
      }

      const webpImageBlob = await response.blob();
      const webpImageUrl = URL.createObjectURL(webpImageBlob);
      webpBlob = webpImageBlob;
      console.log(webpImageBlob, webpImageUrl);
*/
