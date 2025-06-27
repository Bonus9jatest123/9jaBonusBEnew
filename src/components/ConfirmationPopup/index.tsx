import React from 'react';

interface ConfirmationPopupProps {
  saving: boolean;
  onYes: () => void;
  onNo: () => void;
  message: string;
}

const ConfirmationPopup = ({ saving, onYes, onNo, message = 'Do you want to permanently Delete this offer?' }: ConfirmationPopupProps) => {
  return (
    <div className="delete-container">
      <div className="delete-container-heading">{message}</div>
      <div className="delete-container-button">
        <button className="confirm-button" onClick={onYes} style={{ pointerEvents: saving ? 'none' : 'all' }}>
          {!saving ? 'Yes' : <img className="save-loader" src="/images/loading.gif" alt="" />}
        </button>
        <button className="non-confirm-button" onClick={onNo}>
          No
        </button>
      </div>
    </div>
  );
};

export default ConfirmationPopup;
