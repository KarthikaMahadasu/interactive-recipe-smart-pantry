import React, { useState, useRef, useEffect } from 'react';
import { Camera, RefreshCw, CheckCircle, AlertCircle, X, Upload, Sparkles, Plus, Edit3, Layers } from 'lucide-react';
import type { Ingredient, IngredientCategory, FreshnessLevel } from '../../../../types/ingredient';
import { usePantry } from '../../../../hooks/usePantry';
import { useAuth } from '../../../../contexts/AuthContext';
import { ImageDetectionService, type DetectionResult } from '../services/imageDetectionService';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type CameraStep = 'preview' | 'captured' | 'analyzing' | 'detected' | 'confirmation';

const COMMON_UNITS = ['kg', 'g', 'mg', 'L', 'ml', 'pcs', 'pack', 'bottle', 'cup', 'tbsp', 'tsp'];

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({ isOpen, onClose }) => {
  const { pantry, addIngredient, updateIngredient } = usePantry();
  const { user, restaurant } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const [step, setStep] = useState<CameraStep>('preview');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [detectionResult, setDetectionResult] = useState<DetectionResult | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Form confirmation state
  const [itemName, setItemName] = useState('');
  const [isEditingName, setIsEditingName] = useState(false);
  const [quantity, setQuantity] = useState<string>('5');
  const [unit, setUnit] = useState('kg');
  const [category, setCategory] = useState<IngredientCategory>('produce');
  const [expiryDate, setExpiryDate] = useState('');
  const [notes, setNotes] = useState('');

  // Start Camera Stream
  const startCamera = async () => {
    setCameraError(null);
    try {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment', width: { ideal: 1280 }, height: { ideal: 720 } }
        });
        setStream(mediaStream);
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream;
        }
      } else {
        setCameraError('Camera API is not supported on this browser or device.');
      }
    } catch (err: any) {
      console.warn('Camera access error:', err);
      setCameraError('Camera access was denied or unavailable. You can upload an image file instead.');
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('preview');
      setCapturedImage(null);
      setDetectionResult(null);
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen]);

  if (!isOpen) return null;

  // Capture frame from video feed onto canvas
  const handleCapturePhoto = () => {
    if (!videoRef.current || !canvasRef.current) return;
    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth || 640;
    canvas.height = video.videoHeight || 480;

    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
      const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
      setCapturedImage(dataUrl);
      setStep('captured');
      stopCamera();
    }
  };

  // File upload fallback handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setCapturedImage(event.target.result as string);
        setStep('captured');
        stopCamera();
      }
    };
    reader.readAsDataURL(file);
  };

  // Process Captured Image using ImageDetectionService
  const handleProcessImage = async () => {
    if (!capturedImage) return;
    setStep('analyzing');

    try {
      const result = await ImageDetectionService.detectInventoryItemFromImage(capturedImage);
      setDetectionResult(result);
      setItemName(result.name);
      setCategory(result.category);
      setQuantity(result.suggestedQuantity.toString());
      setUnit(result.suggestedUnit);
      setStep('detected');
    } catch (err: any) {
      setCameraError('Object detection failed. Please enter item details manually.');
      setItemName('Stock Item');
      setStep('confirmation');
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    setDetectionResult(null);
    setStep('preview');
    startCamera();
  };

  // Check if detected item already exists in current restaurant inventory
  const existingItem = pantry.find(
    (p) => p.name.toLowerCase() === itemName.trim().toLowerCase()
  );

  const numIncomingQty = parseFloat(quantity) || 0;
  const combinedTotalQty = existingItem
    ? Math.round((existingItem.quantity + numIncomingQty) * 100) / 100
    : numIncomingQty;

  // Final confirmation: Save or merge stock item
  const handleFinalSave = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmedName = itemName.trim();
    if (!trimmedName) return;

    let freshness: FreshnessLevel = 'fresh';
    if (expiryDate) {
      const exp = new Date(expiryDate).getTime();
      const now = new Date().getTime();
      const daysLeft = (exp - now) / (1000 * 60 * 60 * 24);
      if (daysLeft < 0) freshness = 'critical';
      else if (daysLeft <= 3) freshness = 'expiring_soon';
    }

    if (existingItem) {
      // Merge into existing restaurant stock
      updateIngredient({
        ...existingItem,
        quantity: combinedTotalQty,
        freshness: freshness === 'fresh' ? existingItem.freshness : freshness,
        updatedBy: user?.name || 'Staff Member',
        updatedAt: new Date().toISOString()
      });
    } else {
      // Create new restaurant stock item
      const newIng: Ingredient = {
        id: `ing_cam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
        restaurantId: restaurant?.id,
        name: trimmedName,
        quantity: numIncomingQty,
        unit,
        category,
        freshness,
        colorCode: '#06b6d4',
        expiresAt: expiryDate || undefined,
        notes: notes.trim() || `Added via Camera Scanner by ${user?.name || 'Staff'}`,
        createdAt: new Date().toISOString(),
        createdBy: user?.name || 'Staff Member'
      };
      addIngredient(newIng);
    }

    stopCamera();
    onClose();
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(8, 12, 20, 0.92)',
        backdropFilter: 'blur(12px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '16px'
      }}
      onClick={onClose}
    >
      <div
        className="glass-panel"
        onClick={(e) => e.stopPropagation()}
        style={{
          width: '100%',
          maxWidth: '560px',
          padding: '28px',
          borderRadius: '28px',
          background: '#ffffff',
          border: '1.5px solid #cbd5e1',
          boxShadow: '0 20px 50px rgba(15, 23, 42, 0.15)',
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: 40,
                height: 40,
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 16px rgba(6, 182, 212, 0.4)'
              }}
            >
              <Camera size={22} color="#000" />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)', fontFamily: 'var(--font-heading)' }}>
                Camera Inventory Scanner
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                Workspace: <strong style={{ color: '#fff' }}>{restaurant?.name}</strong>
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            style={{ background: 'transparent', color: 'var(--text-dim)', cursor: 'pointer', padding: 4 }}
          >
            <X size={22} />
          </button>
        </div>

        {/* STEP 1: LIVE CAMERA PREVIEW */}
        {step === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '320px',
                borderRadius: '20px',
                background: '#000',
                overflow: 'hidden',
                border: '2px dashed rgba(6, 182, 212, 0.4)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <canvas ref={canvasRef} style={{ display: 'none' }} />

              {/* Scanning Target Overlay */}
              <div
                style={{
                  position: 'absolute',
                  inset: '40px',
                  border: '2px solid rgba(6, 182, 212, 0.7)',
                  borderRadius: '16px',
                  boxShadow: '0 0 20px rgba(6, 182, 212, 0.3)',
                  pointerEvents: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div style={{ fontSize: '0.78rem', color: 'rgba(255, 255, 255, 0.8)', background: 'rgba(0,0,0,0.6)', padding: '4px 12px', borderRadius: '12px' }}>
                  Position ingredient in frame
                </div>
              </div>
            </div>

            {/* Camera Error / Fallback Notice */}
            {cameraError && (
              <div
                style={{
                  padding: '12px 16px',
                  borderRadius: '14px',
                  background: 'rgba(245, 158, 11, 0.15)',
                  border: '1px solid rgba(245, 158, 11, 0.4)',
                  color: '#fcd34d',
                  fontSize: '0.82rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                <AlertCircle size={18} />
                <span>{cameraError}</span>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
              <label
                style={{
                  flex: 1,
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <Upload size={18} />
                <span>Upload Image</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>

              <button
                onClick={handleCapturePhoto}
                style={{
                  flex: 2,
                  padding: '14px',
                  borderRadius: '16px',
                  background: 'linear-gradient(135deg, #06b6d4 0%, #10b981 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.95rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(6, 182, 212, 0.4)'
                }}
              >
                <Camera size={20} />
                <span>TAKE PHOTO</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: CAPTURED IMAGE REVIEW */}
        {step === 'captured' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                width: '100%',
                height: '300px',
                borderRadius: '20px',
                overflow: 'hidden',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                background: '#000'
              }}
            >
              {capturedImage && (
                <img src={capturedImage} alt="Captured Stock" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              )}
            </div>

            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleRetake}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: 'var(--text-main)',
                  fontWeight: 600,
                  fontSize: '0.88rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  cursor: 'pointer'
                }}
              >
                <RefreshCw size={16} />
                <span>RETAKE</span>
              </button>

              <button
                onClick={handleProcessImage}
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #06b6d4 100%)',
                  color: '#fff',
                  fontWeight: 700,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  boxShadow: '0 4px 16px rgba(139, 92, 246, 0.4)'
                }}
              >
                <Sparkles size={18} />
                <span>PROCESS IMAGE</span>
              </button>
            </div>
          </div>
        )}

        {/* STEP 3: AI ANALYZING STATE */}
        {step === 'analyzing' && (
          <div style={{ padding: '48px 24px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <Sparkles size={48} className="spin-slow" color="var(--primary-cyan)" />
            <h4 style={{ fontSize: '1.2rem', color: '#fff' }}>Analyzing Ingredient Image...</h4>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
              Matching visual descriptors against restaurant inventory catalog
            </p>
          </div>
        )}

        {/* STEP 4 & 5: DETECTION RESULT & CONFIRMATION FORM */}
        {(step === 'detected' || step === 'confirmation') && (
          <form onSubmit={handleFinalSave} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
            {/* Detection Result Card */}
            {detectionResult && (
              <div
                style={{
                  padding: '16px 20px',
                  borderRadius: '20px',
                  background: 'rgba(6, 182, 212, 0.12)',
                  border: '1px solid rgba(6, 182, 212, 0.3)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px'
                }}
              >
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary-cyan)', textTransform: 'uppercase' }}>
                    Detected Ingredient Object
                  </div>
                  <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#fff', marginTop: '2px' }}>
                    {itemName}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '2px' }}>
                    Confidence Level: <strong style={{ color: '#34d399' }}>{detectionResult.confidence}</strong>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setIsEditingName(!isEditingName)}
                  style={{
                    padding: '6px 12px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.2)',
                    color: '#fff',
                    fontSize: '0.78rem',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <Edit3 size={14} /> {isEditingName ? 'Done' : 'Edit Name'}
                </button>
              </div>
            )}

            {/* Editable Name Field */}
            {isEditingName && (
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Item Name (Correct if needed)
                </label>
                <input
                  type="text"
                  required
                  value={itemName}
                  onChange={(e) => setItemName(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.8)',
                    border: '1px solid rgba(6, 182, 212, 0.4)',
                    color: '#fff',
                    outline: 'none'
                  }}
                />
              </div>
            )}

            {/* Existing Stock vs Incoming Stock Breakdown */}
            {existingItem ? (
              <div
                style={{
                  padding: '14px 18px',
                  borderRadius: '18px',
                  background: 'rgba(139, 92, 246, 0.12)',
                  border: '1px solid rgba(139, 92, 246, 0.3)',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '8px'
                }}
              >
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#c084fc', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Layers size={14} /> Item Exists in {restaurant?.name} Inventory
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', textAlign: 'center', fontSize: '0.82rem' }}>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Existing Stock</div>
                    <div style={{ fontWeight: 800, color: '#fff' }}>{existingItem.quantity} {existingItem.unit}</div>
                  </div>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(0,0,0,0.3)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.7rem' }}>Incoming Scan</div>
                    <div style={{ fontWeight: 800, color: '#34d399' }}>+{numIncomingQty} {unit}</div>
                  </div>
                  <div style={{ padding: '8px', borderRadius: '10px', background: 'rgba(139, 92, 246, 0.25)' }}>
                    <div style={{ color: '#c084fc', fontSize: '0.7rem' }}>New Total</div>
                    <div style={{ fontWeight: 800, color: '#fff' }}>{combinedTotalQty} {existingItem.unit}</div>
                  </div>
                </div>
              </div>
            ) : (
              <div
                style={{
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(16, 185, 129, 0.12)',
                  border: '1px solid rgba(16, 185, 129, 0.3)',
                  color: '#6ee7b7',
                  fontSize: '0.8rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                <CheckCircle size={16} /> New ingredient item will be created in shared inventory.
              </div>
            )}

            {/* Quantity & Unit */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Quantity *
                </label>
                <input
                  type="number"
                  step="any"
                  min="0.1"
                  required
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.6)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                />
              </div>

              <div>
                <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                  Unit *
                </label>
                <select
                  value={unit}
                  onChange={(e) => setUnit(e.target.value)}
                  style={{
                    width: '100%',
                    marginTop: '4px',
                    padding: '10px 14px',
                    borderRadius: '12px',
                    background: 'rgba(30, 41, 59, 0.9)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    color: '#fff',
                    fontSize: '0.9rem',
                    outline: 'none'
                  }}
                >
                  {COMMON_UNITS.map((u) => (
                    <option key={u} value={u}>
                      {u}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Category */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as IngredientCategory)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              >
                <option value="produce">Produce (Fruits & Veggies)</option>
                <option value="dairy">Dairy & Plant Milks</option>
                <option value="grain">Grains & Rice</option>
                <option value="meat">Meat & Poultry</option>
                <option value="seafood">Seafood</option>
                <option value="spice">Spices & Seasonings</option>
                <option value="liquid">Oils & Liquids</option>
                <option value="canned">Canned & Preserves</option>
                <option value="bakery">Bakery</option>
                <option value="other">Other Pantry Goods</option>
              </select>
            </div>

            {/* Expiry Date */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Expiry Date (Optional)
              </label>
              <input
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Notes */}
            <div>
              <label style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                Stock Notes / Supplier Info
              </label>
              <input
                type="text"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="e.g. Batch #409, Fresh delivery"
                style={{
                  width: '100%',
                  marginTop: '4px',
                  padding: '10px 14px',
                  borderRadius: '12px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#fff',
                  fontSize: '0.9rem',
                  outline: 'none'
                }}
              />
            </div>

            {/* Confirm Actions */}
            <div style={{ display: 'flex', gap: '10px', marginTop: '10px' }}>
              <button
                type="button"
                onClick={handleRetake}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'rgba(30, 41, 59, 0.6)',
                  color: '#94a3b8',
                  fontWeight: 600,
                  fontSize: '0.85rem'
                }}
              >
                Retake
              </button>

              <button
                type="submit"
                style={{
                  flex: 2,
                  padding: '12px',
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #10b981 0%, #06b6d4 100%)',
                  color: '#000',
                  fontWeight: 800,
                  fontSize: '0.9rem',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  boxShadow: '0 4px 16px rgba(16, 185, 129, 0.4)'
                }}
              >
                <Plus size={18} />
                <span>CONFIRM & SAVE TO INVENTORY</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
