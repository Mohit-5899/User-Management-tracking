// src/components/EncryptedImageUpload.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { encryption } from '../services/encryption';
import { supabase } from '../lib/supabase';

function EncryptedImageUpload() {
  const { user } = useAuth();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleImageUpload = async (event) => {
    try {
      setUploading(true);
      setError('');
      setSuccess(false);

      const file = event.target.files[0];
      if (!file) return;

      // Read file as base64
      const reader = new FileReader();
      reader.readAsDataURL(file);

      reader.onload = async () => {
        try {
          // Generate encryption key
          const key = await encryption.generateKey();
          const exportedKey = await encryption.exportKey(key);

          // Encrypt image data
          const { encrypted, iv, authTag } = await encryption.encryptImage(
            reader.result,
            key
          );

          // Store encrypted data
          const { error: uploadError } = await supabase
            .from('user_mgmt_ib27f_profiles')
            .upsert({
              user_email: user.email,
              encrypted_image: encrypted,
              encryption_iv: iv,
              auth_tag: authTag,
              updated_at: new Date().toISOString(),
            });

          if (uploadError) throw uploadError;

          setSuccess(true);
        } catch (error) {
          console.error('Error processing image:', error);
          setError('Failed to process image. Please try again.');
        }
      };

      reader.onerror = () => {
        setError('Failed to read image file. Please try again.');
      };
    } catch (error) {
      console.error('Error uploading image:', error);
      setError('Failed to upload image. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold mb-4">Profile Image</h2>
      <div className="space-y-4">
        <label className="block">
          <span className="sr-only">Choose profile photo</span>
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            disabled={uploading}
            className="block w-full text-sm text-gray-500
              file:mr-4 file:py-2 file:px-4
              file:rounded-full file:border-0
              file:text-sm file:font-semibold
              file:bg-blue-50 file:text-blue-700
              hover:file:bg-blue-100"
          />
        </label>

        {uploading && (
          <div className="flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        )}

        {error && (
          <div className="text-red-500 text-sm">{error}</div>
        )}

        {success && (
          <div className="text-green-500 text-sm">
            Image uploaded and encrypted successfully!
          </div>
        )}

        <p className="text-xs text-gray-500">
          Your image will be encrypted before storage for enhanced privacy.
        </p>
      </div>
    </div>
  );
}

export default EncryptedImageUpload;