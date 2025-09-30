import "./Addlist.css";
import { instance } from "../MainPage/MainPage.jsx";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import trash from "../assets/trash-2.png";
import plusCircle from "../assets/plus-circle.png";
import { Link } from "react-router-dom";

function Addlist() {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const agentBtnRef = useRef(null);
  const removeBtnRef = useRef(null);
  const blurOverlayRef = useRef(null);
  const [activeInput, setActiveInput] = useState(null);
  const [agents, setAgents] = useState([]);

  // Listing useForm
  const {
    register: registerListing,
    handleSubmit: handleSubmitListing,
    watch: watchListing,
    setValue: setValueListing,
    formState: { errors: errorsListing },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      type: "",
      address: "",
      zip: "",
      region_id: "",
      city_id: "",
      price: "",
      m2: "",
      bedrooms: "",
      description: "",
    },
  });

  // Agent useForm
  const {
    register: registerAgent,
    handleSubmit: handleSubmitAgent,
    watch: watchAgent,
    setValue: setValueAgent,
    formState: { errors: errorsAgent },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      Email: "",
      telNum: "",
      avatar: null,
      agent_id: "",
    },
  });

  // Watch values
  const addressValue = watchListing("address");
  const zipValue = watchListing("zip");
  const selectedRegionId = watchListing("region_id");
  const cityValue = watchListing("city_id");

  const nameValue = watchAgent("name");
  const surnameValue = watchAgent("surname");
  const EmailValue = watchAgent("Email");
  const telNumValue = watchAgent("telNum");

  // Regions & Cities fetch
  const getRegions = async () => {
    try {
      const response = await instance.get("/regions");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching regions:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  const getCities = async () => {
    try {
      const response = await instance.get("/cities");
      return response.data;
    } catch (error) {
      console.error(
        "Error fetching cities:",
        error.response?.data || error.message
      );
      throw error;
    }
  };

  useEffect(() => {
    const fetchLocationData = async () => {
      try {
        const [regionData, cityData] = await Promise.all([
          getRegions(),
          getCities(),
        ]);
        setRegions(regionData);
        setCities(cityData);
      } catch (err) {
        console.error("Error loading region/city data:", err);
      }
    };
    fetchLocationData();
  }, []);

  const filteredCities = cities.filter(
    (city) => String(city.region_id) === String(selectedRegionId)
  );

  // Image handlers
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      setImageUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setImage(null);
    setImageUrl("");
  };

  // Popup handlers
  function agent() {
    removeBtnRef.current.style.display = "block";
    blurOverlayRef.current.style.display = "block";
  }

  function remove() {
    removeBtnRef.current.style.display = "none";
    blurOverlayRef.current.style.display = "none";
  }

  function overlayRemove() {
    removeBtnRef.current.style.display = "none";
    blurOverlayRef.current.style.display = "none";
  }

  // Agents fetch
  const fetchAgents = async () => {
    try {
      const response = await instance.get("/agents");
      setAgents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  // Add Listing
  const onSubmitListing = async (data) => {
    try {
      const formData = new FormData();
      Object.entries(data).forEach(([key, value]) =>
        formData.append(key, value)
      );
      if (image) formData.append("avatar", image);

      await instance.post("/listings", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Listing added successfully");
    } catch (error) {
      console.error(
        "Error adding listing:",
        error.response?.data || error.message
      );
    }
  };

  // Add Agent
  const onSubmitAgent = async (data) => {
    try {
      const formData = new FormData();
      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("email", data.Email);
      formData.append("phone", data.telNum);
      if (image) formData.append("avatar", image);

      await instance.post("/agents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      console.log("Agent added successfully");
      remove();
      await fetchAgents();
    } catch (error) {
      console.error(error.response?.data || error.message);
    }
  };

  // Reset city when region changes
  useEffect(() => {
    if (selectedRegionId && watchListing("city_id")) {
      setValueListing("city_id", "");
    }
  }, [selectedRegionId]);

  // ErrorMessage Component
  function ErrorMessage({ children }) {
    return (
      <p style={{ color: "red", fontSize: "14px", marginTop: "4px" }}>
        {children}
      </p>
    );
  }

  return (
    <>
      <div className="add-list-container">
        <h1 className="title">ლისტინგის დამატება</h1>
        <form
          className="form-container"
          onSubmit={handleSubmitListing(onSubmitListing)}
        >
          <div className="sell-rent-content">
            <label htmlFor="">გარიგების ტიპი</label>
            <div className="radio-container">
              <div className="radio-content">
                <input type="radio" name="type" id="sell" />
                <label htmlFor="sell">იყიდება</label>
              </div>
              <div className="radio-content">
                <input type="radio" name="type" id="rent" />
                <label htmlFor="rent">ქირავდება</label>
              </div>
            </div>
          </div>
          <div className="placement-container">
            <h3>მდებარეობა</h3>
            <div className="placement-content">
              <div className="placement-item">
                <label htmlFor="misamarti">მისამართი *</label>
                <input
                  type="text"
                  id="misamarti"
                  {...registerListing("address", {
                    required: "✓ მინიმუმ ორი სიმბოლო",
                    minLength: {
                      value: 2,
                      message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                    },
                  })}
                  onFocus={() => setActiveInput("address")}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    border:
                      addressValue.length === 0
                        ? "1.5px solid #021526"
                        : errorsListing.address
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green",
                    outline:
                      activeInput === "address"
                        ? watchListing("address")?.length === 0
                          ? "1.5px solid #021526"
                          : errorsListing.address
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                />
                {watchListing("address")?.length === 0 ? (
                  <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                ) : errorsListing.address ? (
                  <p style={{ color: "#F93B1D" }}>
                    ✓ ჩაწერეთ ვალიდური მონაცემები
                  </p>
                ) : (
                  <p style={{ color: "green" }}>✓ მინიმუმ ორი სიმბოლო</p>
                )}
              </div>
              <div className="placement-item">
                <label htmlFor="index">საფოსტო ინდექსი *</label>
                <input
                  type="text"
                  id="zip"
                  placeholder="საფოსტო ინდექსი"
                  {...registerListing("zip", {
                    required: "✓ ჩაწერეთ მხოლოდ რიცხვები",
                    pattern: {
                      value: /^[0-9]+$/,
                      message: "✓ ჩაწერეთ მხოლოდ რიცხვები",
                    },
                  })}
                  onFocus={() => setActiveInput("zip")}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    border:
                      zipValue.length === 0
                        ? "1.5px solid #021526"
                        : errorsListing.zip
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green",
                    outline:
                      activeInput === "zip"
                        ? zipValue.length === 0
                          ? "1.5px solid #021526"
                          : errorsListing.zip
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                />
                {zipValue.length === 0 ? (
                  <p style={{ color: "#021526" }}>✓ ჩაწერეთ მხოლოდ რიცხვები</p>
                ) : errorsListing.zip ? (
                  <p style={{ color: "#F93B1D" }}>
                    {errorsListing.zip.message}
                  </p>
                ) : (
                  <p style={{ color: "green" }}>✓ ჩაწერეთ მხოლოდ რიცხვები</p>
                )}
              </div>
            </div>
            <div className="region-city-container">
              <div className="region-city-content">
                <label htmlFor="">რეგიონი</label>
                <select
                  {...registerListing("region_id", {
                    required: "აირჩიეთ რეგიონი",
                  })}
                  onFocus={() => setActiveInput("region_id")}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    border:
                      watchListing("region_id") === ""
                        ? "1.5px solid #021526"
                        : errorsListing.region_id
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green",
                    outline:
                      activeInput === "region_id"
                        ? watchListing("region_id") === ""
                          ? "1.5px solid #021526"
                          : errorsListing.region_id
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                >
                  {watchListing("region_id") === "" && (
                    <option value="">აირჩიეთ რეგიონი</option>
                  )}
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="region-city-content">
                <label htmlFor="">ქალაქი</label>
                <select
                  {...registerListing("city_id", {
                    required: "აირჩიეთ ქალაქი",
                  })}
                  onFocus={() => setActiveInput("city_id")}
                  onBlur={() => setActiveInput(null)}
                  style={{
                    border:
                      watchListing("city_id") === "" ||
                      watchListing("region_id") === ""
                        ? "1.5px solid #021526"
                        : errorsListing.city_id
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green",
                    outline:
                      activeInput === "city_id"
                        ? watchListing("city_id") === "" ||
                          watchListing("region_id") === ""
                          ? "1.5px solid #021526"
                          : errorsListing.city_id
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                >
                  {watchListing("city_id") === "" && (
                    <option value="">აირჩიეთ ქალაქი</option>
                  )}
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>
                {errorsListing.city_id && (
                  <ErrorMessage>{errorsListing.city_id.message}</ErrorMessage>
                )}
              </div>
            </div>
          </div>
          <div className="detail-container">
            <h3>ბინის დეტალები</h3>
            <div className="detail-content">
              <div className="detail-item">
                <label htmlFor="price">ფასი</label>
                <input type="text" id="price" />
              </div>
              <div className="detail-item">
                <label htmlFor="m2">ფართობი</label>
                <input type="text" id="m2" />
              </div>
            </div>
            <div className="detail-item">
              <label htmlFor="bedrooms">საძინებლების რაოდენობა*</label>
              <input type="text" id="bedrooms" />
            </div>
            <div className="description">
              <label htmlFor="">აღწერა *</label>
              <textarea name="" id="" className="text"></textarea>
            </div>
            <div className="photos">
              <label
                htmlFor="file-upload"
                style={{ color: imageUrl ? "green" : "initial" }}
              >
                ატვირთეთ ფოტო *
              </label>
              {!imageUrl ? (
                <label className="custom-file-upload" htmlFor="file-upload">
                  <span className="plus">+</span>
                  <input
                    id="file-upload"
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    onChange={handleFileChange}
                  />
                </label>
              ) : (
                <div
                  className="custom-file-upload"
                  style={{
                    border: imageUrl
                      ? "2px dashed green"
                      : "2px dashed #021526",
                  }}
                >
                  <div className="image-preview-wrapper">
                    <img
                      src={imageUrl}
                      alt="preview"
                      className="image-preview"
                    />
                    <button
                      type="button"
                      className="remove-image-btn"
                      onClick={handleRemoveImage}
                    >
                      <img src={trash} alt="trash" className="trash" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </form>
        <div className="list-btns">
          <Link to="/">
            <button className="cancel btn">გაუქმება</button>
          </Link>
          <button
            className="add btn"
            onClick={handleSubmitListing(onSubmitListing)}
          >
            დაამატე ლისტინგი
          </button>
        </div>
      </div>
      <form className="form" onSubmit={handleSubmitAgent(onSubmitAgent)}>
        <div className="agent-container">
          <h3>აგენტი</h3>
          <p>აირჩიე</p>
          <div className="agent-select-box">
            <select {...registerAgent("agent_id")}>
              <option value="">აირჩიე</option>

              {Array.isArray(agents) && agents.length > 0 ? (
                agents.map((agent) => {
                  console.log(agent); // ← ეს აქ ჩასვი
                  return (
                    <option key={agent.id} value={agent.id}>
                      {agent.name} {agent.surname}
                    </option>
                  );
                })
              ) : (
                <option disabled>აგენტები არ არის</option>
              )}
            </select>
          </div>
          <div className="add-agent-btn">
            <button type="button" ref={agentBtnRef} onClick={agent}>
              <img src={plusCircle} alt="" /> დაამატე აგენტი
            </button>
            <div
              className="blur-overlay"
              ref={blurOverlayRef}
              onClick={overlayRemove}
            ></div>
            <div className="add-agent" ref={removeBtnRef}>
              <h2 className="title">აგენტის დამატება</h2>
              <div className="fullname">
                <div className="inputs">
                  <label htmlFor="">სახელი *</label>
                  <input
                    type="text"
                    id="name"
                    placeholder="სახელი"
                    {...registerAgent("name", {
                      required: "✓ მინიმუმ ორი სიმბოლო",
                      minLength: {
                        value: 2,
                        message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                      },
                    })}
                    onFocus={() => setActiveInput("name")}
                    onBlur={() => setActiveInput(null)}
                    style={{
                      border:
                        nameValue.length === 0
                          ? "1.5px solid #021526"
                          : errorsAgent.name
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                      outline:
                        activeInput === "name"
                          ? nameValue.length === 0
                            ? "1.5px solid #021526"
                            : errorsAgent.name
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                          : "none",
                      padding: "2px",
                    }}
                  />

                  {nameValue.length === 0 ? (
                    <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                  ) : errorsAgent.name ? (
                    <p style={{ color: "#F93B1D" }}>
                      ✓ ჩაწერეთ ვალიდური მონაცემები
                    </p>
                  ) : (
                    <p style={{ color: "green" }}>✓ მინიმუმ ორი სიმბოლო</p>
                  )}
                </div>
                <div className="inputs">
                  <label htmlFor="">გვარი</label>
                  <input
                    type="text"
                    id="surname"
                    placeholder="სახელი"
                    {...registerAgent("surname", {
                      required: "✓ მინიმუმ ორი სიმბოლო",
                      minLength: {
                        value: 2,
                        message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                      },
                    })}
                    onFocus={() => setActiveInput("surname")}
                    onBlur={() => setActiveInput(null)}
                    style={{
                      border:
                        surnameValue.length === 0
                          ? "1.5px solid #021526"
                          : errorsAgent.surname
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                      outline:
                        activeInput === "surname"
                          ? surnameValue.length === 0
                            ? "1.5px solid #021526"
                            : errorsAgent.surname
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                          : "none",
                      padding: "2px",
                    }}
                  />

                  {surnameValue.length === 0 ? (
                    <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                  ) : errorsAgent.surname ? (
                    <p style={{ color: "#F93B1D" }}>
                      ✓ ჩაწერეთ ვალიდური მონაცემები
                    </p>
                  ) : (
                    <p style={{ color: "green" }}>✓ მინიმუმ ორი სიმბოლო</p>
                  )}
                </div>
              </div>
              <div className="mail-tel">
                <div className="inputs">
                  <label htmlFor="">ელ-ფოსტა*</label>
                  <input
                    type="email"
                    id="Email"
                    placeholder="ელ-ფოსტა"
                    {...registerAgent("Email", {
                      required: "✓ გამოიყენეთ @redberry.ge ფოსტა",
                      validate: (value) =>
                        value.endsWith("@redberry.ge") ||
                        "✓ ჩაწერეთ ვალიდური მონაცემები",
                    })}
                    onFocus={() => setActiveInput("Email")}
                    onBlur={() => setActiveInput(null)}
                    style={{
                      border:
                        EmailValue.length === 0
                          ? "1.5px solid #021526"
                          : errorsAgent.Email
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                      outline:
                        activeInput === "Email"
                          ? EmailValue.length === 0
                            ? "1.5px solid #021526"
                            : errorsAgent.Email
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                          : "none",
                      padding: "2px",
                    }}
                  />

                  {EmailValue.length === 0 ? (
                    <p style={{ color: "#021526" }}>
                      ✓ გამოიყენეთ @redberry.ge ფოსტა
                    </p>
                  ) : errorsAgent.Email ? (
                    <p style={{ color: "#F93B1D" }}>
                      ✓ ჩაწერეთ ვალიდური მონაცემები
                    </p>
                  ) : (
                    <p style={{ color: "green" }}>
                      ✓ გამოიყენეთ @redberry.ge ფოსტა
                    </p>
                  )}
                </div>
                <div className="inputs">
                  <label htmlFor="">ტელეფონის ნომერი</label>
                  <input
                    type="text"
                    id="telNum"
                    placeholder="ტელეფონის ნომერი"
                    {...registerAgent("telNum", {
                      required: "✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით",
                      pattern: {
                        value: /^5\d{8}$/,
                        message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                      },
                    })}
                    onFocus={() => setActiveInput("telNum")}
                    onBlur={() => setActiveInput(null)}
                    style={{
                      border:
                        telNumValue.length === 0
                          ? "1.5px solid #021526"
                          : errorsAgent.telNum
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                      outline:
                        activeInput === "telNum"
                          ? telNumValue.length === 0
                            ? "1.5px solid #021526"
                            : errorsAgent.telNum
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                          : "none",
                      padding: "2px",
                      borderRadius: "6px",
                      fontSize: "16px",
                    }}
                  />

                  {telNumValue.length === 0 ? (
                    <p style={{ color: "#021526" }}>
                      ✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით
                    </p>
                  ) : errorsAgent.telNum ? (
                    <p style={{ color: "#F93B1D" }}>
                      {errorsAgent.telNum.message}
                    </p>
                  ) : (
                    <p style={{ color: "green" }}>
                      ✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით
                    </p>
                  )}
                </div>
              </div>
              <div className="photos">
                <label
                  htmlFor="file-upload"
                  style={{ color: imageUrl ? "green" : "initial" }}
                >
                  ატვირთეთ ფოტო *
                </label>
                {!imageUrl ? (
                  <label className="custom-file-upload" htmlFor="file-upload">
                    <span className="plus">+</span>
                    <input
                      id="file-upload"
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={handleFileChange}
                    />
                  </label>
                ) : (
                  <div
                    className="custom-file-upload"
                    style={{
                      border: imageUrl
                        ? "2px dashed green"
                        : "2px dashed #021526",
                    }}
                  >
                    <div className="image-preview-wrapper">
                      <img
                        src={imageUrl}
                        alt="preview"
                        className="image-preview"
                      />
                      <button
                        type="button"
                        className="remove-image-btn"
                        onClick={handleRemoveImage}
                      >
                        <img src={trash} alt="trash" className="trash" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <div className="agent-btns">
                <button className="agent-remove-btn in-agent" onClick={remove}>
                  გაუქმება
                </button>
                <button
                  className="agent-add-btn in-agent"
                  type="submit"
                  onClick={handleSubmitAgent(onSubmitAgent)}
                >
                  დაამატე აგენტი
                </button>
              </div>
            </div>
          </div>
        </div>
      </form>
    </>
  );
}

export default Addlist;
