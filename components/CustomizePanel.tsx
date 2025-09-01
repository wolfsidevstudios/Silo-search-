
import React, { useRef } from 'react';
import { XIcon } from './icons';
import type { CustomizationSettings, InputSize, InputShape, InputTheme } from '../types';

interface CustomizePanelProps {
  isOpen: boolean;
  onClose: () => void;
  settings: CustomizationSettings;
  onSettingsChange: (newSettings: Partial<CustomizationSettings>) => void;
}

const CustomizePanel: React.FC<CustomizePanelProps> = ({ isOpen, onClose, settings, onSettingsChange }) => {
  const backgroundInputRef = useRef<HTMLInputElement>(null);

  const handleBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onSettingsChange({ backgroundUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const RadioGroup = <T extends string>({ label, options, selected, onChange }: { label: string, options: { value: T, label: string }[], selected: T, onChange: (value: T) => void }) => (
    <div>
      <label className="block text-sm font-medium text-gray-600 mb-2">{label}</label>
      <div className="flex flex-wrap gap-2">
        {options.map(option => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`px-3 py-1.5 rounded-full text-sm font-semibold transition-colors ${selected === option.value ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-700'}`}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div 
      className={`fixed inset-0 bg-black/30 z-50 transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}
      onClick={onClose}
      aria-hidden={!isOpen}
    >
      <div
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="customize-panel-title"
      >
        <div className="flex flex-col h-full">
          <header className="flex items-center justify-between p-4 border-b border-gray-200 flex-shrink-0">
            <h2 id="customize-panel-title" className="text-xl font-bold text-gray-800">Customize</h2>
            <button onClick={onClose} className="p-2 rounded-full hover:bg-gray-100 text-gray-500 hover:text-gray-800 transition-colors" aria-label="Close customization panel">
              <XIcon className="w-5 h-5" />
            </button>
          </header>

          <div className="flex-grow p-6 overflow-y-auto space-y-8">
            {/* Background Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Background</h3>
              <input
                type="file"
                ref={backgroundInputRef}
                onChange={handleBackgroundChange}
                className="hidden"
                accept="image/*"
              />
              <button
                onClick={() => backgroundInputRef.current?.click()}
                className="w-full text-center bg-indigo-50 text-indigo-700 font-semibold px-4 py-2 rounded-lg hover:bg-indigo-100 transition-colors"
              >
                Upload new background
              </button>
            </div>
            
            <div className="border-t border-gray-200"></div>

            {/* Input Box Section */}
            <div>
                <h3 className="text-lg font-semibold text-gray-700 mb-4">Search Box</h3>
                <div className="space-y-6">
                    <RadioGroup
                        label="Size"
                        options={[
                            { value: 'large', label: 'Large' },
                            { value: 'thin', label: 'Thin' },
                        ]}
                        selected={settings.inputSize}
                        onChange={(value) => onSettingsChange({ inputSize: value as InputSize })}
                    />
                     <RadioGroup
                        label="Shape"
                        options={[
                            { value: 'rounded', label: 'Curved Edge' },
                            { value: 'pill', label: 'Pill Shaped' },
                        ]}
                        selected={settings.inputShape}
                        onChange={(value) => onSettingsChange({ inputShape: value as InputShape })}
                    />
                     <RadioGroup
                        label="Theme"
                        options={[
                            { value: 'white', label: 'White' },
                            { value: 'transparent', label: 'Transparent' },
                            { value: 'black', label: 'Black' },
                            { value: 'lightGrey', label: 'Light Grey' },
                        ]}
                        selected={settings.inputTheme}
                        onChange={(value) => onSettingsChange({ inputTheme: value as InputTheme })}
                    />
                </div>
            </div>

             <div className="border-t border-gray-200"></div>
            
            {/* Language Section */}
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">Language</h3>
              <select 
                value={settings.language}
                onChange={(e) => onSettingsChange({ language: e.target.value })}
                className="w-full bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2.5"
                aria-label="Select language"
              >
                <option value="en">English</option>
                <option value="es" disabled>Español (coming soon)</option>
                <option value="fr" disabled>Français (coming soon)</option>
              </select>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomizePanel;
