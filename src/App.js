import { ThirdwebStorage } from "@thirdweb-dev/storage"
import { useEffect, useState } from "react"
import './App.css'

const storage = new ThirdwebStorage()

function App() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const initUpload = async () => {
    try {
      setLoading(true)
      const storedNotes = localStorage.getItem('tw-notes')
      const notes = [...JSON.parse(storedNotes) || []]
      const uri = await storage.upload(text)

      notes.push(uri)
      localStorage.setItem('tw-notes', JSON.stringify(notes))

      getUploads()
      setText('')
      setLoading(false)
    } catch (e) {
      alert('could not fetch notes 👀')
    }
  }

  const getNoteText = async (noteUri) => {
    try {
      let note = await storage.download(noteUri)
      return await note.text()
    } catch (e) {
      alert('could not fetch note text 👀')
    }
  }

  const getUploads = async () => {
    setLoading(true)
    const storedNotes = JSON.parse(localStorage.getItem('tw-notes')) || []
    const storedNotesCopy = []

    for (let a = 0; a < storedNotes.length; a++) {
      const element = storedNotes[a];
      storedNotesCopy.push(await getNoteText(element))
    }

    storedNotesCopy.reverse()
    setNotes(storedNotesCopy)
    setLoading(false)
  }

  useEffect(() => {
    getUploads()
  }, [])

  return (
    <main>
      <h1>Notes app</h1>
      <div className="input-wrapper">
        <input value={text} onChange={e => setText(e.target.value)} placeholder='text' />
        <button onClick={initUpload}>Add</button>
      </div>
      {
        !loading
          ? <div>
            {
              notes.map((note, i) => {
                return <p className="note" key={i}>{note}</p>
              })
            }
          </div>
          : <div className="loading">Loading...</div>
      }
    </main>
  )
}

export default App
