import { useState, useEffect } from "react"

export default function Profile({ user, goTo, logout }) {

  const [myTrees, setMyTrees] = useState([])
  const [avatar, setAvatar] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/api/posts/user/${user._id}`)
      .then(res => res.json())
      .then(data => setMyTrees(data))
      .catch(() => {})
  }, [])

  function changeAvatar(e) {
    const file = e.target.files[0]
    if (file) setAvatar(URL.createObjectURL(file))
  }

  function getHealthBadge(health) {
    if (health === "needs-care") return <span className="bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Needs Care</span>
    if (health === "danger") return <span className="bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">In Danger</span>
    return <span className="bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Healthy</span>
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 md:px-10 lg:px-16">

      <button onClick={() => goTo("home")} className="text-green-800 text-sm cursor-pointer bg-transparent border-none mb-6">
        ← Back to Home
      </button>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 mb-6 max-w-3xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-6 items-center sm:items-start">

          <div className="flex flex-col items-center gap-2 flex-shrink-0">
            <div
              onClick={() => document.getElementById("avatarInput").click()}
              className="w-24 h-24 rounded-full bg-green-100 border-2 border-dashed border-green-300 flex items-center justify-center cursor-pointer overflow-hidden"
            >
              {avatar
                ? <img src={avatar} className="w-full h-full object-cover" alt="avatar" />
                : user.photo && user.photo !== ""
                ? <img src={`http://localhost:3000${user.photo}`} className="w-full h-full object-cover" alt="avatar" />
                : <span className="text-4xl">🌿</span>
              }
            </div>
            <p className="text-xs text-gray-400 text-center">Tap to change photo</p>
            <input id="avatarInput" type="file" accept="image/*" capture="user" className="hidden" onChange={changeAvatar} />
          </div>

          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-xl font-semibold text-gray-900">{user.name}</h1>
            <p className="text-sm text-gray-500 mt-1">✉️ {user.email}</p>
            {user.phone && <p className="text-sm text-gray-500 mt-1">📞 {user.phone}</p>}

            <span className="inline-block mt-3 bg-green-50 border border-green-200 text-green-800 text-xs px-3 py-1 rounded-full">
              🌱 Seedling Level
            </span>

            <div className="flex gap-3 mt-5 flex-wrap justify-center sm:justify-start">
              <div className="bg-gray-50 rounded-xl px-5 py-3 text-center min-w-[80px]">
                <p className="text-xl font-semibold text-green-900">{myTrees.length}</p>
                <p className="text-xs text-gray-500 mt-1">Trees Planted</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-5 py-3 text-center min-w-[80px]">
                <p className="text-xl font-semibold text-green-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Trees Liked</p>
              </div>
              <div className="bg-gray-50 rounded-xl px-5 py-3 text-center min-w-[80px]">
                <p className="text-xl font-semibold text-green-900">🌱</p>
                <p className="text-xs text-gray-500 mt-1">Seedling</p>
              </div>
            </div>

            <div className="flex gap-3 mt-5 flex-wrap justify-center sm:justify-start">
              <button onClick={() => goTo("add")} className="bg-green-900 text-white border-none px-5 py-2 rounded-lg text-sm cursor-pointer hover:bg-green-800">
                Plant a Tree
              </button>
              <button onClick={logout} className="border border-gray-200 bg-white text-gray-600 px-5 py-2 rounded-lg text-sm cursor-pointer hover:bg-gray-50">
                Logout
              </button>
            </div>
          </div>

        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 max-w-3xl mx-auto">
        <h2 className="text-base font-semibold text-gray-900 mb-5">My Planted Trees</h2>

        {myTrees.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <p className="text-5xl mb-3">🌱</p>
            <p className="text-sm">You have not planted any trees yet</p>
            <button onClick={() => goTo("add")} className="mt-4 bg-green-900 text-white border-none px-5 py-2 rounded-lg text-sm cursor-pointer">
              Plant your first tree
            </button>
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {myTrees.map(tree => (
            <div key={tree._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden">
              <div className="h-24 bg-green-100 flex items-center justify-center overflow-hidden">
                {tree.image && tree.image !== ""
                  ? <img src={`http://localhost:3000${tree.image}`} className="w-full h-full object-cover" alt={tree.title} />
                  : <span className="text-3xl">🌱</span>
                }
              </div>
              <div className="p-3">
                <p className="text-sm font-medium text-gray-900 truncate">{tree.title}</p>
                <p className="text-xs text-gray-400 italic mt-0.5">{tree.species}</p>
                <div className="mt-2 mb-2">{getHealthBadge(tree.health)}</div>
                <button
                  onClick={() => goTo("tree_" + tree._id)}
                  className="text-xs text-green-700 bg-transparent border border-green-200 px-2 py-1 rounded-lg cursor-pointer w-full"
                >
                  Post Update
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  )
}