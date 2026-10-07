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
  FileText,
  Check
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
  'Milk',
  'Greek Yogurt',
  'Fresh Paneer',
  'Organic Tofu',
  'Rice',
  'Whole Wheat Flour',
  'Tomato',
  'Cherry Tomatoes',
  'Potato',
  'Onion',
  'Carrot',
  'Fresh Chicken Breast',
  'Eggs',
  'Extra Virgin Olive Oil',
  'Raw Cashews',
  'Dragon Fruit',
  'Cheddar Cheese',
  'Heavy Cream',
  'Whole Wheat Bread',
  'Tomato Sauce'
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

  // Modal Flow Step
  const [step, setStep] = useState<CameraActionStep>('preview');
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Vision Analysis Result
  const [analysisResult, setAnalysisResult] = useState<ImageAnalysisResult | null>(null);
  const [selectedIngredientName, setSelectedIngredientName] = useState<string>('');
  const [inventoryMatch, setInventoryMatch] = useState<CameraInventoryMatch | null>(null);

  // Manual Correction State
  const [isManualCorrection, setIsManualCorrection] = useState(false);
  const [searchFilter, setSearchFilter] = useState('');

  // Dialog Form & Action State
  const [activeAction, setActiveAction] = useState<'use_stock' | 'add_stock' | 'record_waste' | 'add_inventory' | 'add_grocery' | null>(null);
  const [actionQuantity, setActionQuantity] = useState<string>('1');
  const [actionUnit, setActionUnit] = useState<string>('kg');
  const [actionCategory, setActionCategory] = useState<IngredientCategory>('produce');
  const [actionNotes] = useState<string>('');
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
      setCameraError('Camera access was denied or unavailable. You can upload an image file or take a photo with your device camera.');
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
      // Auto analyze captured frame
      processImageAnalysis(dataUrl);
    }
  };

  // File upload fallback handler
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
  };

  // Run generalized image analysis pipeline
  const processImageAnalysis = async (imageData: string) => {
    setStep('analyzing');
    setAIState('working');

    try {
      // Analyze single primary & potential multi-item results
      const multi = await ImageAnalysisService.detectMultipleItems(imageData);
      setDetectedItemsList(multi.items);
      setSelectedMultiIndex(0);

      const primary = multi.items[0];
      setAnalysisResult(primary);

      if (primary && primary.detectedItem) {
        setSelectedIngredientName(primary.detectedItem);
        setActionUnit(primary.suggestedUnit || primary.ocrResult?.extractedUnit || 'kg');
        setActionQuantity((primary.suggestedQuantity || primary.ocrResult?.extractedQuantity || 1).toString());
        setActionCategory(primary.category);

        // Evaluate Inventory & Grocery Match
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

  // Switch active item in multi-item scan mode
  const handleSelectMultiItem = (index: number) => {
    setSelectedMultiIndex(index);
    const item = detectedItemsList[index];
    if (item && item.detectedItem) {
      setAnalysisResult(item);
      setSelectedIngredientName(item.detectedItem);
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

  // Manual Item Correction Picker Selection
  const handleSelectManualItem = (itemName: string) => {
    const norm = IngredientNormalizationService.normalize(itemName);
    setSelectedIngredientName(norm.name);
    setActionCategory(norm.category);
    setActionUnit(norm.unit);
    setActionQuantity('1');

    const match = CameraInventoryService.checkInventoryAndGrocery(
      norm.name,
      state.pantry,
      state.groceryList
    );
    setInventoryMatch(match);
    setIsManualCorrection(false);
    setStep('detected');
  };

  // Open Action Dialog
  const handleOpenAction = (action: 'use_stock' | 'add_stock' | 'record_waste' | 'add_inventory' | 'add_grocery') => {
    setActiveAction(action);
    setShowConfirmation(false);
    setStatusMessage(null);

    // Pre-fill defaults based on match
    if (inventoryMatch?.inventoryItem) {
      setActionUnit(inventoryMatch.inventoryItem.unit);
      setActionCategory(inventoryMatch.inventoryItem.category);
    }
  };

  // Execute and Verify Inventory / Grocery Update
  const handleConfirmAction = async () => {
    if (!selectedIngredientName || !activeAction) return;
    setStep('verifying');
    setAIState('thinking');

    const numQty = Math.max(0.01, parseFloat(actionQuantity) || 1);
    const trimmedName = selectedIngredientName.trim();
    const existingIng = inventoryMatch?.inventoryItem;

    try {
      await new Promise((res) => setTimeout(res, 500)); // Smooth state sequence delay

      if (activeAction === 'use_stock' && existingIng) {
        // Record Usage
        recordUsage(
          existingIng.id,
          numQty,
          actionUnit,
          actionNotes.trim() || `Recorded usage via Camera Scanner by ${user?.name || 'Staff'}`
        );

        const newRemaining = Math.max(0, existingIng.quantity - numQty);
        const successMsg = `Recorded usage of ${numQty} ${actionUnit} ${trimmedName}. Remaining stock: ${newRemaining} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        // Add to AI Response History
        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_stock' && existingIng) {
        // Add More Stock to Existing Item
        const newTotal = Math.round((existingIng.quantity + numQty) * 100) / 100;
        updateIngredient({
          ...existingIng,
          quantity: newTotal,
          notes: actionNotes.trim() || `Added stock via Camera Scanner by ${user?.name || 'Staff'}`,
          updatedBy: user?.name || 'Staff',
          updatedAt: new Date().toISOString()
        });

        const successMsg = `Added ${numQty} ${actionUnit} to existing ${trimmedName} stock. Updated total: ${newTotal} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'record_waste' && existingIng) {
        // Record Waste
        recordWaste(
          existingIng.id,
          numQty,
          actionUnit,
          actionNotes.trim() || `Recorded waste via Camera Scanner by ${user?.name || 'Staff'}`
        );

        const newRemaining = Math.max(0, existingIng.quantity - numQty);
        const successMsg = `Recorded ${numQty} ${actionUnit} ${trimmedName} as waste. Remaining stock: ${newRemaining} ${existingIng.unit}.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_inventory') {
        // Create New Inventory Stock
        const newIng: Ingredient = {
          id: `ing_cam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId: restaurant?.id || 'rest_spice_garden',
          name: trimmedName,
          quantity: numQty,
          unit: actionUnit,
          category: actionCategory,
          freshness: 'fresh',
          colorCode: '#06b6d4',
          notes: actionNotes.trim() || `Added via Camera Scanner by ${user?.name || 'Staff'}`,
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'Staff'
        };
        addIngredient(newIng);

        const successMsg = `Added ${numQty} ${actionUnit} ${trimmedName} to restaurant inventory.`;
        setStatusMessage(successMsg);

        addAIResponse({
          message: successMsg,
          actionRequired: 'explore_pantry',
          timestamp: new Date().toLocaleTimeString(),
          isMock: false
        });
      } else if (activeAction === 'add_grocery') {
        // Add to Restaurant Grocery List
        const newGItem: SmartGroceryItem = {
          id: `g_cam_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
          restaurantId: restaurant?.id || 'rest_spice_garden',
          name: trimmedName,
          quantity: numQty,
          unit: actionUnit,
          reason: actionNotes.trim() || `Added via Camera Scan by ${user?.name || 'Staff'}`,
          priority: 'MEDIUM',
          source: 'MANUAL',
          status: 'NEEDED',
          category: actionCategory,
          createdAt: new Date().toISOString(),
          createdBy: user?.name || 'Staff'
        };
        addGroceryItem(newGItem);

        const successMsg = `Added ${numQty} ${actionUnit} ${trimmedName} to restaurant grocery list.`;
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
    setInventoryMatch(null);
    setIsManualCorrection(false);
    setActiveAction(null);
    setShowConfirmation(false);
    setStatusMessage(null);
    setStep('preview');
    startCamera();
  };

  // Filter manual items for picker
  const filteredStandardItems = STANDARD_RESTAURANT_ITEMS.filter((item) =>
    item.toLowerCase().includes(searchFilter.toLowerCase())
  );

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
          maxWidth: '620px',
          padding: '24px',
          borderRadius: '24px',
          background: '#111827',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          boxShadow: '0 25px 60px rgba(0, 0, 0, 0.7)',
          display: 'flex',
          flexDirection: 'column',
          gap: '18px',
          maxHeight: '92vh',
          overflowY: 'auto',
          color: '#f8fafc'
        }}
      >
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div
              style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#fff'
              }}
            >
              <Camera size={20} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0, color: '#f8fafc' }}>
                Restaurant Inventory Scanner
              </h2>
              <p style={{ fontSize: '0.8rem', color: '#94a3b8', margin: 0 }}>
                Intelligent vision & stock verification pipeline
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: 'none',
              borderRadius: '10px',
              width: '32px',
              height: '32px',
              color: '#94a3b8',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
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
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              {cameraError ? (
                <div style={{ padding: '24px', textAlign: 'center', color: '#f87171', maxWidth: '400px' }}>
                  <AlertTriangle size={36} style={{ marginBottom: '8px' }} />
                  <p style={{ fontSize: '0.88rem', margin: 0 }}>{cameraError}</p>
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
                    inset: '20px',
                    border: '2px dashed rgba(56, 189, 248, 0.5)',
                    borderRadius: '16px',
                    pointerEvents: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <span
                    style={{
                      background: 'rgba(15, 23, 42, 0.75)',
                      padding: '6px 14px',
                      borderRadius: '20px',
                      fontSize: '0.75rem',
                      color: '#38bdf8',
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
                    padding: '12px',
                    borderRadius: '14px',
                    background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                    color: '#fff',
                    border: 'none',
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '0.92rem'
                  }}
                >
                  <Camera size={18} /> Take Photo
                </button>
              )}

              <label
                style={{
                  flex: cameraError ? 1 : undefined,
                  padding: '12px 20px',
                  borderRadius: '14px',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#f8fafc',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  fontWeight: 600,
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '8px',
                  fontSize: '0.92rem'
                }}
              >
                <Upload size={18} /> Upload Image
                <input type="file" accept="image/*" onChange={handleFileUpload} style={{ display: 'none' }} />
              </label>
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
            <RefreshCw size={40} className="spin-animation" style={{ color: '#38bdf8' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Analyzing Ingredient...</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                Extracting pixel feature descriptors & checking restaurant catalog
              </p>
            </div>
          </div>
        )}

        {/* STEP 3: DETECTION RESULT / UNCERTAINTY STATE & INVENTORY MATCH */}
        {step === 'detected' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Captured Image Preview Thumbnail */}
            {capturedImage && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  padding: '10px 14px',
                  borderRadius: '14px',
                  border: '1px solid rgba(255, 255, 255, 0.08)'
                }}
              >
                <img
                  src={capturedImage}
                  alt="Captured scan"
                  style={{ width: '56px', height: '56px', objectFit: 'cover', borderRadius: '10px' }}
                />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Scanned Photo
                  </span>
                  <div style={{ fontSize: '0.85rem', color: '#38bdf8', fontWeight: 600 }}>
                    {analysisResult?.ocrResult ? 'OCR Text Label Detected' : 'Image Feature Matrix Analyzed'}
                  </div>
                </div>
                <button
                  onClick={handleResetScanner}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#94a3b8',
                    cursor: 'pointer',
                    fontSize: '0.8rem',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px'
                  }}
                >
                  <RefreshCw size={14} /> Retake
                </button>
              </div>
            )}

            {/* UNCERTAIN RECOGNITION HANDLING */}
            {(!selectedIngredientName || analysisResult?.confidenceLevel === 'uncertain') && !isManualCorrection && (
              <div
                style={{
                  background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)',
                  padding: '18px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#f87171' }}>
                  <AlertTriangle size={22} />
                  <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                    Unable to identify the ingredient confidently
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: 0 }}>
                  The image feature score is below high-confidence thresholds. We do not automatically select an incorrect inventory item.
                </p>

                {analysisResult?.alternatives && analysisResult.alternatives.length > 0 && (
                  <div style={{ marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>Possible matches:</span>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '6px' }}>
                      {analysisResult.alternatives.map((alt: string) => (
                        <button
                          key={alt}
                          onClick={() => handleSelectManualItem(alt)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            padding: '6px 12px',
                            borderRadius: '20px',
                            color: '#f8fafc',
                            fontSize: '0.82rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '6px'
                          }}
                        >
                          <Check size={14} style={{ color: '#38bdf8' }} /> {alt}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                  <button
                    onClick={handleResetScanner}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: 'rgba(255, 255, 255, 0.08)',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Retake Photo
                  </button>
                  <button
                    onClick={() => setIsManualCorrection(true)}
                    style={{
                      flex: 1,
                      padding: '10px',
                      borderRadius: '12px',
                      background: '#0284c7',
                      color: '#fff',
                      border: 'none',
                      fontSize: '0.85rem',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    Choose Item Manually
                  </button>
                </div>
              </div>
            )}

            {/* CONFIDENT DETECTION DISPLAY */}
            {selectedIngredientName && analysisResult?.confidenceLevel !== 'uncertain' && !isManualCorrection && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                {/* Detected Item Banner */}
                <div
                  style={{
                    background: 'linear-gradient(135deg, rgba(14, 165, 233, 0.15), rgba(37, 99, 235, 0.15))',
                    border: '1px solid rgba(56, 189, 248, 0.3)',
                    padding: '16px 20px',
                    borderRadius: '16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap',
                    gap: '12px'
                  }}
                >
                  <div>
                    <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase' }}>
                      📷 Ingredient Detected
                    </span>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, margin: '2px 0 0 0', color: '#ffffff' }}>
                      {selectedIngredientName}
                    </h3>
                    {analysisResult?.ocrResult && (
                      <span style={{ fontSize: '0.75rem', color: '#a7f3d0', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
                        <FileText size={12} /> {analysisResult.ocrResult.detectedText}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => setIsManualCorrection(true)}
                    style={{
                      background: 'rgba(255, 255, 255, 0.08)',
                      border: '1px solid rgba(255, 255, 255, 0.15)',
                      padding: '6px 12px',
                      borderRadius: '10px',
                      color: '#94a3b8',
                      fontSize: '0.78rem',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    <Edit3 size={14} /> Correct Item
                  </button>
                </div>

                {/* Multi-Item Detection Tabs if multiple items identified */}
                {detectedItemsList.length > 1 && (
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', overflowX: 'auto', paddingBottom: '4px' }}>
                    <span style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Detected:</span>
                    {detectedItemsList.map((item: ImageAnalysisResult, idx: number) => (
                      <button
                        key={idx}
                        onClick={() => handleSelectMultiItem(idx)}
                        style={{
                          padding: '5px 12px',
                          borderRadius: '14px',
                          fontSize: '0.78rem',
                          fontWeight: 600,
                          cursor: 'pointer',
                          background: selectedMultiIndex === idx ? '#0284c7' : 'rgba(255, 255, 255, 0.08)',
                          color: selectedMultiIndex === idx ? '#fff' : '#cbd5e1',
                          border: 'none',
                          whiteSpace: 'nowrap'
                        }}
                      >
                        {item.detectedItem || 'Unknown'}
                      </button>
                    ))}
                  </div>
                )}

                {/* SHARED RESTAURANT INVENTORY STATUS CARD */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Package size={16} /> Restaurant Inventory Status
                    </span>
                    {inventoryMatch?.existsInInventory ? (
                      <span
                        style={{
                          background: 'rgba(16, 185, 129, 0.2)',
                          color: '#34d399',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700,
                          display: 'flex',
                          alignItems: 'center',
                          gap: '4px'
                        }}
                      >
                        <CheckCircle2 size={13} /> Available
                      </span>
                    ) : (
                      <span
                        style={{
                          background: 'rgba(245, 158, 11, 0.2)',
                          color: '#fbbf24',
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
                      <p style={{ fontSize: '0.85rem', color: '#cbd5e1', margin: '0 0 8px 0' }}>
                        <strong>{selectedIngredientName}</strong> is already available in your restaurant inventory.
                      </p>
                      <div
                        style={{
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))',
                          gap: '10px',
                          background: 'rgba(0, 0, 0, 0.25)',
                          padding: '12px',
                          borderRadius: '12px'
                        }}
                      >
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Current Stock</span>
                          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
                            {inventoryMatch.inventoryItem.quantity} {inventoryMatch.inventoryItem.unit}
                          </span>
                        </div>
                        <div>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Category</span>
                          <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f8fafc', textTransform: 'capitalize' }}>
                            {inventoryMatch.inventoryItem.category}
                          </span>
                        </div>
                        {inventoryMatch.inventoryItem.expiresAt && (
                          <div>
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Expires</span>
                            <span style={{ fontSize: '0.85rem', color: '#f8fafc' }}>
                              {new Date(inventoryMatch.inventoryItem.expiresAt).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <p style={{ fontSize: '0.85rem', color: '#94a3b8', margin: 0 }}>
                      {selectedIngredientName} was detected, but does not currently exist in active restaurant stock.
                    </p>
                  )}
                </div>

                {/* SHARED RESTAURANT GROCERY LIST STATUS CARD */}
                <div
                  style={{
                    background: 'rgba(255, 255, 255, 0.03)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    padding: '16px',
                    borderRadius: '16px',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <ShoppingCart size={16} /> Restaurant Grocery Status
                    </span>
                    {inventoryMatch?.existsInGrocery ? (
                      <span
                        style={{
                          background: 'rgba(56, 189, 248, 0.2)',
                          color: '#38bdf8',
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '0.75rem',
                          fontWeight: 700
                        }}
                      >
                        Status: {inventoryMatch.groceryStatus || 'NEEDED'}
                      </span>
                    ) : (
                      <span style={{ fontSize: '0.75rem', color: '#64748b' }}>Not on Grocery List</span>
                    )}
                  </div>

                  {inventoryMatch?.existsInGrocery && inventoryMatch.groceryItem && (
                    <div style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>
                      ✓ <strong>{selectedIngredientName}</strong> is on the restaurant grocery list. Required:{' '}
                      <span style={{ color: '#38bdf8', fontWeight: 700 }}>
                        {inventoryMatch.groceryItem.quantity} {inventoryMatch.groceryItem.unit}
                      </span>
                    </div>
                  )}
                </div>

                {/* ACTION BUTTONS SELECTION */}
                {!activeAction && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginTop: '4px' }}>
                    <span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 600 }}>What would you like to do?</span>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(170px, 1fr))', gap: '10px' }}>
                      {inventoryMatch?.existsInInventory ? (
                        <>
                          <button
                            onClick={() => handleOpenAction('use_stock')}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              background: 'rgba(56, 189, 248, 0.15)',
                              border: '1px solid rgba(56, 189, 248, 0.3)',
                              color: '#38bdf8',
                              fontWeight: 600,
                              fontSize: '0.85rem',
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
                            onClick={() => handleOpenAction('add_stock')}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                              border: 'none',
                              color: '#ffffff',
                              fontWeight: 600,
                              fontSize: '0.85rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              gap: '6px'
                            }}
                          >
                            <Plus size={16} /> Add More Stock
                          </button>

                          <button
                            onClick={() => handleOpenAction('record_waste')}
                            style={{
                              padding: '12px',
                              borderRadius: '12px',
                              background: 'rgba(239, 68, 68, 0.12)',
                              border: '1px solid rgba(239, 68, 68, 0.3)',
                              color: '#f87171',
                              fontWeight: 600,
                              fontSize: '0.85rem',
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
                            padding: '12px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #10b981, #059669)',
                            border: 'none',
                            color: '#ffffff',
                            fontWeight: 600,
                            fontSize: '0.88rem',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: '6px'
                          }}
                        >
                          <Plus size={16} /> Add to Inventory
                        </button>
                      )}

                      <button
                        onClick={() => handleOpenAction('add_grocery')}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'rgba(255, 255, 255, 0.08)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          color: '#f8fafc',
                          fontWeight: 600,
                          fontSize: '0.85rem',
                          cursor: 'pointer',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px'
                        }}
                      >
                        <ShoppingCart size={16} /> Add to Grocery List
                      </button>
                    </div>
                  </div>
                )}

                {/* ACTION FORM & CONFIRMATION DIALOG */}
                {activeAction && (
                  <div
                    style={{
                      background: 'rgba(15, 23, 42, 0.8)',
                      border: '1px solid rgba(56, 189, 248, 0.3)',
                      padding: '18px',
                      borderRadius: '16px',
                      display: 'flex',
                      flexDirection: 'column',
                      gap: '14px',
                      marginTop: '8px'
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#38bdf8' }}>
                        {activeAction === 'use_stock' && 'Record Stock Usage'}
                        {activeAction === 'add_stock' && 'Add Quantity to Existing Stock'}
                        {activeAction === 'record_waste' && 'Record Inventory Waste'}
                        {activeAction === 'add_inventory' && 'Add New Item to Inventory'}
                        {activeAction === 'add_grocery' && 'Add Item to Grocery Restock List'}
                      </span>
                      <button
                        onClick={() => setActiveAction(null)}
                        style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer', fontSize: '0.8rem' }}
                      >
                        Cancel Action
                      </button>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Quantity</label>
                        <input
                          type="number"
                          step="any"
                          min="0.01"
                          value={actionQuantity}
                          onChange={(e) => setActionQuantity(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: 'rgba(255, 255, 255, 0.08)',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '0.92rem'
                          }}
                        />
                      </div>

                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Unit</label>
                        <select
                          value={actionUnit}
                          onChange={(e) => setActionUnit(e.target.value)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: '#1e293b',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '0.92rem'
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

                    {activeAction === 'add_inventory' && (
                      <div>
                        <label style={{ fontSize: '0.78rem', color: '#94a3b8', display: 'block', marginBottom: '4px' }}>Category</label>
                        <select
                          value={actionCategory}
                          onChange={(e) => setActionCategory(e.target.value as IngredientCategory)}
                          style={{
                            width: '100%',
                            padding: '10px 12px',
                            borderRadius: '10px',
                            background: '#1e293b',
                            border: '1px solid rgba(255, 255, 255, 0.15)',
                            color: '#fff',
                            fontSize: '0.92rem'
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

                    {/* CONFIRMATION SUMMARY PROMPT */}
                    {!showConfirmation ? (
                      <button
                        onClick={() => setShowConfirmation(true)}
                        style={{
                          padding: '12px',
                          borderRadius: '12px',
                          background: 'linear-gradient(135deg, #0284c7, #2563eb)',
                          color: '#fff',
                          border: 'none',
                          fontWeight: 700,
                          fontSize: '0.9rem',
                          cursor: 'pointer',
                          marginTop: '4px'
                        }}
                      >
                        Review & Confirm Update
                      </button>
                    ) : (
                      <div
                        style={{
                          background: 'rgba(2, 132, 199, 0.15)',
                          border: '1px solid rgba(56, 189, 248, 0.4)',
                          padding: '14px',
                          borderRadius: '12px',
                          display: 'flex',
                          flexDirection: 'column',
                          gap: '10px'
                        }}
                      >
                        <div style={{ fontSize: '0.85rem', color: '#f8fafc', fontWeight: 600 }}>
                          {activeAction === 'use_stock' && `Record usage of ${actionQuantity} ${actionUnit} ${selectedIngredientName}?`}
                          {activeAction === 'add_stock' && `Add ${actionQuantity} ${actionUnit} ${selectedIngredientName} to restaurant stock?`}
                          {activeAction === 'record_waste' && `Record ${actionQuantity} ${actionUnit} ${selectedIngredientName} as waste?`}
                          {activeAction === 'add_inventory' && `Add ${actionQuantity} ${actionUnit} ${selectedIngredientName} to restaurant inventory?`}
                          {activeAction === 'add_grocery' && `Add ${actionQuantity} ${actionUnit} ${selectedIngredientName} to grocery list?`}
                        </div>

                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={handleConfirmAction}
                            style={{
                              flex: 1,
                              padding: '10px',
                              borderRadius: '10px',
                              background: '#10b981',
                              color: '#fff',
                              border: 'none',
                              fontWeight: 700,
                              cursor: 'pointer'
                            }}
                          >
                            Confirm Update
                          </button>
                          <button
                            onClick={() => setShowConfirmation(false)}
                            style={{
                              padding: '10px 16px',
                              borderRadius: '10px',
                              background: 'rgba(255, 255, 255, 0.08)',
                              color: '#94a3b8',
                              border: 'none',
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

            {/* MANUAL ITEM CORRECTION SEARCH PICKER */}
            {isManualCorrection && (
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.9)',
                  border: '1px solid rgba(255, 255, 255, 0.15)',
                  padding: '18px',
                  borderRadius: '16px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '12px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontWeight: 700, fontSize: '0.95rem', color: '#f8fafc' }}>
                    Select Restaurant Ingredient Item
                  </span>
                  <button
                    onClick={() => setIsManualCorrection(false)}
                    style={{ background: 'none', border: 'none', color: '#94a3b8', cursor: 'pointer' }}
                  >
                    Back
                  </button>
                </div>

                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    background: 'rgba(255, 255, 255, 0.08)',
                    padding: '8px 12px',
                    borderRadius: '10px',
                    border: '1px solid rgba(255, 255, 255, 0.15)'
                  }}
                >
                  <Search size={16} style={{ color: '#94a3b8' }} />
                  <input
                    type="text"
                    placeholder="Search or enter ingredient name..."
                    value={searchFilter}
                    onChange={(e) => setSearchFilter(e.target.value)}
                    style={{ background: 'none', border: 'none', color: '#fff', flex: 1, outline: 'none', fontSize: '0.88rem' }}
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
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        color: '#f8fafc',
                        fontSize: '0.88rem',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <span>{itemName}</span>
                      <ArrowRight size={14} style={{ color: '#38bdf8' }} />
                    </button>
                  ))}

                  {searchFilter.trim() && !filteredStandardItems.includes(searchFilter.trim()) && (
                    <button
                      onClick={() => handleSelectManualItem(searchFilter.trim())}
                      style={{
                        textAlign: 'left',
                        padding: '10px 14px',
                        borderRadius: '10px',
                        background: 'rgba(14, 165, 233, 0.2)',
                        border: '1px solid rgba(56, 189, 248, 0.3)',
                        color: '#38bdf8',
                        fontWeight: 600,
                        fontSize: '0.88rem',
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
            <RefreshCw size={36} className="spin-animation" style={{ color: '#10b981' }} />
            <div>
              <h3 style={{ fontSize: '1.1rem', margin: 0 }}>Updating & Verifying Shared Restaurant Inventory...</h3>
              <p style={{ fontSize: '0.85rem', color: '#94a3b8', marginTop: '4px' }}>
                Verifying transaction persistence in restaurant store
              </p>
            </div>
          </div>
        )}

        {/* STEP 5: SUCCESS & VERIFIED STATE RESULT */}
        {step === 'success' && (
          <div
            style={{
              padding: '24px',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '16px',
              background: 'rgba(16, 185, 129, 0.1)',
              border: '1px solid rgba(16, 185, 129, 0.3)',
              borderRadius: '20px'
            }}
          >
            <div
              style={{
                width: '48px',
                height: '48px',
                borderRadius: '50%',
                background: '#10b981',
                color: '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}
            >
              <CheckCircle2 size={28} />
            </div>
            <div>
              <h3 style={{ fontSize: '1.2rem', margin: 0, color: '#f8fafc' }}>Action Verified & Saved</h3>
              <p style={{ fontSize: '0.9rem', color: '#a7f3d0', marginTop: '6px', lineHeight: '1.4' }}>
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
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 600,
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
                  background: '#10b981',
                  color: '#fff',
                  border: 'none',
                  fontWeight: 700,
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
