import { useState, useEffect } from "react"
import Navbar from "./components/Navbar"
import Home from "./components/Home"
import Login from "./components/Login"
import Register from "./components/Register"
import AddPost from "./components/AddPost"
import Profile from "./components/Profile"
import TreeDetail from "./components/TreeDetails"
import About from "./components/About"
import MapPage from "./components/Map"
import Contact from "./components/Contact"
import Trees from "./components/Tree"

export default function App() {

  const [page, setPage] = useState("home")
  const [user, setUser] = useState(null)
  const [selectedTreeId, setSelectedTreeId] = useState(null)

  // load user from localStorage when app starts
  useEffect(() => {
    const savedUser = localStorage.getItem("vanashree_user")
    if (savedUser) {
      setUser(JSON.parse(savedUser))
    }
  }, [])

  function goTo(pageName) {
    setPage(pageName)
    window.scrollTo(0, 0)
  }

  function openTree(treeId) {
    setSelectedTreeId(treeId)
    setPage("tree")
    window.scrollTo(0, 0)
  }


  function handleSetUser(userData) {
    setUser(userData)
    if (userData) {
      localStorage.setItem("vanashree_user", JSON.stringify(userData))
    } else {
      localStorage.removeItem("vanashree_user")
    }
  }

  function logout() {
    setUser(null)
    localStorage.removeItem("vanashree_user")
    setPage("home")
  }

  return (
    <div>

      <Navbar user={user} goTo={goTo} logout={logout} />

      {page === "home" && <Home user={user} goTo={goTo} openTree={openTree} />}
      {page === "trees" && <Trees user={user} goTo={goTo} openTree={openTree} />}
      {page === "login" && <Login goTo={goTo} setUser={handleSetUser} />}
      {page === "register" && <Register goTo={goTo} setUser={handleSetUser} />}
      {page === "about" && <About goTo={goTo} />}
      {page === "map" && <MapPage goTo={goTo} />}
      {page === "contact" && <Contact goTo={goTo} />}
      {page === "tree" && selectedTreeId && <TreeDetail treeId={selectedTreeId} goTo={goTo} user={user} />}

      {page === "add" && user && <AddPost goTo={goTo} user={user} />}
      {page === "add" && !user && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="text-5xl mb-4">🌱</p>
          <p className="text-gray-600 mb-4">Please login to plant a tree</p>
          <button onClick={() => goTo("login")} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer">
            Login
          </button>
        </div>
      )}

      {page === "profile" && user && <Profile user={user} goTo={goTo} logout={logout} />}
      {page === "profile" && !user && (
        <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
          <p className="text-5xl mb-4">👤</p>
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
          <button onClick={() => goTo("login")} className="bg-green-900 text-white border-none px-6 py-2.5 rounded-lg text-sm cursor-pointer">
            Login
          </button>
        </div>
      )}

    </div>
  )
}