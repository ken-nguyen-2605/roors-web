'use client';

import { useState } from 'react';
import Link from 'next/link';
import Star from "@/components/decorativeComponents/Star";
import Line from "@/components/decorativeComponents/Line";

const styles = {
  page: {
    container: "relative bg-[#F5F4ED] min-h-screen flex flex-col",
  },
  header: {
    container: "w-full bg-black text-white py-6 border-b-4 border-[#D4AF37]",
    content: "max-w-[1280px] mx-auto px-4 text-center",
    title: "text-4xl font-bold text-[#D4AF37]",
  },
  main: {
    wrapper: "flex-1 py-14 max-h-[750px]",
    contentContainer: "max-w-[1280px] mx-auto px-3",
    gridContainer: "grid grid-cols-1 md:grid-cols-12 gap-8 items-start",
  },
  imageSection: {
    container: "md:col-span-5",
    imageWrapper: "relative w-full h-[600px] shadow-lg rounded-lg overflow-hidden bg-gray-200",
    image: "w-full h-full object-cover",
  },
  centerFrame: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[600px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center",
  },

  centerFrameTop: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[400px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center top-0",
  },
  centerFrameBottom: {
    container: "md:col-span-1 flex flex-col items-center justify-center min-h-[750px]",
    divider: "flex flex-col w-full h-full items-center justify-items-center bottom-0",
  },
  formSection: {
    container: "md:col-span-5",
    formWrapper: "bg-[#F5F4ED] rounded-lg shadow-lg p-8",
    formContainer: "w-full",
  },
  form: {
    title: "text-4xl font-bold mb-8 text-center",
    form: "space-y-6",
    fieldWrapper: "block",
    label: "block text-gray-800 font-medium mb-2",
    input: "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors",
    inputError: "border-red-500",
    inputNormal: "border-gray-300",
    select: "w-full px-4 py-3 border-2 rounded-lg focus:outline-none focus:border-[#D4AF37] transition-colors",
    checkboxWrapper: "flex items-center",
    checkbox: "w-4 h-4 rounded border-2",
    checkboxError: "border-red-500",
    checkboxNormal: "border-gray-400",
    checkboxLabel: "ml-2 text-sm text-gray-700",
    link: "text-blue-600 hover:underline",
    linkBold: "text-blue-600 hover:underline font-medium",
    submitButton: "w-full py-4 bg-[#D4AF37] text-white rounded-lg hover:bg-[#B8941F] transition-colors font-bold text-lg shadow-lg",
    textCenter: "text-center text-gray-700",
  },
  footer: {
    container: "w-full bg-black text-white py-12 mt-12 border-t-4 border-[#D4AF37]",
    maxWidth: "max-w-[1280px] mx-auto px-4",
    grid: "grid grid-cols-1 md:grid-cols-4 gap-8",
    heading: "text-2xl mb-4 text-[#D4AF37]",
    list: "space-y-2",
    divider: "mt-8 pt-8 border-t border-gray-700 text-center",
  },
};

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    time: '',
    guests: '',
    specialRequests: ''
  });

  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }

    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    }

    if (!formData.date) {
      newErrors.date = 'Date is required';
    }

    if (!formData.time) {
      newErrors.time = 'Time is required';
    }

    if (!formData.guests) {
      newErrors.guests = 'Number of guests is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validateForm()) {
      console.log('Reservation successful:', formData);
    }
  };

  return (
    <div className={styles.page.container}>
      
      {/* Header */}
      <header className={styles.header.container}>
        <div className={styles.header.content}>
          {/* <h1 className={styles.header.title}>ROORS Restaurant</h1> */}
        </div>
      </header>
      
      {/* Main Content */}
      <main className={styles.main.wrapper}>
        <div className={styles.main.contentContainer}>
          <div className={styles.main.gridContainer}>
            
            {/* Left - Picture Section */}
            <div className={styles.imageSection.container}>
              <div className={styles.imageSection.imageWrapper}>
                <img
                  src="/image/FireChef.jpg"
                  alt="Chef cooking with flames"
                  className={styles.imageSection.image}
                />
              </div>
            </div>

            {/* Center - Invisible Frame with Vertical Lines and Stars */}
            <div className={styles.centerFrameTop.container}>
              <div className={styles.centerFrameTop.divider}>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
                <Star color="black" size={64}/>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
              </div>
            </div>

            <div className={styles.centerFrameBottom.container}>
              <div className={styles.centerFrameBottom.divider}>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
                <Star color="black" size={64}/>
                <Line color="black" size={200} direction="vertical" thinkness={3}/>
              </div>
            </div>

            

            {/* Right - Form Section */}
            <div className={styles.formSection.container}>
              <div className={styles.formSection.formWrapper}>
                <div className={styles.formSection.formContainer}>
                  
                  <h2 className={styles.form.title}>Reserve Your Table</h2>

                  <form onSubmit={handleSubmit} className={styles.form.form}>
                    
                    {/* Name Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Full Name</label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        className={`${styles.form.input} ${
                          errors.name ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
                    </div>

                    {/* Email Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Email address</label>
                      <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className={`${styles.form.input} ${
                          errors.email ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
                    </div>

                    {/* Phone Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Phone Number</label>
                      <input
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        className={`${styles.form.input} ${
                          errors.phone ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
                    </div>

                    {/* Date Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Reservation Date</label>
                      <input
                        type="date"
                        name="date"
                        value={formData.date}
                        onChange={handleChange}
                        className={`${styles.form.input} ${
                          errors.date ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      />
                    </div>

                    {/* Time Field */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Reservation Time</label>
                      <select
                        name="time"
                        value={formData.time}
                        onChange={handleChange}
                        className={`${styles.form.select} ${
                          errors.time ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      >
                        <option value="">Select time</option>
                        <option value="11:00">11:00 AM</option>
                        <option value="11:30">11:30 AM</option>
                        <option value="12:00">12:00 PM</option>
                        <option value="12:30">12:30 PM</option>
                        <option value="13:00">1:00 PM</option>
                        <option value="13:30">1:30 PM</option>
                        <option value="14:00">2:00 PM</option>
                        <option value="17:00">5:00 PM</option>
                        <option value="17:30">5:30 PM</option>
                        <option value="18:00">6:00 PM</option>
                        <option value="18:30">6:30 PM</option>
                        <option value="19:00">7:00 PM</option>
                        <option value="19:30">7:30 PM</option>
                        <option value="20:00">8:00 PM</option>
                        <option value="20:30">8:30 PM</option>
                        <option value="21:00">9:00 PM</option>
                      </select>
                    </div>

                    {/* Number of Guests */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Number of Guests</label>
                      <select
                        name="guests"
                        value={formData.guests}
                        onChange={handleChange}
                        className={`${styles.form.select} ${
                          errors.guests ? styles.form.inputError : styles.form.inputNormal
                        }`}
                      >
                        <option value="">Select number of guests</option>
                        <option value="1">1 Guest</option>
                        <option value="2">2 Guests</option>
                        <option value="3">3 Guests</option>
                        <option value="4">4 Guests</option>
                        <option value="5">5 Guests</option>
                        <option value="6">6 Guests</option>
                        <option value="7">7 Guests</option>
                        <option value="8">8 Guests</option>
                        <option value="9">9+ Guests</option>
                      </select>
                    </div>

                    {/* Special Requests */}
                    <div className={styles.form.fieldWrapper}>
                      <label className={styles.form.label}>Special Requests (Optional)</label>
                      <input
                        type="text"
                        name="specialRequests"
                        value={formData.specialRequests}
                        onChange={handleChange}
                        placeholder="Any dietary restrictions or special occasions?"
                        className={`${styles.form.input} ${styles.form.inputNormal}`}
                      />
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className={styles.form.submitButton}>
                      Book Table
                    </button>

                    {/* View Menu Link */}
                    <p className={styles.form.textCenter}>
                      Want to see our menu?{' '}
                      <a href="/menu" className={styles.form.linkBold}>
                        View Menu
                      </a>
                    </p>
                  </form>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>

    </div>
  );
}