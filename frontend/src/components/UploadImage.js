import React from "react";

function UploadImage({ uploadImage }) {
  return (
    <div>
      <input
        type="file"
        accept="image/*"
        onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
            uploadImage(file);
          }
        }}
        style={{
          padding: '10px',
          border: '1px solid #ccc',
          borderRadius: '5px',
          width: '100%'
        }}
      />
    </div>
  );
}

export default UploadImage;