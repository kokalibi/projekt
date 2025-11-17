import React, { useState } from "react";
import "./dragdrop.css";

export default function DragDropImage({ onFileSelected }) {
  const [preview, setPreview] = useState(null);

  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      onFileSelected(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      onFileSelected(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div
      className="dropzone"
      onDragOver={(e) => e.preventDefault()}
      onDrop={handleDrop}
    >
      {preview ? (
        <img src={preview} alt="preview" className="preview" />
      ) : (
        <>
          <p>Húzd ide a képet vagy kattints a feltöltéshez</p>
          <input
            type="file"
            accept="image/*"
            onChange={handleSelect}
            className="fileInput"
          />
        </>
      )}
    </div>
  );
}
