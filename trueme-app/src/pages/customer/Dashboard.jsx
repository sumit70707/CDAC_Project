import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { getMyProfile, updateMyProfile, getMyAddress, addAddress, updateAddress, deleteAddress } from '../../services/userService';

const Dashboard = () => {
  const { user } = useSelector((state) => state.auth);
  const [profile, setProfile] = useState(user || {});
  // Address State
  const [address, setAddress] = useState(null);
  const [loading, setLoading] = useState(false);

  // Profile Edit State
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});

  // Address Edit State
  const [isEditingAddress, setIsEditingAddress] = useState(false);
  const [addressFormData, setAddressFormData] = useState({
    addressLine1: '',
    city: '',
    state: '',
    postalCode: '',
    country: 'India'
  });


  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Fetch Profile
        const profileData = await getMyProfile();
        setProfile(profileData);

        // 2. Fetch Address (Backend stores 1 address)
        const addressData = await getMyAddress();
        setAddress(addressData); // can be null if not set
      } catch (error) {
        console.error("Failed to load user data", error);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // --- Profile Handlers ---
  const handleEditProfile = () => {
    setFormData({
      firstName: profile.firstName,
      lastName: profile.lastName,
      phone: profile.phone,
    });
    setIsEditing(true);
  };

  const handleCancelProfile = () => setIsEditing(false);

  const handleSubmitProfile = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const updated = await updateMyProfile(formData);
      setProfile(updated);
      setIsEditing(false);
      alert("Profile Updated Successfully");
    } catch (error) {
      alert("Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handleProfileChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });


  // --- Address Handlers ---
  const handleAddOrEditAddress = () => {
    if (address) {
      setAddressFormData({
        addressLine1: address.addressLine1 || '',
        city: address.city || '',
        state: address.state || '',
        postalCode: address.postalCode || '',
        country: address.country || 'India'
      });
    }
    setIsEditingAddress(true);
  };

  const handleCancelAddress = () => setIsEditingAddress(false);

  const handleAddressChange = (e) => setAddressFormData({ ...addressFormData, [e.target.name]: e.target.value });

  const handleSubmitAddress = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      let result;
      if (address) {
        // Update
        result = await updateAddress(addressFormData);
      } else {
        // Add
        result = await addAddress(addressFormData);
      }
      setAddress(result);
      setIsEditingAddress(false);
      alert("Address Saved Successfully");
    } catch (error) {
      console.error("Address save failed", error);
      alert("Failed to save address");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAddress = async () => {
    if (!window.confirm("Are you sure you want to delete your address?")) return;
    setLoading(true);
    try {
      await deleteAddress();
      setAddress(null);
      setAddressFormData({
        addressLine1: '',
        city: '',
        state: '',
        postalCode: '',
        country: 'India'
      });
    } catch (error) {
      alert("Failed to delete address");
    } finally {
      setLoading(false);
    }
  };


  if (loading && !profile.email) return <div className="min-h-screen flex justify-center items-center"><span className="loading loading-spinner text-black"></span></div>;

  return (
    <div className="max-w-7xl mx-auto px-6 py-12 min-h-screen text-black font-sans bg-white">

      {/* Header */}
      <div className="mb-12 border-b border-black pb-6 flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tighter mb-2">My Account</h1>
          <p className="text-sm font-bold uppercase tracking-widest text-gray-500">Welcome Back, {profile?.firstName}</p>
        </div>
        <div className="badge border-black text-xs font-bold uppercase tracking-widest px-4 py-3 rounded-none bg-white text-black">{profile?.role}</div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">

        {/* SIDEBAR */}
        <div className="lg:col-span-1">
          <div className="sticky top-24">
            <div className="mb-8">
              <div className="w-16 h-16 bg-black text-white flex items-center justify-center text-xl font-bold rounded-full mb-4">
                {profile?.firstName?.charAt(0)}
              </div>
              <p className="text-xs font-bold uppercase tracking-widest text-gray-400">Signed in as</p>
              <p className="font-bold text-lg break-all">{profile?.email}</p>
            </div>

            <ul className="flex flex-col gap-4 text-sm font-bold uppercase tracking-widest">
              <li><button className="text-black border-l-2 border-black pl-4 text-left w-full pointer-events-none">Profile Settings</button></li>
              <li><Link to="/orders" className="text-gray-400 hover:text-black border-l-2 border-transparent hover:border-black pl-4 transition-all block">Order History</Link></li>
              <li><Link to="/wishlist" className="text-gray-400 hover:text-black border-l-2 border-transparent hover:border-black pl-4 transition-all block">Wishlist</Link></li>
            </ul>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div className="lg:col-span-3 space-y-12">

          {/* SECTION 1: PERSONAL INFO */}
          <section>
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">Personal Information</h2>
              {!isEditing && (
                <button onClick={handleEditProfile} className="btn btn-sm btn-outline rounded-none uppercase tracking-widest">
                  Edit Details
                </button>
              )}
            </div>

            {isEditing ? (
              <form onSubmit={handleSubmitProfile} className="max-w-lg space-y-6 animate-fade-in">
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">First Name</label>
                    <input name="firstName" value={formData.firstName || ''} onChange={handleProfileChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required />
                  </div>
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Last Name</label>
                    <input name="lastName" value={formData.lastName || ''} onChange={handleProfileChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" />
                  </div>
                </div>
                <div className="form-control">
                  <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Phone</label>
                  <input name="phone" value={formData.phone || ''} onChange={handleProfileChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" />
                </div>
                <div className="form-control">
                  <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Email</label>
                  <input value={profile.email} readOnly className="input input-bordered rounded-none bg-gray-100 text-gray-500 cursor-not-allowed" />
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleCancelProfile} className="btn btn-ghost rounded-none uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={loading} className="btn btn-neutral rounded-none uppercase tracking-widest px-8">
                    {loading ? 'Saving...' : 'Save Changes'}
                  </button>
                </div>
              </form>
            ) : (
              <div className="bg-gray-50 p-8 border border-gray-100 grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-4">
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">First Name</h4>
                  <p className="font-bold text-lg">{profile.firstName}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Last Name</h4>
                  <p className="font-bold text-lg">{profile.lastName || '-'}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Email</h4>
                  <p className="font-bold text-lg">{profile.email}</p>
                </div>
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-1">Phone</h4>
                  <p className="font-bold text-lg">{profile.phone || '-'}</p>
                </div>
              </div>
            )}
          </section>

          {/* SECTION 2: ADDRESS BOOK */}
          <section>
            <div className="flex justify-between items-center mb-8 border-b border-gray-100 pb-4">
              <h2 className="text-2xl font-black uppercase tracking-tight">Address Book</h2>
              {!isEditingAddress && !address && (
                <button onClick={handleAddOrEditAddress} className="bg-black text-white px-8 py-3 font-black uppercase tracking-widest text-xs hover:bg-gray-800 transition-all shadow-lg border-2 border-black active:scale-95">
                  Add Address
                </button>
              )}
            </div>

            {isEditingAddress ? (
              <form onSubmit={handleSubmitAddress} className="max-w-lg space-y-6 animate-fade-in bg-gray-50 p-6 border border-gray-200">
                <div className="form-control">
                  <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Address Line 1</label>
                  <input name="addressLine1" value={addressFormData.addressLine1} onChange={handleAddressChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required placeholder="Street Address, P.O. Box" />
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">City</label>
                    <input name="city" value={addressFormData.city} onChange={handleAddressChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required />
                  </div>
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">State/Province</label>
                    <input name="state" value={addressFormData.state} onChange={handleAddressChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-6">
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Zip/Postal Code</label>
                    <input name="postalCode" value={addressFormData.postalCode} onChange={handleAddressChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required />
                  </div>
                  <div className="form-control">
                    <label className="label uppercase text-xs font-bold tracking-widest text-gray-500">Country</label>
                    <input name="country" value={addressFormData.country} onChange={handleAddressChange} className="input input-bordered rounded-none focus:outline-none focus:border-black" required />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <button type="button" onClick={handleCancelAddress} className="btn btn-ghost rounded-none uppercase tracking-widest">Cancel</button>
                  <button type="submit" disabled={loading} className="btn btn-neutral rounded-none uppercase tracking-widest px-8">
                    {loading ? 'Saving...' : 'Save Address'}
                  </button>
                </div>
              </form>
            ) : (
              address ? (
                <div className="bg-white border-2 border-dashed border-gray-300 p-8 hover:border-black transition-colors group relative">
                  <div className="absolute top-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={handleAddOrEditAddress} className="btn btn-xs btn-outline rounded-none">Edit</button>
                    <button onClick={handleDeleteAddress} className="btn btn-xs btn-error text-white rounded-none">Delete</button>
                  </div>
                  <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-4">Primary Address</h4>
                  <p className="font-bold text-lg mb-1">{address.addressLine1}</p>
                  <p className="text-gray-600 mb-1">{address.city}, {address.state} {address.postalCode}</p>
                  <p className="text-gray-600 font-bold uppercase tracking-widest text-xs">{address.country}</p>
                </div>
              ) : (
                <div className="text-center py-12 bg-gray-50 border border-gray-100 text-gray-500 uppercase tracking-widest text-sm">
                  No address saved
                </div>
              )
            )}
          </section>

        </div>
      </div>
    </div>
  );
};

export default Dashboard;

