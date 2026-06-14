import { useState } from "react";
import { useTheme } from "@/theme";
import { useCompanyProfile, useUpdateCompanyProfile } from "../Hooks/useHiring";
import { FiUploadCloud, FiTrash2, FiMaximize2 } from "react-icons/fi";

const MediaManagementPage = () => {
  const { theme } = useTheme();
  const { data: profile, isLoading } = useCompanyProfile();
  const updateProfileMutation = useUpdateCompanyProfile();

  const [dragActive, setDragActive] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  const mediaList = profile?.media || [];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (file.size > 500 * 1024) {
        alert("For LocalStorage storage preservation in this simulation, uploaded photos are limited to 500KB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          const newUrl = event.target.result;
          const updatedMedia = [...mediaList, newUrl];
          updateProfileMutation.mutate({ media: updatedMedia });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (file.size > 500 * 1024) {
        alert("For LocalStorage storage preservation in this simulation, uploaded photos are limited to 500KB. Please upload a smaller image.");
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result && typeof event.target.result === "string") {
          const newUrl = event.target.result;
          const updatedMedia = [...mediaList, newUrl];
          updateProfileMutation.mutate({ media: updatedMedia });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDelete = (indexToDelete: number) => {
    const updatedMedia = mediaList.filter((_, idx) => idx !== indexToDelete);
    updateProfileMutation.mutate({ media: updatedMedia });
  };

  if (isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="text-sm font-medium animate-pulse" style={{ color: theme.text.secondary }}>
          Loading media assets...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto p-6 lg:p-10" style={{ backgroundColor: theme.bg.page }}>
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col gap-1 mb-8">
          <h1 className="text-2xl font-bold tracking-tight" style={{ color: theme.text.primary }}>
            Gallery & Media Assets
          </h1>
          <p className="text-sm" style={{ color: theme.text.secondary }}>
            Upload, remove, and manage photos of your workspace, culture events, and community office days.
          </p>
        </div>

        {/* Upload Box */}
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          className="relative border-2 border-dashed rounded-xl p-8 mb-8 flex flex-col items-center justify-center cursor-pointer transition-all duration-150"
          style={{
            borderColor: dragActive ? theme.primary.default : theme.border.default,
            backgroundColor: dragActive ? theme.bg.surfaceSecondary : theme.bg.surface,
          }}
        >
          <input
            type="file"
            id="media-file-input"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={handleFileInput}
          />
          <FiUploadCloud className="w-10 h-10 mb-3" style={{ color: theme.text.muted }} />
          <p className="text-sm font-semibold mb-1" style={{ color: theme.text.primary }}>
            Drag and drop images here, or click to browse files
          </p>
          <p className="text-xs" style={{ color: theme.text.muted }}>
            Supports PNG, JPEG, WEBP up to 5MB. Images will be optimized dynamically.
          </p>
        </div>

        {/* Gallery Grid */}
        <h2 className="text-sm font-semibold uppercase tracking-wider mb-4" style={{ color: theme.text.secondary }}>
          Uploaded Assets ({mediaList.length})
        </h2>

        {mediaList.length === 0 ? (
          <div
            className="text-center py-16 rounded-xl border"
            style={{ backgroundColor: theme.bg.surface, borderColor: theme.border.default }}
          >
            <p className="text-sm" style={{ color: theme.text.muted }}>
              No gallery images uploaded yet. Upload workspace shots to show company culture!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {mediaList.map((url, idx) => (
              <div
                key={idx}
                className="group relative h-48 rounded-xl overflow-hidden border shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ borderColor: theme.border.default, backgroundColor: theme.bg.surfaceSecondary }}
              >
                <img src={url} alt={`Culture shot ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105" />

                {/* Overlays / Control bar */}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150 flex items-center justify-center gap-3">
                  <button
                    onClick={() => setFullscreenImage(url)}
                    className="p-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors duration-100"
                    title="Fullscreen Preview"
                  >
                    <FiMaximize2 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(idx)}
                    className="p-2.5 rounded-lg bg-red-500/80 hover:bg-red-500 text-white transition-colors duration-100"
                    title="Delete Image"
                  >
                    <FiTrash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-black/50 text-white backdrop-blur-sm">
                  Culture Shot {idx + 1}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox / Fullscreen Modal */}
      {fullscreenImage && (
        <div
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-sm flex items-center justify-center p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-4xl max-h-[85vh] overflow-hidden rounded-xl">
            <img src={fullscreenImage} alt="Fullscreen View" className="max-w-full max-h-[85vh] object-contain" />
            <button
              onClick={() => setFullscreenImage(null)}
              className="absolute top-4 right-4 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur"
            >
              Close Preview
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagementPage;
