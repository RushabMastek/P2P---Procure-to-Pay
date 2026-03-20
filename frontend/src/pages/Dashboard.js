import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../styles/Dashboard.css';

function Dashboard() {
  const navigate = useNavigate();
  
  // State management
  const [vendorDetails, setVendorDetails] = useState(null);
  // const [pendingTasks, setPendingTasks] = useState([]);
  const [catalogItems, setCatalogItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);

  // Check authentication on component mount
  useEffect(() => {
    const token = localStorage.getItem('token');
    const email = localStorage.getItem('userEmail');

    if (!token || !email) {
      alert('Please login to access dashboard');
      navigate('/login');
      return;
    }

    // Fetch vendor details
    fetchVendorDetails(email, token);
    // Fetch pending tasks
    // fetchPendingTasks(email, token);
    // Fetch catalog items
    fetchCatalogItems(email, token);
  }, [navigate]);

  // Fetch vendor details
  const fetchVendorDetails = async (email, token) => {
    try {
      const response = await axios.get(
        `https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/vendor-details?email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setVendorDetails(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching vendor details:', error);
      if (error.response?.status === 401) {
        handleLogout();
      }
      setLoading(false);
    }
  };

  // Fetch pending tasks
  // const fetchPendingTasks = async (email, token) => {
  //   try {
  //     const response = await axios.get(
  //       `https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/pending-tasks?email=${email}`,
  //       {
  //         headers: { Authorization: `Bearer ${token}` }
  //       }
  //     );
  //     setPendingTasks(response.data.tasks || []);
  //   } catch (error) {
  //     console.error('Error fetching pending tasks:', error);
  //     setPendingTasks([]);
  //   }
  // };

  // Fetch catalog items
  const fetchCatalogItems = async (email, token) => {
    try {
      const response = await axios.get(
        `https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/catalog-items?email=${email}`,
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      setCatalogItems(response.data.items || []);
    } catch (error) {
      console.error('Error fetching catalog items:', error);
      setCatalogItems([]);
    }
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    navigate('/login');
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Loading dashboard...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-container">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="dashboard-title">P2P Vendor Portal</h1>
        </div>

        <div className="header-right">
          {/* User Profile Section */}
          <div className="user-profile-section">
            <button 
              className="profile-button"
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
            >
              <div className="profile-avatar">
                {vendorDetails?.firstName?.[0] || 'V'}
              </div>
              <div className="profile-info">
                <span className="profile-name">
                  {vendorDetails?.firstName} {vendorDetails?.lastName}
                </span>
                <span className="profile-role">Vendor</span>
              </div>
              <span className="dropdown-arrow">▼</span>
            </button>

            {/* Profile Dropdown */}
            {showProfileDropdown && (
              <div className="profile-dropdown">
                <div className="dropdown-header">
                  <p className="dropdown-email">{vendorDetails?.email}</p>
                  <p className="dropdown-company">{vendorDetails?.companyName}</p>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-section">
                  <h4>Vendor Details</h4>
                  <div className="detail-item">
                    <span className="detail-label">Company:</span>
                    <span className="detail-value">{vendorDetails?.companyName || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">City:</span>
                    <span className="detail-value">{vendorDetails?.city || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Country:</span>
                    <span className="detail-value">{vendorDetails?.country || 'N/A'}</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Postal Code:</span>
                    <span className="detail-value">{vendorDetails?.postalCode || 'N/A'}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <div className="dropdown-section">
                  <h4>Session Info</h4>
                  <div className="detail-item">
                    <span className="detail-label">Status:</span>
                    <span className="detail-value status-active">Active</span>
                  </div>
                  <div className="detail-item">
                    <span className="detail-label">Login Time:</span>
                    <span className="detail-value">{new Date().toLocaleTimeString()}</span>
                  </div>
                </div>
                <div className="dropdown-divider"></div>
                <button className="logout-button" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <h2>Welcome back, {vendorDetails?.firstName}!</h2>
          <p>Here's what's happening with your vendor account</p>
        </div>

        {/* Dashboard Grid */}
        <div className="dashboard-grid">
          {/* Pending Tasks Section */}
          {/* External Questionnaire Section */}
          <section className="dashboard-section pending-tasks-section">
            <div className="section-header">
              <h3>External Questionnaire</h3>
            </div>

            <div className="section-content">
              <div className="empty-state">
                <div className="empty-icon">📋</div>
                <p>Complete Your Questionnaire</p>
                <span>Fill out the external vendor questionnaire form</span>
                <button 
                  className="task-action-btn"
                  onClick={() => navigate('/questionnaire')}
                  style={{ marginTop: '16px', padding: '8px 16px' }}
                >
                  Go to Questionnaire
                </button>
              </div>
            </div>
          </section>

          {/* Catalog Items Section */}
          <section className="dashboard-section catalog-section">
            <div className="section-header">
              <h3>Catalog Items</h3>
              <span className="item-count">{catalogItems.length} items</span>
            </div>

            <div className="section-content">
              {catalogItems.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon">📦</div>
                  <p>No catalog items</p>
                  <span>Items will appear here once available</span>
                </div>
              ) : (
                <div className="catalog-grid">
                  {catalogItems.map((item, index) => (
                    <div key={index} className="catalog-item">
                      <div className="catalog-item-header">
                        <h4 className="catalog-item-name">{item.name}</h4>
                        <span className="catalog-item-status" data-status={item.status}>
                          {item.status}
                        </span>
                      </div>
                      <p className="catalog-item-description">{item.description}</p>
                      <div className="catalog-item-footer">
                        <span className="catalog-item-price">${item.price}</span>
                        <button className="catalog-action-btn">Details</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;