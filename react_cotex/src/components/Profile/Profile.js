import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaEdit } from 'react-icons/fa';
import './Profile.css';
import './Password.css'; // Include the password styling
import config from '../../config';
import Password from './Password'; // Adjust path as needed

const Profile = () => {
  const [profile, setProfile] = useState({
    full_name: '',
    email: '',
    phone: '',
    street: '',
    city: '',
    state: '',
    zip_code: '',
    about: '',
    username: '',
    profile_pic: '',
  });
  const [successMessage, setSuccessMessage] = useState('');
  const [editMode, setEditMode] = useState({
    username: false,
    about: false,
  });
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const fetchProfile = async () => {
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

        setProfile(response.data);
      } catch (error) {
        console.error('Failed to fetch profile:', error.message);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setProfile((prevState) => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleUpdate = async () => {
    try {
      const accessToken = sessionStorage.getItem('accessToken');
      if (!accessToken) {
        throw new Error('Access token not found.');
      }

      console.log('Updating profile with data:', profile);

      const response = await axios.put(`${config.API_URL}/auth/profile/`, profile, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });

      console.log('Profile updated:', response.data);
      setSuccessMessage('Profile updated successfully!');
      setTimeout(() => {
        setSuccessMessage('');
      }, 3000);
    } catch (error) {
      console.error('Failed to update profile:', error.response.data);
    }
  };

  const toggleEditMode = (field) => {
    setEditMode((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleChangePassword = () => {
    setShowPassword(true);
  };

  const handleClosePassword = () => {
    setShowPassword(false);
  };

  if (!profile) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container">
      {successMessage && (
        <div className="alert alert-success" role="alert">
          {successMessage}
        </div>
      )}
      <div className="row gutters">
        <div className="col-xl-3 col-lg-3 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="account-settings">
                <div className="user-profile">
                  <div className="user-avatar">
                    <img
                      src={`${config.API_URL}/${profile.profile_pic}`}
                      alt={profile.username}
                    />
                  </div>
                  <div className="d-flex align-items-center">
                    {editMode.username ? (
                      <input
                        type="text"
                        className="form-control"
                        id="username"
                        value={profile.username}
                        onChange={handleChange}
                      />
                    ) : (
                      <h5 className="user-name">{profile.username}</h5>
                    )}
                    <FaEdit
                      className="ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleEditMode('username')}
                    />
                  </div>
                  <h6 className="user-email">{profile.email}</h6>
                </div>
                <div className="about">
                  <div className="d-flex align-items-center">
                    <h5>About</h5>
                    <FaEdit
                      className="ml-2"
                      style={{ cursor: 'pointer' }}
                      onClick={() => toggleEditMode('about')}
                    />
                  </div>
                  {editMode.about ? (
                    <textarea
                      className="form-control"
                      id="about"
                      value={profile.about}
                      onChange={handleChange}
                    />
                  ) : (
                    <p>{profile.about}</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="col-xl-9 col-lg-9 col-md-12 col-sm-12 col-12">
          <div className="card h-100">
            <div className="card-body">
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mb-2 text-primary">Personal Details</h6>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="full_name">Full Name</label>
                    <input
                      type="text"
                      className="form-control"
                      id="full_name"
                      placeholder="Enter full name"
                      value={profile.full_name}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                      type="email"
                      className="form-control"
                      id="email"
                      placeholder="Enter email ID"
                      value={profile.email}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="phone">Phone</label>
                    <input
                      type="text"
                      className="form-control"
                      id="phone"
                      placeholder="Enter phone number"
                      value={profile.phone}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <h6 className="mt-3 mb-2 text-primary">Address</h6>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="street">Street</label>
                    <input
                      type="text"
                      className="form-control"
                      id="street"
                      placeholder="Enter Street"
                      value={profile.street}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                      type="text"
                      className="form-control"
                      id="city"
                      placeholder="Enter City"
                      value={profile.city}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                      type="text"
                      className="form-control"
                      id="state"
                      placeholder="Enter State"
                      value={profile.state}
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="col-xl-6 col-lg-6 col-md-6 col-sm-6 col-12">
                  <div className="form-group">
                    <label htmlFor="zip_code">Zip Code</label>
                    <input
                      type="text"
                      className="form-control"
                      id="zip_code"
                      placeholder="Zip Code"
                      value={profile.zip_code}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              <div className="row gutters">
                <div className="col-xl-12 col-lg-12 col-md-12 col-sm-12 col-12">
                  <div className="d-flex justify-content-between">
                    <button
                      type="button"
                      id="submit"
                      name="submit"
                      className="btn btn-primary btn-spacing"
                      onClick={handleUpdate}
                    >
                      Update
                    </button>
                    <button
                      type="button"
                      id="changePassword"
                      name="changePassword"
                      className="btn btn-warning"
                      onClick={handleChangePassword}
                    >
                      Change Password
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showPassword && (
        <div className="password-modal">
          <div className="password-modal-content">
            <Password onClose={handleClosePassword} />
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
