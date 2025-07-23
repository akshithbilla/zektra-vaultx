import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Input, Button } from "@heroui/react";

const ResetPasswordPage = () => {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_BACKEND_URL}/reset-password/${token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();
      if (res.ok) {
        setStatus("Password reset successful. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      } else {
        setStatus(data.message || "Reset failed.");
      }
    } catch (err) {
      setStatus("Error resetting password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen">
      <form className="w-full max-w-md p-6 bg-white shadow-md rounded" onSubmit={handleReset}>
        <h2 className="text-xl font-semibold mb-4">Reset Password</h2>
        <Input
          label="New Password"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" isLoading={loading} className="mt-4" color="primary">
          Reset Password
        </Button>
        {status && <p className="text-sm mt-4 text-center">{status}</p>}
      </form>
    </div>
  );
};

export default ResetPasswordPage;
