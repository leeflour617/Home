// src/App.tsx
import React, { useState } from 'react';
import { useBookmarks } from './hooks/useBookmarks';
import BookmarkItem from './components/BookmarkItem';
import BookmarkForm from './components/BookmarkForm';
import { Bookmark } from './types';
import './App.css'; // Main app styles

function App() {
  const { bookmarks, isLoading, addBookmark, updateBookmark, deleteBookmark } = useBookmarks();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingBookmark, setEditingBookmark] = useState<Bookmark | null>(null);

  const handleOpenForm = (bookmark: Bookmark | null = null) => {
    setEditingBookmark(bookmark);
    setIsFormOpen(true);
  };

  const handleCloseForm = () => {
    setIsFormOpen(false);
    setEditingBookmark(null);
  };

  const handleSaveBookmark = (bookmarkData: Omit<Bookmark, 'id'> | Bookmark) => {
    if ('id' in bookmarkData) { // Check if it's an existing bookmark (has id)
      updateBookmark(bookmarkData);
    } else {
      addBookmark(bookmarkData);
    }
    handleCloseForm();
  };

  if (isLoading) {
    return <div className="loading">Loading bookmarks...</div>;
  }

  return (
    <div className="appContainer">
      <header className="appHeader">
        <h1>My Personal Bookmarks</h1>
        <button onClick={() => handleOpenForm()} className="addButton">
          + Add Bookmark
        </button>
      </header>

      <main className="bookmarkList">
        {bookmarks.length === 0 ? (
          <p className="emptyState">No bookmarks yet. Add one to get started!</p>
        ) : (
          bookmarks.map(bookmark => (
            <BookmarkItem
              key={bookmark.id}
              bookmark={bookmark}
              onEdit={handleOpenForm} // Pass the bookmark to edit
              onDelete={deleteBookmark}
            />
          ))
        )}
      </main>

      {isFormOpen && (
        <BookmarkForm
          bookmarkToEdit={editingBookmark}
          onSave={handleSaveBookmark}
          onCancel={handleCloseForm}
        />
      )}

      <footer className="appFooter">
        <p>Powered by React & LocalStorage. Deploy anywhere!</p>
      </footer>
    </div>
  );
}

export default App;
