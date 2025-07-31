import "./Addlist.css";
import { instance } from "../Main/FIlter/FIlter";
import React, { useState, useRef, useEffect } from "react";
import { useForm } from "react-hook-form";

function Addlist() {
  const [regions, setRegions] = useState([]);
  const [cities, setCities] = useState([]);

  const {
    register,
    handleSubmit,
    watch,
    trigger,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => console.log(data);

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
                <label htmlFor="">მისამართი *</label>
                <input type="text" />
              </div>
              <div className="placement-item">
                <label htmlFor="">საფოსტო ინდექსი *</label>
                <input type="text" />
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
        </form>
      </div>
    </>
  );
}

export default Addlist;
