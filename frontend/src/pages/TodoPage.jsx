import { useState, useEffect } from "react";
import toast from "react-hot-toast";

const TodoPage = () => {
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState("");
  const [dailyNotes, setDailyNotes] = useState([]);
  const [newNoteTitle, setNewNoteTitle] = useState("");
  const [newNoteContent, setNewNoteContent] = useState("");
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [editNoteTitle, setEditNoteTitle] = useState("");
  const [editNoteContent, setEditNoteContent] = useState("");
  const [currentQuote, setCurrentQuote] = useState({
    english: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
    hindi: "आपको अपने नियत कर्तव्यों का पालन करने का अधिकार है, लेकिन आप अपने कार्यों के फलों के हकदार नहीं हैं।",
    author: "Sri Krishna"
  });

  const krishnaQuotes = [
    {
      english: "You have the right to perform your prescribed duties, but you are not entitled to the fruits of your actions.",
      hindi: "आपको अपने नियत कर्तव्यों का पालन करने का अधिकार है, लेकिन आप अपने कार्यों के फलों के हकदार नहीं हैं।",
      author: "Sri Krishna"
    },
    {
      english: "Perform your duty without attachment to the results, for by working without attachment one attains the Supreme.",
      hindi: "परिणामों से आसक्ति के बिना अपना कर्तव्य निभाएं, क्योंकि आसक्ति के बिना कार्य करके मनुष्य सर्वोच्च को प्राप्त करता है।",
      author: "Sri Krishna"
    },
    {
      english: "The soul is neither born, and nor does it die.",
      hindi: "आत्मा न तो जन्म लेती है और न मरती है।",
      author: "Sri Krishna"
    },
    {
      english: "A person can rise through the efforts of his own mind; or draw himself down, in the same manner.",
      hindi: "मनुष्य अपने मन के प्रयास से ऊपर उठ सकता है; या उसी तरह नीचे गिर सकता है।",
      author: "Sri Krishna"
    },
    {
      english: "Happiness is a state of mind that has nothing to do with the external world.",
      hindi: "सुख एक मानसिक अवस्था है जो बाहरी दुनिया से कुछ भी लेना-देना नहीं रखती।",
      author: "Sri Krishna"
    }
  ];

  const chanakyaQuotes = [
    {
      english: "A man is great by deeds, not by birth.",
      hindi: "मनुष्य जन्म से नहीं, कर्म से महान होता है।",
      author: "Chanakya"
    },
    {
      english: "Education is the best friend. An educated person is respected everywhere.",
      hindi: "शिक्षा सबसे अच्छा मित्र है। शिक्षित व्यक्ति हर जगह सम्मानित होता है।",
      author: "Chanakya"
    },
    {
      english: "The biggest guru-mantra is: Never share your secrets with anybody.",
      hindi: "सबसे बड़ा गुरु-मंत्र है: अपनी गुप्त बातें कभी किसी से न साझा करें।",
      author: "Chanakya"
    },
    {
      english: "Before you start some work, always ask yourself three questions - Why am I doing it? What the results might be? And Will I be successful?",
      hindi: "कोई काम शुरू करने से पहले, हमेशा खुद से तीन सवाल पूछें - मैं यह क्यों कर रहा हूं? परिणाम क्या हो सकते हैं? और क्या मैं सफल होऊंगा?",
      author: "Chanakya"
    },
    {
      english: "There is no austerity equal to a balanced mind, and there is no happiness equal to contentment.",
      hindi: "संतुलित मन के बराबर कोई तपस्या नहीं है, और संतोष के बराबर कोई खुशी नहीं है।",
      author: "Chanakya"
    }
  ];

  const movieQuotes = [
    {
      english: "The only way to do great work is to love what you do.",
      hindi: "महान काम करने का एकमात्र तरीका है कि आप जो करते हैं उससे प्यार करें।",
      author: "Steve Jobs (Jobs)"
    },
    {
      english: "Your time is limited, so don't waste it living someone else's life.",
      hindi: "आपका समय सीमित है, इसलिए इसे किसी और के जीवन जीकर बर्बाद न करें।",
      author: "Steve Jobs (Jobs)"
    },
    {
      english: "The best way to predict the future is to create it.",
      hindi: "भविष्य की भविष्यवाणी करने का सबसे अच्छा तरीका है इसे बनाना।",
      author: "Peter Drucker (The Founder)"
    },
    {
      english: "Believe you can and you're halfway there.",
      hindi: "विश्वास कीजिए कि आप कर सकते हैं और आप आधे रास्ते पर हैं।",
      author: "Theodore Roosevelt (The West Wing)"
    },
    {
      english: "The only impossible journey is the one you never begin.",
      hindi: "एकमात्र असंभव यात्रा वह है जिसे आप कभी शुरू नहीं करते।",
      author: "Tony Robbins (Shallow Hal)"
    },
    {
      english: "Don't watch the clock; do what it does. Keep going.",
      hindi: "घड़ी को मत देखो; वह जो करती है वही करो। चलते रहो।",
      author: "Sam Levenson (Groundhog Day)"
    },
    {
      english: "The secret of getting ahead is getting started.",
      hindi: "आगे बढ़ने की कुंजी शुरू करना है।",
      author: "Mark Twain (The Secret of Getting Ahead)"
    },
    {
      english: "Dream big and dare to fail.",
      hindi: "बड़े सपने देखो और असफल होने की हिम्मत रखो।",
      author: "Norman Vaughan (Back to the Future)"
    },
    {
      english: "What lies behind us and what lies before us are tiny matters compared to what lies within us.",
      hindi: "हमारे पीछे जो है और हमारे सामने जो है, हमारे भीतर जो है उसके मुकाबले छोटी बातें हैं।",
      author: "Ralph Waldo Emerson (Forrest Gump)"
    },
    {
      english: "You miss 100% of the shots you don't take.",
      hindi: "आप उन शॉट्स में से 100% मिस करते हैं जिन्हें आप नहीं लेते।",
      author: "Wayne Gretzky (The Cutting Edge)"
    }
  ];

  useEffect(() => {
    const savedTodos = localStorage.getItem('todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
    const savedNotes = localStorage.getItem('dailyNotes');
    if (savedNotes) {
      setDailyNotes(JSON.parse(savedNotes));
    }
    generateRandomQuote();
  }, []);

  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos));
  }, [todos]);

  useEffect(() => {
    localStorage.setItem('dailyNotes', JSON.stringify(dailyNotes));
  }, [dailyNotes]);

  const generateRandomQuote = () => {
    const allQuotes = [...krishnaQuotes, ...chanakyaQuotes, ...movieQuotes];
    const randomIndex = Math.floor(Math.random() * allQuotes.length);
    setCurrentQuote(allQuotes[randomIndex]);
  };

  const addTodo = () => {
    if (newTodo.trim() === "") return;
    const todo = {
      id: Date.now(),
      text: newTodo,
      completed: false,
      createdAt: new Date().toISOString()
    };
    setTodos([...todos, todo]);
    setNewTodo("");
    toast.success("Todo added!");
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
    toast.success("Todo deleted!");
  };

  const toggleComplete = (id) => {
    setTodos(todos.map(todo =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    ));
  };

  const startEdit = (id, text) => {
    setEditingId(id);
    setEditText(text);
  };

  const saveEdit = () => {
    if (editText.trim() === "") return;
    setTodos(todos.map(todo =>
      todo.id === editingId ? { ...todo, text: editText } : todo
    ));
    setEditingId(null);
    setEditText("");
    toast.success("Todo updated!");
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditText("");
  };

  const addNote = () => {
    if (newNoteTitle.trim() === "" || newNoteContent.trim() === "") return;
    const note = {
      id: Date.now(),
      title: newNoteTitle,
      content: newNoteContent,
      createdAt: new Date().toISOString()
    };
    setDailyNotes([...dailyNotes, note]);
    setNewNoteTitle("");
    setNewNoteContent("");
    toast.success("Note added!");
  };

  const deleteNote = (id) => {
    setDailyNotes(dailyNotes.filter(note => note.id !== id));
    toast.success("Note deleted!");
  };

  const startEditNote = (id, title, content) => {
    setEditingNoteId(id);
    setEditNoteTitle(title);
    setEditNoteContent(content);
  };

  const saveEditNote = () => {
    if (editNoteTitle.trim() === "" || editNoteContent.trim() === "") return;
    setDailyNotes(dailyNotes.map(note =>
      note.id === editingNoteId ? { ...note, title: editNoteTitle, content: editNoteContent } : note
    ));
    setEditingNoteId(null);
    setEditNoteTitle("");
    setEditNoteContent("");
    toast.success("Note updated!");
  };

  const cancelEditNote = () => {
    setEditingNoteId(null);
    setEditNoteTitle("");
    setEditNoteContent("");
  };

  return (
    <div className="px-4">
      <div className="bg-glass max-w-4xl mx-auto rounded-md p-6">
        <div className="mb-6">
          <h1 className="text-2xl font-bold mb-4">Daily Goals & Todo List</h1>
        </div>

        <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-6 rounded-lg mb-6 text-center">
          <div className="mb-4">
            <p className="text-white text-lg italic font-medium">"{currentQuote.english}"</p>
            <p className="text-yellow-200 text-base italic mt-2">"{currentQuote.hindi}"</p>
          </div>
          <p className="text-yellow-300 text-sm font-semibold mb-3">- {currentQuote.author}</p>
          <button
            onClick={generateRandomQuote}
            className="px-4 py-2 bg-white text-purple-600 rounded-lg text-sm font-medium hover:bg-gray-100 transition-colors shadow-lg"
          >
            🌟 New Quote
          </button>
        </div>

        <div className="flex gap-2 mb-6">
          <input
            type="text"
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            placeholder="Add a new goal or todo..."
            className="flex-1 px-4 py-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
          />
          <button
            onClick={addTodo}
            className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Add
          </button>
        </div>

        <div className="space-y-3">
          {todos.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No todos yet. Add your first goal!</p>
            </div>
          ) : (
            todos.map((todo) => (
              <div
                key={todo.id}
                className={`flex items-center gap-3 p-4 rounded-lg border transition-colors ${
                  todo.completed
                    ? 'bg-green-900/20 border-green-600'
                    : 'bg-gray-800/50 border-gray-600'
                }`}
              >
                <input
                  type="checkbox"
                  checked={todo.completed}
                  onChange={() => toggleComplete(todo.id)}
                  className="w-5 h-5 text-green-600 bg-gray-800 border-gray-600 rounded focus:ring-green-500"
                />

                <div className="flex-1">
                  {editingId === todo.id ? (
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        onKeyPress={(e) => e.key === 'Enter' && saveEdit()}
                        className="flex-1 px-3 py-1 bg-gray-700 border border-gray-600 rounded text-white text-sm focus:outline-none focus:border-blue-500"
                      />
                      <button
                        onClick={saveEdit}
                        className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                      >
                        Save
                      </button>
                      <button
                        onClick={cancelEdit}
                        className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <span className={`text-sm ${todo.completed ? 'line-through text-gray-500' : 'text-white'}`}>
                      {todo.text}
                    </span>
                  )}
                </div>

                <div className="flex gap-2">
                  {!todo.completed && editingId !== todo.id && (
                    <button
                      onClick={() => startEdit(todo.id, todo.text)}
                      className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => deleteTodo(todo.id)}
                    className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {todos.length > 0 && (
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {todos.filter(t => t.completed).length} of {todos.length} goals completed
            </p>
          </div>
        )}

        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Daily Notes</h2>

          <div className="mb-6">
            <input
              type="text"
              value={newNoteTitle}
              onChange={(e) => setNewNoteTitle(e.target.value)}
              placeholder="Note title..."
              className="w-full px-4 py-2 mb-2 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
            />
            <textarea
              value={newNoteContent}
              onChange={(e) => setNewNoteContent(e.target.value)}
              placeholder="Share your thoughts and feelings..."
              className="w-full h-24 px-4 py-3 bg-gray-800 border border-gray-600 rounded-md text-white placeholder-gray-400 focus:outline-none focus:border-blue-500 resize-none"
            />
            <button
              onClick={addNote}
              className="mt-2 px-6 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
            >
              Add Note
            </button>
          </div>

          <div className="space-y-4">
            {dailyNotes.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-500">No notes yet. Add your first note!</p>
              </div>
            ) : (
              dailyNotes.map((note) => (
                <div
                  key={note.id}
                  className="bg-gray-800/50 rounded-lg p-4 border border-gray-600"
                >
                  {editingNoteId === note.id ? (
                    <div>
                      <input
                        type="text"
                        value={editNoteTitle}
                        onChange={(e) => setEditNoteTitle(e.target.value)}
                        className="w-full px-3 py-2 mb-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500"
                      />
                      <textarea
                        value={editNoteContent}
                        onChange={(e) => setEditNoteContent(e.target.value)}
                        className="w-full h-24 px-3 py-2 bg-gray-700 border border-gray-600 rounded text-white focus:outline-none focus:border-blue-500 resize-none"
                      />
                      <div className="flex gap-2 mt-2">
                        <button
                          onClick={saveEditNote}
                          className="px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                        >
                          Save
                        </button>
                        <button
                          onClick={cancelEditNote}
                          className="px-3 py-1 bg-gray-600 text-white rounded text-sm hover:bg-gray-700"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-2">{note.title}</h3>
                      <p className="text-gray-300 mb-3 whitespace-pre-wrap">{note.content}</p>
                      <p className="text-xs text-gray-500 mb-3">
                        {new Date(note.createdAt).toLocaleDateString()}
                      </p>
                      <div className="flex gap-2">
                        <button
                          onClick={() => startEditNote(note.id, note.title, note.content)}
                          className="px-3 py-1 bg-yellow-600 text-white rounded text-sm hover:bg-yellow-700"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteNote(note.id)}
                          className="px-3 py-1 bg-red-600 text-white rounded text-sm hover:bg-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TodoPage;