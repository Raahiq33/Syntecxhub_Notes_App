import { useEffect, useRef, useState } from "react";
import "./App.css";

function App() {
  const [notes, setNotes] = useState(() => {
    const savedNotes = localStorage.getItem("notes");
    return savedNotes ? JSON.parse(savedNotes) : [];
  });

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [category, setCategory] = useState("Personal");
  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState(null);

  const titleInputRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("notes", JSON.stringify(notes));
  }, [notes]);

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("Please enter title and note.");
      return;
    }

    if (editingId) {
      setNotes((currentNotes) =>
        currentNotes.map((note) =>
          note.id === editingId
            ? {
                ...note,
                title: title.trim(),
                content: content.trim(),
                category,
                updatedAt: new Date().toLocaleString(),
              }
            : note
        )
      );

      setEditingId(null);
    } else {
      const newNote = {
        id: Date.now(),
        title: title.trim(),
        content: content.trim(),
        category,
        pinned: false,
        createdAt: new Date().toLocaleString(),
      };

      setNotes((currentNotes) => [newNote, ...currentNotes]);
    }

    setTitle("");
    setContent("");
    setCategory("Personal");

    titleInputRef.current?.focus();
  };

  const editNote = (note) => {
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
    setEditingId(note.id);

    titleInputRef.current?.focus();
  };

  const deleteNote = (id) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      setNotes((currentNotes) =>
        currentNotes.filter((note) => note.id !== id)
      );
    }
  };

  const togglePin = (id) => {
    setNotes((currentNotes) =>
      currentNotes.map((note) =>
        note.id === id
          ? { ...note, pinned: !note.pinned }
          : note
      )
    );
  };

  const cancelEdit = () => {
    setEditingId(null);
    setTitle("");
    setContent("");
    setCategory("Personal");

    titleInputRef.current?.focus();
  };

  const filteredNotes = notes
    .filter((note) => {
      const text = `${note.title} ${note.content} ${note.category}`;
      return text.toLowerCase().includes(search.toLowerCase());
    })
    .sort((a, b) => Number(b.pinned) - Number(a.pinned));

  return (
    <div className="app">
      <header className="header">
        <h1>Notes App</h1>
        <p>Organize your ideas and notes easily.</p>
      </header>

      <main className="container">
        <section className="card">
          <h2>{editingId ? "Edit Note" : "Create a Note"}</h2>

          <form onSubmit={handleSubmit} className="note-form">
            <input
              ref={titleInputRef}
              type="text"
              placeholder="Note title"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
            />

            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
            >
              <option>Personal</option>
              <option>Study</option>
              <option>Work</option>
              <option>Ideas</option>
              <option>Other</option>
            </select>

            <textarea
              placeholder="Write your note..."
              value={content}
              onChange={(event) => setContent(event.target.value)}
              rows="5"
            />

            <div className="form-buttons">
              <button type="submit">
                {editingId ? "Update Note" : "Add Note"}
              </button>

              {editingId && (
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </section>

        <section className="card">
          <div className="notes-header">
            <div>
              <h2>My Notes</h2>
              <span>{notes.length} notes</span>
            </div>

            <input
              className="search-input"
              type="text"
              placeholder="Search notes..."
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          </div>

          {filteredNotes.length === 0 ? (
            <p className="empty-message">
              No notes found.
            </p>
          ) : (
            <div className="notes-grid">
              {filteredNotes.map((note) => (
                <article
                  className={`note-card ${
                    note.pinned ? "pinned" : ""
                  }`}
                  key={note.id}
                >
                  <div className="note-top">
                    <span className="category">
                      {note.category}
                    </span>

                    {note.pinned && <span>📌</span>}
                  </div>

                  <h3>{note.title}</h3>

                  <p>{note.content}</p>

                  <small>
                    Created: {note.createdAt}
                  </small>

                  <div className="note-actions">
                    <button onClick={() => togglePin(note.id)}>
                      {note.pinned ? "Unpin" : "Pin"}
                    </button>

                    <button onClick={() => editNote(note)}>
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => deleteNote(note.id)}
                    >
                      Delete
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
}

export default App;