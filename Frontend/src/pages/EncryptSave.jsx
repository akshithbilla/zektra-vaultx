import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import axios from 'axios';
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Input,
  Textarea,
  Tabs,
  Tab,
  Badge,
  Progress,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Alert,
  Checkbox  // Add this line
} from "@heroui/react";
import DefaultLayout from '../layouts/default';
import PasswordStrengthMeter from '../components/PasswordStrengthMeter';

import { Link } from 'react-router-dom';

const storageTypes = [
  {
    id: "payment-wallet",
    label: "Payment Wallet",
    description: "Secure financial information storage",
    icon: (
      <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    color: "purple"
  },
  {
    id: "id-sync",
    label: "ID Sync",
    description: "Digital identity documents and credentials",
    icon: (
      <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
      </svg>
    ),
    color: "blue"
  },
  {
    id: "info-vault",
    label: "Info Vault",
    description: "Encrypted notes and sensitive text",
    icon: (
      <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "green"
  },
  {
    id: "identity-capsule",
    label: "Identity Capsule",
    description: "Complete digital profile information",
    icon: (
      <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
      </svg>
    ),
    color: "pink"
  },
  {
    id: "key-locker",
    label: "Key Locker",
    description: "Passwords and login credentials",
    icon: (
      <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
      </svg>
    ),
    color: "yellow"
  },
  {
    id: "docsafe",
    label: "DocSafe",
    description: "Private documents and files",
    icon: (
      <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "red"
  }
];

const EncryptPage = () => {
  const [user, setUser ] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCheckingVault, setIsCheckingVault] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  const [selectedType, setSelectedType] = useState("");
  const [encryptionProgress, setEncryptionProgress] = useState(0);
  const [isEncrypting, setIsEncrypting] = useState(false);
  const [activeTab, setActiveTab] = useState("text");
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [textContent, setTextContent] = useState("");
  const [itemName, setItemName] = useState("");
  const [tags, setTags] = useState("");
  const [uploadError, setUploadError] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isFirstUpload, setIsFirstUpload] = useState(false);
  const [decryptionPassword, setDecryptionPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordStrength, setPasswordStrength] = useState(0);
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [rememberPassword, setRememberPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [vaultCorrupted, setVaultCorrupted] = useState(false);
  const [showVaultReset, setShowVaultReset] = useState(false);

  const {isOpen, onOpen, onClose} = useDisclosure();
  const fileInputRef = useRef(null);

  const checkAuth = async () => {
    const token = localStorage.getItem("token");
    const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

    if (!token) {
      setUser (null);
      return false;
    }

    try {
      const response = await axios.get(`${BACKEND_URL}/check-auth`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (response.data?.authenticated) {
        setUser (response.data.user);
        return true;
      }
      localStorage.removeItem("token");
      setUser (null);
      return false;
    } catch (err) {
      console.error("Auth check failed:", err);
      localStorage.removeItem("token");
      setUser (null);
      return false;
    }
  };

  const validateVaultKey = (vaultKey) => {
    if (!vaultKey || typeof vaultKey !== 'object') {
      console.error("Vault key is not an object");
      return false;
    }

    const requiredKeys = ['encrypted', 'salt', 'iv', 'tag'];
    const missingKeys = requiredKeys.filter(key => !vaultKey[key] || vaultKey[key] === 'missing');
    
    if (missingKeys.length > 0) {
      console.error(`Vault key missing required components: ${missingKeys.join(', ')}`);
      return { valid: false, missingKeys };
    }
    
    // Validate component formats (basic checks)
    const validationChecks = [
      { key: 'encrypted', check: (val) => typeof val === 'string' && val.length > 0 },
      { key: 'salt', check: (val) => typeof val === 'string' && val.length > 0 },
      { key: 'iv', check: (val) => typeof val === 'string' && val.length > 0 },
      { key: 'tag', check: (val) => typeof val === 'string' && val.length > 0 }
    ];
    
    for (const validation of validationChecks) {
      if (!validation.check(vaultKey[validation.key])) {
        console.error(`Invalid ${validation.key} format`);
        return { valid: false, invalidKey: validation.key };
      }
    }
    
    return { valid: true };
  };

  const checkVaultStatus = async () => {
    try {
      setIsCheckingVault(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/vault-status`, 
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      const vaultData = response.data;
      console.log("Vault status:", vaultData);
      
      if (vaultData?.initialized && vaultData?.hasAllFields) {
        setIsFirstUpload(false);
        setVaultCorrupted(false);
      } else {
        setIsFirstUpload(true);
        if (vaultData.corrupted) {
          setVaultCorrupted(true);
          setUploadError("Vault encryption key is corrupted. Please reset your vault.");
          setShowVaultReset(true);
        }
      }
    } catch (error) {
      console.error("Vault check error:", error);
      setIsFirstUpload(false);
    } finally {
      setIsCheckingVault(false);
    }
  };

  const resetVault = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/reset-vault`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setVaultCorrupted(false);
        setShowVaultReset(false);
        setIsFirstUpload(true);
        setUploadError(null);
        setDecryptionPassword("");
        setConfirmPassword("");
        alert("Vault has been reset successfully. Please set a new password.");
      }
    } catch (error) {
      console.error("Vault reset error:", error);
      setUploadError("Failed to reset vault. Please contact support.");
    }
  };


  useEffect(() => {
    const init = async () => {
      const isAuth = await checkAuth();
      if (!isAuth) {
        navigate('/login');
        return;
      }
      await checkVaultStatus();
      setIsLoading(false);
    };
    init();
  }, [navigate, location.pathname]);

  useEffect(() => {
    setPasswordMatch(confirmPassword && decryptionPassword === confirmPassword);
  }, [decryptionPassword, confirmPassword]);

  useEffect(() => {
    if (decryptionPassword) {
      setPasswordStrength(calculatePasswordStrength(decryptionPassword));
    }
  }, [decryptionPassword]);

  const handleDragEvents = {
    onDragEnter: (e) => { e.preventDefault(); setIsDragging(true); },
    onDragLeave: (e) => { e.preventDefault(); setIsDragging(false); },
    onDragOver: (e) => e.preventDefault(),
    onDrop: (e) => {
      e.preventDefault();
      setIsDragging(false);
      if (e.dataTransfer.files.length) {
        handleFileChange({ target: { files: e.dataTransfer.files } });
      }
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (!selectedFile) return;
    
    setUploadError(null);
    
    if (selectedFile.size > 50 * 1024 * 1024) {
      setUploadError("File size exceeds 50MB limit");
      return;
    }
    
    setFile(selectedFile);
    setFileName(selectedFile.name);
    setItemName(selectedFile.name.replace(/\.[^/.]+$/, ""));
  };

  const calculatePasswordStrength = (password) => {
    let strength = Math.min(password.length * 4, 40);
    if (/[A-Z]/.test(password)) strength += 10;
    if (/[a-z]/.test(password)) strength += 10;
    if (/[0-9]/.test(password)) strength += 10;
    if (/[^A-Za-z0-9]/.test(password)) strength += 10;
    if (password.length < 8) strength -= 20;
    if (password === itemName || password === user?.email?.split('@')[0]) strength -= 30;
    return Math.min(Math.max(strength, 0), 100);
  };
  const simulateEncryptionProgress = () => {
    let progress = 0;
    const interval = setInterval(() => {
      progress = Math.min(progress + Math.floor(Math.random() * 10) + 5, 100);
      setEncryptionProgress(progress);
      if (progress >= 100) clearInterval(interval);
    }, 300);
    return interval;
  };


  const initializeVault = async (token) => {
    try {
      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/initialize-vault`,
        { decryptionPassword },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.message === "Vault initialized successfully") {
        setIsFirstUpload(false);
        setVaultCorrupted(false);
      }
    } catch (err) {
      if (err.response?.data?.message === "Vault already initialized") {
        setIsFirstUpload(false);
      } else {
        throw err;
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploadError(null);
    setSuccessMessage("");

    if (vaultCorrupted) {
      setUploadError("Vault is corrupted and must be reset before uploading new content.");
      return;
    }

    if (!selectedType) return setUploadError("Please select a storage type");
    if (activeTab === "file" && !file) return setUploadError("Please select a file");
    if (activeTab === "text" && !textContent.trim()) return setUploadError("Please enter text");
    if (!itemName.trim()) return setUploadError("Please enter an item name");

    if (isFirstUpload) {
      if (!decryptionPassword) return setUploadError("Please set a decryption password");
      if (!passwordMatch) return setUploadError("Passwords don't match");
      if (passwordStrength < 70) return setUploadError("Password too weak (minimum 70% strength required)");
    } else if (!decryptionPassword) {
      return setUploadError("Please enter your vault password");
    }

    setIsEncrypting(true);
    setEncryptionProgress(0);
    const progressInterval = simulateEncryptionProgress();
    const token = localStorage.getItem("token");

    try {
      const vaultStatus = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/vault-status`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (vaultStatus.data.initialized && vaultStatus.data.hasAllFields) {
        // Vault is valid
      } else {
        if (!vaultStatus.data.initialized) {
          await initializeVault(token);
        }
      }

      const formData = new FormData();
      if (activeTab === "file") {
        formData.append('file', file);
      } else {
        formData.append('file', new Blob([textContent], { type: 'text/plain' }), `${itemName}.txt`);
      }
      formData.append('storageType', selectedType);
      formData.append('itemName', itemName);
      formData.append('tags', tags);
      formData.append('decryptionPassword', decryptionPassword);

      const response = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/encrypt-upload`,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            'Authorization': `Bearer ${token}`
          },
          timeout: 30000
        }
      );

      if (response.data.message === "File encrypted and uploaded") {
        setSuccessMessage(`Successfully uploaded "${itemName}" to ${selectedType}`);
        onOpen(); // Show success modal
        
        // Reset form
        setFile(null);
        setFileName("");
        setTextContent("");
        setItemName("");
        setTags("");
        setDecryptionPassword("");
        setConfirmPassword("");
        setSelectedType("");
        setActiveTab("text");
        
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      } else {
        throw new Error(response.data.message || "Upload failed");
      }
      
    } catch (err) {
      console.error("Upload error:", err);
      let errorMessage = "Upload failed";
      
      if (err.response) {
        const status = err.response.status;
        const responseData = err.response.data;
        
        if (status === 400) {
          errorMessage = responseData.message || "Invalid request";
          if (responseData.message?.includes("Vault not initialized")) {
            setIsFirstUpload(true);
          } else if (responseData.message?.includes("authentication tag") || 
                     responseData.message?.includes("tag")) {
            setVaultCorrupted(true);
            setShowVaultReset(true);
            errorMessage = "Vault encryption key is corrupted. Please reset your vault.";
          }
        } else if (status === 401) {
          errorMessage = "Session expired - please login again";
          localStorage.removeItem("token");
          navigate('/login');
          return;
        } else if (status === 403) {
          errorMessage = "Access denied - invalid vault password";
        } else if (status === 413) {
          errorMessage = "File too large for upload";
        } else if (status === 500) {
          errorMessage = "Server error - please try again later";
        }
      } else if (err.code === 'ECONNABORTED') {
        errorMessage = "Upload timeout - please try again";
      } else {
        errorMessage = err.message || "Network error";
      }
      
      setUploadError(errorMessage);
    } finally {
      clearInterval(progressInterval);
      setIsEncrypting(false);
      setEncryptionProgress(0);
    }
  };

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="flex justify-center items-center min-h-screen">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-3 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
            Secure Data Encryption
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Protect your sensitive information with military-grade AES-256 encryption
          </p>
        </div>

        {isCheckingVault && (
          <div className="mb-6 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg flex items-center gap-3">
            <Spinner size="sm" />
            <span>Checking your vault status...</span>
          </div>
        )}

        {/* Vault Corrupted Alert */}
        {vaultCorrupted && showVaultReset && (
          <div className="mb-6">
            <Alert 
              color="danger" 
              variant="bordered"
              title="Vault Corrupted"
              description="Your vault's encryption key is missing the authentication tag, which is required for secure encryption. This is a critical security issue."
              endContent={
                <Button 
                  color="danger" 
                  variant="solid" 
                  size="sm"
                  onClick={resetVault}
                >
                  Reset Vault
                </Button>
              }
            />
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Storage types sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-6 hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <h2 className="text-xl font-semibold flex items-center gap-2">
                  <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                  </svg>
                  Storage Types
                </h2>
              </CardHeader>
              <CardBody className="space-y-4">
                {storageTypes.map((type) => (
                  <div 
                    key={type.id}
                    onClick={() => !vaultCorrupted && setSelectedType(type.id)}
                    className={`p-4 rounded-lg cursor-pointer transition-all duration-200 ${
                      vaultCorrupted ? 'opacity-50 cursor-not-allowed' : ''
                    } ${selectedType === type.id 
                      ? `bg-${type.color}-100 dark:bg-${type.color}-900/30 border-l-4 border-${type.color}-500` 
                      : "hover:bg-gray-100 dark:hover:bg-gray-800"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg bg-${type.color}-100 dark:bg-${type.color}-900/20`}>
                        {type.icon}
                      </div>
                      <div className="min-w-0">
                        <h3 className="font-medium truncate">{type.label}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{type.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </CardBody>
            </Card>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2">
            <Card className="hover:shadow-xl transition-shadow duration-300">
              <CardHeader className="border-b border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
                  <h2 className="text-xl font-semibold">New Secure Item</h2>
                  {selectedType && (
                    <Badge color={storageTypes.find(t => t.id === selectedType)?.color} variant="flat">
                      {storageTypes.find(t => t.id === selectedType)?.label}
                    </Badge>
                  )}
                </div>
                {selectedType && (
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                    {storageTypes.find(t => t.id === selectedType)?.description}
                  </p>
                )}
              </CardHeader>

              <CardBody>
                {selectedType && !vaultCorrupted ? (
                  <form onSubmit={handleSubmit} id="encrypt-form" className="space-y-6">
                    {isFirstUpload && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                          </svg>
                          First-Time Vault Setup
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Set a master password to secure your vault
                        </p>
                        
                        <div className="mt-4 space-y-4">
                          <div>
                            <Input
                              type={showPassword ? "text" : "password"}
                              label="Decryption Password"
                              placeholder="Create a strong password"
                             value={decryptionPassword}

                                                              onChange={(e) => {
                                setDecryptionPassword(e.target.value);
                                setPasswordStrength(calculatePasswordStrength(e.target.value));
                              }}
                              required
                              description="Minimum 8 characters with mixed case, numbers, and symbols"
                              endContent={
                                <button
                                  type="button"
                                  onClick={() => setShowPassword(!showPassword)}
                                  className="focus:outline-none"
                                >
                                  {showPassword ? (
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                    </svg>
                                  ) : (
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                    </svg>
                                  )}
                                </button>
                              }
                            />
                            <PasswordStrengthMeter strength={passwordStrength} />
                          </div>
                          
                          <Input
                            type={showPassword ? "text" : "password"}
                            label="Confirm Password"
                            placeholder="Re-enter your password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            isInvalid={!passwordMatch}
                            errorMessage={!passwordMatch ? "Passwords don't match" : ""}
                          />
                           
                      
                       
                          <Checkbox
                            isSelected={rememberPassword}
                            onChange={setRememberPassword}
                            className="mt-2"
                          >
                            Remember password for this session
                          </Checkbox>
                        </div>
                      </div>
                    )}

                    {!isFirstUpload && (
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                        <h3 className="font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                          </svg>
                          Vault Authentication
                        </h3>
                        <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                          Enter your vault password to encrypt this item
                        </p>
                        
                        <div className="mt-4">
                          <Input
                            type={showPassword ? "text" : "password"}
                            label="Vault Password"
                            placeholder="Enter your vault password"
                            value={decryptionPassword}
                            onChange={(e) => setDecryptionPassword(e.target.value)}
                            required
                            endContent={
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="focus:outline-none"
                              >
                                {showPassword ? (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                                  </svg>
                                ) : (
                                  <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                  </svg>
                                )}
                              </button>
                            }
                          />
                           <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                     <Link to ="/myvault">Forgot decrypt password?</Link>
                        </p>
                          <Checkbox
                            isSelected={rememberPassword}
                            onChange={setRememberPassword}
                            className="mt-2"
                          >
                            Remember password for this session
                          </Checkbox>
                        </div>
                      </div>
                    )}

                    <Input
                      label="Item Name"
                      placeholder="Descriptive name for your item"
                      value={itemName}
                      onChange={(e) => setItemName(e.target.value)}
                      required
                      description="This will be visible in your vault listing"
                    />

                    <Tabs 
                      selectedKey={activeTab}
                      onSelectionChange={(key) => setActiveTab(key)}
                      aria-label="Content type tabs"
                      color="primary"
                    >
                      <Tab key="text" title="Text Content">
                        <Textarea
                          label="Secure Text"
                          placeholder="Enter sensitive text to encrypt"
                          value={textContent}
                          onChange={(e) => setTextContent(e.target.value)}
                          minRows={8}
                          className="mt-4"
                        />
                      </Tab>
                      <Tab key="file" title="File Upload">
                        <div 
                          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors duration-200 mt-4 ${
                            isDragging 
                              ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/10' 
                              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400'
                          }`}
                          {...handleDragEvents}
                        >
                          {file ? (
                            <div className="space-y-3">
                              <div className="flex items-center justify-center gap-2">
                                <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <span className="font-medium">{fileName}</span>
                              </div>
                              <Button 
                                color="danger" 
                                variant="light" 
                                size="sm"
                                onClick={() => {
                                  setFile(null);
                                  setFileName("");
                                  if (fileInputRef.current) {
                                    fileInputRef.current.value = '';
                                  }
                                }}
                              >
                                Remove File
                              </Button>
                            </div>
                          ) : (
                            <>
                              <svg className="w-12 h-12 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                              </svg>
                              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                Drag and drop files here, or click to browse
                              </p>
                              <Button 
                                color="primary" 
                                variant="flat" 
                                className="mt-3"
                                onClick={() => fileInputRef.current?.click()}
                              >
                                Select File
                              </Button>
                              <p className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                                Maximum file size: 50MB
                              </p>
                              <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleFileChange}
                                className="hidden"
                              />
                            </>
                          )}
                        </div>
                      </Tab>
                    </Tabs>

                    <Input
                      label="Tags (optional)"
                      placeholder="comma-separated tags"
                      value={tags}
                      onChange={(e) => setTags(e.target.value)}
                      description="Helpful for organizing and searching your vault"
                    />

                    {isEncrypting && (
                      <div className="space-y-2">
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Encrypting...</span>
                          <span className="text-sm text-gray-500">{encryptionProgress}%</span>
                        </div>
                        <Progress
                          aria-label="Encryption progress"
                          value={encryptionProgress}
                          color="primary"
                          className="w-full"
                        />
                      </div>
                    )}

                    {uploadError && (
                      <Alert 
                        color="danger" 
                        variant="bordered"
                        className="mb-4"
                      >
                        {uploadError}
                      </Alert>
                    )}

                    <div className="flex justify-end gap-3 pt-4">
                      <Button 
                        color="default" 
                        variant="light"
                        onClick={() => {
                          setSelectedType("");
                          setFile(null);
                          setFileName("");
                          setTextContent("");
                          setItemName("");
                          setTags("");
                          setActiveTab("text");
                          if (fileInputRef.current) {
                            fileInputRef.current.value = '';
                          }
                        }}
                      >
                        Clear
                      </Button>
                      <Button 
                        color="primary" 
                        type="submit"
                        isLoading={isEncrypting}
                        disabled={isEncrypting || vaultCorrupted}
                      >
                        {isEncrypting ? "Encrypting..." : "Secure & Upload"}
                      </Button>
                    </div>
                  </form>
                ) : (
                  <div className="text-center py-10">
                    <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                    <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
                      {vaultCorrupted ? "Vault is Corrupted" : "Select a Storage Type"}
                    
                                        </h3>
                    <p className="mt-2 text-gray-500 dark:text-gray-400">
                      {vaultCorrupted 
                        ? "Your vault encryption key is corrupted. Please reset your vault to continue."
                        : "Choose where you'd like to store your encrypted content from the options on the left."}
                    </p>
                    {vaultCorrupted && (
                      <Button 
                        color="danger" 
                        className="mt-4"
                        onClick={resetVault}
                      >
                        Reset Vault
                      </Button>
                    )}
                  </div>
                )}
              </CardBody>
            </Card>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <Modal isOpen={isOpen} onClose={onClose} backdrop="blur">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <div className="flex items-center gap-2">
                  <svg className="w-6 h-6 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                  </svg>
                  Upload Successful
                </div>
              </ModalHeader>
              <ModalBody>
                <p>{successMessage}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  Your content has been encrypted and stored securely.
                </p>
              </ModalBody>
              <ModalFooter>
               <Link to="/myvault">
  <Button color="primary" onClick={onClose}>
    View in Myvault
  </Button>
</Link>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
};

export default EncryptPage;
