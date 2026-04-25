import { useState, useEffect } from "react"

export default function Tree({ user, goTo, openTree }) {

  const [treeList, setTreeList] = useState([])
  const [search, setSearch] = useState("")
  const [healthFilter, setHealthFilter] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalTrees, setTotalTrees] = useState(0)
  const [loading, setLoading] = useState(true)
  const [guestWarning, setGuestWarning] = useState(false)

  const treesPerPage = 12

  useEffect(() => {
    loadTrees()
  }, [currentPage])

  function loadTrees() {
    setLoading(true)
    fetch(`http://localhost:3000/api/posts?page=${currentPage}&limit=${treesPerPage}`)
      .then(res => res.json())
      .then(data => {
        setTreeList(data.posts || [])
        setTotalPages(data.totalPages || 1)
        setTotalTrees(data.totalPosts || 0)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }

  const filteredTrees = treeList.filter(tree => {
    const matchSearch =
      tree.title.toLowerCase().includes(search.toLowerCase()) ||
      tree.species.toLowerCase().includes(search.toLowerCase()) ||
      (tree.location || "").toLowerCase().includes(search.toLowerCase())
    const matchHealth = !healthFilter || tree.health === healthFilter
    return matchSearch && matchHealth
  })

  async function toggleLike(treeId) {
    if (!user) {
      setGuestWarning(true)
      setTimeout(() => setGuestWarning(false), 3000)
      return
    }
    const res = await fetch(`http://localhost:3000/api/posts/${treeId}/like`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId: user._id })
    })
    const data = await res.json()
    setTreeList(prev => prev.map(tree =>
      tree._id === treeId
        ? { ...tree, likes: data.msg === "Liked" ? [...(tree.likes || []), user._id] : (tree.likes || []).filter(id => id !== user._id) }
        : tree
    ))
  }

  function isLiked(tree) {
    if (!user) return false
    return (tree.likes || []).includes(user._id)
  }

  function getHealthBadge(health) {
    if (health === "needs-care") return <span className="absolute top-2 right-2 bg-orange-100 text-orange-800 text-xs px-2 py-0.5 rounded-full">Needs Care</span>
    if (health === "danger") return <span className="absolute top-2 right-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">In Danger</span>
    return <span className="absolute top-2 right-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">Healthy</span>
  }

  function goToPage(page) {
    setCurrentPage(page)
    window.scrollTo(0, 0)
  }

 
  function getPageNumbers() {
    if (totalPages <= 5) return Array.from({ length: totalPages }, (_, i) => i + 1)
    if (currentPage <= 3) return [1, 2, 3, 4, 5]
    if (currentPage >= totalPages - 2) return [totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
    return [currentPage - 2, currentPage - 1, currentPage, currentPage + 1, currentPage + 2]
  }

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-8 lg:px-16">

      
      {guestWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl z-50 shadow-lg whitespace-nowrap">
          Please login to like a tree 🌱
        </div>
      )}

     
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-3">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-900">All Trees 🌳</h1>
          <p className="text-sm text-gray-500 mt-1">{totalTrees} trees planted so far</p>
        </div>
        {user && (
          <button onClick={() => goTo("add")} className="bg-green-900 text-white border-none px-5 py-2.5 rounded-lg text-sm cursor-pointer hover:bg-green-800">
            + Plant a Tree
          </button>
        )}
      </div>

     
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 flex items-center gap-2 border border-gray-200 rounded-lg px-4 bg-white">
          <span className="text-gray-400">⌕</span>
          <input
            placeholder="Search by name, species or location..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="flex-1 py-2.5 text-sm border-none outline-none bg-transparent"
          />
        </div>
        <select
          value={healthFilter}
          onChange={e => setHealthFilter(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 text-sm bg-white text-gray-600 outline-none cursor-pointer py-2"
        >
          <option value="">All Health</option>
          <option value="good">Healthy</option>
          <option value="needs-care">Needs Care</option>
          <option value="danger">In Danger</option>
        </select>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-4xl mb-3">🌱</p>
          <p className="text-sm">Loading trees...</p>
        </div>
      )}

      {/* Empty */}
      {!loading && filteredTrees.length === 0 && (
        <div className="text-center py-20 text-gray-400">
          <p className="text-5xl mb-3">🌱</p>
          <p className="text-sm">No trees found</p>
          {user && (
            <button onClick={() => goTo("add")} className="mt-4 bg-green-900 text-white border-none px-5 py-2 rounded-lg text-sm cursor-pointer">
              Plant the first tree
            </button>
          )}
        </div>
      )}

      {/* Tree cards */}
      {!loading && filteredTrees.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTrees.map(tree => (
            <div key={tree._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors">
              <div className="relative h-40 cursor-pointer" onClick={() => openTree && openTree(tree._id)}>
                {tree.image
                  ? <img src={`http://localhost:3000${tree.image}`} className="w-full h-full object-cover" alt={tree.title} />
                  : <div className="w-full h-full bg-green-100 flex items-center justify-center text-4xl">🌱</div>
                }
                {getHealthBadge(tree.health)}
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-sm text-gray-900 cursor-pointer truncate" onClick={() => openTree && openTree(tree._id)}>{tree.title}</p>
                <p className="text-xs text-gray-400 italic mt-0.5">{tree.species}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">📍 {tree.location || "Unknown"}</p>
                <p className="text-xs text-gray-400 mt-0.5">📅 {tree.createdAt ? new Date(tree.createdAt).toDateString() : ""}</p>
                <div className="flex items-center justify-between mt-3 pt-2.5 border-t border-gray-100">
                  <button
                    onClick={() => toggleLike(tree._id)}
                    className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer text-xs text-gray-500"
                  >
                    <span className="text-base">{isLiked(tree) ? "❤️" : "🤍"}</span>
                    <span>{(tree.likes || []).length} likes</span>
                  </button>
                  <button onClick={() => openTree && openTree(tree._id)} className="text-xs text-green-700 bg-transparent border-none cursor-pointer">
                    View →
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-10">
          <div className="flex justify-center items-center gap-1.5 flex-wrap">
            <button
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className="border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>

            {getPageNumbers().map(page => (
              <button
                key={page}
                onClick={() => goToPage(page)}
                className={`w-8 h-8 sm:w-9 sm:h-9 rounded-lg text-xs sm:text-sm cursor-pointer border ${currentPage === page ? "bg-green-900 text-white border-green-900" : "bg-white text-gray-600 border-gray-200"}`}
              >
                {page}
              </button>
            ))}

            <button
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="border border-gray-200 bg-white text-gray-600 px-3 py-2 rounded-lg text-xs sm:text-sm cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          <p className="text-center text-xs text-gray-400 mt-3">
            Page {currentPage} of {totalPages} · {totalTrees} total trees
          </p>
        </div>
      )}

    </div>
  )
}