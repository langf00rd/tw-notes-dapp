import { ThirdwebStorage } from "@thirdweb-dev/storage"
import { useEffect, useState } from "react"
import './App.css'

const storage = new ThirdwebStorage()

function App() {
  const [text, setText] = useState('')
  const [notes, setNotes] = useState([])
  const [loading, setLoading] = useState(true)

  const addNote = async () => {
    try {
      setLoading(true)
      const storedNotes = localStorage.getItem('tw-notes')
      const notes = [...JSON.parse(storedNotes) || []]
      const noteUri = await storage.upload(text)
      const noteText = await storage.download(noteUri)

      notes.push(await noteText.text())
      notes.reverse()  // reverses order of notes with the latest at the top
      localStorage.setItem('tw-notes', JSON.stringify(notes))

      getUploads()
      setText('')
      setLoading(false)
    } catch (e) {
      alert('could not fetch notes 👀')
      console.warn(e)
    }
  }

  const getUploads = () => {
    setLoading(true)
    const storedNotes = JSON.parse(localStorage.getItem('tw-notes')) || []
    setNotes(storedNotes)
    setLoading(false)
  }

  useEffect(() => {
    getUploads()
  }, [])

  return (
    <main>
      <h1>Notes dApp</h1>
      <div className="input-wrapper">
        <input value={text} onChange={e => setText(e.target.value)} placeholder='Add new note...' />
        <button onClick={addNote}>Save</button>
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
