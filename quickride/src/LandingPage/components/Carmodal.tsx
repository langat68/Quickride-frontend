import { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import "../Styling/Carmodal.scss"
interface Car {
  id?: number;
  name: string;
  category: string;
  pricePerDay: string;
  seats: number;
  fuelType: string;
  transmission: string;
  description: string | null; 
  imageUrl: string;
  location: string;
  isAvailable: boolean;
  createdAt?: string;
  updatedAt?: string;
}
interface CarModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: 'create' | 'edit' | 'view' | 'delete';
  car?: Car;
  onSave: (carData: Partial<Car>) => Promise<void>;
  onDelete: (carId: number) => Promise<void>;
}

const CarModal: React.FC<CarModalProps> = ({
  isOpen,
  onClose,
  mode,
  car,
  onSave,
  onDelete
}) => {
  const [formData, setFormData] = useState<Partial<Car>>({
    name: '',
    category: '',
    pricePerDay: '',
    seats: 1,
    fuelType: '',
    transmission: '',
    description: '',
    imageUrl: '',
    location: '',
    isAvailable: true
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (car && (mode === 'edit' || mode === 'view')) {
      setFormData(car);
    } else if (mode === 'create') {
      setFormData({
        name: '',
        category: '',
        pricePerDay: '',
        seats: 1,
        fuelType: '',
        transmission: '',
        description: '',
        imageUrl: '',
        location: '',
        isAvailable: true
      });
    }
    setErrors({});
  }, [car, mode, isOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked :
              type === 'number' ? Number(value) : value
    }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name?.trim()) newErrors.name = 'Name is required';
    if (!formData.category?.trim()) newErrors.category = 'Category is required';
    if (!formData.pricePerDay || Number(formData.pricePerDay) <= 0) {
      newErrors.pricePerDay = 'Price per day must be a positive number';
    }
    if (!formData.seats || formData.seats <= 0) {
      newErrors.seats = 'Seats must be a positive number';
    }
    if (!formData.fuelType?.trim()) newErrors.fuelType = 'Fuel type is required';
    if (!formData.transmission?.trim()) newErrors.transmission = 'Transmission is required';
    if (!formData.imageUrl?.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    } else if (!/^https?:\/\/.+/.test(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid URL';
    }
    if (!formData.location?.trim()) newErrors.location = 'Location is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (mode === 'view') return;
    
    if (mode !== 'delete' && !validateForm()) return;

    setLoading(true);
    try {
      if (mode === 'delete' && car?.id) {
        await onDelete(car.id);
      } else {
        await onSave(formData);
      }
      onClose();
    } catch (error) {
      console.error('Error saving car:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  const getModalTitle = () => {
    switch (mode) {
      case 'create': return 'Add New Car';
      case 'edit': return 'Edit Car';
      case 'view': return 'Car Details';
      case 'delete': return 'Delete Car';
      default: return 'Car';
    }
  };

  const isReadOnly = mode === 'view';

  return (
    <div className="modal-overlay">
      <div className="modal-container">
        <div className="modal-header">
          <h2>{getModalTitle()}</h2>
          <button onClick={onClose} className="close-button">
            <X size={24} />
          </button>
        </div>

        <div className="modal-content">
          {mode === 'delete' ? (
            <div className="delete-confirmation">
              <p>Are you sure you want to delete <strong>{car?.name}</strong>?</p>
              <p>This action cannot be undone.</p>
              <div className="modal-actions">
                <button onClick={onClose} className="cancel-button">
                  Cancel
                </button>
                <button 
                  onClick={handleSubmit} 
                  className="delete-button"
                  disabled={loading}
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="form-grid">
                <div className="form-group">
                  <label htmlFor="name">Car Name *</label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={errors.name ? 'error' : ''}
                  />
                  {errors.name && <span className="error-message">{errors.name}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="category">Category *</label>
                  <input
                    type="text"
                    id="category"
                    name="category"
                    value={formData.category || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={errors.category ? 'error' : ''}
                  />
                  {errors.category && <span className="error-message">{errors.category}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="pricePerDay">Price per Day (KSh) *</label>
                  <input
                    type="number"
                    id="pricePerDay"
                    name="pricePerDay"
                    value={formData.pricePerDay || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    min="0"
                    step="0.01"
                    className={errors.pricePerDay ? 'error' : ''}
                  />
                  {errors.pricePerDay && <span className="error-message">{errors.pricePerDay}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="seats">Number of Seats *</label>
                  <input
                    type="number"
                    id="seats"
                    name="seats"
                    value={formData.seats || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    min="1"
                    className={errors.seats ? 'error' : ''}
                  />
                  {errors.seats && <span className="error-message">{errors.seats}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="fuelType">Fuel Type *</label>
                  <select
                    id="fuelType"
                    name="fuelType"
                    value={formData.fuelType || ''}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className={errors.fuelType ? 'error' : ''}
                  >
                    <option value="">Select fuel type</option>
                    <option value="Petrol">Petrol</option>
                    <option value="Diesel">Diesel</option>
                    <option value="Hybrid">Hybrid</option>
                    <option value="Electric">Electric</option>
                  </select>
                  {errors.fuelType && <span className="error-message">{errors.fuelType}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="transmission">Transmission *</label>
                  <select
                    id="transmission"
                    name="transmission"
                    value={formData.transmission || ''}
                    onChange={handleInputChange}
                    disabled={isReadOnly}
                    className={errors.transmission ? 'error' : ''}
                  >
                    <option value="">Select transmission</option>
                    <option value="Manual">Manual</option>
                    <option value="Automatic">Automatic</option>
                  </select>
                  {errors.transmission && <span className="error-message">{errors.transmission}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="location">Location *</label>
                  <input
                    type="text"
                    id="location"
                    name="location"
                    value={formData.location || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={errors.location ? 'error' : ''}
                  />
                  {errors.location && <span className="error-message">{errors.location}</span>}
                </div>

                <div className="form-group">
                  <label htmlFor="imageUrl">Image URL *</label>
                  <input
                    type="url"
                    id="imageUrl"
                    name="imageUrl"
                    value={formData.imageUrl || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    className={errors.imageUrl ? 'error' : ''}
                  />
                  {errors.imageUrl && <span className="error-message">{errors.imageUrl}</span>}
                </div>

                <div className="form-group full-width">
                  <label htmlFor="description">Description</label>
                  <textarea
                    id="description"
                    name="description"
                    value={formData.description || ''}
                    onChange={handleInputChange}
                    readOnly={isReadOnly}
                    rows={3}
                  />
                </div>

                <div className="form-group checkbox-group">
                  <label>
                    <input
                      type="checkbox"
                      name="isAvailable"
                      checked={formData.isAvailable || false}
                      onChange={handleInputChange}
                      disabled={isReadOnly}
                    />
                    Available for rent
                  </label>
                </div>
              </div>

              {!isReadOnly && (
                <div className="modal-actions">
                  <button type="button" onClick={onClose} className="cancel-button">
                    Cancel
                  </button>
                  <button type="submit" className="save-button" disabled={loading}>
                    {loading ? 'Saving...' : mode === 'create' ? 'Create Car' : 'Update Car'}
                  </button>
                </div>
              )}

              {isReadOnly && (
                <div className="modal-actions">
                  <button type="button" onClick={onClose} className="cancel-button">
                    Close
                  </button>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default CarModal;