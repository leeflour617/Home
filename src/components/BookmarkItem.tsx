// src/components/BookmarkItem.tsx
import React from 'react';
import { Bookmark } from '../types';
import styles from './BookmarkItem.module.css'; // We'll create this CSS file

interface Props {
  bookmark: Bookmark;
  onEdit: (bookmark: Bookmark) => void;
  onDelete: (id: string) => void;
}

// Helper to get the display icon
const getIconSrc = (bookmark: Bookmark): string => {
  if (bookmark.customIconData) {
    return bookmark.customIconData; // Use Base64 uploaded icon
  }
  if (bookmark.iconUrl) {
    return bookmark.iconUrl; // Use custom URL or fetched favicon URL
  }
  // Fallback: Use Google's public favicon service (adjust size 'sz=...' as needed)
  // Note: This relies on Google's service being available and CORS allowing it.
  // A server-side proxy would be more robust.
  try {
      const domain = new URL(bookmark.url1).hostname;
      return `https://www.google.com/s2/favicons?sz=32&domain=${domain}`;
      // Alternative / more direct:
      // return `https://www.google.com/s2/favicons?sz=32&domain_url=${encodeURIComponent(bookmark.url1)}`;
  } catch (e) {
      // If URL is invalid, return a default placeholder
      return '/default-icon.png'; // Make sure you have a default icon in public/
  }
};

const BookmarkItem: React.FC<Props> = ({ bookmark, onEdit, onDelete }) => {
  const iconSrc = getIconSrc(bookmark);

  const handleIconError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    // If the fetched/custom icon fails to load, use a default
    e.currentTarget.src = '/default-icon.png'; // Ensure default icon exists
  };

  return (
    <div className={styles.item}>
      <img
        src={iconSrc}
        alt={`${bookmark.name} icon`}
        className={styles.icon}
        onError={handleIconError}
        width="32"
        height="32"
      />
      <div className={styles.details}>
        <span className={styles.name}>{bookmark.name}</span>
        <div className={styles.urls}>
          <a href={bookmark.url1} target="_blank" rel="noopener noreferrer" title={bookmark.url1}>
            Primary Link
          </a>
          {bookmark.url2 && (
            <>
              {' | '}
              <a href={bookmark.url2} target="_blank" rel="noopener noreferrer" title={bookmark.url2}>
                Secondary Link
              </a>
            </>
          )}
        </div>
      </div>
      <div className={styles.actions}>
        <button onClick={() => onEdit(bookmark)} className={styles.button}>Edit</button>
        <button onClick={() => onDelete(bookmark.id)} className={`${styles.button} ${styles.deleteButton}`}>Delete</button>
      </div>
    </div>
  );
};

export default BookmarkItem;
