import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Link2, Image, Upload, X, AlertCircle, Plus, GripVertical, Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { ImageCropper } from '@/components/ImageCropper';

interface MediaItem {
  type: 'video' | 'image';
  url: string;
}

interface MediaUploadProps {
  value: string[]; // Array of URLs (both video and image)
  onChange: (urls: string[]) => void;
  hasError?: boolean;
}

const isValidUrl = (string: string): boolean => {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
};

const isImageUrl = (url: string): boolean => {
  // Check if it's from our storage bucket or common image extensions
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.gif', '.webp', '.svg', '.bmp'];
  const lowercaseUrl = url.toLowerCase();
  
  // Check for storage bucket URLs
  if (url.includes('project-thumbnails') || url.includes('supabase.co/storage')) {
    return true;
  }
  
  // Check for common image extensions
  return imageExtensions.some(ext => lowercaseUrl.includes(ext));
};

const isVideoUrl = (url: string): boolean => {
  const lowercaseUrl = url.toLowerCase();
  return lowercaseUrl.includes('youtube') || 
         lowercaseUrl.includes('youtu.be') || 
         lowercaseUrl.includes('vimeo') ||
         lowercaseUrl.includes('.mp4') ||
         lowercaseUrl.includes('.mov') ||
         lowercaseUrl.includes('.webm');
};

export const MediaUpload = ({ value, onChange, hasError }: MediaUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [showCropper, setShowCropper] = useState(false);
  const [imageToCrop, setImageToCrop] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const invalidUrls = value.filter(url => !isValidUrl(url));

  const uploadImage = async (blob: Blob, extension: string = 'jpg') => {
    setIsUploading(true);
    try {
      const fileName = `media-${Date.now()}-${Math.random().toString(36).substring(7)}.${extension}`;
      
      const { error: uploadError } = await supabase.storage
        .from('project-thumbnails')
        .upload(fileName, blob, {
          contentType: `image/${extension}`,
          upsert: false
        });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-thumbnails')
        .getPublicUrl(fileName);

      onChange([...value, publicUrl]);
      toast({
        title: "Image uploaded",
        description: "Your image has been added to the media list.",
      });
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "Failed to upload image. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please select an image file.",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please select an image under 10MB.",
        variant: "destructive",
      });
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      setImageToCrop(e.target?.result as string);
      setShowCropper(true);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) {
      processFile(file);
    }
  }, []);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleCropComplete = (croppedBlob: Blob) => {
    setShowCropper(false);
    setImageToCrop(null);
    uploadImage(croppedBlob, 'jpg');
  };

  const handleAddUrl = () => {
    const urls = urlInput.split('\n').map(u => u.trim()).filter(u => u);
    if (urls.length > 0) {
      onChange([...value, ...urls]);
      setUrlInput('');
    }
  };

  const handleRemoveItem = (index: number) => {
    const newValue = [...value];
    newValue.splice(index, 1);
    onChange(newValue);
  };

  const moveItem = (index: number, direction: 'up' | 'down') => {
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === value.length - 1)
    ) {
      return;
    }
    
    const newValue = [...value];
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [newValue[index], newValue[newIndex]] = [newValue[newIndex], newValue[index]];
    onChange(newValue);
  };

  const getMediaType = (url: string): 'video' | 'image' | 'unknown' => {
    if (isImageUrl(url)) return 'image';
    if (isVideoUrl(url)) return 'video';
    return 'unknown';
  };

  const getYouTubeThumbnail = (url: string): string | null => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|shorts\/)([^#&?]*).*/;
    const match = url.match(regExp);
    if (match && match[2].length === 11) {
      return `https://img.youtube.com/vi/${match[2]}/mqdefault.jpg`;
    }
    return null;
  };

  return (
    <div className="space-y-4">
      <Label className="text-white flex items-center gap-2">
        <Link2 className="w-4 h-4" />
        Media (Videos & Images)
      </Label>

      {/* Current Media List */}
      {value.length > 0 && (
        <div className="space-y-2">
          <Label className="text-white/70 text-sm">Current Media ({value.length})</Label>
          <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
            {value.map((url, index) => {
              const mediaType = getMediaType(url);
              const isValid = isValidUrl(url);
              const ytThumb = mediaType === 'video' ? getYouTubeThumbnail(url) : null;
              
              return (
                <div
                  key={index}
                  className={`flex items-center gap-2 p-2 rounded-lg bg-white/5 border ${
                    isValid ? 'border-white/10' : 'border-red-500/50'
                  }`}
                >
                  <GripVertical className="w-4 h-4 text-white/40 cursor-move flex-shrink-0" />
                  
                  {/* Preview */}
                  <div className="w-12 h-12 rounded bg-white/10 overflow-hidden flex-shrink-0">
                    {mediaType === 'image' && isValid ? (
                      <img src={url} alt="" className="w-full h-full object-cover" />
                    ) : ytThumb ? (
                      <img src={ytThumb} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        {mediaType === 'video' ? (
                          <Link2 className="w-5 h-5 text-white/40" />
                        ) : (
                          <Image className="w-5 h-5 text-white/40" />
                        )}
                      </div>
                    )}
                  </div>
                  
                  {/* URL and Type */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-xs px-1.5 py-0.5 rounded ${
                        mediaType === 'image' ? 'bg-blue-500/20 text-blue-400' :
                        mediaType === 'video' ? 'bg-purple-500/20 text-purple-400' :
                        'bg-gray-500/20 text-gray-400'
                      }`}>
                        {mediaType === 'image' ? 'Image' : mediaType === 'video' ? 'Video' : 'Link'}
                      </span>
                      {!isValid && (
                        <span className="text-xs text-red-400 flex items-center gap-1">
                          <AlertCircle className="w-3 h-3" />
                          Invalid URL
                        </span>
                      )}
                    </div>
                    <p className="text-white/70 text-sm truncate mt-0.5">{url}</p>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10"
                      onClick={() => moveItem(index, 'up')}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-white/50 hover:text-white hover:bg-white/10"
                      onClick={() => moveItem(index, 'down')}
                      disabled={index === value.length - 1}
                    >
                      ↓
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-red-400 hover:text-red-300 hover:bg-red-500/10"
                      onClick={() => handleRemoveItem(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add URL Section */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Add Video/Image URLs</Label>
        <div className="flex gap-2">
          <Textarea
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            className="bg-white/10 border-white/20 text-white placeholder:text-white/40 min-h-[80px] flex-1"
            placeholder="Paste video or image URLs (one per line)&#10;e.g. https://youtu.be/abc123&#10;e.g. https://example.com/image.jpg"
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={handleAddUrl}
          disabled={!urlInput.trim()}
          className="bg-white/10 border-white/20 text-white hover:bg-white/20"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add URLs
        </Button>
      </div>

      {/* Upload Image Section */}
      <div className="space-y-2">
        <Label className="text-white/70 text-sm">Or Upload Images</Label>
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragOver
              ? 'border-white/50 bg-white/10'
              : 'border-white/20 hover:border-white/40'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />
          <Upload className="w-8 h-8 mx-auto mb-2 text-white/40" />
          <p className="text-white/60 text-sm mb-2">
            {isUploading ? 'Uploading...' : 'Drag & drop an image or'}
          </p>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
            className="bg-white/10 border-white/20 text-white hover:bg-white/20"
          >
            <Image className="w-4 h-4 mr-2" />
            Browse Images
          </Button>
          <p className="text-white/40 text-xs mt-2">Max 10MB • JPG, PNG, GIF, WebP</p>
        </div>
      </div>

      {invalidUrls.length > 0 && (
        <div className="flex items-start gap-2 text-red-400 text-sm">
          <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
          <span>
            {invalidUrls.length} invalid URL(s) detected. Please fix or remove them.
          </span>
        </div>
      )}

      {/* Image Cropper Modal */}
      {imageToCrop && (
        <ImageCropper
          image={imageToCrop}
          open={showCropper}
          onClose={() => {
            setShowCropper(false);
            setImageToCrop(null);
          }}
          onCropComplete={handleCropComplete}
          aspectRatio={16 / 9}
        />
      )}
    </div>
  );
};
