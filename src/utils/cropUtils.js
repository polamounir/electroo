export const getCroppedImg = (imageUrl, pixelCrop) => {
  const canvas = document.createElement("canvas");
  const image = new Image();

  return new Promise((resolve) => {
    image.src = imageUrl;
    image.onload = () => {
      const ctx = canvas.getContext("2d");
      const { x, y, width, height } = pixelCrop;

      canvas.width = width;
      canvas.height = height;

      ctx.drawImage(image, x, y, width, height, 0, 0, width, height);

      // Convert canvas to base64 image
      resolve(canvas.toDataURL("image/png"));
    };
  });
};
