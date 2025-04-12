import React, { useState } from "react";

const defaultOption = { width: "", height: "", quality: "80", format: "jpeg" };

export default function ImageUploader({ onSubmit }) {
  const [files, setFiles] = useState([]);
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleFiles = (selectedFiles) => {
    const fileArray = Array.from(selectedFiles);
    setFiles(fileArray);
    setOptions(fileArray.map(() => ({ ...defaultOption })));
  };

  const handleDrop = (e) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleChange = (e) => {
    handleFiles(e.target.files);
  };

  const updateOption = (index, key, value) => {
    const newOptions = [...options];
    newOptions[index][key] = value;
    setOptions(newOptions);
  };

  const handleUpload = async () => {
    if (files.length === 0) return;
    setLoading(true);

    const formData = new FormData();
    files.forEach((file) => formData.append("images", file));
    formData.append("options", JSON.stringify(options));

    try {
      const res = await fetch("http://localhost:3000/api/image-batch", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data?.error || "Upload failed");

      onSubmit?.(data.images || []);
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto p-6 bg-white rounded-xl shadow space-y-6">
      <div
        className="border-2 border-dashed border-gray-300 p-8 text-center rounded cursor-pointer hover:border-blue-400 transition"
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={handleChange}
          className="hidden"
          id="image-upload"
        />
        <label
          htmlFor="image-upload"
          className="cursor-pointer block text-gray-600"
        >
          <p className="text-lg font-semibold mb-2">
            📁 Drag & Drop Images Here
          </p>
          <p className="text-sm text-gray-500">
            or click to select from your computer
          </p>
        </label>
      </div>

      {files.length > 0 && (
        <div className="space-y-4">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex flex-col md:flex-row items-start md:items-center gap-6 p-4 border rounded-md bg-gray-50 shadow-sm"
            >
              <img
                src={URL.createObjectURL(file)}
                alt="preview"
                className="w-32 h-32 object-cover rounded-md border"
              />
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 w-full">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Width
                  </label>
                  <input
                    type="number"
                    value={options[idx].width}
                    onChange={(e) => updateOption(idx, "width", e.target.value)}
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Height
                  </label>
                  <input
                    type="number"
                    value={options[idx].height}
                    onChange={(e) =>
                      updateOption(idx, "height", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Quality
                  </label>
                  <input
                    type="number"
                    value={options[idx].quality}
                    onChange={(e) =>
                      updateOption(idx, "quality", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-md"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Format
                  </label>
                  <select
                    value={options[idx].format}
                    onChange={(e) =>
                      updateOption(idx, "format", e.target.value)
                    }
                    className="w-full px-2 py-1 border rounded-md"
                  >
                    <option value="jpeg">JPEG</option>
                    <option value="png">PNG</option>
                    <option value="webp">WebP</option>
                  </select>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {files.length > 0 && (
        <button
          onClick={handleUpload}
          disabled={loading}
          className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? "Uploading..." : "Upload & Optimize"}
        </button>
      )}
    </div>
  );
}
