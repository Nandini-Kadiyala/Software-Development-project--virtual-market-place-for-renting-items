import { Button, ConfigProvider, message, Modal } from "antd";
import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppContext from "../AppContext";
import DefaultPP from "../assets/defaultPP.png";
import Logo from "../assets/logoo.avif";
import CustomSwitch from "./CustomSwitch";
import Login from "./Login";
import Signup from "./Signup";

const Header = () => {
  const [card, setCard] = useState("Login");
  const [modalOpen, setModalOpen] = useState(false);
  const { user, setUser, setUserProperties } = useContext(AppContext);
  const navigate = useNavigate();

  const logoutHandler = () => {
    setUser(null);
    localStorage.removeItem("currUser");
    setModalOpen(false);
    navigate("/");
    message.success("Logged out successfully!");
  };

  return (
    <div className="w-full flex items-center justify-between px-5 h-[50px] bg-black text-white">
      <div className="flex items-center gap-3">
        <img src={Logo} alt="" className="size-8" />
        <span className="text-xl">RentCity</span>
      </div>
      <button
        onClick={() => setModalOpen(true)}
        className="rounded-md bg-white/20 hover:bg-white/40 px-2 py-1"
      >
        {!user?.token ? (
          <span>Login/Signup</span>
        ) : (
          <div className="flex items-center gap-2">
            <img
              src={user.profilePicture ? user.profilePicture : DefaultPP}
              alt="PP"
              className="size-8 rounded-full"
            />
            <span>Hi {user.firstName}!</span>
          </div>
        )}
      </button>
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
          onCancel={() => setModalOpen(false)}
          onClose={() => setModalOpen(false)}
          onOk={() => setModalOpen(false)}
          width="fit-content"
        >
          {!user?.token ? (
            <div className="w-full flex flex-col items-center gap-4">
              <CustomSwitch
                currOption={card}
                setOption={setCard}
                options={["Login", "Signup"]}
              />
              {card === "Login" ? (
                <Login setModalOpen={setModalOpen} />
              ) : (
                <Signup setModalOpen={setModalOpen} />
              )}
            </div>
          ) : (
            <div className="w-full flex flex-col items-center gap-4">
              <div className="flex items-center gap-3">
                <img src={Logo} alt="" className="size-10" />
                <span className="text-2xl text-primary font-bold">
                  RentCity
                </span>
              </div>
              <div className="flex items-center gap-4">
                <div
                  className=" size-32 sm:size-56 rounded-full border"
                  style={{
                    backgroundImage: `url(${
                      user?.profilePicture ? user.profilePicture : DefaultPP
                    })`,
                    backgroundPosition: "center",
                    backgroundSize: "cover",
                  }}
                />
                <div className="flex flex-col gap-4 items-start">
                  <div className="flex flex-col gap-0 items-start">
                    <span className=" text-3xl sm:text-4xl font-[610] text-green-700 mb-2 text-left">
                      {user?.firstName} {user?.lastName}
                    </span>
                    <span className="text-[15px] flex items-center gap-2">
                      <span className="italic">Email:</span>
                      <span>{user?.email}</span>
                    </span>
                    <span className="text-[15px] flex items-center gap-2">
                      <span className="italic">Contact:</span>
                      <span>{user?.phoneNumber}</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button onClick={logoutHandler} type="primary">
                      Logout
                    </Button>
                    {/* <Button type='primary' className='bg-primary border-primary hover:bg-white hover:text-primary'>Edit Profile</Button> */}
                  </div>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </ConfigProvider>
    </div>
  );
};

export default Header;
