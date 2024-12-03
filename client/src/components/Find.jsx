import { ConfigProvider, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import AppContext from "../AppContext";
import LoaderFull from "./LoaderFull";
import PropertyCard from "./PropertyCard";

const Find = () => {
  const { user, properties, loading } = useContext(AppContext);
  const [list, setList] = useState([]);

  useEffect(() => {
    const filteredList = properties.filter(
      (property) => property.sellerEmail !== user?.email
    );
    setList(filteredList);
  }, [user, properties]);

  const cityOptions = [
    { value: "Boston", label: "Boston" },
    { value: "Manchester", label: "Manchester" },
    { value: "London", label: "London" },
    { value: "Amsterdam", label: "Amsterdam" },
    { value: "Tokyo", label: "Tokyo" },
    { value: "Beijing", label: "Beijing" },
  ];

  const priceOptions = [
    { value: 1000, label: "<1000" },
    { value: 2000, label: "<2000" },
    { value: 3000, label: "<3000" },
    { value: 4000, label: "<4000" },
    { value: 5000, label: "<5000" },
    { value: "up", label: ">5000" },
  ];

  const handleCityFilter = (value) => {
    if (value) {
      let filteredList = properties.filter(
        (property) => property.sellerEmail !== user?.email
      );
      filteredList = filteredList.filter((property) => property.city === value);
      setList(filteredList);
    } else {
      const filteredList = properties.filter(
        (property) => property.sellerEmail !== user?.email
      );
      setList(filteredList);
    }
  };
  const handleRoomFilter = (value) => {
    if (value) {
      let filteredList = properties.filter(
        (property) => property.sellerEmail !== user?.email
      );
      filteredList = filteredList.filter((property) => property.bhk === value);
      setList(filteredList);
    } else {
      const filteredList = properties.filter(
        (property) => property.sellerEmail !== user?.email
      );
      setList(filteredList);
    }
  };

  const handlePriceFilter = (value) => {
    if (value) {
      if (value === "up") {
        let filteredList = properties.filter(
          (property) => property.sellerEmail !== user?.email
        );
        filteredList = filteredList.filter(
          (property) => property.price > 50000
        );
        setList(filteredList);
      } else {
        let filteredList = properties.filter(
          (property) => property.sellerEmail !== user?.email
        );
        filteredList = filteredList.filter(
          (property) => property.price <= value
        );
        setList(filteredList);
      }
    } else {
      const filteredList = properties.filter(
        (property) => property.sellerEmail !== user?.email
      );
      setList(filteredList);
    }
  };

  if (loading) {
    return <LoaderFull />;
  }

  return (
    <div className="flex flex-col items-center justify-center">
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00a200",
            colorBorder: "#00a200",
            colorTextPlaceholder: "#00a200",
          },
        }}
      >
        <div className="flex flex-wrap items-center justify-center gap-1">
          <Select
            defaultValue={null}
            style={{ minWidth: "100px" }}
            allowClear
            options={cityOptions}
            onChange={handleCityFilter}
            placeholder="City filter"
            width="fit-content"
          />

          <Select
            defaultValue={null}
            style={{ minWidth: "100px" }}
            allowClear
            options={priceOptions}
            onChange={handlePriceFilter}
            placeholder="Price filter"
            width="fit-content"
          />
        </div>
      </ConfigProvider>
      <div className="p-2 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        {list?.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
    </div>
  );
};

export default Find;
