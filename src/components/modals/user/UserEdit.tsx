import { useEffect, useState } from 'react';
import { User } from '@/types/user';
import { createInputChangeHandler } from '@/utils/handleInputChange';


export default function UserEdit({
  user,
  onClose,
  onSubmit,
  onSuccess,
}: {
  user: User;
  onClose: () => void;
  onSubmit: (userData: { userName: string, userPassword: string, userRole: string, userEmail: string, isActive : boolean }) => Promise<void>;
  onSuccess?: () => void; 
  
}) {

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    userName: user.userName,
    userPassword: "",
    userRole: user.userRole,
    userEmail: user.userEmail,
    isActive: user.isActive
  
  });
  
  const handleChange = createInputChangeHandler(setForm, setImagePreview);

  const handleSubmit = async () => {
    
    const userData = {
      id: user.id,  // Include ID for update
      userName: form.userName,
      userPassword: form.userPassword,
      userRole: form.userRole,
      userEmail: form.userEmail,
      isActive: form.isActive,
    };

    console.log("Submitting user data:", userData);

    try {
      await onSubmit(userData);  // Directly pass JSON object
      onClose();      
      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit user:', err);
    }
  };

   

  return (
    <div className="bg-green-50 w-full shadow-md rounded-lg p-6 max-w-lg md:max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Edit User</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="userName"
          placeholder="User Name"
          value={form.userName}
          onChange={handleChange}
          className="input-text"
          required
        />

        <input
          type="password"
          name="userPassword"
          placeholder="New Password"
          value={form.userPassword}
          onChange={handleChange}
          className="input-text"
          required
        />

        <input
          type="text"
          name="userEmail"
          placeholder="User Email"
          value={form.userEmail}
          onChange={handleChange}
          className="input-text"
          required
        />

        <select
          name="userRole"
          value={form.userRole}
          onChange={handleChange}
          className="input-text"
          required
        >
          <option value="">Select Role</option>
          <option value="ADMIN">Admin</option>
          <option value="MODERATOR">Moderator</option>
          <option value="USER">User</option>
        </select>

        <label className="flex items-center gap-2 mt-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Is Active?
        </label>

        
        
      </div>


      

      <div className="mt-6 flex justify-end gap-4">
        <button
          onClick={onClose}
          className="btn-base btn-gray"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          className="btn-base btn-blue"
        >
          Submit
        </button>
      </div>
    </div>
  );
}