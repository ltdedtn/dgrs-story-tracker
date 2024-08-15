import React, { useState } from "react";
import { Role } from "../../models/User";

interface RoleChangeModalProps {
  isOpen: boolean;
  onClose: () => void;
  roles: Role[];
  onRoleChange: (roleId: number) => void;
}

const RoleChangeModal: React.FC<RoleChangeModalProps> = ({
  isOpen,
  onClose,
  roles,
  onRoleChange,
}) => {
  const [selectedRole, setSelectedRole] = useState<number | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = () => {
    if (selectedRole !== null) {
      onRoleChange(selectedRole);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="modal modal-open">
        <div className="modal-box">
          <h2 className="text-lg font-bold">Change Role</h2>
          <div className="my-4">
            <label htmlFor="roleSelect" className="block text-sm">
              Select Role
            </label>
            <select
              id="roleSelect"
              className="select select-bordered w-full mt-2"
              onChange={(e) => setSelectedRole(Number(e.target.value))}
              value={selectedRole ?? ""}
            >
              <option value="" disabled>
                Select a role
              </option>
              {roles.map((role) => (
                <option key={role.roleId} value={role.roleId}>
                  {role.roleName}
                </option>
              ))}
            </select>
          </div>
          <div className="modal-action">
            <button className="btn btn-error" onClick={onClose}>
              Cancel
            </button>
            <button className="btn btn-primary" onClick={handleRoleChange}>
              Change
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
