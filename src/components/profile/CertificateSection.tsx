import { useState, useRef } from "react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import {
  Plus,
  Trash2,
  ExternalLink,
  Upload,
  X,
  Loader,
  Award,
} from "lucide-react";
import {
  ImageUploadService,
  uploadPortfolioImage,
} from "../../api/upload/imageUpload";
import type { Certification } from "../../types/profile";

const MAX_CERTIFICATES = 20;

interface CertificateSectionProps {
  certifications: Certification[];
  isEditing: boolean;
  showAddCertificate: boolean;
  newCertificateItem: Omit<Certification, "id">;
  onShowAddCertificateChange: (show: boolean) => void;
  onNewCertificateItemChange: (item: Omit<Certification, "id">) => void;
  onAddCertificateItem: () => void;
  onRemoveCertificateItem: (id: number) => void;
}

export function CertificateSection({
  certifications,
  isEditing,
  showAddCertificate,
  newCertificateItem,
  onShowAddCertificateChange,
  onNewCertificateItemChange,
  onAddCertificateItem,
  onRemoveCertificateItem,
}: CertificateSectionProps) {
  const [uploadingImage, setUploadingImage] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    field: keyof Omit<Certification, "id">,
    value: string,
  ) => {
    onNewCertificateItemChange({
      ...newCertificateItem,
      [field]: value,
    });
  };

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate and create preview
    const validation = ImageUploadService.validateImage(file);
    if (!validation.valid) {
      setUploadError(validation.error);
      return;
    }

    setUploadError(null);
    const previewUrl = ImageUploadService.createPreviewUrl(file);
    setImagePreview(previewUrl);

    // Upload the image
    uploadImageFile(file);
  };

  const uploadImageFile = async (file: File) => {
    setUploadingImage(true);
    setUploadProgress(0);

    try {
      const result = await uploadPortfolioImage(file, (progress) => {
        setUploadProgress(progress.percentage);
      });

      // Update the certificate item with the uploaded image URL
      handleChange("certificate", result.secure_url);

      // Clean up preview URL
      if (imagePreview) {
        ImageUploadService.revokePreviewUrl(imagePreview);
        setImagePreview(null);
      }
    } catch (error) {
      setUploadError(error instanceof Error ? error.message : "Upload failed");
      // Clean up preview URL on error
      if (imagePreview) {
        ImageUploadService.revokePreviewUrl(imagePreview);
        setImagePreview(null);
      }
    } finally {
      setUploadingImage(false);
      setUploadProgress(0);
    }
  };

  const removeImage = () => {
    handleChange("certificate", "");
    if (imagePreview) {
      ImageUploadService.revokePreviewUrl(imagePreview);
      setImagePreview(null);
    }
    setUploadError(null);
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold">Certifications</h3>

        {isEditing && certifications.length < MAX_CERTIFICATES && (
          <Button
            onClick={() => onShowAddCertificateChange(true)}
            className="bg-[#0084ca] hover:bg-[#006ba6]"
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Certificate
          </Button>
        )}
      </div>

      {/* Empty State */}
      {certifications.length === 0 && !showAddCertificate && (
        <div className="text-center border-2 border-dashed rounded-xl p-10">
          <Award className="w-12 h-12 mx-auto mb-3 text-gray-400" />
          <p className="text-gray-500 mb-3">
            Showcase your professional certifications
          </p>
          {isEditing && (
            <Button onClick={() => onShowAddCertificateChange(true)}>
              Add your first certificate
            </Button>
          )}
        </div>
      )}

      {/* Add Form */}
      {showAddCertificate && (
        <div className="p-5 border rounded-xl space-y-4 bg-gray-50 dark:bg-gray-800">
          <h4 className="font-semibold">Add Certificate</h4>

          {/* Image Upload Section */}
          <div className="space-y-3">
            <label className="text-sm font-medium">Certificate Image</label>

            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleImageSelect}
              className="hidden"
            />

            {/* Image Preview/Upload Area */}
            <div className="relative">
              {newCertificateItem.certificate || imagePreview ? (
                <div className="relative">
                  <img
                    src={imagePreview || newCertificateItem.certificate}
                    alt="Certificate preview"
                    className="w-full h-48 object-cover rounded-lg"
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={removeImage}
                      className="p-2"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                  {uploadingImage && (
                    <div className="absolute inset-0 bg-black/50 rounded-lg flex items-center justify-center">
                      <div className="text-white text-center">
                        <Loader className="w-8 h-8 animate-spin mx-auto mb-2" />
                        <p className="text-sm">
                          Uploading... {uploadProgress}%
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div
                  onClick={triggerFileSelect}
                  className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center cursor-pointer hover:border-[#0084ca] transition-colors"
                >
                  <Upload className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                  <p className="text-gray-600 dark:text-gray-300 mb-2">
                    Click to upload certificate image
                  </p>
                  <p className="text-xs text-gray-500">
                    JPEG, PNG, GIF, WebP (max 10MB)
                  </p>
                </div>
              )}
            </div>

            {/* Upload Error */}
            {uploadError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-600">{uploadError}</p>
              </div>
            )}

            {/* Upload Progress */}
            {uploadingImage && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Uploading image...</span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-[#0084ca] h-2 rounded-full transition-all duration-300"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          <Input
            placeholder="Certificate Name"
            value={newCertificateItem.name}
            onChange={(e) => handleChange("name", e.target.value)}
          />

          <Input
            placeholder="Issuing Organization"
            value={newCertificateItem.issuer}
            onChange={(e) => handleChange("issuer", e.target.value)}
          />

          <Input
            placeholder="Year (e.g., 2024)"
            value={newCertificateItem.year}
            onChange={(e) => handleChange("year", e.target.value)}
          />

          <div className="flex gap-2">
            <Button onClick={onAddCertificateItem} disabled={uploadingImage}>
              {uploadingImage ? (
                <>
                  <Loader className="w-4 h-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                "Save Certificate"
              )}
            </Button>
            <Button
              variant="outline"
              onClick={() => onShowAddCertificateChange(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* Certificates Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {certifications.map((cert) => (
          <div
            key={cert.id}
            className="group rounded-xl overflow-hidden border hover:shadow-xl transition"
          >
            {/* Certificate Image */}
            <div className="relative h-52 overflow-hidden">
              {cert.certificate ? (
                <>
                  <img
                    src={cert.certificate}
                    alt={cert.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                    onError={() => {
                      console.error("Image failed to load:", cert.certificate);
                    }}
                    onLoad={() => {
                      console.log(
                        "Image loaded successfully:",
                        cert.certificate,
                      );
                    }}
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center gap-3">
                    <a
                      href={cert.certificate}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-white text-black px-3 py-2 rounded-lg text-sm flex items-center gap-2"
                    >
                      <ExternalLink className="w-4 h-4" />
                      View
                    </a>

                    {isEditing && (
                      <button
                        onClick={() => onRemoveCertificateItem(cert.id)}
                        className="bg-red-500 text-white p-2 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center">
                  <Award className="w-16 h-16 text-gray-400" />
                </div>
              )}
            </div>

            {/* Certificate Content */}
            <div className="p-4 space-y-2">
              <h4 className="font-semibold">{cert.name}</h4>
              <p className="text-sm text-gray-500">{cert.issuer}</p>
              <p className="text-xs text-gray-400">{cert.year}</p>
              {/* Debug Info - Show URL for troubleshooting */}
              <p className="text-xs text-blue-500 truncate">
                {cert.certificate ? "Image: YES" : "Image: NO"}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Debug Section - Show first certificate details */}
      {certifications.length > 0 && (
        <div className="mt-6 p-4 border rounded bg-gray-50">
          <h4 className="font-semibold mb-2">Debug Info</h4>
          {certifications.slice(0, 1).map((cert) => (
            <div key={cert.id} className="space-y-2">
              <p className="text-sm">
                <strong>Certificate:</strong> {cert.name}
              </p>
              <p className="text-xs text-gray-500 break-all">
                <strong>Image URL:</strong> {cert.certificate || "No image URL"}
              </p>
              <div className="flex items-center space-x-4">
                {cert.certificate && (
                  <>
                    <p className="text-sm">
                      <strong>Test Image:</strong>
                    </p>
                    <img
                      src={cert.certificate}
                      alt="Test certificate"
                      className="w-24 h-24 object-cover border"
                      onError={() => console.error("Test image failed to load")}
                      onLoad={() =>
                        console.log("Test image loaded successfully")
                      }
                    />
                  </>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
