import "./Addlist.css";
import { instance } from "../Main/Filter/Filter";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";
import trash from "../assets/trash-2.png";
import plusCircle from "../assets/plus-circle.png";
import { Link } from "react-router-dom";
import axios from "axios";

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

  // agent form validation
  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      firstName: "",
      lastName: "",
      Email: "",
      telNum: "",
      address: "",
      zip: "",
    },
  });

  const onSubmit = async (formData) => {
    try {
      await addAgent(formData);
      await fetchAgents();
    } catch (error) {
      console.error("Agent add failed", error);
    }
  };

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const EmailValue = watch("Email");
  const telNumValue = watch("telNum");
  const addressValue = watch("address")
  const zipValue = watch("zip");

  // city and region lists

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

  const selectedRegionId = watch("region_id");
  const filteredCities = cities.filter(
    (city) => String(city.region_id) === String(selectedRegionId)
  );

  // image add and remove
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

  // agent add and remove
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

  // axios api

  const fetchAgents = async () => {
    try {
      const response = await instance.get("/agents");
      console.log("AGENT DATA:", response.data);
      setAgents(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  const addAgent = async (newAgentData) => {
    try {
      const formData = new FormData();
      formData.append("first_name", newAgentData.firstName);
      formData.append("last_name", newAgentData.lastName);
      formData.append("email", newAgentData.Email);
      formData.append("phone", newAgentData.telNum);
      formData.append("avatar", image);

      await instance.post("/agents", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      await fetchAgents();
      remove();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className="add-list-container">
        <h1 className="title">ლისტინგის დამატება</h1>
        <form className="form-container" onSubmit={handleSubmit(onSubmit)}>
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
                  {...register("address", {
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
                        : errors.address
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                    outline:
                      activeInput === "address"
                        ? watch("address")?.length === 0
                          ? "1.5px solid #021526"
                          : errors.address
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                />
                {watch("address")?.length === 0 ? (
                  <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                ) : errors.address ? (
                  <p style={{ color: "#F93B1D" }}>✓ ჩაწერეთ ვალიდური მონაცემები</p>
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
                  {...register("zip", {
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
                        : errors.zip
                          ? "1.5px solid #F93B1D"
                          : "1.5px solid green",
                    outline:
                      activeInput === "zip"
                        ? zipValue.length === 0
                          ? "1.5px solid #021526"
                          : errors.zip
                            ? "1.5px solid #F93B1D"
                            : "1.5px solid green"
                        : "none",
                    padding: "2px",
                  }}
                />
                {zipValue.length === 0 ? (
                  <p style={{ color: "#021526" }}>✓ ჩაწერეთ მხოლოდ რიცხვები</p>
                ) : errors.zip ? (
                  <p style={{ color: "#F93B1D" }}>{errors.zip.message}</p>
                ) : (
                  <p style={{ color: "green" }}>✓ ჩაწერეთ მხოლოდ რიცხვები</p>
                )}
              </div>
            </div>
            <div className="region-city-container">
              <div className="region-city-content">
                <label htmlFor="">რეგიონი</label>
                <select {...register("region_id")}>
                  <option value="">აირჩიეთ რეგიონი</option>
                  {regions.map((region) => (
                    <option key={region.id} value={region.id}>
                      {region.name}
                    </option>
                  ))}
                  {errors.region_id && (
                    <Error>{errors.region_id.message}</Error>
                  )}
                </select>
              </div>
              <div className="region-city-content">
                <label htmlFor="">ქალაქი</label>
                <select {...register("city_id")}>
                  <option value="">აირჩიეთ ქალაქი</option>
                  {filteredCities.map((city) => (
                    <option key={city.id} value={city.id}>
                      {city.name}
                    </option>
                  ))}
                </select>

                {errors.city_id && <Error>{errors.city_id.message}</Error>}
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
          <div className="agent-container">
            <h3>აგენტი</h3>
            <p>აირჩიე</p>
            <div className="agent-select-box">
              <select {...register("agent_id")}>
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
                      id="firstName"
                      placeholder="სახელი"
                      {...register("firstName", {
                        required: "✓ მინიმუმ ორი სიმბოლო",
                        minLength: {
                          value: 2,
                          message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                        },
                      })}
                      onFocus={() => setActiveInput("firstName")}
                      onBlur={() => setActiveInput(null)}
                      style={{
                        border:
                          firstNameValue.length === 0
                            ? "1.5px solid #021526"
                            : errors.firstName
                              ? "1.5px solid #F93B1D"
                              : "1.5px solid green",
                        outline:
                          activeInput === "firstName"
                            ? firstNameValue.length === 0
                              ? "1.5px solid #021526"
                              : errors.firstName
                                ? "1.5px solid #F93B1D"
                                : "1.5px solid green"
                            : "none",
                        padding: "2px",
                      }}
                    />

                    {firstNameValue.length === 0 ? (
                      <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                    ) : errors.firstName ? (
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
                      id="lastName"
                      placeholder="სახელი"
                      {...register("lastName", {
                        required: "✓ მინიმუმ ორი სიმბოლო",
                        minLength: {
                          value: 2,
                          message: "✓ ჩაწერეთ ვალიდური მონაცემები",
                        },
                      })}
                      onFocus={() => setActiveInput("lastName")}
                      onBlur={() => setActiveInput(null)}
                      style={{
                        border:
                          lastNameValue.length === 0
                            ? "1.5px solid #021526"
                            : errors.lastName
                              ? "1.5px solid #F93B1D"
                              : "1.5px solid green",
                        outline:
                          activeInput === "lastName"
                            ? lastNameValue.length === 0
                              ? "1.5px solid #021526"
                              : errors.lastName
                                ? "1.5px solid #F93B1D"
                                : "1.5px solid green"
                            : "none",
                        padding: "2px",
                      }}
                    />

                    {lastNameValue.length === 0 ? (
                      <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
                    ) : errors.lastName ? (
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
                      {...register("Email", {
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
                            : errors.Email
                              ? "1.5px solid #F93B1D"
                              : "1.5px solid green",
                        outline:
                          activeInput === "Email"
                            ? EmailValue.length === 0
                              ? "1.5px solid #021526"
                              : errors.Email
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
                    ) : errors.Email ? (
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
                      {...register("telNum", {
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
                            : errors.telNum
                              ? "1.5px solid #F93B1D"
                              : "1.5px solid green",
                        outline:
                          activeInput === "telNum"
                            ? telNumValue.length === 0
                              ? "1.5px solid #021526"
                              : errors.telNum
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
                    ) : errors.telNum ? (
                      <p style={{ color: "#F93B1D" }}>
                        {errors.telNum.message}
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
                  <button
                    className="agent-remove-btn in-agent"
                    onClick={remove}
                  >
                    გაუქმება
                  </button>
                  <button className="agent-add-btn in-agent">
                    დაამატე აგენტი
                  </button>
                </div>
              </div>
            </div>
          </div>
        </form>
        <div className="list-btns">
          <Link to="/Main">
            <button className="cancel btn">გაუქმება</button>
          </Link>
          <button className="add btn">დაამატე ლისტინგი</button>
        </div>
      </div>
    </>
  );
}

export default Addlist;
