import { Button, ConfigProvider, DatePicker, message, Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { GoHeart, GoHeartFill } from "react-icons/go";
import {
  deleteProperty,
  dislikeProperty,
  getAllProperties,
  likeProperty,
} from "../api/property";
import AppContext from "../AppContext";
import Logo from "../assets/logo.png";
import EditProperty from "./EditProperty";

const PropertyCard = ({ property }) => {
  const [modalOpen, setModalOpen] = useState(false);
  const { user, setUser, loading, setLoading, properties, setProperties } =
    useContext(AppContext);
  const [edit, setEdit] = useState(false);
  const [liked, setLiked] = useState(false);

  const [rentModalOpen, setRentModalOpen] = useState(false);
  const [rentedDates, setRentedDates] = useState(property?.rentedDates || null);
  const [confirmModalOpen, setConfirmModalOpen] = useState(false);
  const [selectedDates, setSelectedDates] = useState(null);

  useEffect(() => {
    if (user?.token && user?.likedProperties?.includes(property._id)) {
      setLiked(true);
    }
  }, [user]);

  const quoteHandler = () => {
    setRentModalOpen(true);
  };

  const handleRentItem = () => {
    setRentModalOpen(true);
  };

  const handleBooking = () => {
    if (selectedDates && selectedDates.length === 2) {
      confirmBooking(property._id, selectedDates[0], selectedDates[1]);
      setConfirmModalOpen(false); // Close the modal after confirming
    } else {
      alert("Please select valid booking dates.");
    }
  };

  const handleDateSelect = (dates) => {
    if (dates && dates.length === 2) {
      setSelectedDates(dates);
      message.success(
        `Selected rental dates from ${dates[0].format(
          "YYYY-MM-DD"
        )} to ${dates[1].format("YYYY-MM-DD")}`
      );
      setRentModalOpen(false);
      setConfirmModalOpen(true);
    } else {
      alert("Please select both start and end dates.");
    }
  };

  const confirmBooking = async (propertyId, startDate, endDate) => {
    if (!propertyId || typeof propertyId !== "string") {
      console.error("Invalid propertyId:", propertyId);
      alert("Unable to book the property. Please try again.");
      return;
    }

    if (!startDate || !endDate) {
      alert("Invalid booking dates.");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/properties/book/${propertyId}`, // Use your backend base URL
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${user.token}`, // Include the token if required by protectRoute
          },
          body: JSON.stringify({
            from: startDate.format("YYYY-MM-DD"),
            to: endDate.format("YYYY-MM-DD"),
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        alert(errorData.message || "Failed to book the property.");
        return;
      }

      const data = await response.json();
      alert(data.message || "Booking successful!");
      window.location.reload();
    } catch (error) {
      console.error("Error booking property:", error);
      alert("Booking failed. Please try again later.");
    }
  };

  const handleLike = async () => {
    try {
      setLoading(true);
      const response = await likeProperty(property._id, user);
      if (response?.token) {
        setUser(response);
        localStorage.removeItem("currUser");
        localStorage.setItem("currUser", JSON.stringify(response));
        setLiked(true);
        const freshProperties = await getAllProperties();
        if (Array.isArray(freshProperties)) {
          setProperties(freshProperties);
        }
        message.success("Liked a property!");
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDislike = async () => {
    try {
      setLoading(true);
      const response = await dislikeProperty(property._id, user);
      if (response?.token) {
        console.log(response);
        setUser(response);
        localStorage.removeItem("currUser");
        localStorage.setItem("currUser", JSON.stringify(response));
        setLiked(false);
        const freshProperties = await getAllProperties();
        if (Array.isArray(freshProperties)) {
          setProperties(freshProperties);
        }
        message.success("Disliked a property");
      }
    } catch (error) {
      console.log("Error: ", error);
    } finally {
      setLoading(false);
    }
  };

  const deleteHandler = async () => {
    try {
      setLoading(true);
      const response = await deleteProperty(property._id, user);
      if (response.message) {
        message.success("Property deleted successfully");
        const freshProperties = await getAllProperties();
        if (Array.isArray(freshProperties)) {
          setProperties(freshProperties);
        }
      }
    } catch (error) {
      message.error("Error deleting property");
    } finally {
      setLoading(false);
      setModalOpen(false);
    }
  };

  const checkAvailability = () => {
    if (property && property.bookings && property.bookings.length === 0) {
      return "Available";
    } else {
      return "Booked";
    }
  };

  return (
    <>
      <div
        onClick={() => setModalOpen(true)}
        className="w-full aspect-[60vh] bg-primary/10 flex flex-col items-center justify-center cursor-pointer hover:bg-primary/20 rounded-xl p-6 gap-3"
      >
        <div className="h-1/2 overflow-hidden flex items-center rounded-xl mb-1">
          <img
            src={property.image ? property.image : Logo}
            alt=""
            className="rounded-xl"
          />
        </div>

        <div className="text-lg font-bold">{property.location}</div>

        <div className="flex items-center gap-0 text-lg sm:text-xl">
          <span className="flex items-center gap-1">${property.price}</span>
          <span>/month</span>
        </div>
        <div className="flex items-center gap-2 text-center">
          <span className="italic text-neutral-500">{property.city}</span>
        </div>
        <div className="flex items-center justify-center gap-3 text-xl w-full">
          {user?.token && user.email === property.sellerEmail && (
            <div className="italic text-sm leading-2 text-center w-1/2">
              Hosted by you
            </div>
          )}
          <div className="flex items-center justify-center gap-1 w-1/2">
            {liked ? (
              <GoHeartFill className="text-red-600" size={24} />
            ) : (
              <GoHeart />
            )}
            <span className={`${liked ? "text-red-500" : ""}`}>
              {property.likes}
            </span>
          </div>
        </div>
        <h3>Status: {checkAvailability()}</h3>

        {/* If booked, show booked dates */}
        {property.bookings.length > 0 && (
          <div>
            <h4>Booked Dates:</h4>
            <ul>
              {property.bookings.map((booking, index) => (
                <li key={index}>
                  From: {new Date(booking.from).toLocaleDateString()} - To:{" "}
                  {new Date(booking.to).toLocaleDateString()}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: "#00a200",
          },
        }}
      >
        <Modal
          centered
          title={false}
          footer={false}
          open={modalOpen}
          onCancel={() => {
            setModalOpen(false);
            setEdit(false);
          }}
          onClose={() => {
            setModalOpen(false);
            setEdit(false);
          }}
          onOk={() => {
            setModalOpen(false);
            setEdit(false);
          }}
          width={edit ? "fit-content" : "400px"}
        >
          {!edit ? (
            <div className="flex flex-col items-center gap-4 p-3 sm:p-5 h-full">
              <div className="max-h-[35vh] overflow-hidden flex items-center rounded-xl">
                <img
                  src={property.image ? property.image : Logo}
                  alt=""
                  className="rounded-xl"
                />
              </div>
              <div className="flex items-center gap-1 text-xl">
                <span className="text-lg">Price:</span>
                <div className="flex items-center">
                  <span className="">${property.price}/Month</span>
                </div>
              </div>
              <div className="flex gap-1 w-full">
                <div className="text-lg text-center flex items-center justify-center w-1/4">
                  Item Info:
                </div>
                <div className="grid grid-cols-2 gap-1 p-2 text-nowrap rounded-xl bg-primary/20 w-3/4">
                  <div className="col-span-2 gap-1 flex items-start justify-start">
                    Item: <span className="font-bold">{property.location}</span>
                  </div>
                  <div className="gap-1 flex items-start justify-start">
                    City: <span className="font-bold">{property.city}</span>
                  </div>
                  <div className="col-span-2 gap-0 flex flex-col items-start justify-start text-wrap">
                    <span>Nearby Facilities:</span>
                    <span className="font-bold">
                      {property.nearbyFacilities.join(", ")}
                    </span>
                  </div>
                </div>
              </div>
              {user?.token ? (
                <div className="flex gap-1 w-full">
                  <div className="text-lg text-center flex items-center justify-center w-1/4">
                    Renter Info:
                  </div>
                  <div className="grid grid-cols-1 gap-1 p-2 text-nowrap rounded-xl bg-primary/20 w-3/4">
                    <div className="gap-1 flex items-start justify-start">
                      Email:{" "}
                      <span className="font-bold">{property.sellerEmail}</span>
                    </div>
                    <div className="gap-1 flex items-start justify-start">
                      Phone Number:{" "}
                      <span className="font-bold">{property.sellerPhone}</span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-lg">Login to see seller information</div>
              )}

              {user?.token && (
                <div className="flex items-center gap-1">
                  <div
                    onClick={liked ? handleDislike : handleLike}
                    className="flex items-center gap-1 text-[15px] bg-red-600/20 px-3 py-[4.5px] rounded-md hover:bg-red-600/60 hover:text-white cursor-pointer duration-200 transition-all"
                  >
                    {!liked ? (
                      <GoHeart />
                    ) : (
                      <GoHeartFill className="text-red-600" />
                    )}
                    <span>{liked ? "Dislike" : "Like"}</span>
                  </div>
                  {user.email !== property.sellerEmail ? (
                    <Button
                      onClick={quoteHandler}
                      className="bg-primary text-white"
                    >
                      Rent Item
                    </Button>
                  ) : (
                    <div className="flex items-center gap-1">
                      <Button
                        onClick={() => setEdit(true)}
                        className="bg-primary border-primary text-white"
                      >
                        Edit Property
                      </Button>
                      <ConfigProvider
                        theme={{ token: { colorPrimary: "red" } }}
                      >
                        <Button
                          onClick={deleteHandler}
                          className="border-red-600 text-red-600"
                        >
                          Delete Property
                        </Button>
                      </ConfigProvider>
                    </div>
                  )}
                </div>
              )}
            </div>
          ) : (
            <EditProperty property={property} setModalOpen={setModalOpen} />
          )}
        </Modal>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: "#00a200",
            },
          }}
        >
          {/* Rental Modal */}
          <Modal
            centered
            title="Select Rental Dates"
            footer={null}
            open={rentModalOpen}
            onCancel={() => setRentModalOpen(false)}
          >
            <DatePicker.RangePicker onChange={handleDateSelect} />
          </Modal>

          <Modal
            centered
            title="Confirm Booking"
            open={confirmModalOpen}
            onCancel={() => setConfirmModalOpen(false)}
            onOk={handleBooking} // Use handleBooking
          >
            <p>
              Are you sure you want to book this item from{" "}
              <strong>{selectedDates?.[0]?.format("YYYY-MM-DD")}</strong> to{" "}
              <strong>{selectedDates?.[1]?.format("YYYY-MM-DD")}</strong>?
            </p>
          </Modal>
        </ConfigProvider>
      </ConfigProvider>
    </>
  );
};

export default PropertyCard;
