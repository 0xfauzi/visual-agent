import mergeImages from "merge-images";

/**
 * A hook to create a grid of images from an array of Base64 encoded images.
 * 
 * @param {Array<string>} base64Images - An array of Base64 encoded image strings.
 * @param {number} columns - The number of columns in the grid.
 * @param {number} gridImageWidth - The width of each image in the grid.
 * @param {number} quality - The quality of the output image.
 * @returns {Array} An array containing the grid URL and a function to create the grid.
 */
export function useImagesGrid(base64Images, setImagesGridUrl, columns = 4, gridImageWidth = 512, quality = 0.6) {

    const createImagesGrid = async () => {
        if (!base64Images.length) {
            return "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/wcAAwAB/2lXzAAAACV0RVh0ZGF0ZTpjcmVhdGU9MjAyMy0xMC0xOFQxNTo0MDozMCswMDowMEfahTAAAAAldEVYdGRhdGU6bW9kaWZ5PTIwMjMtMTAtMThUMTU6NDA6MzArMDA6MDBa8cKfAAAAAElFTkSuQmCC";
        }

        const dimensions = await getImageDimensions(base64Images[0]);
        const aspectRatio = dimensions.width / dimensions.height;
        const gridImageHeight = gridImageWidth / aspectRatio;
        const rows = Math.ceil(base64Images.length / columns);
        const imagesWithCoordinates = base64Images.map((src, index) => ({
            src,
            x: (index % columns) * gridImageWidth,
            y: Math.floor(index / columns) * gridImageHeight,
        }));

        const mergedImage = await mergeImages(imagesWithCoordinates, {
            format: "image/jpeg",
            quality,
            width: columns * gridImageWidth,
            height: rows * gridImageHeight,
        });

        setImagesGridUrl(mergedImage);
        console.log(mergedImage);
        return mergedImage;
    };

    return [createImagesGrid];
}


/**
 * Asynchronously retrieves the dimensions of an image given its source URL.
 * @param {string} src - The source URL of the image.
 * @returns {Promise<Object>} A promise that resolves with an object containing the image's width and height.
 */
async function getImageDimensions(src) {
    return new Promise((resolve, reject) => {
        const img = new globalThis.Image();

        img.onload = function () {
            resolve({
                width: this.width,
                height: this.height,
            });
        };

        img.onerror = function () {
            reject(new Error("Failed to load image."));
        };

        img.src = src;
    });
}