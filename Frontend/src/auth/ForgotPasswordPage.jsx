import { useState } from "react";
import { Input, Button } from "@heroui/react";
import { useNavigate } from "react-router-dom";

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("A reset link has been sent to your email.");
      } else {
        setStatus(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setStatus("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="w-full max-w-md p-6 bg-white shadow-md rounded" onSubmit={handleSubmit}>
        <h2 className="text-xl font-semibold mb-4">Forgot Password</h2>
        <Input
          label="Enter your email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button type="submit" isLoading={loading} className="mt-4" color="primary">
          Send Reset Link
        </Button>
        {status && <p className="text-sm mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
};

export default ForgotPasswordPage;
