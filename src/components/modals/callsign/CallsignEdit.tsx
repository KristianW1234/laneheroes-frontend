import { useEffect, useState } from 'react';
import { Callsign } from '@/types/callsign';
import { createInputChangeHandler } from '@/utils/handleInputChange';


export default function CallsignEdit({
  callsign,
  onClose,
  onSubmit,
  onSuccess,
}: {
  callsign: Callsign;
  onClose: () => void;
  onSubmit: (callsignData: { callsign: string, callsignPlural: string }) => Promise<void>;
  onSuccess?: () => void;

}) {

  
  const [form, setForm] = useState({
    callsign: callsign.callsign || '',
    callsignPlural: callsign.callsignPlural || '',
  });

  const [imagePreview, setImagePreview] = useState<string | null>(null);
  
  const handleChange = createInputChangeHandler(setForm, setImagePreview);

  const handleSubmit = async () => {
    const callsignData = {
      id: callsign.id,  // Include ID for updates
      callsign: form.callsign,
      callsignPlural: form.callsignPlural,
    };

    try {
      console.log("Submitting callsign data:", callsignData);
      await onSubmit(callsignData);  // Directly pass JSON object
      onClose();
      onSuccess?.();
    } catch (err) {
      console.error('Failed to submit callsign:', err);
    }
  };

   

  return (
    <div className="bg-green-50 w-full shadow-md rounded-lg p-6 max-w-lg md:max-w-4xl">
      <h2 className="text-2xl font-bold mb-4">Edit Callsign</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        <input
          type="text"
          name="callsign"
          placeholder="Callsign Name"
          value={form.callsign}
          onChange={handleChange}
          className="input-text"
          required
        />

        <input
          type="text"
          name="callsignPlural"
          placeholder="Plural Form"
          value={form.callsignPlural}
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