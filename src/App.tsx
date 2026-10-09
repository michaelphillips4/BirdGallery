import { useEffect, useState, type FormEvent, type CSSProperties } from 'react'
import { ArrowLeft, ArrowUpRight, Aperture, Bird, CalendarDays, Camera, ImagePlus, MapPin, PencilLine, Plus, Trash2, X } from 'lucide-react'
import './App.css'

type BirdPhoto = {
  id: string
  title: string
  species: string
  location: string
  date: string
  camera: string
  lens: string
  settings: string
  category: string
  notes: string
  image: string
}

const baseImage = 'https://images.unsplash.com/photo-1552728089-57bdde30beb3?auto=format&fit=crop&w=1500&q=85'
const initialPhotos: BirdPhoto[] = [
  ['parakeet', 'Green parakeet', 'Psittacula sp.', 'Sample location', '04 June 2026', 'Other', 'A vivid green parakeet perched among the leaves.', 'photo-1552728089-57bdde30beb3'],
  ['kingfisher', 'Common kingfisher', 'Alcedo atthis', 'Bough Beech, Surrey', '18 May 2026', 'Bough Beech', 'A flash of electric blue over the slow water, just after first light.', 'photo-1444464666168-49d633b86797'],
  ['macaw', 'Blue-and-yellow macaw', 'Ara ararauna', 'Sample location', '11 June 2025', 'Other', 'A close portrait of a blue-and-yellow macaw.', 'photo-1452570053594-1b985d6ea890'],
  ['macaws', 'Macaw flock', 'Ara ararauna', 'Sample location', '23 February 2026', 'Other', 'A small group of macaws gathered together.', 'photo-1549608276-5786777e6587'],
  ['flamingo', 'Greater flamingo', 'Phoenicopterus roseus', 'Sample location', '16 March 2026', 'Warnham Local', 'Flamingos wading through a shallow blue lagoon.', 'photo-1497206365907-f5e630693df0'],
  ['songbird', 'Yellow garden bird', 'Passeriformes sp.', 'Sample location', '28 August 2025', 'Farthing Downs', 'A small yellow songbird among the spring blossoms.', 'photo-1480044965905-02098d419e96'],
].map(([id, title, species, location, date, category, notes, image], index) => ({
  id, title, species, location, date, category, notes,
  camera: 'Canon EOS R5',
  lens: 'RF 100–500mm F4.5–7.1 L IS USM',
  settings: `1/${[1600, 2500, 2000, 3200, 1600, 2000][index]} sec · f/${['5.6', '6.3', '5.6', '8', '7.1', '6.3'][index]} · ISO ${[800, 1600, 1000, 800, 1250, 1000][index]} · ${[400, 500, 420, 500, 500, 450][index]}mm`,
  image: baseImage.replace('photo-1552728089-57bdde30beb3', image),
}))

const filters = ['All', 'Kenley Aerodrome', 'Farthing Downs', 'Warnham Local', 'Bough Beech', 'Sevenoaks Nature Reserve', 'Other']
const blankDraft = { title: '', species: '', location: '', date: '', camera: '', lens: '', settings: '', category: 'Other', notes: '' }

function App() {
  const [photos, setPhotos] = useState(initialPhotos)
  const [activeFilter, setActiveFilter] = useState('All')
  const [selectedPhoto, setSelectedPhoto] = useState<BirdPhoto | null>(null)
  const [isManaging, setIsManaging] = useState(false)
  const [draft, setDraft] = useState(blankDraft)
  const [uploadFile, setUploadFile] = useState<File | null>(null)

  useEffect(() => {
    const closeOnEscape = (event: KeyboardEvent) => { if (event.key === 'Escape') setSelectedPhoto(null) }
    window.addEventListener('keydown', closeOnEscape)
    return () => window.removeEventListener('keydown', closeOnEscape)
  }, [])

  const visiblePhotos = activeFilter === 'All' ? photos : photos.filter((photo) => photo.category === activeFilter)

  function addPhoto(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!uploadFile || !draft.title.trim()) return
    setPhotos((current) => [{ ...draft, id: `${Date.now()}`, title: draft.title.trim(), image: URL.createObjectURL(uploadFile) }, ...current])
    setDraft(blankDraft)
    setUploadFile(null)
    event.currentTarget.reset()
  }

  function removePhoto(photo: BirdPhoto) {
    if (window.confirm(`Delete “${photo.title}” from this local demo?`)) setPhotos((current) => current.filter((item) => item.id !== photo.id))
  }

  return (
    <div className="site-shell">
      <header className="site-header">
        <button className="wordmark" type="button" onClick={() => { setIsManaging(false); setSelectedPhoto(null) }} aria-label="Bird Index home"><span className="wordmark-icon"><Bird size={19} /></span><span>BIRD<span className="wordmark-light">INDEX</span></span></button>
        <div className="header-meta"><span className="status-dot" /> SAMPLE COLLECTION <span className="meta-divider">/</span> DEMO PHOTOS</div>
        {import.meta.env.DEV && <button className={`manage-button${isManaging ? ' is-active' : ''}`} type="button" onClick={() => { setIsManaging(!isManaging); setSelectedPhoto(null) }}>{isManaging ? <ArrowLeft size={16} /> : <PencilLine size={15} />}{isManaging ? 'Back to gallery' : 'Manage collection'}</button>}
      </header>

      {isManaging ? (
        <main className="manage-page">
          <div className="manage-heading"><p className="eyebrow"><span>COLLECTION TOOLS</span><span className="eyebrow-line" /></p><h1>Manage the <em>archive.</em></h1><p className="manage-intro">Add new photographs or remove an entry from the collection.</p></div>
          <div className="demo-notice"><span className="notice-mark">i</span><p><strong>Local demo only.</strong> This screen has no sign-in or cloud storage yet; edits stay in this browser session.</p></div>
          <div className="manage-layout">
            <form className="upload-form" onSubmit={addPhoto}>
              <div className="form-heading"><div><span className="section-index">01</span><h2>Add a photograph</h2></div><ImagePlus size={19} /></div>
              <label className="upload-picker"><input type="file" accept="image/*" required onChange={(event) => setUploadFile(event.currentTarget.files?.[0] ?? null)} /><ImagePlus size={20} /><span>{uploadFile ? uploadFile.name : 'Choose a photo from your device'}</span><span className="picker-browse">Browse</span></label>
              <div className="form-grid">
                <label className="form-field"><span>Common name *</span><input required value={draft.title} onChange={(event) => setDraft({ ...draft, title: event.target.value })} placeholder="e.g. Common kingfisher" /></label>
                <label className="form-field"><span>Scientific name</span><input value={draft.species} onChange={(event) => setDraft({ ...draft, species: event.target.value })} placeholder="e.g. Alcedo atthis" /></label>
                <label className="form-field"><span>Location</span><input value={draft.location} onChange={(event) => setDraft({ ...draft, location: event.target.value })} placeholder="Place, region" /></label>
                <label className="form-field"><span>Date photographed</span><input type="date" value={draft.date} onChange={(event) => setDraft({ ...draft, date: event.target.value })} /></label>
                <label className="form-field"><span>Camera</span><input value={draft.camera} onChange={(event) => setDraft({ ...draft, camera: event.target.value })} placeholder="Camera body" /></label>
                <label className="form-field"><span>Lens</span><input value={draft.lens} onChange={(event) => setDraft({ ...draft, lens: event.target.value })} placeholder="Lens and focal length" /></label>
                <label className="form-field form-field-wide"><span>Exposure settings</span><input value={draft.settings} onChange={(event) => setDraft({ ...draft, settings: event.target.value })} placeholder="1/2000 sec · f/5.6 · ISO 800" /></label>
                <label className="form-field"><span>Location</span><select value={draft.category} onChange={(event) => setDraft({ ...draft, category: event.target.value })}>{filters.slice(1).map((filter) => <option key={filter}>{filter}</option>)}</select></label>
                <label className="form-field form-field-wide"><span>Field note</span><textarea rows={3} value={draft.notes} onChange={(event) => setDraft({ ...draft, notes: event.target.value })} placeholder="A short note about the photograph" /></label>
              </div>
              <button className="primary-button" type="submit"><Plus size={17} /> Add to collection</button>
            </form>
            <section className="manage-list" aria-labelledby="collection-heading">
              <div className="form-heading"><div><span className="section-index">02</span><h2 id="collection-heading">In the collection</h2></div><span className="collection-count">{photos.length} PHOTOS</span></div>
              <div className="manage-rows">{photos.map((photo) => <article className="manage-row" key={photo.id}><img src={photo.image} alt="" /><div className="manage-row-copy"><strong>{photo.title}</strong><span>{photo.location || 'Location not set'}</span></div><button className="delete-button" type="button" onClick={() => removePhoto(photo)} aria-label={`Delete ${photo.title}`} title="Delete photo"><Trash2 size={16} /></button></article>)}{photos.length === 0 && <p className="empty-state">Your collection is empty. Add a photograph to get started.</p>}</div>
            </section>
          </div>
        </main>
      ) : (
        <main>
          <section className="intro"><div className="intro-copy"><p className="eyebrow"><span>NOTES FROM THE FIELD</span><span className="eyebrow-line" /></p><h1>Birds, <em>observed.</em></h1><p className="intro-description">A photographic field journal of the birds and wild places of Surrey.</p></div><div className="intro-aside"><span className="aside-number">{String(photos.length).padStart(2, '0')}</span><span>PHOTOGRAPHS<br />IN THE ARCHIVE</span><span className="aside-rule" /><span>SURREY<br />& BEYOND</span></div></section>
          <section className="collection" aria-label="Bird photograph collection">
            <div className="collection-toolbar"><div className="filter-list" aria-label="Filter by location">{filters.map((filter) => <button className={activeFilter === filter ? 'filter-button is-selected' : 'filter-button'} type="button" key={filter} onClick={() => setActiveFilter(filter)} aria-pressed={activeFilter === filter}>{filter === 'All' ? 'All photographs' : filter}</button>)}</div><span className="sort-note">LATEST OBSERVATIONS <ArrowUpRight size={14} /></span></div>
            {visiblePhotos.length ? <div className="photo-grid">{visiblePhotos.map((photo, index) => <button className="photo-card" type="button" key={photo.id} onClick={() => setSelectedPhoto(photo)} style={{ '--reveal-delay': `${index * 45}ms` } as CSSProperties} aria-label={`View ${photo.title} details`}><span className="photo-image-wrap"><img className="photo-image" src={photo.image} alt={photo.title} loading={index > 3 ? 'lazy' : 'eager'} /><span className="photo-open"><ArrowUpRight size={17} /></span></span><span className="photo-caption"><span className="photo-caption-top"><span className="photo-category">{photo.category}</span><span className="photo-date">{photo.date}</span></span><span className="photo-title">{photo.title}</span><span className="photo-location"><MapPin size={13} />{photo.location || 'Location not set'}</span></span></button>)}</div> : <p className="empty-state gallery-empty">No photographs in this habitat yet.</p>}
          </section>
        </main>
      )}

      <footer className="site-footer"><span><Bird size={15} /> BIRD INDEX</span><span>A FIELD ARCHIVE · SURREY</span><span>© 2026</span></footer>
      {selectedPhoto && <div className="detail-backdrop" role="presentation" onMouseDown={(event) => { if (event.target === event.currentTarget) setSelectedPhoto(null) }}><section className="detail-dialog" role="dialog" aria-modal="true" aria-labelledby="detail-title"><button className="dialog-close" type="button" onClick={() => setSelectedPhoto(null)} aria-label="Close photo details"><X size={19} /></button><div className="detail-image"><img src={selectedPhoto.image} alt={selectedPhoto.title} /></div><div className="detail-copy"><p className="eyebrow"><span>{selectedPhoto.category.toUpperCase()} OBSERVATION</span><span className="eyebrow-line" /></p><h2 id="detail-title">{selectedPhoto.title}</h2><p className="detail-species">{selectedPhoto.species}</p><p className="detail-notes">{selectedPhoto.notes || 'No field note has been added.'}</p><div className="detail-facts"><div><MapPin size={16} /><span><small>LOCATION</small>{selectedPhoto.location || 'Not recorded'}</span></div><div><CalendarDays size={16} /><span><small>DATE</small>{selectedPhoto.date || 'Not recorded'}</span></div><div><Camera size={16} /><span><small>CAMERA</small>{selectedPhoto.camera || 'Not recorded'}</span></div><div><Aperture size={16} /><span><small>LENS</small>{selectedPhoto.lens || 'Not recorded'}</span></div></div><div className="settings-strip"><span>EXPOSURE</span><strong>{selectedPhoto.settings || 'Not recorded'}</strong></div><span className="record-id">FIELD RECORD / {selectedPhoto.id.toUpperCase()}</span></div></section></div>}
    </div>
  )
}

export default App
