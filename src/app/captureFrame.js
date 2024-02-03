/**
  * Captures a frame from the provided video stream and saves it as a Base64 encoded
 JPEG image.
  * This function draws the current frame from the video element onto a canvas
 element, then converts
  * the canvas content to a Base64 encoded JPEG image. The captured image is then
 stored in an array
  * for later use.
  *
  * @param {Object} videoRef - A React ref object pointing to the video element from
 which to capture the frame.
  * @param {Object} canvasRef - A React ref object pointing to the canvas element us
 for capturing the frame.
  * @param {Object} screenshotsRef - A React ref object pointing to an array where t
 captured image will be stored.
  * @param {number} IMAGE_WIDTH - The desired width of the captured image. The heigh
 is calculated to maintain the aspect ratio.
  */
export const captureFrame = (videoRef, canvasRef, screenshotsRef, IMAGE_WIDTH) => {
    if (videoRef.current && canvasRef.current) {
        console.log("capturing frame");

        const context = canvasRef.current.getContext("2d");
        const originalWidth = videoRef.current.videoWidth;
        const originalHeight = videoRef.current.videoHeight;
        const aspectRatio = originalHeight / originalWidth;

        // Set new width while maintaining aspect ratio
        canvasRef.current.width = IMAGE_WIDTH;
        canvasRef.current.height = IMAGE_WIDTH * aspectRatio;

        // Draw the current video frame onto the canvas
        context.drawImage(
            videoRef.current,
            0,
            0,
            canvasRef.current.width,
            canvasRef.current.height
        );
        // Compress and convert the canvas content to a Base64 encoded JPEG image
        const quality = 1; // Adjust the quality as needed, between 0 and 1
        const base64Image = canvasRef.current.toDataURL("image/jpeg", quality);

        // Store the captured image in the provided array if it's not empty
        if (base64Image !== "data:,") {
            screenshotsRef.current.push(base64Image);
        }
    }
};