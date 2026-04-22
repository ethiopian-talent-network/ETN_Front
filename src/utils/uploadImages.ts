import axios from "axios";

export const uploadImage = async (file: File): Promise<string> => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", "portfolio_upload");

  const res = await axios.post(
    "https://api.cloudinary.com/v1_1/dzqma6sfk/image/upload",
    formData
  );

  return res.data.secure_url;
};
