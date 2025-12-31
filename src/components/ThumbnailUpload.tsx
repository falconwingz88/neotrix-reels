import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Image, Upload, X, Link2, AlertCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface ThumbnailUploadProps {
  value: string;
  onChange: (url: string) => void;
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

export const ThumbnailUpload = ({ value, onChange, hasError }: ThumbnailUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [mode, setMode] = useState<'url' | 'upload'>('url');
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const uploadFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an image file (JPG, PNG, GIF, WebP)",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File too large",
        description: "Please upload an image smaller than 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `thumbnails/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('project-thumbnails')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('project-thumbnails')
        .getPublicUrl(filePath);

      onChange(publicUrl);
      toast({
        title: "Thumbnail uploaded",
        description: "Your image has been uploaded successfully.",
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

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      uploadFile(file);
    }
  };

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      uploadFile(file);
    }
  }, []);

  const handlePaste = useCallback((e: React.ClipboardEvent) => {
    const items = e.clipboardData?.items;
    if (!items) return;

    for (const item of items) {
      if (item.type.startsWith('image/')) {
        e.preventDefault();
        const file = item.getAsFile();
        if (file) {
          uploadFile(file);
        }
        return;
      }
    }
  }, []);

  const clearThumbnail = () => {
    onChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="space-y-3">
      <Label className="text-white flex items-center gap-2">
        <Image className="w-4 h-4" />
        Thumbnail
      </Label>

      {/* Mode Toggle */}
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode('url')}
          className={`flex items-center gap-1 ${
            mode === 'url'
              ? 'bg-white/20 border-white/40 text-white'
              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Link2 className="w-3 h-3" />
          URL
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => setMode('upload')}
          className={`flex items-center gap-1 ${
            mode === 'upload'
              ? 'bg-white/20 border-white/40 text-white'
              : 'bg-white/5 border-white/20 text-white/70 hover:bg-white/10 hover:text-white'
          }`}
        >
          <Upload className="w-3 h-3" />
          Upload
        </Button>
      </div>

      {mode === 'url' ? (
        <div className="space-y-2">
          <Input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className={`bg-white/10 border-white/20 text-white placeholder:text-white/40 ${
              hasError ? 'border-red-500' : ''
            }`}
            placeholder="https://example.com/image.jpg"
          />
          {hasError && (
            <div className="flex items-start gap-2 text-red-400 text-sm">
              <AlertCircle className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Please enter a valid URL</span>
            </div>
          )}
        </div>
      ) : (
        <div
          className={`relative border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
            dragActive
              ? 'border-purple-400 bg-purple-500/10'
              : 'border-white/20 hover:border-white/40'
          } ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onPaste={handlePaste}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <div className="space-y-2">
            <Upload className="w-8 h-8 mx-auto text-white/50" />
            <p className="text-white/70 text-sm">
              {isUploading ? 'Uploading...' : 'Drag & drop, paste, or'}
            </p>
            {!isUploading && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                className="bg-white/10 border-white/20 text-white hover:bg-white/20"
              >
                Browse Files
              </Button>
            )}
            <p className="text-white/50 text-xs">
              JPG, PNG, GIF, WebP up to 5MB
            </p>
          </div>
        </div>
      )}

      {/* Preview */}
      {value && isValidUrl(value) && (
        <div className="relative inline-block">
          <img
            src={value}
            alt="Thumbnail preview"
            className="w-32 h-20 object-cover rounded-lg border border-white/20"
            onError={(e) => {
              e.currentTarget.style.display = 'none';
            }}
          />
          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={clearThumbnail}
            className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 hover:bg-red-600 text-white"
          >
            <X className="w-3 h-3" />
          </Button>
        </div>
      )}

      <p className="text-white/50 text-xs">
        Leave empty to auto-generate from YouTube link
      </p>
    </div>
  );
};
