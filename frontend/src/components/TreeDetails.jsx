import { useState, useEffect } from "react"

export default function TreeDetail({ treeId, goTo, user }) {

  const [tree, setTree] = useState(null);
  const [liked, setLiked] = useState(false);
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [caption, setCaption] = useState("");
  const [updatePhoto, setUpdatePhoto] = useState(null);
  const [updatePhotoFile, setUpdatePhotoFile] = useState(null);
  const [isPosting, setIsPosting] = useState(false);
  const [updateMsg, setUpdateMsg] = useState("");

  useEffect(() => {
    loadTree()
  }, [treeId])

  function loadTree() {
  fetch(`${import.meta.env.VITE_API_URL}/api/posts/${treeId}`).then(res => res.json())
      .then(data => {
        setTree(data)
        if (user && data.likes) {
          setLiked(data.likes.includes(user._id))
        }
      })
      .catch(() => {})
  }

  async function toggleLike() {
    if (!user) return alert("Please login to like")
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${treeId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id })
    })
    const data = await res.json()
    setLiked(data.msg === "Liked")
    loadTree()
  }

  function pickUpdatePhoto(e) {
    const file = e.target.files[0]
    if (file) {
      setUpdatePhoto(URL.createObjectURL(file))
      setUpdatePhotoFile(file)
    }
  }

  async function postUpdate() {
    if (!caption && !updatePhotoFile) {
      setUpdateMsg("Please add a caption or photo")
      return
    }

    setIsPosting(true)

    const formData = new FormData()
    formData.append("caption", caption)
    formData.append("postedBy", user._id)
    formData.append("postedByName", user.name)
    if (updatePhotoFile) formData.append("image", updatePhotoFile, updatePhotoFile.name)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/posts/${treeId}/update`, {
      method: "POST",
      body: formData
    })

    const data = await res.json()
    setIsPosting(false)

    if (data.msg === "Update added") {
      setCaption("")
      setUpdatePhoto(null)
      setUpdatePhotoFile(null)
      setShowUpdateForm(false)
      setUpdateMsg("")
      loadTree()
    } else {
      setUpdateMsg("Something went wrong")
    }
  }

  function shortLocation(location) {
    if (!location) return "Unknown"
    return location.split(",").slice(0, 2).join(",").trim()
  }

  function getHealthBadge(health) {
    if (health === "needs-care") return <span className="bg-orange-100 text-orange-800 text-xs px-3 py-1 rounded-full font-medium">Needs Care</span>
    if (health === "danger") return <span className="bg-red-100 text-red-800 text-xs px-3 py-1 rounded-full font-medium">In Danger</span>
    return <span className="bg-green-100 text-green-800 text-xs px-3 py-1 rounded-full font-medium">Healthy</span>
  }

  if (!tree) return (
    <div className="min-h-screen flex items-center justify-center">
      <p className="text-gray-400 text-sm">Loading tree details...</p>
    </div>
  )

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-8 lg:px-16">

      <button onClick={() => goTo("home")} className="text-green-800 text-sm bg-transparent border-none cursor-pointer mb-6">
        ← Back to Home
      </button>

      <div className="max-w-3xl mx-auto flex flex-col gap-6">

        
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden">

          
          <div className="h-56 sm:h-72 bg-green-100 overflow-hidden">
            {tree.image && tree.image !== ""
              ? <img  src={`${import.meta.env.VITE_API_URL}${tree.image}`}  className="w-full h-full object-cover" alt={tree.title} />
              : <div className="w-full h-full flex items-center justify-center text-6xl">🌱</div>
            }
          </div>

          <div className="p-5 sm:p-6">

           
            <div className="flex justify-between items-start gap-3 flex-wrap">
              <div>
                <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">{tree.title}</h1>
                <p className="text-gray-400 text-sm italic mt-1">{tree.species}</p>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {getHealthBadge(tree.health)}
                <button
                  onClick={toggleLike}
                  className="flex items-center gap-1 bg-transparent border-none cursor-pointer text-sm text-gray-500"
                >
                  <span className="text-xl">{liked ? "❤️" : "🤍"}</span>
                  <span>{(tree.likes || []).length}</span>
                </button>
              </div>
            </div>

            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-5">
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Location</p>
                <p className="text-sm font-medium text-gray-800">📍 {shortLocation(tree.location)}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Species</p>
                <p className="text-sm font-medium text-gray-800">🌿 {tree.species}</p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Planted On</p>
                <p className="text-sm font-medium text-gray-800">
                  📅 {tree.createdAt ? new Date(tree.createdAt).toDateString() : "Unknown"}
                </p>
              </div>
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">Health</p>
                <p className="text-sm font-medium text-gray-800">
                  {tree.health === "good" ? "💚 Healthy" : tree.health === "needs-care" ? "🟠 Needs Care" : "🔴 In Danger"}
                </p>
              </div>
            </div>

            
            {tree.lat && tree.lng && (
              <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-4">
                <p className="text-xs text-gray-400 mb-1">GPS Coordinates</p>
                <p className="text-sm text-green-800">📍 {Number(tree.lat).toFixed(5)}, {Number(tree.lng).toFixed(5)}</p>
              <a
              href={`https://www.google.com/maps?q=${tree.lat},${tree.lng}`}
              target="_blank"
               rel="noreferrer"
               className="text-xs text-green-700 underline mt-1 block"
               >
  Open in Google Maps →
</a>
              </div>
            )}

            
            {tree.description && (
              <div className="mt-4">
                <p className="text-xs text-gray-400 mb-2">Notes</p>
                <p className="text-sm text-gray-700 leading-relaxed">{tree.description}</p>
              </div>
            )}

          </div>
        </div>

        
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">

          <div className="flex justify-between items-center mb-5">
            <h2 className="text-base font-semibold text-gray-900">
              Tree Updates ({(tree.updates || []).length})
            </h2>
            {user && tree.postedBy?.toString() === user._id?.toString() && !user.isGuest &&  (
           <button  onClick={() => setShowUpdateForm(!showUpdateForm)} className="bg-green-900 text-white px-4 py-2 rounded-lg text-xs">
            {showUpdateForm ? "Cancel" : "+ Add Update"}
            </button>
            )}
          </div>

          
          {showUpdateForm && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-4 mb-5">
              <h3 className="text-sm font-medium text-gray-900 mb-3">Post an Update</h3>

              
              <div
                onClick={() => document.getElementById("updatePhotoInput").click()}
                className="border-2 border-dashed border-gray-200 rounded-xl h-36 flex flex-col items-center justify-center cursor-pointer hover:border-green-400 transition-colors mb-3 overflow-hidden"
              >
                {updatePhoto
                  ? <img src={updatePhoto} className="w-full h-full object-cover" alt="update" />
                  : (
                    <div className="text-center">
                      <p className="text-2xl mb-1">📷</p>
                      <p className="text-xs text-gray-400">Tap to add a photo</p>
                    </div>
                  )
                }
              </div>
              <input
                id="updatePhotoInput"
                type="file"
                accept="image/*"
                capture="environment"
                className="hidden"
                onChange={pickUpdatePhoto}
              />

              {updatePhoto && (
                <button
                  onClick={() => { setUpdatePhoto(null); setUpdatePhotoFile(null) }}
                  className="text-xs text-gray-400 mb-3 block border border-gray-200 px-3 py-1 rounded-lg cursor-pointer"
                >
                  Remove photo
                </button>
              )}

              <textarea
                value={caption}
                onChange={e => setCaption(e.target.value)}
                placeholder="Describe the condition of this tree..."
                rows={3}
                className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-green-700 mb-3"
              />

              {updateMsg && (
                <p className="text-red-500 text-xs mb-3">{updateMsg}</p>
              )}

              <button
                onClick={postUpdate}
                disabled={isPosting}
                className="bg-green-900 text-white border-none px-5 py-2 rounded-lg text-sm cursor-pointer disabled:opacity-60"
              >
                {isPosting ? "Posting..." : "Post Update"}
              </button>
            </div>
          )}

          
          {(tree.updates || []).length === 0 && !showUpdateForm && (
            <div className="text-center py-10 text-gray-400">
              <p className="text-4xl mb-3">📋</p>
              <p className="text-sm">No updates yet</p>
              <p className="text-xs mt-1">Be the first to post an update for this tree</p>
            </div>
          )}

          <div className="flex flex-col gap-4">
            {(tree.updates || []).slice().reverse().map((update, i) => (
              <div key={i} className="border border-gray-100 rounded-xl p-4">
                {update.image && update.image !== "" && (
                  <img src={`${import.meta.env.VITE_API_URL}${update.image}`}
                    className="w-full h-44 object-cover rounded-lg mb-3"
                    alt="update"
                  />
                )}
                {update.caption && (
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">{update.caption}</p>
                )}
                <div className="flex justify-between items-center">
                  <p className="text-xs text-green-700 font-medium">🌿 {update.postedByName || "Volunteer"}</p>
                  <p className="text-xs text-gray-400">
                    {update.createdAt ? new Date(update.createdAt).toDateString() : ""}
                  </p>
                </div>
              </div>
            ))}
          </div>

        </div>

       
        <div className="bg-white border border-gray-200 rounded-2xl p-5 sm:p-6">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Care & Watering 💧</h2>
          <div className="text-center py-10 text-gray-400">
            <p className="text-4xl mb-3">💧</p>
            <p className="text-sm">Watering system coming soon</p>
            <p className="text-xs mt-1">Track when this tree was last watered</p>
          </div>
        </div>

      </div>
    </div>
  )
}