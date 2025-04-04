// src/components/BookmarkForm.tsx
import React, { useState, useEffect, useRef } from 'react';
import { Bookmark } from '../types';
import styles from './BookmarkForm.module.css';

interface Props {
  bookmarkToEdit: Bookmark | null;
  onSave: (bookmark: Omit<Bookmark, 'id'> | Bookmark) => void;
  onCancel: () => void;
}

const BookmarkForm: React.FC<Props> = ({ bookmarkToEdit, onSave, onCancel }) => {
  const [name, setName] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [customIconUrl, setCustomIconUrl] = useState('');
  const [customIconData, setCustomIconData] = useState<string | undefined>(undefined); // For Base64
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (bookmarkToEdit) {
      setName(bookmarkToEdit.name);
      setUrl1(bookmarkToEdit.url1);
      setUrl2(bookmarkToEdit.url2 || '');
      // Prioritize Base64 data if it exists, otherwise use URL
      if (bookmarkToEdit.customIconData) {
          setCustomIconData(bookmarkToEdit.customIconData);
          setCustomIconUrl(''); // Clear URL field if Base64 is used
      } else {
          setCustomIconUrl(bookmarkToEdit.iconUrl || '');
          setCustomIconData(undefined); // Clear Base64 data if URL is used
      }
    } else {
      // Reset form for adding new
      setName('');
      setUrl1('');
      setUrl2('');
      setCustomIconUrl('');
      setCustomIconData(undefined);
    }
  }, [bookmarkToEdit]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCustomIconData(reader.result as string); // Store as Base64
        setCustomIconUrl(''); // Clear custom URL if file is uploaded
         // Reset file input value so the same file can be selected again if needed
        if(fileInputRef.current) {
            fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !url1) {
      alert('Name and Primary URL are required.');
      return;
    }

    // Basic URL validation (you might want a more robust check)
    const isValidUrl = (url: string) => url === '' || url.startsWith('http://') || url.startsWith('https://');
    if (!isValidUrl(url1) || !isValidUrl(url2) || !isValidUrl(customIconUrl)) {
        alert('Please enter valid URLs (starting with http:// or https://), or leave optional fields blank.');
        return;
    }

    const bookmarkData: Omit<Bookmark, 'id' | 'iconUrl' | 'customIconData'> & { iconUrl?: string; customIconData?: string } = {
      name,
      url1,
      url2: url2 || undefined, // Store undefined if empty
    };

    // Determine which icon source to save
    if (customIconData) {
        bookmarkData.customIconData = customIconData;
        bookmarkData.iconUrl = undefined; // Ensure iconUrl is not saved if Base64 is present
    } else if (customIconUrl) {
        bookmarkData.iconUrl = customIconUrl;
        bookmarkData.customIconData = undefined; // Ensure Base64 is not saved
    } else {
         // If neither custom icon is set, iconUrl and customIconData will be undefined.
         // The BookmarkItem will attempt auto-detection based on url1.
         bookmarkData.iconUrl = undefined;
         bookmarkData.customIconData = undefined;
    }


    if (bookmarkToEdit) {
      onSave({ ...bookmarkData, id: bookmarkToEdit.id });
    } else {
      onSave(bookmarkData); // Let useBookmarks handle ID generation
    }
  };

  return (
    <div className={styles.modalOverlay}>
        <div className={styles.modalContent}>
            <h2>{bookmarkToEdit ? 'Edit Bookmark' : 'Add New Bookmark'}</h2>
            <form onSubmit={handleSubmit}>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name:</label>
                    <input type="text" id="name" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="url1">Primary URL (required):</label>
                    <input type="url" id="url1" value={url1} onChange={(e) => setUrl1(e.target.value)} required placeholder="https://example.com" />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="url2">Secondary URL (optional):</label>
                    <input type="url" id="url2" value={url2} onChange={(e) => setUrl2(e.target.value)} placeholder="https://backup.example.com"/>
                </div>
                 <div className={styles.formGroup}>
                    <label>Custom Icon:</label>
                    <div className={styles.iconOptions}>
                        <span>Option 1: Upload File</span>
                        <input type="file" accept="image/*" onChange={handleFileChange} ref={fileInputRef}/>
                        {customIconData && <img src={customIconData} alt="Preview" className={styles.iconPreview} />}
                        <span>Option 2: Enter Icon URL</span>
                        <input
                            type="url"
                            placeholder="https://example.com/icon.png"
                            value={customIconUrl}
                            onChange={(e) => { setCustomIconUrl(e.target.value); setCustomIconData(undefined); }} // Clear Base64 if URL is typed
                        />
                        {customIconUrl && !customIconData && <img src={customIconUrl} alt="Preview" className={styles.iconPreview} />}
                    </div>
                    <small>If no custom icon is provided, the site's favicon will be attempted.</small>
                </div>

                <div className={styles.formActions}>
                    <button type="submit" className={styles.saveButton}>Save</button>
                    <button type="button" onClick={onCancel} className={styles.cancelButton}>Cancel</button>
                </div>
            </form>
        </div>
    </div>

  );
};

export default BookmarkForm;
