import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Button,
  Chip,
  Avatar,
  Input,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
  Spinner,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure
} from "@heroui/react";
import { title, subtitle } from "@/components/primitives";
import DefaultLayout from "@/layouts/default";
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import ModalBodyWithReactPDF from "./ModalBodyWithReactPDF";

const categoryIcons = {
  "payment-wallet": (
    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  "id-sync": (
    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 6H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V8a2 2 0 00-2-2h-5m-4 0V5a2 2 0 114 0v1m-4 0a2 2 0 104 0m-5 8a2 2 0 100-4 2 2 0 000 4zm0 0c1.306 0 2.417.835 2.83 2M9 14a3.001 3.001 0 00-2.83 2M15 11h3m-3 4h2" />
    </svg>
  ),
  "info-vault": (
    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  ),
  "identity-capsule": (
    <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
    </svg>
  ),
  "key-locker": (
    <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
    </svg>
  ),
  "docsafe": (
    <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
    </svg>
  )
};

const categoryLabels = {
  "payment-wallet": "Payment Wallet",
  "id-sync": "ID Sync",
  "info-vault": "Info Vault",
  "identity-capsule": "Identity Capsule",
  "key-locker": "Key Locker",
  "docsafe": "DocSafe"
};

export default function MyVaultPage() {
  const [activeCategory, setActiveCategory] = useState("payment-wallet");
  const [searchQuery, setSearchQuery] = useState("");
  const [vaultData, setVaultData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [previewFile, setPreviewFile] = useState(null);
  const [previewContent, setPreviewContent] = useState(null);
  const [isPreviewLoading, setIsPreviewLoading] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(null);
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(true);
  const [currentAction, setCurrentAction] = useState('initial');
  const [vaultInitialized, setVaultInitialized] = useState(false);
  const [vaultCorrupted, setVaultCorrupted] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [accountPassword, setAccountPassword] = useState("");
  const [newDecryptionPassword, setNewDecryptionPassword] = useState(""); // Ensure this is initialized
  const [resetError, setResetError] = useState(null);

  const { isOpen, onOpen, onOpenChange } = useDisclosure();
  const navigate = useNavigate();

  const checkVaultStatus = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/vault-status`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setVaultInitialized(response.data.initialized);
      setVaultCorrupted(response.data.corrupted);
      if (!response.data.initialized) {
        setError("Vault not initialized. Please initialize your vault first.");
      }
    } catch (err) {
      console.error("Vault status check error:", err);
      setError("Failed to check vault status");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchVaultData = async (decryptionPassword) => {
    try {
      setIsLoading(true);
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/vault-items`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            decryptionPassword
          }
        }
      );
      console.log("Vault data fetched successfully:", response.data);

      const initialData = Object.keys(categoryLabels).reduce((acc, category) => {
        acc[category] = [];
        return acc;
      }, {});

      const groupedData = response.data.files.reduce((acc, item) => {
        if (item.storageType && acc[item.storageType]) {
          acc[item.storageType].push(item);
        }
        return acc;
      }, initialData);

      setVaultData(groupedData);
      setError(null);
      setIsPasswordModalOpen(false);
      setVaultInitialized(true);
    } catch (err) {
      console.error("Error fetching vault data:", err.response?.data || err);
      if (err.response?.data?.code === 'WRONG_PASSWORD') {
        setPasswordError("Incorrect password. Please try again.");
      } else {
        setError(err.response?.data?.message || "Failed to load vault data");
        if (err.response?.status === 401) {
          navigate('/login');
        }
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    checkVaultStatus();
  }, []);

  const filteredItems = vaultData[activeCategory]?.filter(item =>
    item?.name?.toLowerCase()?.includes(searchQuery.toLowerCase()) || []
  );

  const handlePasswordSubmit = async () => {
    if (!password) {
      setPasswordError("Password is required");
      return;
    }

    try {
      if (currentAction === 'initial') {
        await fetchVaultData(password);
      } else if (currentAction === 'preview') {
        await handlePreviewFile(previewFile, password);
      } else if (currentAction === 'download') {
        await handleDownloadFile(previewFile._id, previewFile.name, password);
      }
      setPassword("");
      setPasswordError(null);
    } catch (error) {
      setPasswordError("Incorrect password. Please try again.");
      console.error("Decryption error:", error);
    }
  };

  const handleRepairVault = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/repair-vault`,
        { decryptionPassword: password },
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );
      setPasswordError(null);
      setVaultCorrupted(false);
      await fetchVaultData(password);
    } catch (err) {
      setPasswordError(err.response?.data?.message || "Failed to repair vault");
      console.error("Vault repair error:", err);
    }
  };

  const promptForPassword = (action, file) => {
    console.log("Selected file for action:", action, file);
    if (!file || !file.id) {
      setPasswordError("Invalid file selected.");
      return;
    }
    setCurrentAction(action);
    setPreviewFile(file);
    setIsPasswordModalOpen(true);
    setPassword("");
    setPasswordError(null);
  };

  const handleDownloadFile = async (fileId, fileName, decryptionPassword) => {
    if (!fileId) {
      throw new Error("Invalid file ID");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/decrypt-download/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            decryptionPassword
          },
          responseType: 'blob'
        }
      );

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      setIsPasswordModalOpen(false);
    } catch (err) {
      console.error("Download error:", err.response?.data || err);
      throw new Error(err.response?.data?.message || "Failed to decrypt file");
    }
  };

  const handlePreviewFile = async (file, decryptionPassword) => {
    if (!file || !file.id) {
      throw new Error("Invalid file selected");
    }
    setIsPreviewLoading(true);
    setPreviewFile(file);
    setPreviewContent(null);
    onOpen();

    try {
      const token = localStorage.getItem("token");
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/decrypt-download/${file.id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          },
          params: {
            decryptionPassword
          },
          responseType: 'blob'
        }
      );

      const blob = new Blob([response.data], { type: file.contentType });
      const blobUrl = URL.createObjectURL(blob);

      if (file.contentType.startsWith("image/")) {
        setPreviewContent(blobUrl);
      } else if (file.contentType === "application/pdf") {
        setPreviewContent(blobUrl);
      } else if (file.contentType.startsWith("text/")) {
        const text = await blob.text();
        setPreviewContent(text);
      } else {
        setPreviewContent(null);
      }
      setIsPasswordModalOpen(false);
    } catch (error) {
      console.error("Decryption error details:", error.response?.data);
      throw new Error(error.response?.data?.message || "Failed to decrypt file");
    } finally {
      setIsPreviewLoading(false);
    }
  };

  const handleDeleteFile = async (fileId) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/api/encryption/files/${fileId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setVaultData(prev => ({
        ...prev,
        [activeCategory]: prev[activeCategory].filter(file => file.id !== fileId)
      }));

      if (previewFile?.id === fileId) {
        closePreview();
      }
    } catch (err) {
      console.error("Delete error:", err);
      alert(err.response?.data?.message || "Failed to delete file");
    }
  };

  const closePreview = () => {
    setPreviewFile(null);
    setPreviewContent(null);
    setIsPreviewLoading(false);
  };

const handleResetDecryptionPassword = async () => {
  if (!accountPassword || !newDecryptionPassword) {
    setResetError("Both account password and new decryption password are required");
    return;
  }

  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${import.meta.env.VITE_BACKEND_URL}/api/encryption/reset-decryption-password`,
      {
        accountPassword,
        newDecryptionPassword
      },
      {
        headers: {
          Authorization: `Bearer ${token}`
        }
      }
    );
    setResetError(null);
    setIsResetModalOpen(false);
    setAccountPassword("");
    setNewDecryptionPassword("");
    alert(response.data.message); // Show the detailed success message
    // Refresh vault data with the new decryption password
    await fetchVaultData(newDecryptionPassword);
  } catch (err) {
    setResetError(err.response?.data?.message || "Failed to reset decryption password");
    console.error("Reset decryption password error:", err);
  }
};

  if (isLoading) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Spinner size="lg" />
        </div>
      </DefaultLayout>
    );
  }

  if (error && !vaultInitialized) {
    return (
      <DefaultLayout>
        <div className="min-h-screen flex items-center justify-center">
          <Card className="max-w-md">
            <CardBody className="text-center">
              <svg className="w-12 h-12 mx-auto text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="text-lg font-medium mt-4">Error loading vault</h3>
              <p className="text-default-500 mt-2">{error}</p>
              <Button className="mt-4" onClick={checkVaultStatus}>
                Try Again
              </Button>
              {!vaultInitialized && (
                <Button className="mt-4" onClick={() => navigate('/initialize-vault')}>
                  Initialize Vault
                </Button>
              )}
            </CardBody>
          </Card>
        </div>
      </DefaultLayout>
    );
  }

  return (
    <DefaultLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header Section */}
        <section className="mb-8 flex justify-between items-center">
          <div>
            <h1 className={title({ size: "lg" })}>
              My <span className={title({ color: "violet", size: "lg" })}>Vault</span>
            </h1>
            <p className={subtitle({ class: "mt-2" })}>
              All your secured items in one place, protected with military-grade encryption
            </p>
          </div>
          {vaultInitialized && (
            <Button color="primary" onClick={() => setIsResetModalOpen(true)}>
              Reset Decryption Password
            </Button>
          )}
        </section>

        {/* Search and Filter Bar */}
        {vaultInitialized && (
          <section className="mb-6 flex flex-col sm:flex-row gap-4">
            <Input
              placeholder="Search your vault..."
              startContent={
                <svg className="w-5 h-5 text-default-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-grow"
            />
          </section>
        )}

        {vaultInitialized && (
          <div className="flex flex-col lg:flex-row gap-6">
            {/* Categories Sidebar */}
            <div className="lg:w-1/4">
              <Card className="h-full">
                <CardHeader>
                  <h2 className="text-lg font-semibold">Categories</h2>
                </CardHeader>
                <CardBody className="p-0">
                  <div className="space-y-1">
                    {Object.keys(categoryLabels).map((categoryKey) => (
                      <button
                        key={categoryKey}
                        onClick={() => setActiveCategory(categoryKey)}
                        className={`w-full text-left px-4 py-3 flex items-center gap-3 ${
                          activeCategory === categoryKey
                            ? "bg-purple-500/10 dark:bg-purple-400/10 text-purple-600 dark:text-purple-400"
                            : "hover:bg-default-100 dark:hover:bg-default-800"
                        }`}
                      >
                        <div className="p-2 rounded-lg bg-white/80 dark:bg-black/20">
                          {categoryIcons[categoryKey]}
                        </div>
                        <span>{categoryLabels[categoryKey]}</span>
                        <Chip size="sm" className="ml-auto">
                          {vaultData[categoryKey]?.length || 0}
                        </Chip>
                      </button>
                    ))}
                  </div>
                </CardBody>
              </Card>
            </div>

            {/* Items Grid */}
            <div className="lg:w-3/4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold flex items-center gap-2">
                  <div className="p-2 rounded-lg bg-white/80 dark:bg-black/20">
                    {categoryIcons[activeCategory]}
                  </div>
                  {categoryLabels[activeCategory]}
                </h3>
              </div>

              {filteredItems?.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredItems.map((item) => (
                    <Card
                      key={item._id}
                      isPressable
                      isHoverable
                      className="hover:shadow-lg transition-all"
                      onClick={() => promptForPassword('preview', item)}
                    >
                      <CardHeader className="flex items-start gap-3">
                        <Avatar
                          isBordered
                          radius="sm"
                          color={
                            item.storageType === "payment-wallet" ? "secondary" :
                            item.storageType === "id-sync" ? "primary" :
                            item.storageType === "info-vault" ? "success" :
                            item.storageType === "identity-capsule" ? "danger" :
                            item.storageType === "key-locker" ? "warning" : "danger"
                          }
                          name={item.name?.charAt(0) || 'F'}
                        />
                        <div>
                          <h4 className="font-semibold">{item.name}</h4>
                          <p className="text-sm text-default-500">
                            {new Date(item.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </CardHeader>
                      <CardBody className="pt-0 px-4">
                        <div className="text-sm space-y-1">
                          {item.size && <p>Size: {formatFileSize(item.size)}</p>}
                          {item.tags?.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {item.tags.map(tag => (
                                <Chip key={tag} size="sm" variant="flat">{tag}</Chip>
                              ))}
                            </div>
                          )}
                        </div>
                      </CardBody>
                      <CardFooter className="flex justify-between items-center">
                        <span className="text-xs text-default-500">
                          {item.contentType || 'Encrypted file'}
                        </span>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              promptForPassword('download', item);
                            }}
                          >
                            Download
                          </Button>
                          <Button
                            size="sm"
                            color="danger"
                            variant="light"
                            onClick={(e) => {
                              e.stopPropagation();
                              if (confirm(`Are you sure you want to delete ${item.name}?`)) {
                                handleDeleteFile(item._id);
                              }
                            }}
                          >
                            Delete
                          </Button>
                        </div>
                      </CardFooter>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardBody className="text-center py-12">
                    <svg
                      className="w-12 h-12 mx-auto text-default-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    <h4 className="text-lg font-medium mt-4">No items found</h4>
                    <p className="text-default-500 mt-1">
                      {searchQuery ? "Try a different search term" : `No items in ${categoryLabels[activeCategory]}`}
                    </p>
                  </CardBody>
                </Card>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Password Modal */}
      <Modal isOpen={isPasswordModalOpen} onClose={() => {}} backdrop="blur" isDismissable={false}>
        <ModalContent>
          <ModalHeader>Enter Decryption Password</ModalHeader>
          <ModalBody>
            <Input
              type="password"
              label="Vault Password"
              placeholder="Enter your decryption password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              errorMessage={passwordError}
              onKeyPress={(e) => e.key === 'Enter' && handlePasswordSubmit()}
            />
            <p className="text-sm text-default-500 mt-2">
              This password is required to decrypt and access your secure files.
            </p>
            {vaultCorrupted && (
              <p className="text-sm text-warning-500 mt-2">
                Vault appears to be corrupted. You can attempt to repair it using your password.
              </p>
            )}
          </ModalBody>
 <ModalFooter>
  {currentAction === 'initial' && vaultCorrupted && (
    <Button color="warning" variant="light" onPress={handleRepairVault}>
      Repair Vault
    </Button>
  )}
  <Button color="primary" onPress={handlePasswordSubmit}>
    Unlock
  </Button>
  <Button color="default" variant="light" onPress={() => setIsResetModalOpen(true)}>
    Reset Password
  </Button>
</ModalFooter>

        </ModalContent>
      </Modal>

      {/* Reset Decryption Password Modal */}
      <Modal isOpen={isResetModalOpen} onClose={() => setIsResetModalOpen(false)} backdrop="blur">
        <ModalContent>
          <ModalHeader>Reset Decryption Password</ModalHeader>
          <ModalBody>
            <Input
              type="password"
              label="Account Password"
              placeholder="Enter your account password"
              value={accountPassword}
              onChange={(e) => setAccountPassword(e.target.value)}
              errorMessage={resetError}
              onKeyPress={(e) => e.key === 'Enter' && handleResetDecryptionPassword()}
            />
            <Input
              type="password"
              label="New Decryption Password"
              placeholder="Enter new decryption password"
              value={newDecryptionPassword}
              onChange={(e) => setNewDecryptionPassword(e.target.value)}
              errorMessage={resetError}
              onKeyPress={(e) => e.key === 'Enter' && handleResetDecryptionPassword()}
              className="mt-4"
            />
            <p className="text-sm text-default-500 mt-2">
              Enter your account password to verify your identity, then set a new decryption password for your vault.
            </p>
            {resetError && (
              <p className="text-sm text-danger-500 mt-2">{resetError}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="danger" variant="light" onPress={() => setIsResetModalOpen(false)}>
              Cancel
            </Button>
            <Button color="primary" onPress={handleResetDecryptionPassword}>
              Reset Password
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* File Preview Modal */}
      <Modal isOpen={isOpen} onOpenChange={onOpenChange} size="5xl">
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                {previewFile?.name}
                <p className="text-sm font-normal text-default-500">
                  {previewFile?.contentType}
                </p>
              </ModalHeader>

              <ModalBodyWithReactPDF
                isPreviewLoading={isPreviewLoading}
                previewContent={previewContent}
                previewFile={previewFile}
              />

              <ModalFooter>
                <Button
                  size="sm"
                  variant="light"
                  onPress={() => promptForPassword('download', previewFile)}
                  isDisabled={!previewFile}
                >
                  Download
                </Button>
                <Button
                  size="sm"
                  color="danger"
                  variant="light"
                  onPress={() => {
                    if (confirm(`Are you sure you want to delete ${previewFile?.name}?`)) {
                      handleDeleteFile(previewFile?._id);
                      onClose();
                    }
                  }}
                  isDisabled={!previewFile}
                >
                  Delete
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </DefaultLayout>
  );
}

function formatFileSize(bytes) {
  if (!bytes) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}