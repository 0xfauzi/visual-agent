/**
  * Uploads an image to a remote server.
  *
  * This function takes a Base64 encoded image string, converts it to a Blob, and th
 uploads it using FormData.
  * The server is expected to return a JSON object containing a URL to the uploaded
 image. This URL is then modified
  * to point directly to the downloadable image resource and returned.
  *
  * @param {string} base64Image - The Base64 encoded string of the image to be
 uploaded.
  * @returns {Promise<string>} A promise that resolves with the URL of the uploaded
 image.
  */
 export async function uploadImage(base64Image) {
    // Convert the Base64 encoded string to a Blob.
    const blob = base64ToBlob(base64Image, "image/jpeg");
    const formData = new FormData();
    formData.append("file", blob, "image.jpg");

    // Perform the upload request.
    const response = await fetch("https://tmpfiles.org/api/v1/upload", {
        method: "POST",
        body: formData,
    });

    // Extract the URL from the response.
    const { data } = await response.json();

    // Modify the URL to point directly to the downloadable resource.
    return data.url.replace("https://tmpfiles.org/", "https://tmpfiles.org/dl/");
}

/**
 * Converts a Base64 encoded string to a Blob.
 *
 * This utility function is used to convert a Base64 encoded string of an image int
a Blob object,
 * which can then be used in FormData for uploading. The MIME type of the Blob is
specified by the caller.
 *
 * @param {string} base64 - The Base64 encoded string to convert.
 * @param {string} mimeType - The MIME type of the resulting Blob.
 * @returns {Blob} The Blob object created from the Base64 string.
 */
function base64ToBlob(base64, mimeType) {
    // Decode the Base64 string.
    const byteCharacters = atob(base64.split(",")[1]);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);

    // Create and return the Blob.
    return new Blob([byteArray], { type: mimeType });
}