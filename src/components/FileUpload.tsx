"use client";
import React, { useState } from "react";
import {  IKUpload } from "imagekitio-next";
import { Loader2 } from "lucide-react";
import { IKUploadResponse } from "imagekitio-next/dist/types/components/IKUpload/props";

interface FileUploadProps {
    onSuccess: (res: IKUploadResponse) => void;
    onProgress?: (progress: number) => void;
    fileType?: "image" | "video"; 
}

export default function FileUpload({
    onSuccess,
    onProgress,
    fileType = "image",
}: FileUploadProps) {

    const [uploading, setUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)

  const onError = (err: {message: string}) => {
    // console.log("Error", err);
    setError(err.message)
    setUploading(false)
  };
  
  const handleSuccess = (response: IKUploadResponse) => {
    // console.log("Success", response);
    setUploading(false)
    setError(null)
    onSuccess(response)
  };
  
  const handleProgress = (evt: ProgressEvent) => {
        if(evt.lengthComputable && onProgress) {
          const percentComplete = (evt.loaded / evt.total) * 100;
          onProgress(Math.round(percentComplete)); 
        }
    };
  
  const handleStartUpload = () => {
    // console.log("Start", evt);
    setUploading(true);
    setError(null)

  };

  const validateFile = (file: File) => {
    if(fileType === "image"){
        if(!file.type.startsWith('image/')){
            setError("Please upload an image file")
            return false;
        }
    } else {
      const validTypes = ['image/jpeg', 'image/png', 'image/webp']
      if(!validTypes.includes(file.type)){
        setError("please upload a valid file (JEPG, PNG, webp")
        return false;
      }
    }
    return false;
  }

  return (
    <div className="App">
      <h1>ImageKit Next.js quick start</h1>
        <p>Upload an image with advanced options</p>
        <IKUpload
          fileName="test-upload.jpg"
          useUniqueFileName={true}
          validateFile={validateFile}
          onError={onError}
          onSuccess={handleSuccess}
          onUploadProgress={handleProgress}
          onUploadStart={handleStartUpload}
          folder={fileType === "image" ? "/images" : "/videos"}
        />

        {
          uploading && (
            <div className="flex items-center gap-2 text-sm text-blue-500">
              <Loader2 className="animate-spin w-4 h-4" />
              <span>Uploading...</span>
            </div>
          )
        }
        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}
    </div>
  );
}