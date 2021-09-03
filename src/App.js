import { useState } from "react";
import "./App.scss";
import ImagePreview from "./components/image-preview";
import ImageUploader from "./components/image-uploader";

function App() {
  const [uploadedImage, setUploadedImage] = useState(null);
  const getUploadedImage = (image) => {
    setUploadedImage(image);
  };

  return (
    <div className="App">
      <ImageUploader getUploadedFiles={getUploadedImage} />
      {uploadedImage && <ImagePreview uploadedImage={uploadedImage} />}
    </div>
  );
}

export default App;
