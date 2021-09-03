import React from "react";
import Dropzone from "react-dropzone";
import { FaUpload } from "react-icons/fa";
import "./styles.scss";

function ImageUploader({ getUploadedFiles }) {
  const acceptedFileTypes = "image/x-png, image/png, image/jpeg, image/jpg";
  const acceptedFileTypesArray = acceptedFileTypes
    .split(",")
    .map((item) => item.trim());

  /**
   * Verify uploaded files matches our acceptance criteria.
   * @param {array} files Uploaded files.
   * @returns {boolean} file verification.
   */
  const verifyUploadedImage = (files) => {
    if (files && files.length > 0) {
      const currentFile = files[0];
      const currentFileType = currentFile.type;
      if (!acceptedFileTypesArray.includes(currentFileType)) {
        alert("This file is not supported");
        return false;
      }
      return true;
    }
  };

  /**
   * Handle dropping/uploading files.
   * @param {Array} files Uploaded files.
   */
  const handleDrop = (files) => {
    if (files && files.length > 0) {
      const isVerified = verifyUploadedImage(files);
      if (isVerified) {
        const currentFile = files[0];
        const fileReader = new FileReader();
        fileReader.addEventListener(
          "load",
          () => {
            getUploadedFiles({
              imgBase64: fileReader.result,
              fileName: currentFile.name,
            });
          },
          false
        );
        fileReader.readAsDataURL(currentFile);
      }
    }
  };

  return (
    <section className="image-uploader">
      <Dropzone
        multiple={false}
        acceptedFileTypes={acceptedFileTypes}
        onDrop={(acceptedFiles) => handleDrop(acceptedFiles)}
      >
        {({ getRootProps, getInputProps }) => (
          <div className="image-uploader__container">
            <div className="image-uploader__button" {...getRootProps()}>
              <input {...getInputProps()} />
              <p className="image-uploader__text">
                <FaUpload /> Upload or drag image
              </p>
            </div>
          </div>
        )}
      </Dropzone>
    </section>
  );
}

export default ImageUploader;
