// src/components/ProfileManager.jsx
import React, { useState } from 'react';
import { encryptImage, decryptImage } from '../services/encryption';
import { uploadProfile, updateProfile } from '../services/api';

const ProfileManager = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleImageUpload = async (e) => {
    setLoading(true);
    const file = e.target.files[0];
    const encryptedImage = await encryptImage(file);
    await uploadProfile(encryptedImage);
    setLoading(false);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h2 className="text-xl font-bold mb-4">Profile Management</h2>
      <div className="space-y-4">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
        />
        {loading && <p>Processing...</p>}
      </div>
    </div>
  );
};

export default ProfileManager;