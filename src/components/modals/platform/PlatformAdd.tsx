import { useEffect, useState } from 'react';
import { createInputChangeHandler } from '@/utils/handleInputChange';


export default function PlatformAdd({
  onClose,
  onSubmit,
  onSuccess,
}: {
  onClose: () => void;
  onSubmit: (subject: string, platformData: { platformName: string }) => Promise<void>;
  onSuccess?: () => void; 
  
}) {

  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [form, setForm] = useState({
    platformName: '',
  
  });

  
  const handleChange = createInputChangeHandler(setForm, setImagePreview);

  const handleSubmit = async () => {
    const platformData = {
      platformName: form.platformName,
    };

    try {
      await onSubmit("Platform", platformData);  // Directly pass JSON object
      onClose();      
      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit platform:', err);
    }
  };

   

  return (
    <div className="bg-green-50 w-full shadow-md rounded-lg p-6 max-w-lg md:max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Add New Platform</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="platformName"
          placeholder="Platform Name"
          value={form.platformName}
          onChange={handleChange}
          className="input-text"
          required
        />

        
        
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