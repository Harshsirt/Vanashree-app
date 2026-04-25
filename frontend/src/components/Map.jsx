import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
})

export default function MapPage({ goTo }) {

  const [trees, setTrees] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/api/posts?limit=100&page=1`)
      .then(res => res.json())
      .then(data => {
        const allPosts = data.posts || []
        const treesWithGps = allPosts.filter(tree => tree.lat && tree.lng)
        setTrees(treesWithGps)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-8 lg:px-16">

      <button onClick={() => goTo("home")} className="text-green-800 text-sm bg-transparent border-none cursor-pointer mb-6">
        ← Back to Home
      </button>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Tree Map 🗺️</h1>
          <p className="text-sm text-gray-500 mt-1">All planted trees on the map</p>
        </div>
        <div className="flex gap-3 text-xs flex-wrap">
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-green-600 inline-block"></span>Healthy</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-orange-400 inline-block"></span>Needs Care</span>
          <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>In Danger</span>
        </div>
      </div>

      {loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🗺️</p>
          <p className="text-sm">Loading map...</p>
        </div>
      )}

      {!loading && (
        <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden mb-6" style={{ height: "450px" }}>
          <MapContainer center={[18.5204, 73.8567]} zoom={7} style={{ height: "100%", width: "100%" }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" attribution="© OpenStreetMap" />
            {trees.map(tree => (
              <Marker key={tree._id} position={[tree.lat, tree.lng]}>
                <Popup>
                  <div>
                    <p className="font-semibold text-sm">{tree.title}</p>
                    <p className="text-xs text-gray-500 italic">{tree.species}</p>
                    <p className="text-xs text-gray-500 mt-1">📍 {tree.location ? tree.location.split(",").slice(0, 2).join(",") : ""}</p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {!loading && trees.length === 0 && (
        <div className="text-center py-16 text-gray-400">
          <p className="text-4xl mb-3">📍</p>
          <p className="text-sm">No trees with GPS found yet</p>
          <p className="text-xs mt-1">Trees will appear here once GPS is captured while planting</p>
        </div>
      )}

      {trees.length > 0 && (
        <div>
          <h2 className="text-base font-semibold text-gray-900 mb-4">Trees on Map ({trees.length})</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {trees.map(tree => (
              <div key={tree._id} className="bg-white border border-gray-200 rounded-xl p-4 flex gap-3 items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                  {tree.image && tree.image !== ""
                    ? <img src={`${import.meta.env.VITE_API_URL}${tree.image}`} className="w-full h-full object-cover" alt={tree.title} />
                    : <span className="text-xl">🌱</span>
                  }
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{tree.title}</p>
                  <p className="text-xs text-gray-400 italic">{tree.species}</p>
                  <p className="text-xs text-gray-400 mt-0.5">📍 {tree.location ? tree.location.split(",").slice(0, 2).join(",") : ""}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  )
}