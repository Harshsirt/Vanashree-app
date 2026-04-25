import { useState, useEffect } from "react"
import logo from "../assets/logo.jpeg"

export default function Navbar({ user, goTo, logout }) {

  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [showNotif, setShowNotif] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)

  const navLinks = [
    { label: "Home", page: "home" },
    { label: "Trees", page: "trees" },
    { label: "Map", page: "map" },
    { label: "About", page: "about" },
    { label: "Contact", page: "contact" },
  ]

  useEffect(() => {
    if (user && !user.isGuest) {
      loadNotifications()
    }
  }, [user])

  function loadNotifications() {
    fetch("http://localhost:3000/api/updates/recent")
      .then(res => res.json())
      .then(data => {
        setNotifications(data)
        setUnreadCount(data.length)
      })
      .catch(() => {})
  }

  function openNotifications() {
    setShowNotif(!showNotif)
    setUnreadCount(0)
  }

  return (
    <nav className="bg-white border-b border-gray-200 px-4 sm:px-8 lg:px-10 h-16 flex items-center justify-between sticky top-0 z-50">

      
      <div onClick={() => goTo("home")} className="flex items-center gap-3 cursor-pointer">
        <img src={logo} alt="Vanashree" className="h-10" />
        <div>
          <p className="text-green-900 font-semibold text-sm sm:text-base m-0 leading-tight">Vanashree</p>
          <p className="text-gray-600 text-xs m-0 tracking-widest hidden sm:block">वनश्री · Tree Plantation</p>
        </div>
      </div>

     
      <div className="hidden md:flex gap-1 bg-gray-100 rounded-xl p-1">
        {navLinks.map(item => (
          <span
            key={item.page}
            onClick={() => goTo(item.page)}
            className="text-xs text-gray-500 px-4 py-2 rounded-lg cursor-pointer hover:bg-green-500"
          >
            {item.label}
          </span>
        ))}
      </div>

     
      <div className="hidden md:flex items-center gap-2">

       
        {user && !user.isGuest && (
          <div className="relative">
            <button
              onClick={openNotifications}
              className="relative bg-transparent border-none cursor-pointer p-2 text-gray-600 hover:text-green-900"
            >
              <span className="text-xl">🔔</span>
              {unreadCount > 0 && (
                <span className="absolute top-0 right-0 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center font-semibold">
                  {unreadCount > 9 ? "9+" : unreadCount}
                </span>
              )}
            </button>

           
            {showNotif && (
              <div className="absolute right-0 top-12 w-80 bg-white border border-gray-200 rounded-2xl shadow-xl z-50 overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-sm font-semibold text-gray-900">Recent Updates</h3>
                  <button onClick={() => setShowNotif(false)} className="text-gray-400 bg-transparent border-none cursor-pointer text-lg">✕</button>
                </div>
                <div className="max-h-72 overflow-y-auto">
                  {notifications.length === 0 && (
                    <div className="text-center py-8 text-gray-400">
                      <p className="text-2xl mb-2">🔔</p>
                      <p className="text-xs">No updates yet</p>
                    </div>
                  )}
                  {notifications.map((notif, i) => (
                    <div
                      key={i}
                      className="px-4 py-3 border-b border-gray-50 hover:bg-gray-50 cursor-pointer"
                      onClick={() => { setShowNotif(false) }}
                    >
                      <p className="text-xs font-medium text-gray-900 mb-0.5">
                        🌿 {notif.treeTitle}
                      </p>
                      <p className="text-xs text-gray-500 mb-0.5">{notif.caption || "Photo update posted"}</p>
                      <p className="text-xs text-green-700">by {notif.postedByName} · {new Date(notif.createdAt).toDateString()}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {!user && (
          <>
            <button onClick={() => goTo("login")} className="border border-gray-200 bg-white text-gray-700 px-4 py-2 rounded-lg text-xs cursor-pointer">
              Login
            </button>
            <button onClick={() => goTo("register")} className="bg-green-900 text-white px-4 py-2 rounded-lg text-xs cursor-pointer border-none">
               Join Us
            </button>
          </>
        )}

        {user && (
          <>
            {!user.isGuest && (
              <button onClick={() => goTo("add")} className="bg-green-900 text-white px-4 py-2 rounded-lg text-xs cursor-pointer border-none">
                 Plant Tree
              </button>
            )}
            <div onClick={() => goTo("profile")} className="flex items-center gap-2 bg-green-50 border border-green-200 rounded-full pl-1 pr-4 py-1 cursor-pointer">
              <div className="w-7 h-7 bg-green-900 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0">
                {user.photo && user.photo !== ""
                  ? <img src={`http://localhost:3000${user.photo}`} className="w-full h-full object-cover" alt="avatar" />
                  : <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                }
              </div>
              <span className="text-xs text-green-900 font-medium max-w-[80px] truncate">{user.name}</span>
            </div>
          </>
        )}
      </div>

      {/* Mobile hamburger */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden bg-transparent border-none text-gray-700 text-2xl cursor-pointer p-1"
      >
        {menuOpen ? "✕" : "☰"}
      </button>

      {/* Mobile dropdown */}
      {menuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white border-b border-gray-200 px-4 py-4 flex flex-col gap-2 z-50 shadow-lg">
          {navLinks.map(item => (
            <span
              key={item.page}
              onClick={() => { goTo(item.page); setMenuOpen(false) }}
              className="text-sm text-gray-700 cursor-pointer py-2 border-b border-gray-100"
            >
              {item.label}
            </span>
          ))}

          {!user && (
            <div className="flex gap-2 mt-2">
              <button onClick={() => { goTo("login"); setMenuOpen(false) }} className="flex-1 border border-gray-200 bg-white text-gray-700 py-2 rounded-lg text-sm cursor-pointer">
                Login
              </button>
              <button onClick={() => { goTo("register"); setMenuOpen(false) }} className="flex-1 bg-green-900 text-white py-2 rounded-lg text-sm cursor-pointer border-none">
                + Join Us
              </button>
            </div>
          )}

          {user && (
            <div className="flex flex-col gap-2 mt-2">
              <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                <div className="w-8 h-8 bg-green-900 rounded-full flex items-center justify-center text-white text-xs font-semibold overflow-hidden flex-shrink-0">
                  {user.photo && user.photo !== ""
                    ? <img src={`http://localhost:3000${user.photo}`} className="w-full h-full object-cover" alt="avatar" />
                    : <span>{user.name ? user.name[0].toUpperCase() : "U"}</span>
                  }
                </div>
                <span className="text-sm font-medium text-gray-800">{user.name}</span>
              </div>
              {!user.isGuest && (
                <button onClick={() => { goTo("add"); setMenuOpen(false) }} className="bg-green-900 text-white py-2 rounded-lg text-sm cursor-pointer border-none">
                  + Plant Tree
                </button>
              )}
              <button onClick={() => { goTo("profile"); setMenuOpen(false) }} className="border border-gray-200 bg-white text-gray-700 py-2 rounded-lg text-sm cursor-pointer">
                My Profile
              </button>
              <button onClick={() => { logout(); setMenuOpen(false) }} className="border border-red-200 bg-white text-red-600 py-2 rounded-lg text-sm cursor-pointer">
                Logout
              </button>
            </div>
          )}
        </div>
      )}

    </nav>
  )
}