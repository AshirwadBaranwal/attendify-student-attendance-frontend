import React from "react";

const ProfileInfo = ({ name, email, collegeName }) => {
  return (
    <div className="text-center pt-20 pb-8">
      <h1 className="text-3xl font-bold text-gray-800">{name}</h1>
      <p className="text-md text-gray-500 mt-1">{email}</p>
      <p className="text-sm text-gray-500 mt-1">{collegeName}</p>
    </div>
  );
};

export default ProfileInfo;
