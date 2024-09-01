import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './Password.css'; // Ensure this CSS is included for styling
import config from '../../config';

const Password = ({ onClose }) => {
  const [profilePic, setProfilePic] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  useEffect(() => {
    const fetchProfilePic = async () => {
      try {
        const accessToken = sessionStorage.getItem('accessToken');
        if (!accessToken) {
          throw new Error('Access token not found.');
        }

        const response = await axios.get(`${config.API_URL}/auth/profile/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        setProfilePic(response.data.profile_pic);
      } catch (error) {
        console.error('Failed to fetch profile picture:', error.message);
      }
    };

    fetchProfilePic();
  }, []);

  const handlePasswordChange = async () => {
    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match.');
      return;
    }

    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found.');
      }

      await axios.put(`${config.API_URL}/auth/change-password/`, {
        current_password: currentPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
      }, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      setSuccessMessage('Password changed successfully!');
      setError('');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        setSuccessMessage('');
        onClose(); // Close the password modal
      }, 3000);
    } catch (error) {
      setError('Failed to change password. Please try again.');
      console.error('Failed to change password:', error.response.data);
    }
  };

  return (
    
      <div className="password-container">
        <button className="btn-close" onClick={onClose}>×</button>
        <div className="profile-section">
          <img
            alt="Profile"
            className="profile-img"
            src={`${config.API_URL}/${profilePic}`}
          />
          <h3 className="modal-title">Change Password</h3>
        </div>
        <div className="message-section">
          {error && <div className="alert alert-danger">{error}</div>}
          {successMessage && <div className="alert alert-success">{successMessage}</div>}
        </div>
        <div className="form-group">
          <label htmlFor="currentPassword">Current Password</label>
          <input
            id="currentPassword"
            type="password"
            className="form-control"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            className="form-control"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label htmlFor="confirmPassword">Confirm New Password</label>
          <input
            id="confirmPassword"
            type="password"
            className="form-control"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>
        <div className="button-group">
          <button className="btn btn-success" type="button" onClick={handlePasswordChange}>
            Save
          </button>
        </div>
      </div>
   
  );
};

export default Password;
