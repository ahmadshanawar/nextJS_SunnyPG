"use client"
import { useState, ChangeEvent, FormEvent } from 'react';

interface FormData {
  name: string;
  mobile: string;
  addhar: string;
  college: string;
  email: string;
  password: string;
  confirmPassword: string;
  termsAccepted: boolean;
}

interface Errors {
  name?: string;
  mobile?: string;
  addhar?: string;
  college?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
  termsAccepted?: string;
}

const SignUpForm: React.FC = () => {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    mobile: '',
    addhar: '',
    college: '',
    email: '',
    password: '',
    confirmPassword: '',
    termsAccepted: false
  });

  const [errors, setErrors] = useState<Errors>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  const validateForm = (): Errors => {
    const newErrors: Errors = {};

    if (!formData.name) newErrors.name = 'Name is required';
    if (!formData.mobile || formData.mobile.length !== 10)
      newErrors.mobile = 'Mobile number must be 10 digits';
    if (!formData.addhar || formData.addhar.length !== 12)
      newErrors.addhar = 'Aadhaar number must be 12 digits';
    if (!formData.college) newErrors.college = 'College/Institution is required';
    if (!formData.email) newErrors.email = 'Email is required';
    if (!formData.password) newErrors.password = 'Password is required';
    if (formData.password !== formData.confirmPassword)
      newErrors.confirmPassword = 'Passwords do not match';
    if (!formData.termsAccepted) newErrors.termsAccepted = 'You must agree to the terms and conditions';

    return newErrors;
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      setIsSubmitting(false);
    } else {
      // Submit form (e.g., API call)
      console.log('Form submitted:', formData);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg mt-10">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Registration Form</h2>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Right Side (Name, Aadhaar, Mobile) */}
        <div className="space-y-4">
          <div>
            <label className="text-lg text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-700">Aadhaar Number</label>
            <input
              type="text"
              name="addhar"
              value={formData.addhar}
              onChange={handleChange}
              maxLength={12}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.addhar && <p className="text-red-500 text-sm mt-1">{errors.addhar}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-700">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={formData.mobile}
              onChange={handleChange}
              maxLength={10}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.mobile && <p className="text-red-500 text-sm mt-1">{errors.mobile}</p>}
          </div>
        </div>

        {/* Left Side (Email, Password, Confirm Password) */}
        <div className="space-y-4">
          <div>
            <label className="text-lg text-gray-700">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-700">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.password && <p className="text-red-500 text-sm mt-1">{errors.password}</p>}
          </div>
          <div>
            <label className="text-lg text-gray-700">Confirm Password</label>
            <input
              type="password"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleChange}
              className="p-3 rounded-md border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:outline-none w-full"
            />
            {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="col-span-1 md:col-span-2 flex items-center space-x-2">
          <input
            type="checkbox"
            name="termsAccepted"
            checked={formData.termsAccepted}
            onChange={handleChange}
            className="h-5 w-5 border-gray-300 focus:ring-2 focus:ring-purple-500"
          />
          <label className="text-sm text-gray-600">
            I agree to the{' '}
            <a href="#" className="text-purple-800 hover:underline">Terms and Conditions</a>
          </label>
        </div>

        {/* Submit Button */}
        <div className="col-span-1 md:col-span-2">
          <button
            type="submit"
            disabled={isSubmitting || !formData.termsAccepted}
            className="w-full p-4 bg-purple-800 text-white font-semibold rounded-md hover:bg-purple-700 disabled:opacity-50 transition"
          >
            {isSubmitting ? 'Submitting...' : 'Sign Up'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SignUpForm;
