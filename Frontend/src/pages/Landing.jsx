import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function Landing() {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col relative overflow-hidden">
      {/* Background glowing accents */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none"></div>
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-violet-600/10 blur-[120px] pointer-events-none"></div>

      {/* Decorative Grid Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f293710_1px,transparent_1px),linear-gradient(to_bottom,#1f293710_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] pointer-events-none"></div>

      {/* Navigation Header */}
      <header className="relative z-10 max-w-7xl mx-auto w-full px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-2xl font-bold tracking-tight bg-gradient-to-r from-indigo-400 via-purple-400 to-indigo-400 bg-clip-text text-transparent">
            ⚡ TaskManager
          </span>
        </div>
        <div className="flex items-center gap-4">
          {user ? (
            <Link
              to="/dashboard"
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/20"
            >
              Go to Dashboard
            </Link>
          ) : (
            <>
              <Link to="/login" className="text-gray-300 hover:text-white font-medium transition duration-200">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-indigo-600 hover:bg-indigo-500 text-white font-medium px-5 py-2.5 rounded-xl transition duration-300 shadow-lg shadow-indigo-600/20"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-6xl mx-auto px-6 flex flex-col items-center justify-center text-center py-20">
        <div className="animate-fade-in space-y-6 max-w-3xl">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-950/80 border border-indigo-800/60 text-indigo-300 text-xs font-semibold uppercase tracking-wider">
            <span>✨ Introducing TaskManager v2.0</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-none text-transparent bg-clip-text bg-gradient-to-b from-white via-gray-100 to-gray-400">
            Unleash Productivity. <br className="hidden md:inline" />
            <span className="bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">Simplified.</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-medium">
            Streamline your project lifecycles, collaborate in high-speed Kanban sprints, and track milestones with the ultimate internal manager.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            {user ? (
              <Link
                to="/dashboard"
                className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/35"
              >
                Go to Dashboard &rarr;
              </Link>
            ) : (
              <>
                <Link
                  to="/signup"
                  className="w-full sm:w-auto px-8 py-4 bg-indigo-600 hover:bg-indigo-500 hover:scale-105 active:scale-95 text-white font-semibold rounded-2xl transition-all duration-300 shadow-xl shadow-indigo-600/35"
                >
                  Start Organizing Free
                </Link>
                <Link
                  to="/login"
                  className="w-full sm:w-auto px-8 py-4 bg-gray-900 hover:bg-gray-800 hover:scale-105 active:scale-95 text-gray-200 hover:text-white font-semibold rounded-2xl border border-gray-800 hover:border-gray-700 transition-all duration-300"
                >
                  Explore Demo Account
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Feature Grid */}
        <section className="mt-28 w-full">
          <div className="grid md:grid-cols-3 gap-6 text-left">
            {[
              {
                title: 'Sprint Kanban Boards',
                desc: 'Organize your tasks visually with interactive statuses (To Do, In Progress, Done) and drag-and-drop support.',
                icon: (
                  <svg className="w-6 h-6 text-indigo-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 17V7m0 10a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h2a2 2 0 012 2m0 10a2 2 0 002 2h2a2 2 0 002-2M9 7a2 2 0 012-2h2a2 2 0 012 2m0 10V7m0 10a2 2 0 002 2h2a2 2 0 002-2V7a2 2 0 00-2-2h-2a2 2 0 00-2 2" />
                  </svg>
                ),
              },
              {
                title: 'Role-Based Safety',
                desc: 'Admins create, configure, and delete projects. Members update statuses and execute assigned tasks securely.',
                icon: (
                  <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                ),
              },
              {
                title: 'Analytics at a Glance',
                desc: 'Instantly view pending, completed, or overdue tasks in a beautiful interactive centralized hub.',
                icon: (
                  <svg className="w-6 h-6 text-violet-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                ),
              },
            ].map((f, i) => (
              <div
                key={i}
                className="bg-gray-900/60 backdrop-blur-md border border-gray-900 rounded-2xl p-6 hover:border-indigo-500/30 hover:scale-[1.02] hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800/80 flex items-center justify-center mb-4 border border-gray-700/50">
                  {f.icon}
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-gray-900/60 py-8 text-center text-xs text-gray-600">
        <p>&copy; {new Date().getFullYear()} TaskManager by Ethara.AI. All rights reserved.</p>
      </footer>
    </div>
  )
}
