import axios from "axios";
import { useState } from "react";

function Donate() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");

  const upload = async () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "YOUR_PRESET");

    const res = await axios.post(
      "https://api.cloudinary.com/v1_1/YOUR_CLOUD_NAME/image/upload",
      data
    );

    return res.data.secure_url;
  };

  const submit = async () => {
    try {
      const url = await upload();
      await axios.post("http://localhost:5000/add", {
        name,
        image: url,
        type: "donate"
      });
      alert("Food Donated Successfully!");
    } catch (err) {
      alert("Error donating food: " + err.message);
    }
  };

  return (
    <div className="container">
      <h2>Donate Food</h2>
      <div className="form-group">
        <input type="file" onChange={e => setImage(e.target.files[0])} />
      </div>
      <div className="form-group">
        <input placeholder="Food Name" onChange={e => setName(e.target.value)} />
      </div>
      <button className="btn" onClick={submit}>Donate Food</button>
    </div>
  );
}

export default Donate;