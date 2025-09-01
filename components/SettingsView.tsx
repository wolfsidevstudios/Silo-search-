
import React from 'react';
import { XIcon } from './icons';

interface SettingsViewProps {
  onClose: () => void;
  isMusicPlayerVisible: boolean;
  onToggleMusicPlayer: () => void;
}

const ToggleSwitch: React.FC<{ checked: boolean; onChange: () => void }> = ({ checked, onChange }) => {
  return (
    <button
      onClick={onChange}
      role="switch"
      aria-checked={checked}
      className={`${
        checked ? 'bg-indigo-600' : 'bg-gray-200'
      } relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2`}
    >
      <span
        aria-hidden="true"
        className={`${
          checked ? 'translate-x-5' : 'translate-x-0'
        } pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out`}
      />
    </button>
  );
};

const SettingsView: React.FC<SettingsViewProps> = ({ onClose, isMusicPlayerVisible, onToggleMusicPlayer }) => {
  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-300"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-xl w-full max-w-md relative zoom-in-95 duration-300 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-2xl font-bold text-gray-800">Settings</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800">
            <XIcon className="w-5 h-5" />
          </button>
        </div>

        <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                <div>
                    <h4 className="font-semibold text-gray-700">Relaxing Music Player</h4>
                    <p className="text-sm text-gray-500">Show the draggable music widget.</p>
                </div>
                <ToggleSwitch checked={isMusicPlayerVisible} onChange={onToggleMusicPlayer} />
            </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsView;
