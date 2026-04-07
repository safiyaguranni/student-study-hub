'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/', label: 'Dashboard', icon: '🏠' },
  { href: '/chat', label: 'AI Chat Tutor', icon: '🤖' },
  { href: '/quiz', label: 'Quiz Generator', icon: '📝' },
  { href: '/study-plan', label: 'Study Planner', icon: '📅' },
  { href: '/summarize', label: 'Summarizer', icon: '📄' },
  { href: '/notes', label: 'My Notes', icon: '📁' },
];

export default function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="sidebar" id="sidebar">
      <div className="sidebar-header">
        <Link href="/" className="sidebar-logo">
          <div className="sidebar-logo-icon">🎓</div>
          <span className="sidebar-logo-text">AI Coach</span>
        </Link>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`nav-link ${isActive ? 'active' : ''}`}
              id={`nav-${item.href.replace('/', '') || 'home'}`}
            >
              <span className="nav-link-icon">{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <p className="sidebar-footer-text">AI Student Coach v1.0</p>
      </div>
    </aside>
  );
}
