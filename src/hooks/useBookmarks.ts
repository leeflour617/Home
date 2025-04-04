// src/hooks/useBookmarks.ts
import { useState, useEffect, useCallback } from 'react';
import { Bookmark } from '../types';

const STORAGE_KEY = 'personalBookmarks';

export function useBookmarks() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const storedBookmarks = localStorage.getItem(STORAGE_KEY);
      if (storedBookmarks) {
        setBookmarks(JSON.parse(storedBookmarks));
      }
    } catch (error) {
      console.error("Failed to load bookmarks from localStorage:", error);
      // Handle potential parsing errors, maybe clear invalid data
      // localStorage.removeItem(STORAGE_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveBookmarks = useCallback((newBookmarks: Bookmark[]) => {
    try {
      setBookmarks(newBookmarks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newBookmarks));
    } catch (error) {
      console.error("Failed to save bookmarks to localStorage:", error);
      // Potentially handle storage limit errors
    }
  }, []);

  const addBookmark = useCallback((newBookmark: Omit<Bookmark, 'id'>) => {
    const bookmarkWithId: Bookmark = {
      ...newBookmark,
      id: crypto.randomUUID(), // Modern browser API for unique IDs
    };
    saveBookmarks([...bookmarks, bookmarkWithId]);
  }, [bookmarks, saveBookmarks]);

  const updateBookmark = useCallback((updatedBookmark: Bookmark) => {
    saveBookmarks(
      bookmarks.map(b => b.id === updatedBookmark.id ? updatedBookmark : b)
    );
  }, [bookmarks, saveBookmarks]);

  const deleteBookmark = useCallback((id: string) => {
    saveBookmarks(bookmarks.filter(b => b.id !== id));
  }, [bookmarks, saveBookmarks]);

  return {
    bookmarks,
    isLoading,
    addBookmark,
    updateBookmark,
    deleteBookmark,
  };
}
