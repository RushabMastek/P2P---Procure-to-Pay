import React, { useState, useEffect } from 'react';
import '../styles/VendorCreation.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
// import { useLocation } from "react-router-dom";

const VendorCreation = () => {

  const navigate = useNavigate();

  useEffect(() => {
    // Check if user completed OTP verification
    const otpVerified = localStorage.getItem("otpVerified");
    const verifiedEmail = localStorage.getItem("verifiedEmail");
    const email = localStorage.getItem("email");
    
    if (!otpVerified || !verifiedEmail || verifiedEmail !== email) {
      alert("Please complete OTP verification first");
      navigate("/verify");
      return;
    }
  }, [navigate]);
  // const location = useLocation();
  // const email = location.state?.email;

  // if (!email) {
  //   console.error("Email not received from navigation");
  //   return;
  // }
  // State for form fields
  const [formData, setFormData] = useState({
    // Company Information
    dunsNumber: '',
    companyLegalName: '',
    
    // Supplier Main Address
    street: '',
    houseNumber: '',
    street2: '',
    street3: '',
    postalCode: '',
    city: '',
    country: '',
    
    // Administrator Account Information
    firstName: '',
    lastName: '',
    primaryEmail: '',
    username: '',
    useEmailAsUsername: false,
    password: '',
    repeatPassword: '',
    disclaimerAgreed: false,
    declarationAgreed: false,
  });

  const [errors, setErrors] = useState({});
  const [cities, setCities] = useState([]);
  const [countries, setCountries] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});
  const [submitAttempted, setSubmitAttempted] = useState(false);

  // Mock data - in production, these would come from API/master forms
  useEffect(() => {
    
  setCities(['Andheri', 'Makarba']);
  setCountries(['India']);

  const fetchVendorData = async () => {
    try {
      
      const email = localStorage.getItem("email");

      if (!email) {
        console.error("Email missing");
        return;
      }

      const res = await axios.get(
        `https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/vendor-details?email=${email}`
      );

      const data = res.data;

      setFormData(prev => ({
        ...prev,
        companyLegalName: data.companyName || '',
        street: data.street || '',
        houseNumber: data.houseNumber || '',
        street2: data.street2 || '',
        street3: data.street3 || '',
        postalCode: data.postalCode || '',
        city: data.city || '',
        country: data.country || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        primaryEmail: data.email || '',
      }));

      // 🔥 IMPORTANT: store sys_id
      localStorage.setItem("sys_id", data.sys_id);

    } catch (err) {
      console.error("Error fetching vendor data:", err);
    }
  };

  fetchVendorData();

}, []);

  // Validation functions
  const validatePostalCode = (value) => {
    return /^\d{6}$/.test(value);
  };

  const validatePassword = (password) => {
    // Password policy: min 8 chars, at least one uppercase, one lowercase, one number, one special char
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const validateUsername = (username) => {
    // Username validation: alphanumeric and underscore, 3-20 characters
    const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
    return usernameRegex.test(username);
  };

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  // Validation on field change
  const validateField = (fieldName, value) => {
    const newErrors = { ...errors };

    switch (fieldName) {
      case 'companyLegalName':
        if (!value.trim()) {
          newErrors.companyLegalName = 'Company Legal Name is mandatory';
        } else {
          delete newErrors.companyLegalName;
        }
        break;

      case 'street':
        if (!value.trim()) {
          newErrors.street = 'Street is mandatory';
        } else {
          delete newErrors.street;
        }
        break;

      case 'houseNumber':
        if (!value.trim()) {
          newErrors.houseNumber = 'House Number is mandatory';
        } else {
          delete newErrors.houseNumber;
        }
        break;

      case 'street2':
        if (!value.trim()) {
          newErrors.street2 = 'Street 2 is mandatory';
        } else {
          delete newErrors.street2;
        }
        break;

      case 'street3':
        if (!value.trim()) {
          newErrors.street3 = 'Street 3 is mandatory';
        } else {
          delete newErrors.street3;
        }
        break;

      case 'postalCode':
        if (!value.trim()) {
          newErrors.postalCode = 'Postal Code is mandatory';
        } else if (!validatePostalCode(value)) {
          newErrors.postalCode = 'Postal Code must be exactly 6 digits';
        } else {
          delete newErrors.postalCode;
        }
        break;

      case 'city':
        if (!value) {
          newErrors.city = 'City is mandatory';
        } else {
          delete newErrors.city;
        }
        break;

      case 'country':
        if (!value) {
          newErrors.country = 'Country/Region is mandatory';
        } else {
          delete newErrors.country;
        }
        break;

      case 'firstName':
        if (!value.trim()) {
          newErrors.firstName = 'First Name is mandatory';
        } else {
          delete newErrors.firstName;
        }
        break;

      case 'lastName':
        if (!value.trim()) {
          newErrors.lastName = 'Last Name is mandatory';
        } else {
          delete newErrors.lastName;
        }
        break;

      case 'username':
        if (!formData.useEmailAsUsername) {
          if (!value.trim()) {
            newErrors.username = 'Username is mandatory (or use email as username)';
          } else if (!validateUsername(value)) {
            newErrors.username = 'Username must be 3-20 alphanumeric characters (underscore allowed)';
          } else {
            delete newErrors.username;
          }
        } else {
          delete newErrors.username;
        }
        break;

      case 'password':
        if (!value) {
          newErrors.password = 'Password is mandatory';
        } else if (!validatePassword(value)) {
          newErrors.password = 'Password must be at least 8 characters with uppercase, lowercase, number, and special character';
        } else {
          delete newErrors.password;
        }
        if (formData.repeatPassword && value !== formData.repeatPassword) {
          newErrors.repeatPassword = 'Passwords do not match';
        } else if (formData.repeatPassword && value === formData.repeatPassword) {
          delete newErrors.repeatPassword;
        }
        break;

      case 'repeatPassword':
        if (!value) {
          newErrors.repeatPassword = 'Repeat Password is mandatory';
        } else if (value !== formData.password) {
          newErrors.repeatPassword = 'Passwords do not match';
        } else {
          delete newErrors.repeatPassword;
        }
        break;

      case 'disclaimerAgreed':
        if (!value) {
          newErrors.disclaimerAgreed = 'You must agree to the disclaimer';
        } else {
          delete newErrors.disclaimerAgreed;
        }
        break;

      case 'declarationAgreed':
        if (!value) {
          newErrors.declarationAgreed = 'You must agree to the declaration';
        } else {
          delete newErrors.declarationAgreed;
        }
        break;

      default:
        break;
    }

    setErrors(newErrors);
  };

  // Handle input change
  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === 'checkbox' ? checked : value;

    setFormData(prev => ({
      ...prev,
      [name]: fieldValue,
    }));

    validateField(name, fieldValue);
  };

  // Handle use email as username toggle
  const handleUseEmailAsUsername = (e) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      useEmailAsUsername: checked,
      username: checked ? prev.primaryEmail : '',
    }));

    if (checked) {
      setErrors(prev => ({
        ...prev,
        username: undefined,
      }));
    }
  };

  // Handle file uploads
  const handleFileUpload = (e, fieldName) => {
    const file = e.target.files[0];
    
    if (file) {
      // Validate file size (max 10MB)
      const maxSize = 10 * 1024 * 1024;
      if (file.size > maxSize) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'File size must not exceed 10MB',
        }));
        return;
      }

      // Validate file type (PDF, DOC, DOCX, XLS, XLSX)
      const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];
      if (!allowedTypes.includes(file.type)) {
        setErrors(prev => ({
          ...prev,
          [fieldName]: 'Only PDF, DOC, DOCX, XLS, and XLSX files are allowed',
        }));
        return;
      }

      setFormData(prev => ({
        ...prev,
        [fieldName]: file,
      }));

      // Clear error for this field
      setErrors(prev => ({
        ...prev,
        [fieldName]: undefined,
      }));

      // Simulate upload progress
      setUploadProgress(prev => ({
        ...prev,
        [fieldName]: 0,
      }));

      // Simulate upload
      const interval = setInterval(() => {
        setUploadProgress(prev => {
          const newProgress = (prev[fieldName] || 0) + Math.random() * 30;
          if (newProgress >= 100) {
            clearInterval(interval);
            return { ...prev, [fieldName]: 100 };
          }
          return { ...prev, [fieldName]: newProgress };
        });
      }, 200);
    }
  };

  // Validate all fields before submission
  const validateForm = () => {
    const newErrors = {};

    // Validate company information
    if (!formData.companyLegalName.trim()) {
      newErrors.companyLegalName = 'Company Legal Name is mandatory';
    }

    // Validate address
    if (!formData.street.trim()) newErrors.street = 'Street is mandatory';
    if (!formData.houseNumber.trim()) newErrors.houseNumber = 'House Number is mandatory';
    if (!formData.street2.trim()) newErrors.street2 = 'Street 2 is mandatory';
    if (!formData.street3.trim()) newErrors.street3 = 'Street 3 is mandatory';

    if (!formData.postalCode.trim()) {
      newErrors.postalCode = 'Postal Code is mandatory';
    } else if (!validatePostalCode(formData.postalCode)) {
      newErrors.postalCode = 'Postal Code must be exactly 6 digits';
    }

    if (!formData.city) newErrors.city = 'City is mandatory';
    if (!formData.country) newErrors.country = 'Country/Region is mandatory';

    // Validate account information
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is mandatory';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is mandatory';

    if (!formData.useEmailAsUsername) {
      if (!formData.username.trim()) {
        newErrors.username = 'Username is mandatory (or use email as username)';
      } else if (!validateUsername(formData.username)) {
        newErrors.username = 'Username must be 3-20 alphanumeric characters';
      }
    }

    if (!formData.password) {
      newErrors.password = 'Password is mandatory';
    } else if (!validatePassword(formData.password)) {
      newErrors.password = 'Password must meet the policy requirements';
    }

    if (!formData.repeatPassword) {
      newErrors.repeatPassword = 'Repeat Password is mandatory';
    } else if (formData.password !== formData.repeatPassword) {
      newErrors.repeatPassword = 'Passwords do not match';
    }

    if (!formData.disclaimerAgreed) {
      newErrors.disclaimerAgreed = 'You must agree to the disclaimer';
    }

    if (!formData.declarationAgreed) {
      newErrors.declarationAgreed = 'You must agree to the declaration';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitAttempted(true);

    if (!validateForm()) return;

    try {
      const sys_id = localStorage.getItem("sys_id");

      const payload = {
        name: formData.firstName + " " + formData.lastName,
        email: formData.primaryEmail,
        password: formData.password,
        sys_id: sys_id,

        // 🔥 ServiceNow fields
        dunsNumber: formData.dunsNumber,
        companyName: formData.companyLegalName,
        street: formData.street,
        houseNumber: formData.houseNumber,
        street2: formData.street2,
        street3: formData.street3,
        postalCode: formData.postalCode,
        city: formData.city,
        country: formData.country,
        firstName: formData.firstName,
        lastName: formData.lastName,
        username: formData.useEmailAsUsername ? formData.primaryEmail : formData.username,
        useEmailAsUsername: formData.useEmailAsUsername,
        disclaimerAgreed: formData.disclaimerAgreed,
        declarationAgreed: formData.declarationAgreed,
      };

      await axios.post(
        "https://p2p-test-api-bdathcbzgghkhmes.centralindia-01.azurewebsites.net/api/vendor/register",
        payload
      );

      alert("Vendor Registered Successfully");

      localStorage.removeItem("otpVerified");
      localStorage.removeItem("verifiedEmail");
      localStorage.removeItem("email");
      localStorage.removeItem("sys_id");

      // Show success message and redirect
      setTimeout(() => {
        navigate("/login", { 
          state: { 
            email: formData.primaryEmail,
            message: "Registration successful! Please login to continue." 
          } 
        });
      }, 2000); // 2 second delay to show success message

    } catch (err) {
      console.error("Submit Error:", err.response?.data || err.message);
      alert("Registration Failed");
    }
  };
  // Check if submit button should be disabled
  const isSubmitDisabled = !formData.disclaimerAgreed || !formData.declarationAgreed;

  return (
    <div className="vendor-creation-container">
      <div className="vendor-creation-header">
        <h1>Vendor Account Creation Form</h1>
        <p>Please fill in all the required information to create a new vendor account</p>
      </div>

      <form onSubmit={handleSubmit} className="vendor-form">
        {/* Company Information Section */}
        <section className="form-section">
          <h2 className="section-title">Company Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="dunsNumber">
                DUNS Number
                <span className="optional">(Optional)</span>
              </label>
              <input
                type="text"
                id="dunsNumber"
                name="dunsNumber"
                value={formData.dunsNumber}
                onChange={handleInputChange}
                placeholder="Enter DUNS Number"
              />
            </div>

            <div className="form-group">
              <label htmlFor="companyLegalName">
                Company Legal Name
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="companyLegalName"
                name="companyLegalName"
                value={formData.companyLegalName}
                onChange={handleInputChange}
                placeholder="Enter Company Legal Name"
                className={errors.companyLegalName ? 'error' : ''}
              />
              {errors.companyLegalName && (
                <span className="error-message">{errors.companyLegalName}</span>
              )}
            </div>
          </div>
        </section>

        {/* Supplier Main Address Section */}
        <section className="form-section">
          <h2 className="section-title">Supplier Main Address</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street">
                Street
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="street"
                name="street"
                value={formData.street}
                onChange={handleInputChange}
                placeholder="Enter Street"
                className={errors.street ? 'error' : ''}
              />
              {errors.street && <span className="error-message">{errors.street}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="houseNumber">
                House Number
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="houseNumber"
                name="houseNumber"
                value={formData.houseNumber}
                onChange={handleInputChange}
                placeholder="Enter House Number"
                className={errors.houseNumber ? 'error' : ''}
              />
              {errors.houseNumber && (
                <span className="error-message">{errors.houseNumber}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="street2">
                Street 2
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="street2"
                name="street2"
                value={formData.street2}
                onChange={handleInputChange}
                placeholder="Enter Street 2"
                className={errors.street2 ? 'error' : ''}
              />
              {errors.street2 && <span className="error-message">{errors.street2}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="street3">
                Street 3
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="street3"
                name="street3"
                value={formData.street3}
                onChange={handleInputChange}
                placeholder="Enter Street 3"
                className={errors.street3 ? 'error' : ''}
              />
              {errors.street3 && <span className="error-message">{errors.street3}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="postalCode">
                Postal Code
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="postalCode"
                name="postalCode"
                value={formData.postalCode}
                onChange={handleInputChange}
                placeholder="Enter 6-digit Postal Code"
                maxLength="6"
                className={errors.postalCode ? 'error' : ''}
              />
              {errors.postalCode && (
                <span className="error-message">{errors.postalCode}</span>
              )}
              <small className="hint">Must be exactly 6 digits</small>
            </div>

            <div className="form-group">
              <label htmlFor="city">
                City
                <span className="mandatory">*</span>
              </label>
              <select
                id="city"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className={errors.city ? 'error' : ''}
              >
                <option value="">Select City</option>
                {cities.map(cityOption => (
                  <option key={cityOption} value={cityOption}>
                    {cityOption}
                  </option>
                ))}
              </select>
              {errors.city && <span className="error-message">{errors.city}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="country">
                Country/Region
                <span className="mandatory">*</span>
              </label>
              <select
                id="country"
                name="country"
                value={formData.country}
                onChange={handleInputChange}
                className={errors.country ? 'error' : ''}
              >
                <option value="">Select Country/Region</option>
                {countries.map(countryOption => (
                  <option key={countryOption} value={countryOption}>
                    {countryOption}
                  </option>
                ))}
              </select>
              {errors.country && <span className="error-message">{errors.country}</span>}
            </div>
          </div>
        </section>

        {/* Administrator Account Information Section */}
        <section className="form-section">
          <h2 className="section-title">Administrator Account Information</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">
                First Name
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                placeholder="Enter First Name"
                className={errors.firstName ? 'error' : ''}
              />
              {errors.firstName && (
                <span className="error-message">{errors.firstName}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="lastName">
                Last Name
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                placeholder="Enter Last Name"
                className={errors.lastName ? 'error' : ''}
              />
              {errors.lastName && (
                <span className="error-message">{errors.lastName}</span>
              )}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="primaryEmail">
                Primary Email
                <span className="mandatory">*</span>
              </label>
              <input
                type="email"
                id="primaryEmail"
                name="primaryEmail"
                value={formData.primaryEmail}
                readOnly
                placeholder="Email (Auto-populated)"
                className="read-only"
              />
              <small className="hint">Auto-populated from vendor request form</small>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="username">
                Username
                <span className="mandatory">*</span>
              </label>
              <input
                type="text"
                id="username"
                name="username"
                value={formData.useEmailAsUsername ? formData.primaryEmail : formData.username}
                onChange={handleInputChange}
                disabled={formData.useEmailAsUsername}
                placeholder="Enter Username"
                className={`${errors.username ? 'error' : ''} ${formData.useEmailAsUsername ? 'disabled' : ''}`}
              />
              {errors.username && (
                <span className="error-message">{errors.username}</span>
              )}
              <small className="hint">3-20 alphanumeric characters (underscore allowed)</small>
            </div>

            <div className="form-group checkbox-group">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="useEmailAsUsername"
                  checked={formData.useEmailAsUsername}
                  onChange={handleUseEmailAsUsername}
                />
                <span>Use email as my username</span>
              </label>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                Password
                <span className="mandatory">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                placeholder="Enter Password"
                className={errors.password ? 'error' : ''}
              />
              {errors.password && (
                <span className="error-message">{errors.password}</span>
              )}
              <small className="hint">
                Min 8 chars, with uppercase, lowercase, number, and special character
              </small>
            </div>

            <div className="form-group">
              <label htmlFor="repeatPassword">
                Repeat Password
                <span className="mandatory">*</span>
              </label>
              <input
                type="password"
                id="repeatPassword"
                name="repeatPassword"
                value={formData.repeatPassword}
                onChange={handleInputChange}
                placeholder="Repeat Password"
                className={errors.repeatPassword ? 'error' : ''}
              />
              {errors.repeatPassword && (
                <span className="error-message">{errors.repeatPassword}</span>
              )}
            </div>
          </div>
        </section>

        {/* Agreement Section */}
        <section className="form-section">
          <h2 className="section-title">Agreements</h2>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="disclaimerAgreed"
                checked={formData.disclaimerAgreed}
                onChange={handleInputChange}
              />
              <span>
                I agree to the Disclaimer
                <span className="mandatory">*</span>
              </span>
            </label>
            {errors.disclaimerAgreed && (
              <span className="error-message">{errors.disclaimerAgreed}</span>
            )}
          </div>

          <div className="form-group checkbox-group">
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="declarationAgreed"
                checked={formData.declarationAgreed}
                onChange={handleInputChange}
              />
              <span>
                I agree to the Declaration
                <span className="mandatory">*</span>
              </span>
            </label>
            {errors.declarationAgreed && (
              <span className="error-message">{errors.declarationAgreed}</span>
            )}
          </div>
        </section>

        {/* Questionnaires Section */}
        {/* <section className="form-section">
          <h2 className="section-title">Registration Questionnaires</h2>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="externalQuestionnaire">
                Supplier External Registration Questionnaires Form Template
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="externalQuestionnaire"
                  name="externalQuestionnaireFile"
                  onChange={(e) => handleFileUpload(e, 'externalQuestionnaireFile')}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="file-input"
                />
                <label htmlFor="externalQuestionnaire" className="file-upload-label">
                  <span className="upload-icon">📎</span>
                  <span className="upload-text">
                    {formData.externalQuestionnaireFile
                      ? formData.externalQuestionnaireFile.name
                      : 'Click to upload or drag and drop'}
                  </span>
                  <span className="upload-hint">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</span>
                </label>
                {uploadProgress.externalQuestionnaireFile !== undefined && uploadProgress.externalQuestionnaireFile < 100 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress.externalQuestionnaireFile}%` }}></div>
                  </div>
                )}
                {formData.externalQuestionnaireFile && uploadProgress.externalQuestionnaireFile === 100 && (
                  <div className="upload-success">✓ File uploaded successfully</div>
                )}
              </div>
              {errors.externalQuestionnaireFile && (
                <span className="error-message">{errors.externalQuestionnaireFile}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="internalQuestionnaire">
                Supplier Internal Registration Questionnaires Form Template
              </label>
              <div className="file-upload-wrapper">
                <input
                  type="file"
                  id="internalQuestionnaire"
                  name="internalQuestionnaireFile"
                  onChange={(e) => handleFileUpload(e, 'internalQuestionnaireFile')}
                  accept=".pdf,.doc,.docx,.xls,.xlsx"
                  className="file-input"
                />
                <label htmlFor="internalQuestionnaire" className="file-upload-label">
                  <span className="upload-icon">📎</span>
                  <span className="upload-text">
                    {formData.internalQuestionnaireFile
                      ? formData.internalQuestionnaireFile.name
                      : 'Click to upload or drag and drop'}
                  </span>
                  <span className="upload-hint">PDF, DOC, DOCX, XLS, XLSX (Max 10MB)</span>
                </label>
                {uploadProgress.internalQuestionnaireFile !== undefined && uploadProgress.internalQuestionnaireFile < 100 && (
                  <div className="progress-bar">
                    <div className="progress-fill" style={{ width: `${uploadProgress.internalQuestionnaireFile}%` }}></div>
                  </div>
                )}
                {formData.internalQuestionnaireFile && uploadProgress.internalQuestionnaireFile === 100 && (
                  <div className="upload-success">✓ File uploaded successfully</div>
                )}
              </div>
              {errors.internalQuestionnaireFile && (
                <span className="error-message">{errors.internalQuestionnaireFile}</span>
              )}
            </div>
          </div>
        </section> */}

        {/* Form Actions */}
        <div className="form-actions">
          <button
            type="submit"
            className="btn-submit"
            disabled={isSubmitDisabled}
          >
            Create Vendor
          </button>
          <button type="reset" className="btn-reset">
            Clear Form
          </button>
        </div>

        {isSubmitDisabled && (
          <div className="submit-hint">
            Please agree to both Disclaimer and Declaration to submit the form.
          </div>
        )}
      </form>
    </div>
  );
};

export default VendorCreation;
