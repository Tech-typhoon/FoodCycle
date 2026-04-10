import axios from "axios";
import { useState } from "react";

function Sell() {
  const [image, setImage] = useState(null);
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [quantity, setQuantity] = useState("");
  const [expiry, setExpiry] = useState("");

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
    const url = await upload();

    await axios.post("http://localhost:5000/add", {
      name,
      image: url,
      type: "sell",
      price: parseFloat(price),
      quantity,
      expiry
    });

    alert("Food Listed for Sale");
  };

  return (
    <div className="container">
      <h2>Sell Food</h2>
      <div className="form-group">
        <input type="file" onChange={e => setImage(e.target.files[0])} />
      </div>
      <div className="form-group">
        <input placeholder="Food Name" onChange={e => setName(e.target.value)} />
      </div>
      <div className="form-group">
        <input placeholder="Price" type="number" onChange={e => setPrice(e.target.value)} />
      </div>
      <div className="form-group">
        <input placeholder="Quantity" onChange={e => setQuantity(e.target.value)} />
      </div>
      <div className="form-group">
        <input placeholder="Expiry Date" type="date" onChange={e => setExpiry(e.target.value)} />
      </div>
      <button className="btn" onClick={submit}>List for Sale</button>
    </div>
  );
}

export default Sell;