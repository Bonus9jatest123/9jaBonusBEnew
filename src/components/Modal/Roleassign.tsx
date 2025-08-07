import React,{useEffect} from 'react';
import './RoleAssign.css';
import { toast } from 'react-toastify';

interface RoleAssignProps {
  showModal: boolean;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
  onAssign: (permissions: string[]) => void;
  availablePermissions: string[];
   defaultSelected: string[]; // ✅ Add this
}

const RoleAssign: React.FC<RoleAssignProps> = ({
  showModal,
  setShowModal,
  onAssign,
  availablePermissions,
  defaultSelected = []
}) => {
  const [selected, setSelected] = React.useState<string[]>(defaultSelected || []);

  const handleChange = (permission: string) => {
    setSelected(prev =>
      prev.includes(permission)
        ? prev.filter(p => p !== permission)
        : [...prev, permission]
    );
  };
  useEffect(() => {
  if (showModal) {
    setSelected(defaultSelected || []);
  }
}, [showModal, defaultSelected]);
console.log('Selected Permissions:', selected);
  const handleAssign = () => {
    // if (selected.length === 0) {
    //   toast.error('Please select at least one permission');
    // }
    // else {
      
      
    // }
onAssign(selected);
  };

  if (!showModal) return null;

  return (
    <div className="custom-modal-backdrop">
      <div className="custom-modal">
        <h3 className="custom-modal-title">Assign Permissions</h3>
        <div className="custom-modal-body">
          {availablePermissions.map(permission => (
            <label key={permission} className="checkbox-label">
              <input
                type="checkbox"
                checked={selected.includes(permission)}
                onChange={() => handleChange(permission)}
              />
              {permission}
            </label>
          ))}
        </div>
        <div className="custom-modal-footer">
          <button className="btn cancel" onClick={() => setShowModal(false)}>Cancel</button>
          <button className="btn assign" onClick={handleAssign}>Assign</button>
        </div>
      </div>
    </div>
  );
};

export default RoleAssign;
