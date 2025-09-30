import "./MainPage.css";
import arrow from "../assets/Shape.png";
import React, { useState, useRef, useEffect } from "react";
import "@fontsource/firago/500.css";
import trash from "../assets/trash-2.png";
import { useForm } from "react-hook-form";
import axios from "axios";
import { Link } from "react-router-dom";

const TOKEN = "9f8e6802-4827-4091-8b26-0e0a42ad5423";
export const instance = axios.create({
  baseURL: "https://api.real-estate-manager.redberryinternship.ge/api",
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
    Authorization: `Bearer ${TOKEN}`,
  },
});

function MainPage() {
  // const [selectedFilter, setSelectedFilter] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const agentBtnRef = useRef(null);
  const removeBtnRef = useRef(null);
  const blurOverlayRef = useRef(null);
  const [posts, setPosts] = useState([]);
  const [activeInput, setActiveInput] = useState(null);

  //  img add and remove in agent
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

  const getPosts = async () => {
    try {
      const response = await instance.get("/real-estates");
      console.log(response.data);
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getPosts();
  }, []);

  // form validation

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      name: "",
      surname: "",
      Email: "",
      telNum: "",
    },
  });

  const onSubmit = async (data) => {
    try {
      const formData = new FormData();

      formData.append("name", data.name);
      formData.append("surname", data.surname);
      formData.append("email", data.Email);
      formData.append("phone", data.telNum);
      formData.append("avatar", image);

      await instance.post("/agents", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("აგენტის დამატება წარმატებით განხორციელდა");
      remove();
    } catch (error) {
      console.error(
        "შეცდომა აგენტის დამატებისას:",
        error.response?.data || error.message
      );
    }
  };

  const nameValue = watch("name");
  const surnameValue = watch("surname");
  const EmailValue = watch("Email");
  const telNumValue = watch("telNum");

  useEffect(() => {
    trigger();
  }, []);

  console.log(errors);

  //  filter on click

  function handleFilterClick1(filter) {
    console.log("რეგიონი");
  }

  function handleFilterClick2(filter) {
    console.log("საფასო კატეგორია");
  }

  function handleFilterClick3(filter) {
    console.log("ფართობი");
  }

  function handleFilterClick4(filter) {
    console.log("საძინებლების რაოდენობა");
  }

  return (
    <>
      <div className="filter-container">
        <div className="filter-content">
          <div className="filter-items">
            <div className="filter-item" onClick={handleFilterClick1}>
              <h3>რეგიონი</h3>
              <img src={arrow} alt="arrow" />
            </div>

            <div className="filter-item" onClick={handleFilterClick2}>
              <h3>საფასო კატეგორია</h3>
              <img src={arrow} alt="arrow" />
            </div>

            <div className="filter-item" onClick={handleFilterClick3}>
              <h3>ფართობი</h3>
              <img src={arrow} alt="arrow" />
            </div>

            <div className="filter-item" onClick={handleFilterClick4}>
              <h3>საძინებლების რაოდენობა</h3>
              <img src={arrow} alt="arrow" />
            </div>
          </div>
          <div className="btns">
            <Link to="/Addlist" className="list btn">
              + ლისტინგის დამატება
            </Link>
            <button className="agent btn" ref={agentBtnRef} onClick={agent}>
              + აგენტის დამატება
            </button>
          </div>
        </div>
        <div className="add-filter"></div>
      </div>

      <div
        className="blur-overlay"
        ref={blurOverlayRef}
        onClick={overlayRemove}
      ></div>

      <div className="add-agent" ref={removeBtnRef}>
        <h2 className="title">აგენტის დამატება</h2>
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <div className="fullname">
            <div className="inputs">
              <label htmlFor="">სახელი *</label>
              <input
                type="text"
                id="name"
                placeholder="სახელი"
                {...register("name", {
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
                      : errors.name
                      ? "1.5px solid #F93B1D"
                      : "1.5px solid green",
                  outline:
                    activeInput === "name"
                      ? nameValue.length === 0
                        ? "1.5px solid #021526"
                        : errors.name
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green"
                      : "none",
                  padding: "2px",
                }}
              />

              {nameValue.length === 0 ? (
                <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
              ) : errors.name ? (
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
                {...register("surname", {
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
                      : errors.surname
                      ? "1.5px solid #F93B1D"
                      : "1.5px solid green",
                  outline:
                    activeInput === "surname"
                      ? surnameValue.length === 0
                        ? "1.5px solid #021526"
                        : errors.surname
                        ? "1.5px solid #F93B1D"
                        : "1.5px solid green"
                      : "none",
                  padding: "2px",
                }}
              />

              {surnameValue.length === 0 ? (
                <p style={{ color: "#021526" }}>✓ მინიმუმ ორი სიმბოლო</p>
              ) : errors.surname ? (
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
                <p style={{ color: "#F93B1D" }}>{errors.telNum.message}</p>
              ) : (
                <p style={{ color: "green" }}>✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით</p>
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
                  border: imageUrl ? "2px dashed green" : "2px dashed #021526",
                }}
              >
                <div className="image-preview-wrapper">
                  <img src={imageUrl} alt="preview" className="image-preview" />
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
            <button className="agent-add-btn in-agent">დაამატე აგენტი</button>
          </div>
        </form>
      </div>
    </>
  );
}

export default MainPage;
