import { message } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { getAllProperties } from "../api/property";
import AppContext from "../AppContext";
import CustomSwitchBig from "../components/CustomSwitchBig";
import Find from "../components/Find";
import Liked from "../components/Liked";
import Rent from "../components/Rent";

const Dashboard = () => {
  const { user, properties, setProperties, loading, setLoading } =
    useContext(AppContext);

  // Retrieve the current page from localStorage or default to "Find"
  const [currPage, setCurrPage] = useState(
    localStorage.getItem("currPage") || "Find"
  );

  // Fetch properties on component mount
  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const response = await getAllProperties();
        if (Array.isArray(response)) {
          setProperties(response);
        } else {
          message.error("Error while fetching properties");
        }
      } catch (errr) {
        message.error("Error while fetching properties");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Update localStorage whenever currPage changes
  useEffect(() => {
    localStorage.setItem("currPage", currPage);
  }, [currPage]);

  return (
    <div className="h-full w-full flex flex-col items-center ">
      <div className="p-2 w-1/2">
        <CustomSwitchBig
          currOption={currPage}
          setOption={setCurrPage}
          options={["Find", "Rent", "Liked"]}
        />
      </div>
      <div className="w-full flex items-center justify-center">
        {currPage === "Find" ? (
          <Find />
        ) : currPage === "Rent" ? (
          <Rent />
        ) : (
          <Liked />
        )}
      </div>
    </div>
  );
};

export default Dashboard;
