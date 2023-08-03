import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { uploadResource } from "~/store/slices/resourceSlice";

const UpLoad = ({ imgRef, body, disabled, handleAfterClose }) => {
  const [files, setFiles] = useState(null);
  const dispatch = useDispatch();

  useEffect(() => {
    if (files) {
      const formData = new FormData();
      formData.append("files", files);
      dispatch(uploadResource({ files: formData.get("files"), ...body })).then(
        () => handleAfterClose && handleAfterClose()
      );
      setFiles(null);
    }
  }, [files]);

  const handleImgChange = (e) => {
    setFiles(e.target.files[0]);
    e.target.value = null;
  };

  return (
    <input
      type="file"
      ref={imgRef}
      onChange={handleImgChange}
      hidden
      id="avatar"
      name="files"
      disabled={disabled}
    />
  );
};

export default UpLoad;
