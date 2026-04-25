import { useState } from "react"

export default function Contact({ goTo }) {

  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [sent, setSent] = useState(false)

  function handleSubmit() {
    if (!name || !email || !message) return
    setSent(true)
  }

  const contactInfo = [
    { icon: "✉️", title: "Email", value: "support@vanashree.com" },
    { icon: "📞", title: "Phone", value: "+91 9876543210" },
    { icon: "📍", title: "Location", value: "Maharashtra, India" },
  ]

  return (
    <div className="bg-gray-50 min-h-screen px-4 py-8 sm:px-8 lg:px-16">

      <button onClick={() => goTo("home")} className="text-green-800 text-sm bg-transparent border-none cursor-pointer mb-6">
        ← Back to Home
      </button>

      <div className="max-w-4xl mx-auto">

        <div className="text-center mb-10">
          <p className="text-green-700 text-xs tracking-widest uppercase mb-2">Get In Touch</p>
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Contact Us</h1>
          <p className="text-sm text-gray-500">Have a question or want to contribute? We would love to hear from you.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Left side */}
          <div className="flex flex-col gap-4">

            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <h2 className="text-base font-semibold text-gray-900 mb-5">Reach Us</h2>
              <div className="flex flex-col gap-4">
                {contactInfo.map(item => (
                  <div key={item.title} className="flex items-start gap-3">
                    <div className="w-9 h-9 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 text-base">
                      {item.icon}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{item.title}</p>
                      <p className="text-sm text-gray-500 mt-0.5">{item.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-green-900 rounded-2xl p-6">
              <h2 className="text-white text-base font-semibold mb-2">Want to Volunteer?</h2>
              <p className="text-green-200 text-sm mb-4 leading-relaxed">Join our team and help plant and protect trees across Maharashtra.</p>
              <button onClick={() => goTo("register")} className="bg-green-400 text-green-900 border-none px-5 py-2 rounded-lg text-sm font-semibold cursor-pointer">
                Join Vanashree
              </button>
            </div>

          </div>

         
          <div className="bg-white border border-gray-200 rounded-2xl p-6">

            {sent ? (
              <div className="text-center py-10">
                <p className="text-5xl mb-4">✅</p>
                <h2 className="text-lg font-semibold text-gray-900 mb-2">Message Sent!</h2>
                <p className="text-sm text-gray-500">We will get back to you soon.</p>
                <button onClick={() => setSent(false)} className="mt-5 text-sm text-green-800 border border-green-200 bg-green-50 px-4 py-2 rounded-lg cursor-pointer">
                  Send Another
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-base font-semibold text-gray-900 mb-5">Send a Message</h2>

                <div className="mb-4">
                  <label className="text-sm text-gray-600 block mb-1.5">Your Name</label>
                  <input value={name} onChange={e => setName(e.target.value)} placeholder="Full name" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
                </div>

                <div className="mb-4">
                  <label className="text-sm text-gray-600 block mb-1.5">Email address</label>
                  <input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="your@email.com" className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none focus:border-green-700" />
                </div>

                <div className="mb-6">
                  <label className="text-sm text-gray-600 block mb-1.5">Message</label>
                  <textarea value={message} onChange={e => setMessage(e.target.value)} placeholder="Write your message here..." rows={5} className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-sm outline-none resize-none focus:border-green-700" />
                </div>

                <button onClick={handleSubmit} className="w-full bg-green-900 text-white border-none py-3 rounded-lg text-sm cursor-pointer hover:bg-green-800">
                  Send Message
                </button>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}