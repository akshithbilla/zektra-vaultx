"use client";

import React, { useState, useRef } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import {
  Button,
  Input,
  Checkbox,
  Link,
  Divider,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@heroui/react";
import { Icon } from "@iconify/react";
import ReCAPTCHA from "react-google-recaptcha";

const SITE_KEY = "6LdzZ3crAAAAAAR0HO3Us161USFuGtUYxcrCm_rj"; // 🔑 Replace with your Google reCAPTCHA site key

const SignupPage = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const [isVisible, setIsVisible] = useState(false);
  const [isConfirmVisible, setIsConfirmVisible] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");

  const recaptchaRef = useRef(null); // 👈 reCAPTCHA reference
  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);
  const toggleConfirmVisibility = () => setIsConfirmVisible(!isConfirmVisible);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setResentMsg("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    const token = await recaptchaRef.current?.getValue();
    if (!token) {
      setError("Please verify that you're not a robot.");
      return;
    }

    setLoading(true);
    try {
      // 1. Verify reCAPTCHA token with backend
      const captchaRes = await fetch(`${import.meta.env.VITE_BACKEND_URL}/api/verify-captcha`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token }),
      });

      const captchaData = await captchaRes.json();
      if (!captchaData.success) {
        setError("reCAPTCHA verification failed.");
        setLoading(false);
        return;
      }

      // 2. Register user
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setShowPopup(true);
      } else {
        setError(data.message || "Registration failed");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
      recaptchaRef.current?.reset(); // reset CAPTCHA
    }
  };

  const handleResendVerification = async () => {
    setResending(true);
    setResentMsg("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email }),
      });
      const data = await response.json();
      if (response.ok) {
        setResentMsg("Verification link resent!");
      } else {
        setResentMsg(data.message || "Failed to resend verification link.");
      }
    } catch {
      setResentMsg("Failed to resend verification link.");
    }
    setResending(false);
  };

  const handlePopupConfirm = () => {
    setShowPopup(false);
    navigate("/login");
  };

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex h-screen w-full items-center justify-center bg-background px-4">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <p className="text-xl font-medium">Welcome</p>
          <p className="text-small text-default-500">
            Create an account to get started
          </p>
        </div>

        {error && <p className="text-red-500 text-sm text-center">{error}</p>}

        <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Username"
            name="username"
            placeholder="Enter your username"
            variant="bordered"
            value={form.username}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
            value={form.email}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon={isVisible ? "solar:eye-closed-linear" : "solar:eye-bold"}
                />
              </button>
            }
            value={form.password}
            onChange={handleChange}
          />
          <Input
            isRequired
            label="Confirm Password"
            name="confirmPassword"
            placeholder="Confirm your password"
            type={isConfirmVisible ? "text" : "password"}
            variant="bordered"
            endContent={
              <button type="button" onClick={toggleConfirmVisibility}>
                <Icon
                  className="pointer-events-none text-2xl text-default-400"
                  icon={
                    isConfirmVisible ? "solar:eye-closed-linear" : "solar:eye-bold"
                  }
                />
              </button>
            }
            value={form.confirmPassword}
            onChange={handleChange}
          />

          <Checkbox isRequired className="py-4" size="sm">
            I agree with the&nbsp;
            <Link className="relative z-[1]" href="#" size="sm">
              Terms
            </Link>
            &nbsp; and&nbsp;
            <Link className="relative z-[1]" href="#" size="sm">
              Privacy Policy
            </Link>
          </Checkbox>

          {/* 👇 reCAPTCHA widget */}
          <ReCAPTCHA ref={recaptchaRef} sitekey={SITE_KEY} className="rounded-md" />

          <Button color="primary" type="submit" isDisabled={loading}>
            {loading ? "Registering..." : "Sign Up"}
          </Button>
        </form>

        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
            onClick={handleGoogleAuth}
          >
            Sign Up with Google
          </Button>
        </div>

        <p className="text-center text-small">
          Already have an account?&nbsp;
          <Link as={RouterLink} to="/login" size="sm" className="text-primary">
            Log In
          </Link>
        </p>
      </div>

      <Modal
        isOpen={showPopup}
        onClose={handlePopupConfirm}
        isDismissable={false}
        className="flex items-center justify-center"
      >
        <ModalContent>
          <ModalHeader>📧 Verify Your Email</ModalHeader>
          <ModalBody>
            <p>
              We've sent a verification link to your email address. Please
              check your spam or inbox and verify to continue.
            </p>
            {resentMsg && (
              <p className="text-sm text-center text-green-500 pb-2">{resentMsg}</p>
            )}
          </ModalBody>
          <ModalFooter>
            <Button color="primary" onClick={handlePopupConfirm}>
              OK
            </Button>
            <Button
              color="secondary"
              onClick={handleResendVerification}
              isDisabled={resending}
              variant="bordered"
            >
              {resending ? "Resending..." : "Resend Verification Link"}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default SignupPage;
