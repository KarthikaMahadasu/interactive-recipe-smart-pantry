import React, { useState, useRef, useEffect } from 'react';
import {
  Camera,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  X,
  Upload,
  Plus,
  Edit3,
  Search,
  Package,
  ShoppingCart,
  MinusCircle,
  Trash2,
  ArrowRight,
  Check,
  Scale
} from 'lucide-react';
import type { Ingredient, IngredientCategory } from '../../../../types/ingredient';
import type { SmartGroceryItem } from '../../../grocery/types/groceryTypes';
import { useKitchenState } from '../../../../state/KitchenContext';
import { useAuth } from '../../../../contexts/AuthContext';
import { ImageAnalysisService } from '../services/imageAnalysisService';
import { IngredientNormalizationService } from '../services/ingredientNormalizationService';
import { CameraInventoryService } from '../services/cameraInventoryService';
import type {
  ImageAnalysisResult,
  CameraInventoryMatch,
  CameraActionStep
} from '../types/cameraTypes';

interface CameraScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const COMMON_UNITS = ['kg', 'g', 'mg', 'L', 'ml', 'pcs', 'pack', 'bottle', 'cup', 'tbsp', 'tsp'];
const CATEGORY_OPTIONS: IngredientCategory[] = [
  'produce',
  'dairy',
  'meat',
  'seafood',
  'grain',
  'spice',
  'liquid',
  'canned',
  'bakery',
  'other'
];

const STANDARD_RESTAURANT_ITEMS = [
  'Potato',
  'Onion',
  'Tomato',
  'Rice',
  'Whole Wheat Flour',
  'Eggs',
  'Dark Chocolate',
  'Milk',
  'Fresh Paneer',
  'Organic Tofu',
  'Hass Avocado',
  'Carrot',
  'Dragon Fruit',
  'Fresh Chicken Breast',
  'Extra Virgin Olive Oil',
  'Raw Cashews',
  'Cheddar Cheese',
  'Heavy Cream',
  'Whole Wheat Bread',
  'Tomato Sauce',
  'Sea Salt',
  'Cane Sugar'
];

export const CameraScannerModal: React.FC<CameraScannerModalProps> = ({ isOpen, onClose }) => {
  const {
    state,
    setAIState,
    addIngredient,
    updateIngredient,
    recordUsage,
    recordWaste,
    addGroceryItem,
    addAIResponse
  } = useKitchenState();
  const { user, restaurant } = useAuth();

  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Modal Flow Step
  const [step, setStep] = useState<CameraActionStep>('preview');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Vision Analysis Result
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [selectedIngredientName, setSelectedIngredientName] = useState<string>('');
  const [isIngredientConfirmed, setIsIngredientConfirmed] = useState<boolean>(false);
  const [inventoryMatch, setInventoryMatch] = useState<CameraInventoryMatch | null>(null);

  // Manual Correction State
  const [isManualCorrection, setIsManualCorrection] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Dialog Form & Action State
  const [activeAction, setActiveAction] = useState<'use_stock' | 'add_stock' | 'record_waste' | 'add_inventory' | 'add_grocery' | null>(null);
  const [actionQuantity, setActionQuantity] = useState<string>('1');
  const [actionUnit, setActionUnit] = useState<string>('kg');
  const [actionCategory, setActionCategory] = useState<IngredientCategory>('produce');
  const [showConfirmation, setShowConfirmation] = useState(false);

  // Multi-item scanning support state
  const [detectedItemsList, setDetectedItemsList] = useState<ImageAnalysisResult[]>([]);
  const [selectedMultiIndex, setSelectedMultiIndex] = useState<number>(0);

  // Verification & Status Message State
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Start Camera Stream with progressive fallbacks
  const startCamera = async () => {
    setCameraError(null);
    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      setCameraError('Camera API is not supported on this browser. You can upload an image file instead.');
      return;
    }

    const constraintAttempts: MediaStreamConstraints[] = [
      { video: { facingMode: { ideal: 'environment' }, width: { ideal: 1280 }, height: { ideal: 720 } } },
      { video: { facingMode: 'environment' } },
      { video: true }
    ];

    let mediaStream: MediaStream | null = null;
    let lastErr: any = null;

    for (const constraints of constraintAttempts) {
      try {
        mediaStream = await navigator.mediaDevices.getUserMedia(constraints);
        if (mediaStream) break;
      } catch (err) {
        lastErr = err;
      }
    }

    if (mediaStream) {
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } else {
      console.warn('Camera access error:', lastErr);
      setCameraError('Camera access was denied or unavailable. You can upload an image file below.');
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach((track: MediaStreamTrack) => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen) {
      setStep('preview');
      setCapturedImage(null);
      setAnalysisResult(null);
      setSelectedIngredientName('');
      setIsIngredientConfirmed(false);
      setInventoryMatch(null);
      setIsManualCorrection(false);
      setActiveAction(null);
      setShowConfirmation(false);
      setStatusMessage(null);
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
      processImageAnalysis(dataUrl);
    }
  };

  // File upload handler
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        const dataUrl = event.target.result as string;
        setCapturedImage(dataUrl);
        setStep('captured');
        stopCamera();
        processImageAnalysis(dataUrl);
      }
    };
    reader.readAsDataURL(file);
    // Reset file input
    if (e.target) e.target.value = '';
  };

  // Run real visual image analysis pipeline
  const processImageAnalysis = async (imageData: string) => {
    setStep('analyzing');
    setAIState('working');
    setIsIngredientConfirmed(false);

    try {
      const multi = await ImageAnalysisService.detectMultipleItems(imageData);
      setDetectedItemsList(multi.items);
      setSelectedMultiIndex(0);

      const primary = multi.items[0];
      setAnalysisResult(primary);

      if (primary && primary.detectedItem && primary.confidenceLevel !== 'uncertain') {
        setSelectedIngredientName(primary.detectedItem);
        setActionUnit(primary.suggestedUnit || 'kg');
        setActionQuantity((primary.suggestedQuantity || 1).toString());
        setActionCategory(primary.category);

        // Cross-check with inventory
        const match = CameraInventoryService.checkInventoryAndGrocery(
          primary.detectedItem,
          state.pantry,
          state.groceryList
        );
        setInventoryMatch(match);
        setStep('detected');
        setAIState('success');
      } else {
        // Uncertain image recognition
        setSelectedIngredientName('');
        setInventoryMatch(null);
        setStep('detected');
        setAIState('idle');
      }
    } catch (err: any) {
      console.error('Vision analysis error:', err);
      setCameraError('Object analysis encountered an issue. You can select your item manually.');
      setStep('manual_correction');
      setAIState('error');
    }
  };

  // Switch item in multi-item scan mode
  const handleSelectMultiItem = (index: number) => {
    setSelectedMultiIndex(index);
    const item = detectedItemsList[index];
    if (item && item.detectedItem) {
      setAnalysisResult(item);
      setSelectedIngredientName(item.detectedItem);
      setIsIngredientConfirmed(false);
      setActionUnit(item.suggestedUnit || 'kg');
      setActionQuantity((item.suggestedQuantity || 1).toString());
      setActionCategory(item.category);

      const match = CameraInventoryService.checkInventoryAndGrocery(
        item.detectedItem,
        state.pantry,
        state.groceryList
      );
      setInventoryMatch(match);
    }
  };

  // Confirm predicted ingredient (Requirement 5 & 6)
  const handleConfirmIngredient = () => {
    if (!selectedIngredientName) return;
    setIsIngredientConfirmed(true);

    // Refresh inventory and grocery status for the confirmed item
    const match = CameraInventoryService.checkInventoryAndGrocery(
      selectedIngredientName,
      state.pantry,
      state.groceryList
    );
    setInventoryMatch(match);
    if (match.inventoryItem) {
      setActionUnit(match.inventoryItem.unit);
      setActionCategory(match.inventoryItem.category);
    }
  };

  // Manual Item Correction Picker Selection
  const handleSelectManualItem = (itemName: string) => {
    const norm = IngredientNormalizationService.normalize(itemName);
    if (!norm.name) return;

    setSelectedIngredientName(norm.name);
    setActionCategory(norm.category);
    setActionUnit(norm.unit);
    setActionQuantity('1');
    setIsIngredientConfirmed(true);

    const match = CameraInventoryService.checkInventoryAndGrocery(
      norm.name,
      state.pantry,
      state.groceryList
    );
    setInventoryMatch(match);
    if (match.inventoryItem) {
      setActionUnit(match.inventoryItem.unit);
      setActionCategory(match.inventoryItem.category);
    }
    setIsManualCorrection(false);
    setStep('detected');
  };

  // Open Action Dialog
  const handleOpenAction = (action: 'use_stock' | 'add_stock' | 'record_waste' | 'add_inventory' | 'add_grocery') => {
    setActiveAction(action);
    setShowConfirmation(false);
    setStatusMessage(null);

    if (inventoryMatch?.inventoryItem) {
      setActionUnit(inventoryMatch.inventoryItem.unit);
      setActionCategory(inventoryMatch.inventoryItem.category);
    }
  };

  // Execute and Verify Inventory / Grocery Update
  const handleConfirmAction = async () => {
    if (!selectedIngredientName || !activeAction) return;

    const numQty = parseFloat(actionQuantity);
    if (isNaN(numQty) || numQty <= 0) {
      alert('Please enter a valid positive quantity.');
      return;
    }

    setStep('verifying');
    setAIState('thinking');

    const trimmedName = selectedIngredientName.trim();
    const existingIng = inventoryMatch?.inventoryItem;

    try {
      await new Promise((res) => setTimeout(res, 400));

      if (activeAction === 'use_stock' && existingIng) {
        recordUsage(
          existingIng.id,
          numQty,
          actionUnit,
          `Recorded usage via Inventory Scanner by ${user?.name || 'Staff'}`
        );

        const newRemaining = Math.max(0, Math.round((existingIng.quantity - numQty) * 100) / 100);
        const successMsg = `Recorded usage of ${numQty} ${actionUnit} ${trimmedName}. Remaining stock: ${newRemaining} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_stock' && existingIng) {
        const newTotal = Math.round((existingIng.quantity + numQty) * 100) / 100;
        updateIngredient({
          ...existingIng,
          quantity: newTotal,
          notes: `Added stock via Inventory Scanner by ${user?.name || 'Staff'}`,
          updatedBy: user?.name || 'Staff',
          updatedAt: new Date().toISOString()
        });

        const successMsg = `Added ${numQty} ${actionUnit} to existing ${trimmedName} stock. Updated total stock: ${newTotal} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'record_waste' && existingIng) {
        recordWaste(
          existingIng.id,
          numQty,
          actionUnit,
          `Recorded waste via Inventory Scanner by ${user?.name || 'Staff'}`
        );

        const newRemaining = Math.max(0, Math.round((existingIng.quantity - numQty) * 100) / 100);
        const successMsg = `Recorded ${numQty} ${actionUnit} ${trimmedName} as kitchen waste. Remaining stock: ${newRemaining} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_inventory') {
        // Prevent accidental duplicates if item already exists in pantry
        const duplicateCheck = IngredientNormalizationService.findInInventory(trimmedName, state.pantry);
        if (duplicateCheck) {
          const newTotal = Math.round((duplicateCheck.quantity + numQty) * 100) / 100;
          updateIngredient({
            ...duplicateCheck,
            quantity: newTotal,
            updatedBy: user?.name || 'Staff',
            updatedAt: new Date().toISOString()
          });
          const successMsg = `${trimmedName} already existed in inventory. Updated existing stock to ${newTotal} ${duplicateCheck.unit}.`;
          setStatusMessage(successMsg);
        } else {
          const newIng: Ingredient = {
            id: `ing_cam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
            restaurantId: restaurant?.id || 'rest_spice_garden',
            name: trimmedName,
            quantity: numQty,
            unit: actionUnit,
            category: actionCategory,
            freshness: 'fresh',
            colorCode: '#ea580c',
            notes: `Added via Inventory Scanner by ${user?.name || 'Staff'}`,
            createdAt: new Date().toISOString(),
            createdBy: user?.name || 'Staff'
          };
          addIngredient(newIng);

          const successMsg = `Added ${numQty} ${actionUnit} ${trimmedName} to restaurant inventory.`;
          setStatusMessage(successMsg);
        }

        addAIResponse({
          message: `Inventory updated: ${numQty} ${actionUnit} ${trimmedName}`,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_grocery') {
        const newGItem: SmartGroceryItem = {
          id: `g_cam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId: restaurant?.id || 'rest_spice_garden',
          name: trimmedName,
          quantity: numQty,
          unit: actionUnit,
          reason: `Added via Inventory Scanner by ${user?.name || 'Staff'}`,
          priority: 'MEDIUM',
          source: 'MANUAL',
          status: 'NEEDED',
          category: actionCategory,
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'Staff'
        };
        addGroceryItem(newGItem);

        const successMsg = `Added ${numQty} ${actionUnit} ${trimmedName} to restaurant grocery restock list.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'add_grocery',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      }

      setAIState('success');
      setStep('success');
    } catch (e: any) {
      console.error('Error executing camera inventory action:', e);
      setStatusMessage('Failed to update shared restaurant state. Please try again.');
      setAIState('error');
    }
  };

  const handleResetScanner = () => {
    setCapturedImage(null);
    setAnalysisResult(null);
    setSelectedIngredientName('');
    setIsIngredientConfirmed(false);
    setInventoryMatch(null);
    setIsManualCorrection(false);
    setActiveAction(null);
    setShowConfirmation(false);
    setStatusMessage(null);
    setStep('preview');
    startCamera();
  };

  const filteredStandardItems = STANDARD_RESTAURANT_ITEMS.filter((item) =>
    item.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 110,
        background: 'rgba(15, 23, 42, 0.70)',
        backdropFilter: 'blur(10px)',
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
          maxWidth: '640px',
          padding: '26px',
          borderRadius: '24px',
          background: '#ffffff',
          border: '1.5px solid #fed7aa',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.2), 0 4px 16px rgba(234, 88, 12, 0.08)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxHeight: '92vh',
          overflowY: 'auto',
          color: '#0f172a'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderBottom: '1px solid #f1f5f9', paddingBottom: '14px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div
              style={{
                width: '42px',
                height: '42px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #ea580c, #f97316)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
              }}
            >
              <Camera size={22} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a', letterSpacing: '-0.02em' }}>
                Restaurant Inventory Scanner
              </h2>
              <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                Visual Food Classifier & Shared Inventory Verification
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Close Scanner"
            style={{
              background: '#f1f5f9',
              border: 'none',
              borderRadius: '10px',
              width: '34px',
              height: '34px',
              color: '#64748b',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.15s ease'
            }}
          >
            <X size={18} />
          </button>
        </div>

        {/* STEP 1: CAMERA PREVIEW & CAPTURE / UPLOAD */}
        {step === 'preview' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div
              style={{
                position: 'relative',
                width: '100%',
                height: '300px',
                borderRadius: '18px',
                background: '#090d16',
                overflow: 'hidden',
                border: '1px solid #e2e8f0',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cameraError ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#dc2626', maxWidth: '420px' }}>
                  <AlertTriangle size={36} style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.9rem', margin: 0, fontWeight: 500 }}>{cameraError}</p>
                </div>
              ) : (
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              )}

              {/* Viewfinder overlay */}
              {!cameraError && (
                <div
                  style={{
                    position: 'absolute',
                    inset: '24px',
                    border: '2px dashed rgba(234, 88, 12, 0.7)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(15, 23, 42, 0.85)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      color: '#fed7aa',
                      fontWeight: 600,
                      backdropFilter: 'blur(4px)'
                    }}
                  >
                    Center ingredient in frame
                  </span>
                </div>
              )}
            </div>

            <canvas ref={canvasRef} style={{ display: 'none' }} />

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              {!cameraError && (
                <button
                  onClick={handleCapturePhoto}
                  style={{
                    flex: 1,
                    padding: '13px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #ea580c, #f97316)',
                    color: '#ffffff',
                    border: 'none',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.94rem',
                    boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                  }}
                >
                  <Camera size={18} /> Take Photo
                </button>
              )}

              <button
                onClick={() => fileInputRef.current?.click()}
                style={{
                  flex: cameraError ? 1 : undefined,
                  padding: '13px 22px',
                  borderRadius: '14px',
                  background: '#f8fafc',
                  color: '#0f172a',
                  border: '1.5px solid #cbd5e1',
                  fontWeight: 700,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.94rem'
                }}
              >
                <Upload size={18} style={{ color: '#ea580c' }} /> Upload Photo
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                style={{ display: 'none' }}
              />
            </div>
          </div>
        )}

        {/* STEP 2: ANALYZING SPINNER */}
        {step === 'analyzing' && (
          <div
            style={{
              padding: '60px 20px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px'
            }}
          >
            <RefreshCw size={42} className="spin-animation" style={{ color: '#ea580c' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Analyzing Ingredient...
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                Extracting pixel feature descriptors & chromaticity matrix
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: DETECTION RESULT SCREEN */}
        {step === 'detected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Captured Image Preview Bar */}
            {capturedImage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '14px',
                  background: '#f8fafc',
                  padding: '12px 16px',
                  borderRadius: '16px',
                  border: '1px solid #e2e8f0'
                }}
              >
                <img
                  src={capturedImage}
                  alt="Scanned photo preview"
                  style={{
                    width: '64px',
                    height: '64px',
                    objectFit: 'cover',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1'
                  }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.72rem', color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.06em', fontWeight: 700 }}>
                    Uploaded Photo
                  </span>
                  <div style={{ fontSize: '0.88rem', color: '#ea580c', fontWeight: 700 }}>
                    {analysisResult?.ocrResult ? 'Verified Packaging Label OCR' : 'Visual Food Classification'}
                  </div>
                </div>

                {/* Retake & Upload Another Photo Controls */}
                <div style={{ display: 'flex', gap: '8px' }}>
                  <button
                    onClick={handleResetScanner}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#334155',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <RefreshCw size={14} /> Retake
                  </button>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      background: '#ffffff',
                      border: '1.5px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '6px 12px',
                      color: '#334155',
                      cursor: 'pointer',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Upload size={14} /> Upload Another
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    style={{ display: 'none' }}
                  />
                </div>
              </div>
            )}

            {/* Multi-Item Candidate Switcher Tabs */}
            {detectedItemsList.length > 1 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 700 }}>Detected Candidates:</span>
                {detectedItemsList.map((item: ImageAnalysisResult, idx: number) => (
                  <button
                    key={idx}
                    onClick={() => handleSelectMultiItem(idx)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '14px',
                      fontSize: '0.8rem',
                      fontWeight: 700,
                      cursor: 'pointer',
                      background: selectedMultiIndex === idx ? 'linear-gradient(135deg, #ea580c, #f97316)' : '#f1f5f9',
                      color: selectedMultiIndex === idx ? '#ffffff' : '#334155',
                      border: 'none',
                      whiteSpace: 'nowrap'
                    }}
                  >
                    {item.detectedItem || 'Unknown'}
                  </button>
                ))}
              </div>
            )}

            {/* CASE A: UNCERTAIN RECOGNITION (Requirement 4) */}
            {(!selectedIngredientName || analysisResult?.confidenceLevel === 'uncertain') && !isManualCorrection && (
              <div
                style={{
                  background: '#fff1f2',
                  border: '1.5px solid #fecdd3',
                  padding: '20px',
                  borderRadius: '18px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '14px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#e11d48' }}>
                  <AlertTriangle size={24} />
                  <span style={{ fontWeight: 800, fontSize: '1.05rem' }}>
                    Ingredient not confidently identified
                  </span>
                </div>
                <p style={{ fontSize: '0.88rem', color: '#475569', margin: 0, lineHeight: 1.5 }}>
                  The visual classifier feature distance is below high-confidence thresholds. To avoid incorrect stock records, please select the correct kitchen ingredient manually below.
                </p>

                {analysisResult?.alternatives && analysisResult.alternatives.length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.8rem', color: '#64748b', fontWeight: 700 }}>
                      Suggested kitchen ingredients:
                    </span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '8px' }}>
                      {analysisResult.alternatives.map((alt: string) => (
                        <button
                          key={alt}
                          onClick={() => handleSelectManualItem(alt)}
                          style={{
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            padding: '7px 14px',
                            borderRadius: '20px',
                            color: '#0f172a',
                            fontSize: '0.85rem',
                            fontWeight: 600,
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Check size={14} style={{ color: '#ea580c' }} /> {alt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    onClick={() => setIsManualCorrection(true)}
                    style={{
                      flex: 1,
                      padding: '12px',
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #ea580c, #f97316)',
                      color: '#ffffff',
                      border: 'none',
                      fontSize: '0.9rem',
                      fontWeight: 700,
                      cursor: 'pointer'
                    }}
                  >
                    Choose Item Manually
                  </button>
                </div>
              </div>
            )}

            {/* CASE B: PREDICTED INGREDIENT - REQUIRE USER CONFIRMATION (Requirement 5) */}
            {selectedIngredientName && analysisResult?.confidenceLevel !== 'uncertain' && !isIngredientConfirmed && !isManualCorrection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                <div
                  style={{
                    background: '#fff7ed',
                    border: '1.5px solid #fed7aa',
                    padding: '20px',
                    borderRadius: '18px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <span
                        style={{
                          background: '#ffedd5',
                          color: '#c2410c',
                          padding: '4px 10px',
                          borderRadius: '10px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em'
                        }}
                      >
                        📷 Visual Prediction
                      </span>
                      {analysisResult?.confidence && (
                        <span
                          style={{
                            background: '#dcfce7',
                            color: '#15803d',
                            padding: '4px 10px',
                            borderRadius: '10px',
                            fontSize: '0.75rem',
                            fontWeight: 700
                          }}
                        >
                          {Math.round(analysisResult.confidence * 100)}% Confidence
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => setIsManualCorrection(true)}
                      style={{
                        background: '#ffffff',
                        border: '1.5px solid #cbd5e1',
                        padding: '6px 14px',
                        borderRadius: '10px',
                        color: '#475569',
                        fontSize: '0.82rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}
                    >
                      <Edit3 size={14} /> Correct Item
                    </button>
                  </div>

                  <div>
                    <h3 style={{ fontSize: '1.6rem', fontWeight: 800, margin: '4px 0 0 0', color: '#0f172a' }}>
                      {selectedIngredientName}
                    </h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: '4px 0 0 0' }}>
                      Please confirm this ingredient identity before entering measured quantity.
                    </p>
                  </div>

                  {analysisResult?.detectedFeatures && analysisResult.detectedFeatures.length > 0 && (
                    <div style={{ background: '#ffffff', padding: '10px 14px', borderRadius: '12px', border: '1px solid #fed7aa' }}>
                      <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700, display: 'block' }}>
                        Computer Vision Descriptors:
                      </span>
                      <div style={{ fontSize: '0.82rem', color: '#334155', marginTop: '2px' }}>
                        {analysisResult.detectedFeatures.join(' • ')}
                      </div>
                    </div>
                  )}

                  {/* Confirmation Button */}
                  <button
                    onClick={handleConfirmIngredient}
                    style={{
                      marginTop: '6px',
                      padding: '13px',
                      borderRadius: '14px',
                      background: 'linear-gradient(135deg, #ea580c, #f97316)',
                      color: '#ffffff',
                      border: 'none',
                      fontWeight: 800,
                      fontSize: '0.96rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '8px',
                      boxShadow: '0 4px 14px rgba(234, 88, 12, 0.3)'
                    }}
                  >
                    <CheckCircle2 size={18} /> Confirm {selectedIngredientName}
                  </button>
                </div>
              </div>
            )}

            {/* CASE C: INGREDIENT CONFIRMED -> ENTER MEASURED QUANTITY & INVENTORY ACTIONS (Requirements 6, 7, 8) */}
            {selectedIngredientName && isIngredientConfirmed && !isManualCorrection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {/* Confirmed Banner */}
                <div
                  style={{
                    background: '#f0fdf4',
                    border: '1.5px solid #bbf7d0',
                    padding: '14px 18px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <CheckCircle2 size={22} style={{ color: '#16a34a' }} />
                    <div>
                      <span style={{ fontSize: '0.72rem', color: '#16a34a', fontWeight: 700, textTransform: 'uppercase' }}>
                        Confirmed Ingredient
                      </span>
                      <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
                        {selectedIngredientName}
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setIsIngredientConfirmed(false);
                      setIsManualCorrection(true);
                    }}
                    style={{
                      background: '#ffffff',
                      border: '1px solid #cbd5e1',
                      borderRadius: '8px',
                      padding: '5px 10px',
                      fontSize: '0.78rem',
                      fontWeight: 600,
                      color: '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    Change
                  </button>
                </div>

                {/* MEASURED QUANTITY & UNIT PROMPT (Requirement 6) */}
                <div
                  style={{
                    background: '#ffffff',
                    border: '1.5px solid #fed7aa',
                    padding: '18px',
                    borderRadius: '16px',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '12px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#c2410c' }}>
                    <Scale size={20} />
                    <span style={{ fontWeight: 700, fontSize: '0.94rem' }}>
                      Enter Actual Kitchen Quantity & Unit
                    </span>
                  </div>
                  <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>
                    Do not infer exact weight from an ordinary photo. Enter the measured quantity weighed or received in your restaurant kitchen.
                  </p>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Quantity
                      </label>
                      <input
                        type="number"
                        step="any"
                        min="0.01"
                        value={actionQuantity}
                        onChange={(e) => setActionQuantity(e.target.value)}
                        placeholder="e.g. 5"
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: '#ffffff',
                          border: '1.5px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.95rem',
                          fontWeight: 600
                        }}
                      />
                    </div>

                    <div>
                      <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                        Unit
                      </label>
                      <select
                        value={actionUnit}
                        onChange={(e) => setActionUnit(e.target.value)}
                        style={{
                          width: '100%',
                          padding: '10px 14px',
                          borderRadius: '12px',
                          background: '#ffffff',
                          border: '1.5px solid #cbd5e1',
                          color: '#0f172a',
                          fontSize: '0.95rem',
                          fontWeight: 600
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
                </div>

                {/* SHARED INVENTORY STATUS CARD (Requirement 7) */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={16} style={{ color: '#ea580c' }} /> Restaurant Inventory Status
                    </span>
                    {inventoryMatch?.existsInInventory ? (
                      <span
                        style={{
                          background: '#dcfce7',
                          color: '#15803d',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={13} /> Available in Inventory
                      </span>
                    ) : (
                      <span
                        style={{
                          background: '#fef3c7',
                          color: '#b45309',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        Not in Inventory
                      </span>
                    )}
                  </div>

                  {inventoryMatch?.existsInInventory && inventoryMatch.inventoryItem ? (
                    <div>
                      <p style={{ fontSize: '0.86rem', color: '#334155', margin: '0 0 8px 0' }}>
                        <strong>{selectedIngredientName}</strong> is already tracked in your restaurant inventory.
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: '10px',
                          background: '#ffffff',
                          padding: '12px',
                          borderRadius: '12px',
                          border: '1px solid #e2e8f0'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Current Stock</span>
                          <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ea580c' }}>
                            {inventoryMatch.inventoryItem.quantity} {inventoryMatch.inventoryItem.unit}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b', display: 'block' }}>Category</span>
                          <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#0f172a', textTransform: 'capitalize' }}>
                            {inventoryMatch.inventoryItem.category}
                          </span>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>
                      {selectedIngredientName} is not currently in active restaurant stock. You can add it now.
                    </p>
                  )}
                </div>

                {/* SHARED GROCERY RESTOCK STATUS */}
                <div
                  style={{
                    background: '#f8fafc',
                    border: '1px solid #e2e8f0',
                    padding: '14px 16px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <ShoppingCart size={16} style={{ color: '#0284c7' }} />
                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 600 }}>Grocery Restock List:</span>
                  </div>
                  {inventoryMatch?.existsInGrocery ? (
                    <span style={{ fontSize: '0.78rem', color: '#0369a1', fontWeight: 700 }}>
                      ✓ Listed ({inventoryMatch.groceryItem?.quantity} {inventoryMatch.groceryItem?.unit} needed)
                    </span>
                  ) : (
                    <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>Not on Grocery List</span>
                  )}
                </div>

                {/* ACTION BUTTONS (Requirement 8) */}
                {!activeAction && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#475569', fontWeight: 700 }}>
                      Choose Inventory Action:
                    </span>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '10px' }}>
                      {inventoryMatch?.existsInInventory ? (
                        <>
                          <button
                            onClick={() => handleOpenAction('add_stock')}
                            style={{
                              padding: '13px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #ea580c, #f97316)',
                              border: 'none',
                              color: '#ffffff',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px',
                              boxShadow: '0 4px 12px rgba(234, 88, 12, 0.25)'
                            }}
                          >
                            <Plus size={16} /> Add More Stock
                          </button>

                          <button
                            onClick={() => handleOpenAction('use_stock')}
                            style={{
                              padding: '13px',
                              borderRadius: '12px',
                              background: '#eff6ff',
                              border: '1.5px solid #bfdbfe',
                              color: '#1d4ed8',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <MinusCircle size={16} /> Record Usage
                          </button>

                          <button
                            onClick={() => handleOpenAction('record_waste')}
                            style={{
                              padding: '13px',
                              borderRadius: '12px',
                              background: '#fef2f2',
                              border: '1.5px solid #fecaca',
                              color: '#dc2626',
                              fontWeight: 700,
                              fontSize: '0.88rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Trash2 size={16} /> Record Waste
                          </button>
                        </>
                      ) : (
                        <button
                          onClick={() => handleOpenAction('add_inventory')}
                          style={{
                            padding: '13px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 700,
                            fontSize: '0.9rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px',
                            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.25)'
                          }}
                        >
                          <Plus size={16} /> Add to Inventory
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenAction('add_grocery')}
                        style={{
                          padding: '13px',
                          borderRadius: '12px',
                          background: '#f8fafc',
                          border: '1.5px solid #cbd5e1',
                          color: '#0f172a',
                          fontWeight: 700,
                          fontSize: '0.88rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingCart size={16} style={{ color: '#ea580c' }} /> Add to Grocery List
                      </button>
                    </div>
                  </div>
                )}

                {/* ACTION CONFIRMATION PROMPT */}
                {activeAction && (
                  <div
                    style={{
                      background: '#fff7ed',
                      border: '1.5px solid #fed7aa',
                      padding: '18px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '12px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#c2410c' }}>
                        {activeAction === 'use_stock' && 'Record Stock Usage'}
                        {activeAction === 'add_stock' && 'Add Quantity to Existing Stock'}
                        {activeAction === 'record_waste' && 'Record Stock Waste'}
                        {activeAction === 'add_inventory' && 'Add New Item to Inventory'}
                        {activeAction === 'add_grocery' && 'Add Item to Grocery Restock List'}
                      </span>
                      <button
                        onClick={() => setActiveAction(null)}
                        style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}
                      >
                        Cancel
                      </button>
                    </div>

                    {activeAction === 'add_inventory' && (
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#475569', fontWeight: 600, display: 'block', marginBottom: '4px' }}>
                          Category
                        </label>
                        <select
                          value={actionCategory}
                          onChange={(e) => setActionCategory(e.target.value as IngredientCategory)}
                          style={{
                            width: '100%',
                            padding: '10px 14px',
                            borderRadius: '12px',
                            background: '#ffffff',
                            border: '1.5px solid #cbd5e1',
                            color: '#0f172a',
                            fontSize: '0.95rem',
                            fontWeight: 600
                          }}
                        >
                          {CATEGORY_OPTIONS.map((cat) => (
                            <option key={cat} value={cat}>
                              {cat.toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    )}

                    {!showConfirmation ? (
                      <button
                        onClick={() => setShowConfirmation(true)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #ea580c, #f97316)',
                          color: '#ffffff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.92rem',
                          cursor: 'pointer'
                        }}
                      >
                        Review & Confirm Action
                      </button>
                    ) : (
                      <div
                        style={{
                          background: '#ffffff',
                          border: '1.5px solid #fed7aa',
                          padding: '14px',
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ fontSize: '0.9rem', color: '#0f172a', fontWeight: 700 }}>
                          {activeAction === 'use_stock' && `Confirm usage of ${actionQuantity} ${actionUnit} ${selectedIngredientName}?`}
                          {activeAction === 'add_stock' && `Confirm adding ${actionQuantity} ${actionUnit} to ${selectedIngredientName} stock?`}
                          {activeAction === 'record_waste' && `Confirm recording ${actionQuantity} ${actionUnit} ${selectedIngredientName} as waste?`}
                          {activeAction === 'add_inventory' && `Confirm adding ${actionQuantity} ${actionUnit} ${selectedIngredientName} to restaurant inventory?`}
                          {activeAction === 'add_grocery' && `Confirm adding ${actionQuantity} ${actionUnit} ${selectedIngredientName} to grocery restock list?`}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={handleConfirmAction}
                            style={{
                              flex: 1,
                              padding: '11px',
                              borderRadius: '10px',
                              background: '#10b981',
                              color: '#ffffff',
                              border: 'none',
                              fontWeight: 800,
                              cursor: 'pointer'
                            }}
                          >
                            Yes, Save Changes
                          </button>
                          <button
                            onClick={() => setShowConfirmation(false)}
                            style={{
                              padding: '11px 16px',
                              borderRadius: '10px',
                              background: '#f1f5f9',
                              color: '#64748b',
                              border: 'none',
                              fontWeight: 600,
                              cursor: 'pointer'
                            }}
                          >
                            Back
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* MANUAL ITEM PICKER (Search & Select) */}
            {isManualCorrection && (
              <div
                style={{
                  background: '#f8fafc',
                  border: '1.5px solid #e2e8f0',
                  padding: '18px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 800, fontSize: '0.95rem', color: '#0f172a' }}>
                    Select Kitchen Ingredient
                  </span>
                  <button
                    onClick={() => setIsManualCorrection(false)}
                    style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', fontWeight: 600 }}
                  >
                    Cancel
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: '#ffffff',
                    padding: '8px 14px',
                    borderRadius: '12px',
                    border: '1.5px solid #cbd5e1'
                  }}
                >
                  <Search size={16} style={{ color: '#ea580c' }} />
                  <input
                    type="text"
                    placeholder="Search or enter ingredient name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#0f172a', flex: 1, outline: 'none', fontSize: '0.9rem', fontWeight: 500 }}
                  />
                </div>

                <div
                  style={{
                    maxHeight: '220px',
                    overflowY: 'auto',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '6px'
                  }}
                >
                  {filteredStandardItems.map((itemName) => (
                    <button
                      key={itemName}
                      onClick={() => handleSelectManualItem(itemName)}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: '#ffffff',
                        border: '1px solid #e2e8f0',
                        color: '#0f172a',
                        fontSize: '0.9rem',
                        fontWeight: 600,
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{itemName}</span>
                      <ArrowRight size={14} style={{ color: '#ea580c' }} />
                    </button>
                  ))}

                  {searchFilter.trim() && !filteredStandardItems.includes(searchFilter.trim()) && (
                    <button
                      onClick={() => handleSelectManualItem(searchFilter.trim())}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: '#fff7ed',
                        border: '1.5px solid #fed7aa',
                        color: '#ea580c',
                        fontWeight: 700,
                        fontSize: '0.9rem',
                        cursor: 'pointer'
                      }}
                    >
                      Use custom item: "{searchFilter.trim()}"
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* STEP 4: VERIFYING STATE */}
        {step === 'verifying' && (
          <div style={{ padding: '40px 20px', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px' }}>
            <RefreshCw size={38} className="spin-animation" style={{ color: '#10b981' }} />
            <div>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Updating & Verifying Shared Restaurant Inventory...
              </h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '6px' }}>
                Verifying transaction persistence in restaurant store
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS STATE */}
        {step === 'success' && (
          <div
            style={{
              padding: '28px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              background: '#f0fdf4',
              border: '1.5px solid #bbf7d0',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                width: '52px',
                height: '52px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
              }}
            >
              <CheckCircle2 size={30} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, margin: 0, color: '#0f172a' }}>
                Action Verified & Saved
              </h3>
              <p style={{ fontSize: '0.92rem', color: '#15803d', marginTop: '6px', lineHeight: '1.4', fontWeight: 600 }}>
                {statusMessage || 'Shared restaurant inventory state updated successfully.'}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: '8px' }}>
              <button
                onClick={handleResetScanner}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: '#ffffff',
                  border: '1.5px solid #cbd5e1',
                  color: '#0f172a',
                  fontWeight: 700,
                  cursor: 'pointer'
                }}
              >
                Scan Another Item
              </button>
              <button
                onClick={onClose}
                style={{
                  flex: 1,
                  padding: '12px',
                  borderRadius: '12px',
                  background: 'linear-gradient(135deg, #10b981, #059669)',
                  color: '#ffffff',
                  border: 'none',
                  fontWeight: 800,
                  cursor: 'pointer'
                }}
              >
                Done
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
