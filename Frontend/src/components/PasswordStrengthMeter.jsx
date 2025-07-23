import React from "react";

const getPasswordStrength = (password) => {
  let score = 0;
  if (!password) return score;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score;
};

const PasswordStrengthMeter = ({ password }) => {
  const strength = getPasswordStrength(password);

  const getStrengthLabel = () => {
    switch (strength) {
      case 0:
      case 1:
        return "Weak";
      case 2:
        return "Fair";
      case 3:
        return "Good";
      case 4:
        return "Strong";
      default:
        return "";
    }
  };

  const getColor = () => {
    switch (strength) {
      case 0:
      case 1:
        return "bg-red-500";
      case 2:
        return "bg-yellow-500";
      case 3:
        return "bg-blue-500";
      case 4:
        return "bg-green-500";
      default:
        return "bg-gray-300";
    }
  };

  return (
    <div className="w-full mt-2">
      <div
        className={`h-2 rounded transition-all ${getColor()}`}
        style={{ width: `${(strength / 4) * 100}%` }}
      ></div>
      <p className="text-sm mt-1">{getStrengthLabel()}</p>
    </div>
  );
};

export default PasswordStrengthMeter;
