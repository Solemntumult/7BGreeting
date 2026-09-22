"use client";

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Tv, 
  Plus, 
  Image as ImageIcon, 
  Megaphone, 
  Clock, 
  Trash2, 
  Edit3, 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  RotateCcw, 
  Upload, 
  Check, 
  X, 
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { Slide, SlideType } from '@/lib/slideStore';

interface PhotoOption {
  filename: string;
  url: string;
  category: string;
  label: string;
}

export default function AdminPage() {
  const [slides, setSlides] = useState<Slide[]>([]);
  const [loading, setLoading] = useState(true);
  const [availablePhotos, setAvailablePhotos] = useState<PhotoOption[]>([]);
  
  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSlide, setEditingSlide] = useState<Slide | null>(null);
  
  // Form fields
  const [formType, setFormType] = useState<SlideType>('announcement');
  const [formImageUrl, setFormImageUrl] = useState('');
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formDuration, setFormDuration] = useState(4000);
  const [formCategory, setFormCategory] = useState('Annonce');
  
  // Upload status
  const [uploading, setUploading] = useState(false);
  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Quick categories
  const categories = [
    'Accueil', 'Services', 'Offre Spéciale', 'Événement', 
    'Chambres', 'Bien-être', 'Gastronomie', 'Localisation', 'Info'
  ];

  // Load slides and photos
  useEffect(() => {
    loadData();
  }, []);

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setNotification({ type, message });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadData = async () => {
    try {
      setLoading(true);
      const [slidesRes, photosRes] = await Promise.all([
        fetch('/api/slides'),
        fetch('/api/photos')
      ]);
      const slidesData = await slidesRes.json();
      const photosData = await photosRes.json();
      
      if (slidesData.success) {
        setSlides(slidesData.slides);
      }
      if (photosData.success) {
        setAvailablePhotos(photosData.photos);
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors du chargement des données', 'error');
    } finally {
      setLoading(false);
    }
  };

  const openCreateModal = (type: SlideType = 'announcement') => {
    setEditingSlide(null);
    setFormType(type);
    setFormImageUrl(availablePhotos[0]?.url || '/selection_photos_tv/01_facade_devanture_seven_b.jpg');
    setFormTitle(type === 'announcement' ? 'Titre de votre annonce' : '');
    setFormDescription(type === 'announcement' ? 'Description ou message à diffuser sur l\'écran TV...' : '');
    setFormDuration(5000);
    setFormCategory(type === 'announcement' ? 'Accueil' : 'Chambres');
    setIsModalOpen(true);
  };

  const openEditModal = (slide: Slide) => {
    setEditingSlide(slide);
    setFormType(slide.type);
    setFormImageUrl(slide.imageUrl);
    setFormTitle(slide.title || '');
    setFormDescription(slide.description || '');
    setFormDuration(slide.duration || 5000);
    setFormCategory(slide.category || 'Annonce');
    setIsModalOpen(true);
  };

  const handleSaveSlide = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formImageUrl) {
      showToast('Veuillez sélectionner une photo', 'error');
      return;
    }

    try {
      if (editingSlide) {
        // Update existing
        const res = await fetch('/api/slides', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            id: editingSlide.id,
            type: formType,
            imageUrl: formImageUrl,
            title: formTitle,
            description: formDescription,
            duration: Number(formDuration),
            category: formCategory
          })
        });
        const data = await res.json();
        if (data.success) {
          setSlides(data.slides);
          setIsModalOpen(false);
          showToast('Diapositive mise à jour avec succès');
        }
      } else {
        // Create new
        const res = await fetch('/api/slides', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            type: formType,
            imageUrl: formImageUrl,
            title: formTitle,
            description: formDescription,
            duration: Number(formDuration),
            category: formCategory
          })
        });
        const data = await res.json();
        if (data.success) {
          setSlides(data.slides);
          setIsModalOpen(false);
          showToast('Nouvelle diapositive ajoutée au flux TV');
        }
      }
    } catch (err) {
      console.error(err);
      showToast('Erreur lors de la sauvegarde', 'error');
    }
  };

  const handleDeleteSlide = async (id: string) => {
    if (!confirm('Confirmer la suppression de cette diapositive ?')) return;
    try {
      const res = await fetch(`/api/slides?id=${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides);
        showToast('Diapositive supprimée');
      }
    } catch (err) {
      showToast('Erreur lors de la suppression', 'error');
    }
  };

  const handleToggleActive = async (slide: Slide) => {
    try {
      const res = await fetch('/api/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: slide.id,
          active: !slide.active
        })
      });
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides);
        showToast(slide.active ? 'Diapositive masquée' : 'Diapositive activée');
      }
    } catch (err) {
      showToast('Erreur lors de la modification', 'error');
    }
  };

  const handleMove = async (index: number, direction: 'up' | 'down') => {
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= slides.length) return;

    const newSlides = [...slides];
    const temp = newSlides[index];
    newSlides[index] = newSlides[targetIdx];
    newSlides[targetIdx] = temp;

    // reindex order
    newSlides.forEach((s, idx) => s.order = idx + 1);
    setSlides(newSlides);

    try {
      await fetch('/api/slides', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slides: newSlides })
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleResetDefaults = async () => {
    if (!confirm('Voulez-vous réinitialiser le flux aux 11 diapositives officielles de Seven B ?')) return;
    try {
      const res = await fetch('/api/slides/reset', { method: 'POST' });
      const data = await res.json();
      if (data.success) {
        setSlides(data.slides);
        showToast('Réinitialisation effectuée avec succès');
      }
    } catch (err) {
      showToast('Erreur lors de la réinitialisation', 'error');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    setUploading(true);
    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (data.success) {
        setFormImageUrl(data.url);
        // Refresh available photos
        const pRes = await fetch('/api/photos');
        const pData = await pRes.json();
        if (pData.success) setAvailablePhotos(pData.photos);
        showToast('Photo importée avec succès');
      } else {
        showToast(data.error || 'Erreur lors du téléversement', 'error');
      }
    } catch (err) {
      showToast('Erreur de téléversement', 'error');
    } finally {
      setUploading(false);
    }
  };

  // Metrics
  const activeSlidesCount = slides.filter(s => s.active !== false).length;
  const announcementsCount = slides.filter(s => s.type === 'announcement' && s.active !== false).length;
  const photosCount = slides.filter(s => s.type === 'photo' && s.active !== false).length;
  const totalDurationSeconds = Math.round(
    slides.filter(s => s.active !== false).reduce((acc, s) => acc + (s.duration || 5000), 0) / 1000
  );

  return (
    <div className="min-h-screen bg-[#07090E] text-slate-100 font-sans pb-24">
      {/* Toast Notification */}
      {notification && (
        <div className={`fixed top-6 right-6 z-50 flex items-center gap-3 px-5 py-3 rounded-lg shadow-2xl border text-sm font-semibold transition-all ${
          notification.type === 'success' 
            ? 'bg-emerald-950/90 border-emerald-500 text-emerald-200' 
            : 'bg-rose-950/90 border-rose-500 text-rose-200'
        }`}>
          {notification.type === 'success' ? <Check className="w-4 h-4 text-emerald-400" /> : <X className="w-4 h-4 text-rose-400" />}
          {notification.message}
        </div>
      )}

      {/* Header */}
      <header className="border-b border-slate-800/80 bg-[#0B0F17]/90 sticky top-0 z-30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-700 flex items-center justify-center text-black font-black text-xl shadow-lg shadow-amber-500/20">
              7B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold text-white tracking-tight">Seven B Digital Signage</h1>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Régie TV
                </span>
              </div>
              <p className="text-xs text-slate-400">Contrôle de diffusion sur écran de télévision • Réception Seven B</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2.5 flex-wrap">
            <button
              onClick={() => openCreateModal('announcement')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer"
            >
              <Megaphone className="w-4 h-4" />
              + Créer une Annonce
            </button>

            <button
              onClick={() => openCreateModal('photo')}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-semibold text-sm border border-slate-700 transition-all cursor-pointer"
            >
              <ImageIcon className="w-4 h-4 text-amber-400" />
              + Ajouter une Photo
            </button>

            <Link
              href="/"
              target="_blank"
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-md shadow-blue-600/20 transition-all"
            >
              <Tv className="w-4 h-4" />
              <span>Ouvrir l'Écran TV</span>
              <ExternalLink className="w-3.5 h-3.5 opacity-70" />
            </Link>

            <button
              onClick={handleResetDefaults}
              title="Restaurer les 11 diapositives officielles"
              className="p-2 rounded-lg bg-slate-800/80 hover:bg-slate-700 text-slate-400 hover:text-white border border-slate-700 transition-all cursor-pointer"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 pt-8">
        {/* Metric Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <div className="p-4 rounded-xl bg-[#111622] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Diapositives Actives</div>
              <div className="text-2xl font-black text-white mt-1">{activeSlidesCount} <span className="text-xs text-slate-500 font-normal">/ {slides.length}</span></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Tv className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111622] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Annonces & Pubs</div>
              <div className="text-2xl font-black text-amber-400 mt-1">{announcementsCount}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Megaphone className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111622] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Photos d'Ambiance</div>
              <div className="text-2xl font-black text-blue-400 mt-1">{photosCount}</div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <ImageIcon className="w-5 h-5" />
            </div>
          </div>

          <div className="p-4 rounded-xl bg-[#111622] border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Cycle de Boucle</div>
              <div className="text-2xl font-black text-white mt-1">~{totalDurationSeconds} <span className="text-xs text-slate-500 font-normal">sec</span></div>
            </div>
            <div className="w-10 h-10 rounded-lg bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
          </div>
        </div>

        {/* Slide List Header */}
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-lg font-bold text-white">Ordre de diffusion sur la télévision</h2>
            <p className="text-xs text-slate-400">Glissez ou utilisez les flèches pour changer l'ordre d'apparition des diapositives.</p>
          </div>
          <div className="text-xs text-slate-400">
            Mise à jour en temps réel sur la TV
          </div>
        </div>

        {/* Slide List */}
        {loading ? (
          <div className="py-20 text-center text-slate-500">Chargement des diapositives...</div>
        ) : slides.length === 0 ? (
          <div className="py-20 text-center border border-dashed border-slate-800 rounded-2xl">
            <Tv className="w-12 h-12 mx-auto text-slate-600 mb-3" />
            <p className="text-slate-300 font-semibold">Aucune diapositive configurée</p>
            <button
              onClick={handleResetDefaults}
              className="mt-4 px-4 py-2 rounded-lg bg-amber-500 text-black font-bold text-sm cursor-pointer"
            >
              Charger les 11 diapositives officielles Seven B
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {slides.map((slide, index) => {
              const isActive = slide.active !== false;
              const isAnnouncement = slide.type === 'announcement';

              return (
                <div
                  key={slide.id}
                  className={`p-4 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive 
                      ? 'bg-[#111622] border-slate-800 hover:border-slate-700' 
                      : 'bg-[#0B0E14] border-slate-900 opacity-50'
                  }`}
                >
                  {/* Left: Reorder & Thumbnail */}
                  <div className="flex items-center gap-4">
                    {/* Position & Order Controls */}
                    <div className="flex flex-col items-center">
                      <button
                        onClick={() => handleMove(index, 'up')}
                        disabled={index === 0}
                        className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Monter"
                      >
                        <ChevronUp className="w-4 h-4" />
                      </button>
                      <span className="text-xs font-mono font-bold text-slate-400 my-0.5">#{index + 1}</span>
                      <button
                        onClick={() => handleMove(index, 'down')}
                        disabled={index === slides.length - 1}
                        className="p-1 text-slate-500 hover:text-white disabled:opacity-20 cursor-pointer"
                        title="Descendre"
                      >
                        <ChevronDown className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Thumbnail */}
                    <div className="relative w-28 h-16 rounded-lg overflow-hidden bg-black flex-shrink-0 border border-slate-800">
                      <Image
                        src={slide.imageUrl}
                        alt={slide.title || 'Slide thumbnail'}
                        fill
                        className="object-cover"
                      />
                      <span className={`absolute top-1 left-1 px-1.5 py-0.5 rounded text-[9px] font-extrabold uppercase tracking-wider ${
                        isAnnouncement ? 'bg-amber-500 text-black' : 'bg-blue-600 text-white'
                      }`}>
                        {isAnnouncement ? 'Annonce' : 'Photo'}
                      </span>
                    </div>

                    {/* Content Details */}
                    <div>
                      <div className="flex items-center gap-2">
                        {slide.category && (
                          <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-2 py-0.5 rounded border border-amber-500/20">
                            {slide.category}
                          </span>
                        )}
                        <span className="text-xs text-slate-500 font-mono">
                          {Math.round((slide.duration || 5000) / 1000)}s d'affichage
                        </span>
                      </div>
                      <h3 className="text-sm font-bold text-white mt-1">
                        {slide.title || <span className="text-slate-500 italic">Photo d'ambiance sans titre</span>}
                      </h3>
                      {slide.description && (
                        <p className="text-xs text-slate-400 line-clamp-1 mt-0.5 max-w-xl">
                          {slide.description}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Right: Actions */}
                  <div className="flex items-center gap-2 self-end sm:self-center">
                    {/* Active Toggle */}
                    <button
                      onClick={() => handleToggleActive(slide)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                        isActive
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 hover:bg-emerald-500/25'
                          : 'bg-slate-800 border-slate-700 text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {isActive ? 'Actif' : 'Masqué'}
                    </button>

                    {/* Edit */}
                    <button
                      onClick={() => openEditModal(slide)}
                      className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 transition-all cursor-pointer"
                      title="Modifier"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>

                    {/* Delete */}
                    <button
                      onClick={() => handleDeleteSlide(slide.id)}
                      className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/30 transition-all cursor-pointer"
                      title="Supprimer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* CREATE / EDIT MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-[#111622] border border-slate-800 rounded-2xl w-full max-w-3xl overflow-hidden shadow-2xl my-8">
            {/* Modal Header */}
            <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-amber-500" />
                <h3 className="font-bold text-white text-lg">
                  {editingSlide ? 'Modifier la diapositive' : 'Créer une nouvelle diapositive'}
                </h3>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveSlide} className="p-6 space-y-6">
              {/* Type Switcher */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                  Type d'affichage
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormType('announcement')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      formType === 'announcement'
                        ? 'bg-amber-500/15 border-amber-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <Megaphone className={`w-5 h-5 ${formType === 'announcement' ? 'text-amber-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-bold text-sm">Annonce / Publicité</div>
                      <div className="text-[11px] opacity-75">Titre grand format, message et badge doré</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFormType('photo')}
                    className={`p-3 rounded-xl border flex items-center gap-3 transition-all cursor-pointer text-left ${
                      formType === 'photo'
                        ? 'bg-blue-500/15 border-blue-500 text-white shadow-md'
                        : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <ImageIcon className={`w-5 h-5 ${formType === 'photo' ? 'text-blue-400' : 'text-slate-500'}`} />
                    <div>
                      <div className="font-bold text-sm">Photo Plein Écran</div>
                      <div className="text-[11px] opacity-75">Image 16:9 avec cartouche d'information discret</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Photo Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                    Sélectionner la photo d'arrière-plan
                  </label>
                  
                  {/* Upload new photo button */}
                  <label className="flex items-center gap-1.5 text-xs font-bold text-amber-400 hover:text-amber-300 cursor-pointer">
                    <Upload className="w-3.5 h-3.5" />
                    <span>{uploading ? 'Téléversement...' : 'Importer une photo de mon PC'}</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Photo grid picker */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2 max-h-44 overflow-y-auto p-2 bg-[#0B0E14] rounded-xl border border-slate-800">
                  {availablePhotos.map((photo) => {
                    const isSelected = formImageUrl === photo.url;
                    return (
                      <div
                        key={photo.url}
                        onClick={() => setFormImageUrl(photo.url)}
                        className={`relative aspect-video rounded-lg overflow-hidden cursor-pointer border-2 transition-all ${
                          isSelected ? 'border-amber-500 ring-2 ring-amber-500/40 scale-95' : 'border-transparent hover:opacity-80'
                        }`}
                        title={photo.label}
                      >
                        <Image
                          src={photo.url}
                          alt={photo.label}
                          fill
                          className="object-cover"
                        />
                        {isSelected && (
                          <div className="absolute inset-0 bg-amber-500/30 flex items-center justify-center">
                            <Check className="w-5 h-5 text-white drop-shadow" />
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Category & Duration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-2">
                    Catégorie
                  </label>
                  <div className="flex flex-wrap gap-1.5">
                    {categories.map((cat) => (
                      <button
                        type="button"
                        key={cat}
                        onClick={() => setFormCategory(cat)}
                        className={`px-2.5 py-1 rounded-md text-xs font-semibold transition-all cursor-pointer ${
                          formCategory === cat
                            ? 'bg-amber-500 text-black font-bold'
                            : 'bg-slate-800 text-slate-400 hover:text-white'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                      Durée d'affichage
                    </label>
                    <span className="text-xs font-mono font-bold text-amber-400">
                      {Math.round(formDuration / 1000)} secondes
                    </span>
                  </div>
                  <input
                    type="range"
                    min="3000"
                    max="15000"
                    step="1000"
                    value={formDuration}
                    onChange={(e) => setFormDuration(Number(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] text-slate-500 font-mono mt-1">
                    <span>3s (Rapide)</span>
                    <span>5s (Standard)</span>
                    <span>15s (Long)</span>
                  </div>
                </div>
              </div>

              {/* Title & Description */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Titre {formType === 'photo' ? '(Optionnel)' : ''}
                </label>
                <input
                  type="text"
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="Ex: Bienvenue à Seven B Hôtel / Soirée Dégustation / Spa & Jacuzzi"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 focus:border-amber-500 focus:outline-none text-white text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Description / Message à diffuser
                </label>
                <textarea
                  rows={3}
                  value={formDescription}
                  onChange={(e) => setFormDescription(e.target.value)}
                  placeholder="Ex: Profitez d'un moment inoubliable avec nos suites équipées et notre room service disponible 24h/24..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#0B0E14] border border-slate-800 focus:border-amber-500 focus:outline-none text-white text-sm leading-relaxed"
                />
              </div>

              {/* Live Preview Box */}
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
                  Aperçu simulé sur TV 16:9
                </label>
                <div className="relative aspect-video w-full rounded-xl overflow-hidden border border-slate-700 bg-black flex items-center justify-center text-center shadow-inner">
                  {formImageUrl && (
                    <Image
                      src={formImageUrl}
                      alt="Aperçu"
                      fill
                      className="object-cover"
                    />
                  )}
                  {formType === 'announcement' ? (
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/70 flex flex-col items-center justify-center p-6 text-center">
                      <div className="text-[10px] font-bold text-white uppercase tracking-[0.3em] mb-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        SEVEN B • {formCategory}
                      </div>
                      <h4 className="text-xl sm:text-2xl font-black text-white leading-tight drop-shadow-[0_3px_14px_rgba(0,0,0,0.95)]">
                        {formTitle || 'Titre de l\'annonce'}
                      </h4>
                      <p className="text-xs sm:text-sm text-white/90 font-light mt-2 max-w-md line-clamp-2 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                        {formDescription || 'Le texte de votre annonce sera affiché en blanc pur sur grand écran.'}
                      </p>
                    </div>
                  ) : (
                    <div className="absolute bottom-4 left-4 text-left max-w-xs pointer-events-none">
                      <div className="text-[9px] font-bold uppercase tracking-wider text-white drop-shadow-[0_1px_6px_rgba(0,0,0,0.9)]">{formCategory}</div>
                      <div className="text-sm font-bold text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]">{formTitle || 'Photo Seven B'}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-semibold text-sm cursor-pointer"
                >
                  Annuler
                </button>
                <button
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-bold text-sm shadow-lg shadow-amber-500/20 cursor-pointer"
                >
                  <Check className="w-4 h-4" />
                  {editingSlide ? 'Enregistrer les modifications' : 'Ajouter à la diffusion TV'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
