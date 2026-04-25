import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import firstpageimg from "../assets/firstpage.jpg";
import step1img from "../assets/step1.jpg";
import step2img from"../assets/step2.jpg";
import step3img from "../assets/step3.jpg";
import img4 from "../assets/img4.jpg";


const howItWorks = [
  { step: "Step 1", title: "Register & Join", desc: "Create your free account and join the Vanashree volunteer community.", img: step1img },
  { step: "Step 2", title: "Plant a Tree", desc: "Go out, plant a sapling and record it with a photo and location.", img: step2img, featured: true },
  { step: "Step 3", title: "Monitor & Care", desc: "Track growth, post updates and get care reminders from the community.", img: step3img },
]

const whyUs = [
  { icon: "🌍", title: "Every Tree Has Identity", desc: "Unique ID, name, species, location and age. Nothing is anonymous." },
  { icon: "💧", title: "Aftercare System", desc: "Watering reminders and health tracking ensure no tree is left behind." },
  { icon: "👥", title: "Community Driven", desc: "Volunteers near you can water and monitor trees together." },
  { icon: "🏅", title: "Badges & Levels", desc: "Earn Seedling, Sapling, Tree, Ancient badges as you contribute." },
]

export default function Home({ user, goTo, openTree }) {

  const [treeList, setTreeList] = useState([])
  const [search, setSearch] = useState("")
  const [healthFilter, setHealthFilter] = useState("")
  const [volunteers, setVolunteers] = useState(0)
  const [guestWarning, setGuestWarning] = useState(false)

  useEffect(() => {
    fetch("fetch(`${import.meta.env.VITE_API_URL}/api/posts?limit=8&page=1`)")
      .then(res => res.json())
      .then(data => setTreeList(data.posts || []))
      .catch(() => {})

    fetch("fetch(`${import.meta.env.VITE_API_URL}/api/volunteers/count`)")
      .then(res => res.json())
      .then(data => setVolunteers(data.count))
      .catch(() => {})
  }, [])

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
    const res = awaitfetch(`${import.meta.env.VITE_API_URL}/api/posts/${treeId}/like`, {
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

  return (
    <div>

    
      {guestWarning && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-sm px-5 py-3 rounded-xl z-50 shadow-lg whitespace-nowrap">
          Please login to like a tree 🌱
        </div>
      )}

    
      <div className="relative min-h-[500px] h-[90vh] max-h-[700px] overflow-hidden">
        <img
          src={firstpageimg}
          className="w-full h-full object-cover"
          alt="forest"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-transparent" />

        <div className="absolute inset-0 flex flex-col justify-center px-4 sm:px-8 lg:px-16">

          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-xl"
          >
            <p className="text-green-400 text-xs tracking-widest uppercase mb-3">Tree Plantation Platform</p>
            <h1 className="text-white text-2xl sm:text-4xl md:text-5xl font-semibold leading-tight mb-4">
              Plant a Tree.<br />Watch it Grow.<br />Change the World.
            </h1>
            <p className="text-green-200 text-xs sm:text-sm mb-6 leading-relaxed max-w-md">
              Vanashree is a community platform where volunteers plant, record and monitor trees together.
            </p>
            <div className="flex gap-3 flex-wrap">
              <button
                onClick={() => goTo(user ? "add" : "register")}
                className="bg-green-400 text-green-900 px-5 py-2.5 rounded-lg text-sm font-semibold border-none cursor-pointer"
              >
                {user ? " Plant a Tree" : "Start Planting"}
              </button>
              <button
                onClick={() => goTo("trees")}
                className="border border-white text-white px-5 py-2.5 rounded-lg text-sm cursor-pointer bg-transparent"
              >
                Explore Trees
              </button>
            </div>
          </motion.div>

          
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-8 md:hidden">
            {[
              [treeList.length || 0, "Trees Planted"],
              [volunteers || 0, "Volunteers"],
              [6, "Districts"],
              ["12k", "Target"]
            ].map(([num, label]) => (
              <div key={label} className="bg-white/15 border border-white/25 rounded-xl px-3 py-3 text-center">
                <p className="text-green-400 text-lg font-bold">{num}</p>
                <p className="text-green-200 text-xs mt-0.5">{label}</p>
              </div>
            ))}
          </div>

        </div>

      
        <div className="hidden md:grid absolute right-16 top-1/2 -translate-y-1/2 grid-cols-2 gap-4">
          {[
            [treeList.length || 0, "Trees Planted"],
            [volunteers || 0, "Volunteers"],
            [6, "Districts"],
            ["12k", "Trees Target"]
          ].map(([num, label]) => (
            <div key={label} className="backdrop-blur-md bg-white/10 border border-white/20 rounded-2xl px-6 py-5 text-center">
              <p className="text-green-400 text-2xl font-bold">{num}</p>
              <p className="text-green-200 text-xs mt-1">{label}</p>
            </div>
          ))}
        </div>
      </div>

      
      <motion.div
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 border-b"
      >
        <div className="text-center mb-8">
          <p className="text-green-700 text-xs tracking-widest uppercase mb-2">Simple Process</p>
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">How It Works</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 max-w-5xl mx-auto">
          {howItWorks.map(item => (
            <div key={item.step} className={`bg-white rounded-xl overflow-hidden ${item.featured ? "border-2 border-green-800" : "border border-gray-200"}`}>
              <img src={item.img} className="w-full h-28 object-cover" alt={item.title} />
              <div className="p-4">
                <p className="text-green-700 text-xs uppercase tracking-widest mb-1">{item.step}</p>
                <h3 className="text-sm font-semibold text-gray-900 mb-1">{item.title}</h3>
                <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      
      <div className="py-12 px-4 sm:px-8 lg:px-16 border-b bg-white">

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-5 gap-3">
          <div>
            <p className="text-green-700 text-xs tracking-widest uppercase mb-1">Community</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900">Recently Planted Trees</h2>
          </div>
          <button onClick={() => goTo("trees")} className="border border-green-800 text-green-800 px-4 py-2 rounded-lg text-xs cursor-pointer bg-white self-start sm:self-auto">
            View All →
          </button>
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
            <option value="">All</option>
            <option value="good">Healthy</option>
            <option value="needs-care">Needs Care</option>
            <option value="danger">In Danger</option>
          </select>
        </div>

        {filteredTrees.length === 0 && (
          <div className="text-center py-14 text-gray-400">
            <p className="text-5xl mb-3">🌱</p>
            <p className="text-sm">No trees found. Be the first to plant one!</p>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredTrees.map(tree => (
            <div key={tree._id} className="bg-white border border-gray-200 rounded-xl overflow-hidden hover:border-green-300 transition-colors">
              <div className="relative h-40 cursor-pointer" onClick={() => openTree && openTree(tree._id)}>
                {tree.image && tree.image !== ""
  ? <img src={`${import.meta.env.VITE_API_URL}${tree.image}`} className="w-full h-full object-cover" alt={tree.title} />
  : <div className="w-full h-full bg-green-100 flex items-center justify-center text-4xl">🌱</div>
}
                {getHealthBadge(tree.health)}
              </div>
              <div className="p-3.5">
                <p className="font-semibold text-sm text-gray-900 cursor-pointer truncate" onClick={() => openTree && openTree(tree._id)}>{tree.title}</p>
                <p className="text-xs text-gray-400 italic mt-0.5">{tree.species}</p>
                <p className="text-xs text-gray-400 mt-1 truncate">📍 {tree.location || "Unknown"}</p>
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

        <div className="text-center mt-8">
          <button onClick={() => goTo("trees")} className="bg-green-900 text-white border-none px-8 py-3 rounded-lg text-sm cursor-pointer hover:bg-green-800">
            View All Trees →
          </button>
        </div>
      </div>

     
      <div className="bg-gray-50 py-12 px-4 sm:px-8 lg:px-16 border-b">
        <div className="flex flex-col md:flex-row gap-10 items-center max-w-5xl mx-auto">
          <div className="flex-1 w-full">
            <p className="text-green-700 text-xs tracking-widest uppercase mb-2">Why Join Us</p>
            <h2 className="text-xl sm:text-2xl font-semibold text-gray-900 mb-3">Why Vanashree?</h2>
            <p className="text-sm text-gray-500 mb-6 leading-relaxed">We are building more than just an app — a transparent ecosystem where every planted tree survives.</p>
            <div className="flex flex-col gap-4">
              {whyUs.map(item => (
                <div key={item.title} className="flex gap-3 items-start">
                  <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">{item.icon}</div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-500 leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="w-full md:w-72 flex-shrink-0 rounded-xl overflow-hidden border border-gray-200">
            <img src={img4} className="w-full h-79 md:h-72 object-cover" alt="nature" />
          </div>
        </div>
      </div>

  
      <div className="relative h-52 sm:h-56 overflow-hidden">
        <img src={firstpageimg} className="w-full h-full object-cover" alt="forest" />
        <div className="absolute inset-0 bg-black/60" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h2 className="text-white text-xl sm:text-2xl font-semibold mb-2">Ready to make a difference?</h2>
          <p className="text-green-200 text-xs sm:text-sm mb-5">Join hundreds of volunteers planting trees across Maharashtra</p>
          <div className="flex gap-3 flex-wrap justify-center">
            <button onClick={() => goTo("register")} className="bg-green-400 text-green-900 border-none px-6 py-2.5 rounded-lg text-sm font-semibold cursor-pointer">
              Join Vanashree Free
            </button>
            <button onClick={() => goTo("about")} className="bg-white/15 border border-white/40 text-white px-6 py-2.5 rounded-lg text-sm cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>

      //footer
      <div className="bg-gray-100 px-4 sm:px-8 lg:px-16 py-10">
        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-5 gap-6 border-b pb-8">
          <div className="col-span-2 md:col-span-2">
            <h2 className="text-green-900 font-semibold text-base mb-2">Vanashree</h2>
            <p className="text-sm text-gray-600 mb-4 max-w-xs">A community platform connecting volunteers to plant and track trees across India.</p>
            <div className="flex gap-2 flex-wrap text-gray-500">
              {["📘", "🐦", "📸", "▶️", "💼"].map(icon => (
                <span key={icon} className="border p-2 rounded cursor-pointer text-sm">{icon}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Company</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {[["About Us", "about"], ["How It Works", "home"], ["Contact", "contact"]].map(([label, page]) => (
                <span key={label} onClick={() => goTo(page)} className="cursor-pointer hover:text-green-800">{label}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">For Users</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              {[["Browse Trees", "trees"], ["Map", "map"], ["Plant a Tree", "add"]].map(([label, page]) => (
                <span key={label} onClick={() => goTo(page)} className="cursor-pointer hover:text-green-800">{label}</span>
              ))}
            </div>
          </div>
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <div className="flex flex-col gap-2 text-sm text-gray-600">
              <span className="cursor-pointer hover:text-green-800">Privacy Policy</span>
              <span className="cursor-pointer hover:text-green-800">Terms of Service</span>
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-center pt-5 text-xs text-gray-500 gap-2">
          <span>© 2026 Vanashree. All rights reserved.</span>
          <span>Made with 🌱 for nature</span>
        </div>
      </div>

    </div>
  )
}