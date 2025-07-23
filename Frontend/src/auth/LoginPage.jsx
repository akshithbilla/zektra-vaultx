"use client";

import React, { useState, useEffect } from "react";
import { useNavigate, Link as RouterLink } from "react-router-dom";
import ReCAPTCHA from "react-google-recaptcha";
import { useRef } from "react";

 // 🔑 From Google reCAPTCHA dashboard

import { Button, Input, Checkbox, Link, Form, Divider } from "@heroui/react";
import { Icon } from "@iconify/react";

const LoginPage = ({ setUser }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showResend, setShowResend] = useState(false);
  const [resending, setResending] = useState(false);
  const [resentMsg, setResentMsg] = useState("");
  const [loginEmail, setLoginEmail] = useState("");
  const recaptchaRef = useRef(null);

  const navigate = useNavigate();

  const toggleVisibility = () => setIsVisible(!isVisible);
const SITE_KEY = "6LdzZ3crAAAAAAR0HO3Us161USFuGtUYxcrCm_rj";
  // Google OAuth: handle token in query string
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const token = params.get('token');
    if (token) {
      localStorage.setItem('token', token);

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/profiles/me`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          setUser(data);
          navigate('/dashboard');
        })
        .catch(() => {
          localStorage.removeItem('token');
          setError('Login failed');
        });
    }
  }, [navigate, setUser]);

const handleSubmit = async (event) => {
  event.preventDefault();
  setLoading(true);
  setError('');
  setShowResend(false);
  setResentMsg("");

  const formData = new FormData(event.target);
  const email = formData.get('email');
  const password = formData.get('password');
  setLoginEmail(email);

  const token = await recaptchaRef.current?.getValue();
  if (!token) {
    setError("Please verify that you're not a robot.");
    setLoading(false);
    return;
  }

  try {
    // 1. Verify reCAPTCHA token with your backend
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

    // 2. Proceed with actual login
    const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      localStorage.setItem('token', data.token);
      setUser(data.user);
      navigate('/dashboard');
    } else {
      if (data.message?.toLowerCase().includes("not verified")) {
        setShowResend(true);
      }
      setError(data.message || 'Login failed');
    }
  } catch (err) {
    setError('An error occurred. Please try again.');
  } finally {
    recaptchaRef.current?.reset(); // reset for next time
    setLoading(false);
  }
};


  // Resend verification link (shared with Signup page)
  const handleResendVerification = async (emailParam) => {
    setResending(true);
    setResentMsg("");
    try {
      const response = await fetch(`${import.meta.env.VITE_BACKEND_URL}/resend-verification`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: emailParam || loginEmail }),
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

  const handleGoogleAuth = () => {
    window.location.href = `${import.meta.env.VITE_BACKEND_URL}/auth/google`;
  };

  return (
    <div className="flex h-full w-full items-center justify-center">
      <div className="flex w-full max-w-sm flex-col gap-4 rounded-large">
        <div className="flex flex-col items-center pb-6">
          <p className="text-xl font-medium">Welcome Back</p>
          <p className="text-small text-default-500">Log in to your account to continue</p>
        </div>

        {error && <div className="text-red-500 text-sm text-center">{error}</div>}
        {showResend && (
          <Button
            color="secondary"
            onClick={() => handleResendVerification()}
            isDisabled={resending}
            variant="bordered"
            className="mt-2 w-full"
          >
            {resending ? "Resending..." : "Resend Verification Link"}
          </Button>
        )}
        {resentMsg && (
          <div className="text-green-500 text-sm text-center">{resentMsg}</div>
        )}

        <Form className="flex flex-col gap-3" validationBehavior="native" onSubmit={handleSubmit}>
          <Input
            isRequired
            label="Email Address"
            name="email"
            placeholder="Enter your email"
            type="email"
            variant="bordered"
          />
          <Input
            isRequired
            endContent={
              <button type="button" onClick={toggleVisibility}>
                {isVisible ? (
                  <Icon className="text-2xl text-default-400" icon="solar:eye-closed-linear" />
                ) : (
                  <Icon className="text-2xl text-default-400" icon="solar:eye-bold" />
                )}
              </button>
            }
            label="Password"
            name="password"
            placeholder="Enter your password"
            type={isVisible ? "text" : "password"}
            variant="bordered"
          />
          <div className="flex w-full items-center justify-between px-1 py-2">
            <Checkbox name="remember" size="sm">
              Remember me
            </Checkbox>
            <Link className="text-default-500" href="/forgot-password" size="sm">
              Forgot password?
            </Link>
          </div>
          <ReCAPTCHA
  ref={recaptchaRef}
  sitekey={SITE_KEY}
  className="my-2 rounded-md"
/>
          <Button className="w-full" color="primary" type="submit" isLoading={loading}>
            <span>Sign In</span>
          </Button>
        </Form>


        <div className="flex items-center gap-4 py-2">
          <Divider className="flex-1" />
          <p className="shrink-0 text-tiny text-default-500">OR</p>
          <Divider className="flex-1" />
        </div>

        <div className="flex flex-col gap-2">
          <Button
            onClick={handleGoogleAuth}
            startContent={<Icon icon="flat-color-icons:google" width={24} />}
            variant="bordered"
          >
            Continue with Google
          </Button>
        </div>

        <p className="text-center text-small">
          Need to create an account?&nbsp;
          <RouterLink to="/signup" className="text-primary hover:underline text-sm">
            Sign Up
          </RouterLink>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;