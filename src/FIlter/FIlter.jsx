import "./Filter.css";
import arrow from "../assets/shape.png";
import React, { useState, useRef } from "react";
import "@fontsource/firago/500.css";
import trash from "../assets/trash-2.png";

function Filter() {
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  const agentBtnRef = useRef(null);
  const removeBtnRef = useRef(null);
  const blurOverlayRef = useRef(null);

  const items = [
    "რეგიონი",
    "საფასო კატეგორია",
    "ფართობი",
    "საძინებლების რაოდენობა",
  ];

  function handleFilterClick(filter) {
    setSelectedFilter(filter);
    console.log(`${filter}`);
  }

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

  return (
    <>
      <div className="filter-container">
        <div className="filter-content">
          <div className="filter-items">
            {items.map((item, index) => (
              <div
                className="filter-item"
                key={index}
                onClick={() => handleFilterClick(item)}
              >
                <h3>{item}</h3>
                <img src={arrow} alt="arrow" />
              </div>
            ))}
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
        <form className="form">
          <div className="fullname">
            <div className="inputs">
              <label htmlFor="">სახელი *</label>
              <input type="text" />
            </div>
            <div className="inputs">
              <label htmlFor="">გვარი</label>
              <input type="text" />
            </div>
          </div>
          <div className="mail-tel">
            <div className="inputs">
              <label htmlFor="">ელ-ფოსტა*</label>
              <input type="email" />
            </div>
            <div className="inputs">
              <label htmlFor="">ტელეფონის ნომერი</label>
              <input type="tex" />
            </div>
          </div>
          <div className="photos">
            <label htmlFor="">ატვირთეთ ფოტო *</label>
            <div className="custom-file-upload">
              {!imageUrl ? (
                <label htmlFor="file-upload">
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
              )}
            </div>
          </div>
        </form>
        <div className="agent-btns">
          <button className="agent-remove-btn in-agent" onClick={remove}>
            გაუქმება
          </button>
          <button className="agent-add-btn in-agent">დაამატე აგენტი</button>
        </div>
      </div>
    </>
  );
}

export default Filter;
