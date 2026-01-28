import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Profile() {
  const [profile, setProfile] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    imageUrl: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  
  const myLoginUser = JSON.parse(localStorage.getItem("user"));
  const userId = myLoginUser?._id;

  useEffect(() => {
    if (userId) {
      fetchProfile();
    }
  }, [userId]);

  const fetchProfile = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/profile/${userId}`);
      if (response.data.success) {
        setProfile(response.data.user);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      setMessage('Error loading profile');
    }
  };

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      const response = await axios.put(
        `http://localhost:4000/api/users/profile/${userId}`,
        profile
      );
      
      if (response.data.success) {
        setMessage('Profile updated successfully!');
        
        const updatedUser = {
          ...myLoginUser,
          firstName: profile.firstName,
          lastName: profile.lastName,
          email: profile.email,
          phoneNumber: profile.phoneNumber,
          imageUrl: profile.imageUrl
        };
        localStorage.setItem('user', JSON.stringify(updatedUser));
        
        setTimeout(() => setMessage(''), 3000);
      }
    } catch (error) {
      setMessage(error.response?.data?.message || 'Error updating profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.formCard}>
        <h2 style={styles.header}>Update Profile</h2>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.formRow}>
            <div style={styles.formGroup}>
              <label style={styles.label}>First Name</label>
              <input
                type="text"
                name="firstName"
                value={profile.firstName}
                onChange={handleChange}
                placeholder="Enter first name"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={profile.lastName}
                onChange={handleChange}
                placeholder="Enter last name"
                style={styles.input}
                required
              />
            </div>
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Email</label>
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              placeholder="Enter email"
              style={styles.input}
              required
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Phone Number</label>
            <input
              type="tel"
              name="phoneNumber"
              value={profile.phoneNumber}
              onChange={handleChange}
              placeholder="Enter phone number"
              style={styles.input}
            />
          </div>

          <div style={styles.formGroup}>
            <label style={styles.label}>Profile Image URL</label>
            <input
              type="text"
              name="imageUrl"
              value={profile.imageUrl}
              onChange={handleChange}
              placeholder="Enter image URL (optional)"
              style={styles.input}
            />
          </div>

          {profile.imageUrl && (
            <div style={styles.imagePreview}>
              <img src={profile.imageUrl} alt="Profile" style={styles.image} />
            </div>
          )}

          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('success') ? styles.success : styles.error)
            }}>
              {message}
            </div>
          )}

          <button type="submit" style={styles.button} disabled={loading}>
            {loading ? 'Updating...' : 'Update Profile'}
          </button>
        </form>
      </div>
    </div>
  );
}

const styles = {
  container: {
    padding: '20px',
    background: '#f5f5f5',
    minHeight: '100vh'
  },
  formCard: {
    maxWidth: '700px',
    margin: '0 auto',
    padding: '40px',
    background: 'white',
    borderRadius: '10px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
  },
  header: {
    color: '#2c3e50',
    fontSize: '28px',
    marginBottom: '30px',
    paddingBottom: '20px',
    borderBottom: '2px solid #f0f0f0'
  },
  formRow: {
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    marginBottom: '20px'
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    marginBottom: '20px'
  },
  label: {
    marginBottom: '8px',
    color: '#555',
    fontWeight: '600',
    fontSize: '14px'
  },
  input: {
    padding: '12px 15px',
    border: '1px solid #ddd',
    borderRadius: '5px',
    fontSize: '14px'
  },
  imagePreview: {
    textAlign: 'center',
    margin: '20px 0',
    padding: '20px',
    background: '#f8f9fa',
    borderRadius: '8px'
  },
  image: {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    objectFit: 'cover',
    border: '4px solid #4a90e2'
  },
  message: {
    padding: '12px 15px',
    borderRadius: '5px',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '14px',
    marginBottom: '20px'
  },
  success: {
    background: '#d4edda',
    color: '#155724',
    border: '1px solid #c3e6cb'
  },
  error: {
    background: '#f8d7da',
    color: '#721c24',
    border: '1px solid #f5c6cb'
  },
  button: {
    width: '100%',
    padding: '14px',
    background: '#4a90e2',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '10px'
  }
};

export default Profile;