import React, { useState, useRef } from "react";
import Cropper from "react-cropper";


const ImageUploadAndCrop = () => {
  const [images, setImages] = useState([]);
  const [isCropped, setIsCropped] = useState(false);
  const cropperRefs = useRef([]);

  const onImageChange = (e) => {
    if (e.target.files && e.target.files.length > 0) {
      const files = Array.from(e.target.files);

      // Clear the cropperRefs array when new images are loaded
      cropperRefs.current = [];

      const newImages = files.map((file) => ({
        file,
        src: URL.createObjectURL(file),
        crop: { unit: "%", width: 30, aspect: 1 },
        croppedImageUrl: null,
      }));

      setImages((prevImages) => [...prevImages, ...newImages]);
      setIsCropped(false);
    }
  };

  const onCropAll = () => {
    if (cropperRefs.current.length === 0) {
      console.error("No cropper instances found");
      return;
    }

    const updatedImages = images.map((image, index) => {
      const cropperInstance = cropperRefs.current[index];
      if (cropperInstance && cropperInstance.cropper) {
        try {
          const croppedCanvas = cropperInstance.cropper.getCroppedCanvas();
          if (croppedCanvas) {
            const croppedImage = croppedCanvas.toDataURL("image/jpeg");
            return { ...image, croppedImageUrl: croppedImage };
          }
        } catch (error) {
          console.error(`Error cropping image ${index}:`, error);
        }
      } else {
        console.error(`Cropper instance ${index} not available`);
      }
      return image;
    });
    
    console.log(updatedImages);
    setImages(updatedImages);
    setIsCropped(true);
  };

  const reset = () => {
    setImages([]);
    setIsCropped(false);
  };

  const downloadImage = (index) => {
    const link = document.createElement("a");
    link.href = images[index].croppedImageUrl;
    link.download = `cropped-image-${index + 1}.jpg`;
    link.click();
  };

  return (
    <div className="flex flex-col items-center py-6 px-4 space-y-6 max-w-4xl mx-auto">
      <h2 className="text-3xl font-semibold text-gray-800">
        Upload and Crop Images
      </h2>

      <div className="w-full">
        <input
          type="file"
          onChange={onImageChange}
          accept="image/*"
          multiple
          className="w-full text-sm text-gray-500 border border-gray-300 rounded-lg p-3 file:py-2 file:px-4 file:bg-blue-500 file:text-white file:rounded-lg file:hover:bg-blue-600"
        />
      </div>

      {/* Display for debugging */}
      <div className="w-full text-sm">
        {/* <p>Images loaded: {images.length}</p>
        <p>Cropper refs: {cropperRefs.current.length}</p> */}
      </div>

      {/* Original images with croppers */}
      {!isCropped && images.length > 0 && (
        <div className="space-y-8 w-full">
          {images.map((image, index) => (
            <div key={index} className="border rounded-lg p-4 bg-white shadow">
              <h3 className="text-xl font-semibold mb-2">Image {index + 1}</h3>

              {/* Regular img tag for fallback */}
              {/* <img
                src={image.src}
                alt={`Preview ${index}`}
                className="mb-2 max-h-96 mx-auto"
                style={{
                  display: cropperRefs.current[index] ? "none" : "block",
                }}
              /> */}

              {/* Cropper component */}
              <div className="cropper-container">
                <Cropper
                  src={image.src}
                  style={{ height: 400, width: "100%" }}
                  guides={true}
                  viewMode={1}
                  dragMode="move"
                  aspectRatio={1}
                  ref={(el) => {
                    if (el) {
                      cropperRefs.current[index] = el;
                    }
                  }}
                  crossOrigin="anonymous"
                  checkOrientation={false}
                  responsive={true}
                  restore={true}
                  checkCrossOrigin={true}
                  background={false}
                  minContainerWidth={300}
                  minContainerHeight={300}
                  minCropBoxWidth={100}
                  minCropBoxHeight={100}
                />
              </div>
            </div>
          ))}

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Reset
            </button>
            <button
              onClick={onCropAll}
              className="px-6 py-2 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 transition"
            >
              Crop All Images
            </button>
          </div>
        </div>
      )}

      {/* Cropped images display */}
      {isCropped && images.length > 0 && (
        <div className="space-y-6 w-full">
          <h3 className="text-2xl font-semibold text-center">
            Cropped Results
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {images.map((image, index) => (
              <div
                key={index}
                className="text-center bg-white p-4 rounded-lg shadow"
              >
                <h3 className="text-lg font-semibold mb-2">
                  Image {index + 1}
                </h3>
                {image.croppedImageUrl ? (
                  <>
                    <img
                      src={image.croppedImageUrl}
                      alt={`Cropped ${index + 1}`}
                      className="mx-auto border rounded-lg"
                      style={{ maxWidth: "100%", maxHeight: "300px" }}
                    />
                    <button
                      onClick={() => downloadImage(index)}
                      className="mt-4 px-4 py-2 bg-green-500 text-white font-medium rounded-lg hover:bg-green-600 transition"
                    >
                      Download
                    </button>
                  </>
                ) : (
                  <div className="p-8 bg-gray-100 rounded-lg text-gray-500">
                    Failed to crop image
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="flex justify-center space-x-4 mt-6">
            <button
              onClick={reset}
              className="px-6 py-2 bg-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-400 transition"
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploadAndCrop;
