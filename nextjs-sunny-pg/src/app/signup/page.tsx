"use client";
import { useState, ChangeEvent, FormEvent } from "react";
import { isValid } from "@make-sense/adhaar-validator";
import {
  FaUser,
  FaMobileAlt,
  FaUniversity,
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaBriefcase,
  FaCreditCard,
} from "react-icons/fa";
import { supabase } from "@/lib/supabase";
import { useRouter } from "next/navigation";
import TermsAndConditions from "./terms-conditions";

interface FormData {
  name: string;
  mobile: string;
  addhar: string;
  occupation: string;
  institution: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface Errors {
  name?: string;
  mobile?: string;
  addhar?: string;
  occupation?: string;
  institution?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

const SignUpForm: React.FC = () => {
  const router = useRouter();
  const [formData, setFormData] = useState<FormData>({
    name: "",
    mobile: "",
    addhar: "",
    email: "",
    occupation: "",
    institution: "",
    password: "",
    confirmPassword: "",
    termsAccepted: false,
  });

  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  const handleTermsClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };
  const [registrationErrors, setRegistrationErrors] = useState<any>();
  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};
    if (!formData.name) newErrors.name = "Name is required";
    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = "Mobile number must be 10 digits";
    if (!formData.addhar || formData.addhar.length !== 12)
      newErrors.addhar = "Aadhaar number must be 12 digits";
    if (!isValid(formData.addhar)) newErrors.addhar = "Aadhaar number must be valid";
    if (!formData.email) newErrors.email = "Email is required";
    if (!formData.password) newErrors.password = "Password is required";
    if (formData.password.length < 8)
      newErrors.password = "Password must be at least 8 characters";
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = "Passwords do not match";
    if (!formData.termsAccepted)
      newErrors.termsAccepted = "You must agree to the terms and conditions";
    if (!formData.occupation) newErrors.occupation = "Occupation is required";
    if (!formData.institution) newErrors.institution = "Institution is required";
    return newErrors;
  };
  async function signUpUserDetails(uid: any, formData: FormData) {
    try {
      const { data, error } = await supabase.from("Tennants").insert([
        {
          uid: uid,
          name: formData.name,
          mobile: formData.mobile,
          adhaar: formData.addhar,
          email: formData.email,
          status: "Pending",
          mobile_verified: false,
          termsAndCondition: formData.termsAccepted,
          occupation: formData.occupation,
          institution: formData.institution,
          role: "user",
        },
      ]);
      if (error) {
        setRegistrationErrors(error);
        console.log(error);
      }
    } catch (error) {
      setRegistrationErrors(error);
      console.log(error);
    }
  }

  async function signUpNewUser(email: string, password: string) {
    try {
      const { data: dataUser, error } = await supabase.auth.signUp({
        email,
        password,
      });
      if (error) {
        return { data: null, error };
      }
      if (dataUser) {
        return { data: dataUser, error: null };
      }
    } catch (error) {
      return { data: null, error };
    }
  }
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    } else {
      const { data, error }: any = await signUpNewUser(
        formData.email,
        formData.password
      );
      if (error) {
        setRegistrationErrors(error);
        setIsSubmitting(false);
      }
      if (data) {
        signUpUserDetails(data?.user?.id, formData);
        alert("User Registered Successfully! Please Login to continue");
        router.push("/login");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10 md:mt-16">
      <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-6 text-center">
        Registration Form
      </h2>
      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 gap-6 md:grid-cols-2"
      >
        {/* Name Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Name</label>
          <FaUser className="absolute left-3 top-10 text-gray-400" />
          <input
            type="text"
            name="name"
            maxLength={50}
            value={formData.name}
            onChange={handleChange}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.name && <span className="text-red-500">{errors.name}</span>}
        </div>

        {/* Aadhaar Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Aadhaar Number</label>
          <FaCreditCard className="absolute left-3 top-10 text-gray-400" />
          <input
            type="text"
            name="addhar"
            value={formData.addhar}
            onChange={handleChange}
            maxLength={12}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.addhar && <span className="text-red-500">{errors.addhar}</span>}
        </div>
        {/* Occupation Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Occupation</label>
          <FaBriefcase className="absolute left-3 top-10 text-gray-400" />
          <input
            type="text"
            name="occupation"
            value={formData.occupation}
            onChange={handleChange}
            maxLength={50}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.occupation && (
            <span className="text-red-500">{errors.occupation}</span>
          )}
        </div>

        {/* institution Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Institution</label>
          <FaUniversity className="absolute left-3 top-10 text-gray-400" />
          <input
            type="text"
            name="institution"
            value={formData.institution}
            onChange={handleChange}
            maxLength={50}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.institution && (
            <span className="text-red-500">{errors.institution}</span>
          )}
        </div>

        {/* Mobile Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Mobile</label>
          <FaMobileAlt className="absolute left-3 top-10 text-gray-400" />
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            maxLength={10}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.mobile && <span className="text-red-500">{errors.mobile}</span>}
        </div>

        {/* Email Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Email</label>
          <FaEnvelope className="absolute left-3 top-10 text-gray-400" />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          {errors.email && <span className="text-red-500">{errors.email}</span>}
        </div>

        {/* Password Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Password</label>
          <FaLock className="absolute left-3 top-10 text-gray-400" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          <div
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-10 text-gray-400 cursor-pointer"
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.password && (
            <span className="text-red-500">{errors.password}</span>
          )}
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <label className="block text-sm font-medium mb-1">Confirm Password</label>
          <FaLock className="absolute left-3 top-10 text-gray-400" />
          <input
            type={showConfirmPassword ? "text" : "password"}
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="p-3 pl-10 w-full rounded-md border border-gray-300"
          />
          <div
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute right-3 top-10 text-gray-400 cursor-pointer"
          >
            {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
          </div>
          {errors.confirmPassword && (
            <span className="text-red-500">{errors.confirmPassword}</span>
          )}
        </div>

        {/* Terms and Conditions */}
        <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="h-5 w-5"
          />
          <label className="text-sm">
            I agree to the{" "}
            <a
              href="#"
              onClick={handleTermsClick}
              className="text-purple-600 hover:underline"
            >
              Terms and Conditions
            </a>
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          {registrationErrors && (
            <div
              className="p-4 mb-4 text-sm text-red-600 rounded-lg bg-red-50"
              role="alert"
            >
              <span className="font-medium">{registrationErrors.message}</span>
            </div>
          )}
          <button
            type="submit"
            disabled={isSubmitting || !formData.termsAccepted}
            className="w-full p-3 bg-purple-600 text-white rounded-md hover:bg-purple-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Sign Up"}
          </button>
        </div>
      </form>
      {isModalOpen && <TermsAndConditions onClose={closeModal} />}
    </div>
  );
};

export default SignUpForm;
