import { useState } from "react"
import { X } from "lucide-react"

export default function Login({ goTo, setUser }) {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [errorMsg, setErrorMsg] = useState("")
  const [loading, setLoading] = useState(false)

  async function handleLogin(e) {
    e.preventDefault()

    if (!email || !password) {
      setErrorMsg("Please fill in all fields")
      return
    }

    setLoading(true)
    setErrorMsg("")

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include"
      })

      const data = await res.json()
      setLoading(false)
      if (data.msg === "Login success") {
      localStorage.setItem("vanashree_user", JSON.stringify(data.user)) 
      setUser(data.user)
      goTo("home")
      } else {
        setErrorMsg(data.msg)
      }

    } catch (err) {
      setLoading(false)
      setErrorMsg("Login failed: " + err.message)
    }
  }

  function continueAsGuest() {
    setUser({ name: "Guest", isGuest: true })
    goTo("home")
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 px-4">

      <div className="relative bg-white w-full max-w-sm rounded-2xl shadow-2xl overflow-hidden">

        
        <button
          onClick={() => goTo("home")}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 bg-transparent border-none cursor-pointer z-10"
        >
          <X size={20} />
        </button>

        
        <div className="bg-green-900 px-6 py-8 text-center">
          <p className="text-green-400 text-xs tracking-widest uppercase mb-1">Welcome Back</p>
          <h2 className="text-white text-2xl font-semibold">Login to Vanashree</h2>
          <p className="text-green-300 text-xs mt-2">Continue your tree planting journey</p>
        </div>

        
        <form onSubmit={handleLogin} className="p-6 flex flex-col gap-4">

          {errorMsg && (
            <div className="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-2.5 rounded-lg">
              {errorMsg}
            </div>
          )}

          <div>
            <label className="text-sm text-gray-600 block mb-1.5">Email address</label>
            <input
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700"
            />
          </div>

          <div>
            <label className="text-sm text-gray-600 block mb-1.5">Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-green-900 text-white py-3 rounded-lg text-sm cursor-pointer border-none hover:bg-green-800 disabled:opacity-60"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-gray-200" />
            <span className="text-xs text-gray-400">or</span>
            <div className="flex-1 h-px bg-gray-200" />
          </div>

          <button
            type="button"
            onClick={continueAsGuest}
            className="w-full border border-gray-200 bg-white text-gray-600 py-3 rounded-lg text-sm cursor-pointer hover:bg-gray-50"
          >
            Continue as Guest 🌱
          </button>

          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <span
              onClick={() => goTo("register")}
              className="text-green-900 cursor-pointer font-medium"
            >
              Register here
            </span>
          </p>

        </form>

      </div>
    </div>
  )
}