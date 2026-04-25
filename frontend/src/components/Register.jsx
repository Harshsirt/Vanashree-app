import { useState } from "react"

export default function Register({ goTo, setUser }) {

  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [photo, setPhoto] = useState(null);
  const [photoFile, setPhotoFile] = useState(null);
  const [otp, setOtp] = useState("");
  const [otpVerified, setOtpVerified] = useState(false);

  const [msg, setMsg] = useState("");
  const [msgType, setMsgType] = useState("error");
  const [loading, setLoading] = useState(false);

  function pickPhoto(e) {
    const file = e.target.files[0]
    if (file) {
      setPhoto(URL.createObjectURL(file))
      setPhotoFile(file)
    }
  }

  function showMsg(text, type = "error") {
    setMsg(text)
    setMsgType(type)
  }

  async function sendOtp() {
    if (!name || !phone || !email || !password) {
      showMsg("Please fill in all fields")
      return
    }
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/sendotp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    })
    const data = await res.json()
    setLoading(false)
    showMsg(data.msg, "success")
    setStep(2)
  }

  async function verifyOtp() {
    setLoading(true)
    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/verifyOtp`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp })
    })
    const data = await res.json()
    setLoading(false)

    if (data.msg === "OTP verified") {
      setOtpVerified(true)
      showMsg("OTP verified!", "success")
      await handleRegister()
    } else {
      showMsg(data.msg)
    }
  }

  async function handleRegister() {
    setLoading(true)

 
    const formData = new FormData()
    formData.append("name", name)
    formData.append("phone", phone)
    formData.append("email", email)
    formData.append("password", password)
    if (photoFile) formData.append("photo", photoFile)

    const res = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
      method: "POST",
      body: formData  // no Content-Type header when using FormData
    })

    const data = await res.json()
    setLoading(false)

    if (data.msg === "Registered") {
      setStep(3)
    } else {
      showMsg(data.msg)
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
          {num === 1 ? "Details" : num === 2 ? "Verify" : "Done"}
        </span>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col md:flex-row">

      
      <div className="hidden md:flex flex-1 bg-green-900 px-14 py-16 flex-col justify-center">
        <h2 className="text-white text-3xl font-semibold mb-4">Join the Vanashree community</h2>
        <p className="text-green-300 text-sm leading-relaxed">Become a volunteer and help plant trees across Maharashtra.</p>
        <div className="mt-8 flex flex-col gap-4">
          {["Free to join", "Email verified account", "Plant your first tree today", "Earn badges as you contribute"].map(item => (
            <div key={item} className="flex items-center gap-3 text-green-200 text-sm">
              <span className="text-green-400">✓</span> {item}
            </div>
          ))}
        </div>
      </div>

     
      <div className="flex-1 md:max-w-md flex items-center justify-center px-6 py-12 bg-white">
        <div className="w-full max-w-sm">

          
          <div className="flex items-center mb-8">
            <StepCircle num={1} />
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > 1 ? "bg-green-900" : "bg-gray-200"}`} />
            <StepCircle num={2} />
            <div className={`flex-1 h-0.5 mx-2 mb-4 ${step > 2 ? "bg-green-900" : "bg-gray-200"}`} />
            <StepCircle num={3} />
          </div>

         
          {msg && (
            <div className={`text-sm px-4 py-3 rounded-lg mb-4 border ${msgType === "success" ? "bg-green-50 border-green-200 text-green-700" : "bg-red-50 border-red-200 text-red-700"}`}>
              {msg}
            </div>
          )}

          
          {step === 1 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Create your account</h2>
              <p className="text-sm text-gray-500 mb-6">Fill in your basic details</p>

           
              <div className="flex flex-col items-center mb-5">
                <div
                  onClick={() => document.getElementById("photoInput").click()}
                  className="w-20 h-20 rounded-full bg-green-100 border-2 border-dashed border-green-300 flex items-center justify-center cursor-pointer overflow-hidden mb-2"
                >
                  {photo
                    ? <img src={photo} className="w-full h-full object-cover" alt="profile" />
                    : <span className="text-3xl">📷</span>
                  }
                </div>
                <p className="text-xs text-gray-400">Tap to add profile photo</p>
                <input
                  id="photoInput"
                  type="file"
                  accept="image/*"
                  capture="user"
                  className="hidden"
                  onChange={pickPhoto}
                />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-1.5">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} placeholder="Your full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-1.5">Phone Number</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="10 digit mobile number" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
              </div>

              <div className="mb-4">
                <label className="text-sm text-gray-600 block mb-1.5">Email address</label>
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
              </div>

              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-1.5">Password</label>
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
              </div>

              <button onClick={sendOtp} disabled={loading} className="w-full bg-green-900 text-white border-none py-3 rounded-lg text-sm cursor-pointer hover:bg-green-800 disabled:opacity-60">
                {loading ? "Sending OTP..." : "Continue →"}
              </button>

              <p className="text-center mt-5 text-sm text-gray-500">
                Already have an account?{" "}
                <span onClick={() => goTo("login")} className="text-green-900 cursor-pointer font-medium">Login</span>
              </p>
            </>
          )}

         
          {step === 2 && (
            <>
              <h2 className="text-2xl font-semibold text-gray-900 mb-1">Verify your email</h2>
              <p className="text-sm text-gray-500 mb-6">
                We sent an OTP to <strong className="text-green-900">{email}</strong>
              </p>

              <div className="mb-6">
                <label className="text-sm text-gray-600 block mb-1.5">Enter OTP</label>
                <input
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  maxLength={6}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700 tracking-widest text-center"
                />
              </div>

              <button onClick={verifyOtp} disabled={loading} className="w-full bg-green-900 text-white border-none py-3 rounded-lg text-sm cursor-pointer hover:bg-green-800 disabled:opacity-60">
                {loading ? "Verifying..." : "Verify & Create Account"}
              </button>

              <div className="flex justify-between mt-4 text-sm text-green-900">
                <span onClick={() => setStep(1)} className="cursor-pointer">← Change details</span>
                <span onClick={sendOtp} className="cursor-pointer">Resend OTP</span>
              </div>
            </>
          )}

          
          {step === 3 && (
            <div className="text-center py-6">
              {photo && (
                <img src={photo} className="w-20 h-20 rounded-full object-cover mx-auto mb-4 border-2 border-green-300" alt="profile" />
              )}
              <p className="text-5xl mb-4">{!photo && "🎉"}</p>
              <h2 className="text-xl font-semibold text-green-900 mb-2">Welcome to Vanashree!</h2>
              <p className="text-sm text-gray-500 mb-6">Your account has been created successfully.</p>
              <button onClick={() => goTo("login")} className="w-full bg-green-900 text-white border-none py-3 rounded-lg text-sm cursor-pointer hover:bg-green-800">
                Login Now
              </button>
            </div>
          )}

        </div>
      </div>

    </div>
  )
}