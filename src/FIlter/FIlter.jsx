import "./Filter.css";
import arrow from "../assets/shape.png";
import React, { useState, useRef, useEffect } from "react";
import "@fontsource/firago/500.css";
import trash from "../assets/trash-2.png";
import { useForm } from "react-hook-form";
import axios from "axios";

function Filter() {
  // const [selectedFilter, setSelectedFilter] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const agentBtnRef = useRef(null);
  const removeBtnRef = useRef(null);
  const blurOverlayRef = useRef(null);
  const [posts, setPosts] = useState([]);

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
      firstName: "",
      lastName: "",
      Email: "",
      telNum: "",
    },
  });

  const onSubmit = async (data) => console.log(data);

  const firstNameValue = watch("firstName");
  const lastNameValue = watch("lastName");
  const EmailValue = watch("Email");

  useEffect(() => {
    trigger();
  }, []);

  // axios api

  const TOKEN = "9f837d22-ede4-4824-8330-981f2b4beadf";

  const instance = axios.create({
    baseURL: "https://api.real-estate-manager.redberryinternship.ge/api",
    headers: {
      Accept: "application/json",
      "Content-Type": "application/json",
      Authorization: `Bearer ${TOKEN}`,
    },
  });

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
            <button className="list btn">+ ლისტინგის დამატება</button>
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
                id="firstName"
                {...register("firstName", {
                  required: "✓ მინიმუმ ორი სიმბოლო",
                  minLength: {
                    value: 2,
                    message: "✓ მინიმუმ ორი სიმბოლო",
                  },
                })}
              />
              {errors.firstName ? (
                <p style={{ color: "#021526" }}>{errors.firstName.message}</p>
              ) : (
                firstNameValue.length >= 2 && (
                  <p style={{ color: "green" }}>✓ მინიმუმ ორი სიმბოლო</p>
                )
              )}
            </div>
            <div className="inputs">
              <label htmlFor="">გვარი</label>
              <input
                type="text"
                id="lastName"
                {...register("lastName", {
                  required: "✓ მინიმუმ ორი სიმბოლო",
                  minLength: {
                    value: 2,
                    message: "✓ მინიმუმ ორი სიმბოლო",
                  },
                })}
              />
              {errors.lastName ? (
                <p style={{ color: "#021526" }}>{errors.lastName.message}</p>
              ) : (
                lastNameValue.length >= 2 && (
                  <p style={{ color: "green" }}>✓ მინიმუმ ორი სიმბოლო</p>
                )
              )}
            </div>
          </div>
          <div className="mail-tel">
            <div className="inputs">
              <label htmlFor="">ელ-ფოსტა*</label>
              <input
                type="email"
                id="Email"
                {...register("Email", {
                  required: "✓ გამოიყენეთ @redberry.ge ფოსტა",
                  validate: (value) =>
                    value.endsWith("@redberry.ge") ||
                    "✓ გამოიყენეთ @redberry.ge ფოსტა",
                })}
              />
              {errors.Email ? (
                <p style={{ color: "#021526" }}>{errors.Email.message}</p>
              ) : (
                EmailValue.endsWith("@redberry.ge") && (
                  <p style={{ color: "green" }}>
                    ✓ გამოიყენეთ @redberry.ge ფოსტა
                  </p>
                )
              )}
            </div>
            <div className="inputs">
              <label htmlFor="">ტელეფონის ნომერი</label>
              <input
                type="text"
                id="telNum"
                {...register("telNum", {
                  required: "✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით",
                  pattern: {
                    value: /^5\d{8}$/,
                    message: "✓ მხოლოდ 9 რიცხვი დაიწყეთ 5 ით",
                  },
                })}
              />
              {errors.telNum ? (
                <p style={{ color: "#021526", width: "386px" }}>
                  {errors.telNum.message}
                </p>
              ) : (
                watch("telNum") && (
                  <p style={{ color: "green", width: "386px" }}>
                    ✓ ფორმატი სწორია
                  </p>
                )
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
              <div className="custom-file-upload">
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

export default Filter;
