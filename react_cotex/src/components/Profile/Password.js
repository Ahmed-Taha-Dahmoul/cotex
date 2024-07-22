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
    <div className="password-modal-content">
      <div className="container bootstrap snippets bootdey">
        <div className="row">
          <div className="col-xs-12 col-sm-12 col-md-8 col-md-offset-2">
            <div className="panel panel-info">
              <div className="panel-heading d-flex align-items-center justify-content-between">
                <button
                  className="btn btn-danger btn-sm close-btn"
                  onClick={onClose}
                >
                  Close
                </button>
                <h3 className="panel-title mb-0">
                  <span className="glyphicon glyphicon-th"></span>
                  Change Password
                </h3>
                <div></div> {/* Empty div for alignment */}
              </div>
              <div className="panel-body">
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6 separator social-login-box">
                    <img
                      alt="Profile"
                      className="img-thumbnail profile-img"
                      src={`${config.API_URL}/${profilePic}`}
                    />
                  </div>
                  <div className="col-xs-6 col-sm-6 col-md-6 login-box">
                    {error && <div className="alert alert-danger">{error}</div>}
                    {successMessage && <div className="alert alert-success">{successMessage}</div>}
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-addon">
                          <span className="glyphicon glyphicon-lock"></span>
                        </div>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Current Password"
                          value={currentPassword}
                          onChange={(e) => setCurrentPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-addon">
                          <span className="glyphicon glyphicon-log-in"></span>
                        </div>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="New Password"
                          value={newPassword}
                          onChange={(e) => setNewPassword(e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="form-group">
                      <div className="input-group">
                        <div className="input-group-addon">
                          <span className="glyphicon glyphicon-log-in"></span>
                        </div>
                        <input
                          className="form-control"
                          type="password"
                          placeholder="Confirm New Password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="panel-footer">
                <div className="row">
                  <div className="col-xs-6 col-sm-6 col-md-6"></div>
                  <div className="col-xs-6 col-sm-6 col-md-6 text-right">
                    <button className="btn icon-btn-save btn-success" type="button" onClick={handlePasswordChange}>
                      <span className="btn-save-label">
                        <i className="glyphicon glyphicon-floppy-disk"></i>
                      </span>
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Password;
