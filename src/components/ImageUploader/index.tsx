'use client';
import React, { useState, useEffect } from 'react';

interface ImageUploaderProps {
  name: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  preview?: string | null;
}

function ImageUploader({ name, onChange, preview = null }: ImageUploaderProps) {
  const [imagePreview, setImagePreview] = useState<string | null>(preview);

  useEffect(() => {
    setImagePreview(preview);
  }, [preview]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange && onChange(e);
    const file = e?.target?.files?.[0];
    if (file) setImagePreview(URL.createObjectURL(file));
  };

  return (
    <label className="file-input-button">
      <input type="file" name={name} accept="image/*" onChange={handleImageChange} />
      {imagePreview ? <img className="image" src={imagePreview} alt="" /> : 'Select'}
    </label>
  );
}

export default ImageUploader;
