import { Modal } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { GoPlusCircle } from "react-icons/go";
import { IoHome } from "react-icons/io5";
import AppContext from "../AppContext";
import Logo from "../assets/logo.png";
import AddProperty from "./AddProperty";
import LoaderFull from "./LoaderFull";
import PropertyCard from "./PropertyCard";

const Rent = () => {
  const { user, properties, loading } = useContext(AppContext);
  const [modalOpen, setModalOpen] = useState(false);
  const [myProperties, setMyProperties] = useState([]);

  useEffect(() => {
    if (user?.token) {
      const list = properties.filter(
        (property) => property.sellerEmail === user.email
      );
      setMyProperties(list);
    }
  }, [properties, user]);

  if (loading) {
    return <LoaderFull />;
  }

  return user?.token ? (
    <div className="w-full">
      <div className="p-2 w-full grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-2">
        <div
          className="w-full h-[85vh] bg-primary/10 flex items-center justify-center cursor-pointer hover:bg-primary/20 rounded-xl"
          onClick={() => setModalOpen(true)}
        >
          <div className="flex flex-col items-center justify-center gap-4 hover:scale-125 duration-150 w-full h-full text-primary">
            <GoPlusCircle className="text-6xl" />
            <span>List your Property</span>
          </div>
        </div>
        {myProperties?.map((property, index) => (
          <PropertyCard key={index} property={property} />
        ))}
      </div>
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
        <div className="flex flex-col items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="text-3xl text-primary font-[700]">List your</div>
            <img src={Logo} alt="" className="size-10" />
          </div>
          <AddProperty setModalOpen={setModalOpen} />
        </div>
      </Modal>
    </div>
  ) : (
    <div className="w-full h-[80vh] flex flex-col items-center justify-center">
      <IoHome className="text-primary/50 text-9xl" />
      <span className="text-primary/50 text-4xl text-center">
        Login/Register to <br />
        List your Properties!
      </span>
    </div>
  );
};

export default Rent;
