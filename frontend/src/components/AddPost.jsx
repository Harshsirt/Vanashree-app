import { useState } from "react"

export default function AddPost({ goTo, user }) {

  const [step, setStep] = useState(1)
  const [treeName, setTreeName] = useState("")
  const [species, setSpecies] = useState("")
  const [notes, setNotes] = useState("")
  const [health, setHealth] = useState("good")
  const [location, setLocation] = useState("")
  const [coords, setCoords] = useState(null)
  const [gpsStatus, setGpsStatus] = useState("idle")
  const [photo, setPhoto] = useState(null)
  const [photoFile, setPhotoFile] = useState(null)
  const [errorMsg, setErrorMsg] = useState("")
  const [isPlanting, setIsPlanting] = useState(false)

  function goNext() {
    if (step === 1 && (!treeName || !species)) {
      setErrorMsg("Please fill in tree name and species")
      return
    }
    if (step === 2 && !location) {
      setErrorMsg("Location is required. Please capture GPS location or enter manually")
      return
    }
    setErrorMsg("")
    setStep(step + 1)
  }

  function goBack() {
    setErrorMsg("")
    setStep(step - 1)
  }

  function getLocation() {
    if (!navigator.geolocation) { setGpsStatus("error"); return }
    setGpsStatus("loading")
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude
        const lng = position.coords.longitude
        setCoords({ lat, lng })
        fetch(`https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`)
          .then(res => res.json())
          .then(data => {
            setLocation(data.display_name || `${lat}, ${lng}`)
            setGpsStatus("done")
          })
          .catch(() => {
            setLocation(`${lat.toFixed(5)}, ${lng.toFixed(5)}`)
            setGpsStatus("done")
          })
      },
      () => setGpsStatus("error"),
      { enableHighAccuracy: true }
    )
  }

  function takePhoto(e) {
    const file = e.target.files[0]
    if (file) {
      setPhoto(URL.createObjectURL(file))
      setPhotoFile(file)
    }
  }

  async function plantTree() {
    if (!photoFile) {
      setErrorMsg("Please take a photo of the tree")
      return
    }
    setIsPlanting(true)
    setErrorMsg("")

    try {
      const formData = new FormData()
      formData.append("title", treeName)
      formData.append("species", species)
      formData.append("location", location)
      formData.append("lat", coords?.lat ?? "")
      formData.append("lng", coords?.lng ?? "")
      formData.append("description", notes)
      formData.append("health", health)
      formData.append("image", photoFile, photoFile.name)
      formData.append("postedBy", user._id)

      const res = await fetch("http://localhost:3000/api/posts", {
        method: "POST",
        body: formData
      })

      const data = await res.json()
      setIsPlanting(false)

      if (data.msg === "Post created") {
        goTo("home")
      } else {
        setErrorMsg("Something went wrong: " + data.msg)
      }
    } catch (err) {
      setIsPlanting(false)
      setErrorMsg("Error: " + err.message)
    }
  }

  function StepCircle({ num }) {
    const isDone = step > num
    const isActive = step === num
    return (
      <div className="flex flex-col items-center gap-1">
        <div className={`w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold
          ${isDone || isActive ? "bg-green-900 text-white" : "bg-gray-200 text-gray-400"}`}>
          {isDone ? "✓" : num}
        </div>
        <span className={`text-xs ${isActive ? "text-green-900 font-medium" : "text-gray-400"}`}>
          {num === 1 ? "Tree Info" : num === 2 ? "Location" : "Photo"}
        </span>
      </div>
    )
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-16">

      <button onClick={() => goTo("home")} className="text-green-800 text-sm bg-transparent border-none cursor-pointer mb-6">
        ← Back to Home
      </button>

      <h1 className="text-2xl font-semibold text-gray-900 mb-1">Plant a Tree 🌱</h1>
      <p className="text-sm text-gray-500 mb-8">Fill in the details of the tree you have planted</p>

      <div className="flex items-center max-w-xs mb-8">
        <StepCircle num={1} />
        <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > 1 ? "bg-green-900" : "bg-gray-200"}`} />
        <StepCircle num={2} />
        <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > 2 ? "bg-green-900" : "bg-gray-200"}`} />
        <StepCircle num={3} />
      </div>

      {errorMsg && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-5 max-w-xl">
          {errorMsg}
        </div>
      )}

      {step === 1 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Tree Details</h2>
          <p className="text-xs text-gray-500 mb-5">Give your tree an identity</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">Tree Name *</label>
              <input value={treeName} onChange={e => setTreeName(e.target.value)} placeholder="e.g. Ramesh's Tamarind" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
            </div>
            <div>
              <label className="text-sm text-gray-600 block mb-1.5">Species *</label>
              <input value={species} onChange={e => setSpecies(e.target.value)} placeholder="e.g. Neem, Banyan, Peepal" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
            </div>
          </div>
          <div className="mb-4">
            <label className="text-sm text-gray-600 block mb-1.5">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} placeholder="Any observations about this tree..." rows={3} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-green-700" />
          </div>
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-1.5">Health Status</label>
            <select value={health} onChange={e => setHealth(e.target.value)} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none bg-white">
              <option value="good">Healthy</option>
              <option value="needs-care">Needs Care</option>
              <option value="danger">In Danger</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button onClick={goNext} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-green-800">
              Next: Location →
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Tree Location</h2>
          <p className="text-xs text-gray-500 mb-5">Capture the exact location where this tree is planted</p>
          <div className="border border-gray-200 rounded-xl p-5 mb-4 text-center">
            {gpsStatus === "idle" && (
              <>
                <p className="text-4xl mb-3">📍</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Capture Current Location</p>
                <p className="text-xs text-gray-500 mb-4">Stand near the tree when you tap this button</p>
                <button onClick={getLocation} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-green-800">
                  📍 Get My Location
                </button>
              </>
            )}
            {gpsStatus === "loading" && (
              <>
                <p className="text-4xl mb-3">⏳</p>
                <p className="text-sm font-medium text-gray-900 mb-1">Finding your location...</p>
                <p className="text-xs text-gray-500">Please wait a few seconds</p>
              </>
            )}
            {gpsStatus === "done" && (
              <>
                <p className="text-4xl mb-3">✅</p>
                <p className="text-sm font-medium text-green-800 mb-2">Location captured!</p>
                <p className="text-xs text-gray-600 mb-1 leading-relaxed">{location.split(",").slice(0, 3).join(",")}</p>
                {coords && <p className="text-xs text-gray-400 mb-3">{coords.lat.toFixed(5)}, {coords.lng.toFixed(5)}</p>}
                <button onClick={getLocation} className="text-xs text-green-800 border border-green-200 bg-green-50 px-4 py-1.5 rounded-lg cursor-pointer">
                  Retake Location
                </button>
              </>
            )}
            {gpsStatus === "error" && (
              <>
                <p className="text-4xl mb-3">❌</p>
                <p className="text-sm font-medium text-red-700 mb-1">Could not get location</p>
                <p className="text-xs text-gray-500 mb-4">Please allow location access or enter manually</p>
                <button onClick={getLocation} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer">
                  Try Again
                </button>
              </>
            )}
          </div>
          <div className="mb-6">
            <label className="text-sm text-gray-600 block mb-1.5">Or enter location manually</label>
            <input value={location} onChange={e => setLocation(e.target.value)} placeholder="e.g. Near Government School, Pune" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
          </div>
          <div className="flex justify-between">
            <button onClick={goBack} className="border border-gray-200 bg-white text-gray-600 px-5 py-2.5 rounded-lg text-sm cursor-pointer">← Back</button>
            <button onClick={goNext} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-green-800">Next: Photo →</button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-xl">
          <h2 className="text-base font-semibold text-gray-900 mb-1">Take a Photo</h2>
          <p className="text-xs text-gray-500 mb-5">Take a live photo of the tree using your camera</p>
          <div onClick={() => document.getElementById("cameraInput").click()} className="border-2 border-dashed border-gray-200 rounded-xl h-52 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors mb-3 overflow-hidden">
            {photo
              ? <img src={photo} className="w-full h-full object-cover" alt="tree" />
              : (
                <div className="text-center px-4">
                  <p className="text-4xl mb-3">📷</p>
                  <p className="text-sm font-medium text-gray-700">Tap to open camera</p>
                  <p className="text-xs text-gray-400 mt-1">Take a photo of your tree</p>
                </div>
              )
            }
          </div>
          <input id="cameraInput" type="file" accept="image/*" capture="environment" className="hidden" onChange={takePhoto} />
          {photo && (
            <button onClick={() => { setPhoto(null); setPhotoFile(null) }} className="text-xs text-gray-500 border border-gray-200 bg-white px-4 py-1.5 rounded-lg cursor-pointer mb-4 block">
              Retake Photo
            </button>
          )}
          <p className="text-xs text-red-400 mb-6">Photo is required</p>
          <div className="flex justify-between">
            <button onClick={goBack} className="border border-gray-200 bg-white text-gray-600 px-5 py-2.5 rounded-lg text-sm cursor-pointer">← Back</button>
            <button onClick={plantTree} disabled={isPlanting} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-green-800 disabled:opacity-60">
              {isPlanting ? "Planting..." : "🌱 Plant This Tree"}
            </button>
          </div>
        </div>
      )}

    </div>
  )
}