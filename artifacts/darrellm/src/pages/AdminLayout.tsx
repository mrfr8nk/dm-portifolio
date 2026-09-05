import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Link, Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  LayoutDashboard, Settings, FolderOpen, MapPin, Hammer, Link2,
  Globe, LogOut, ChevronRight, Menu, X, FileText, BarChart3, Inbox, MessageSquareQuote, GraduationCap, Award, UsersRound, MailPlus, ScrollText,
} from "lucide-react";
import Seo from "@/components/Seo";

const navItems = [
  { label: "Settings", href: "/admin/settings", icon: Settings },
  { label: "Skills", href: "/admin/skills", icon: BarChart3 },
  { label: "Projects", href: "/admin/projects", icon: FolderOpen },
  { label: "Blog", href: "/admin/blog", icon: FileText },
  { label: "Devlogs", href: "/admin/devlogs", icon: ScrollText },
  { label: "Friends", href: "/admin/friends", icon: UsersRound },
  { label: "Newsletter", href: "/admin/newsletter", icon: MailPlus },
  { label: "Testimonials", href: "/admin/testimonials", icon: MessageSquareQuote },
  { label: "Education", href: "/admin/education", icon: GraduationCap },
  { label: "Certifications", href: "/admin/certifications", icon: Award },
  { label: "What I Build", href: "/admin/what-i-build", icon: Hammer },
  { label: "Milestones", href: "/admin/milestones", icon: MapPin },
  { label: "Currently", href: "/admin/currently", icon: LayoutDashboard },
  { label: "Social Links", href: "/admin/social", icon: Link2 },
  { label: "Footer Links", href: "/admin/footer", icon: Globe },
  { label: "Inbox", href: "/admin/inbox", icon: Inbox },
];

const AdminLayout = () => {
  const { signOut, user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    navigate("/admin/login");
  };

  return (
    <div className="admin-layout min-h-screen bg-background flex">
      <Seo title="Portfolio Admin | Darrell Mucheri" description="Private portfolio content management area." path={location.pathname} noIndex />
      <aside className={`admin-sidebar fixed inset-y-0 left-0 z-50 w-60 transform transition-transform lg:translate-x-0 ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:static lg:block`}>
        <div className="flex items-center justify-between h-14 px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2 font-mono font-bold text-sm">
            <img src="/favicon.ico" alt="logo" className="w-6 h-6 rounded" />
            d.m<span className="text-muted-foreground">/</span>admin
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="w-4 h-4" />
          </button>
        </div>

        <nav className="p-3 space-y-1">
          {navItems.map((item) => (
            <Link
              key={item.href}
              to={item.href}
              onClick={() => setSidebarOpen(false)}
              className={`admin-nav-item flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-colors ${
                location.pathname === item.href
                  ? "bg-accent text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
              }`}
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-3 border-t border-border">
          <p className="text-xs text-muted-foreground font-mono truncate mb-2 px-3">{user?.email}</p>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 px-3 py-2 rounded-md text-sm text-muted-foreground hover:text-foreground hover:bg-accent/50 transition-colors w-full"
          >
            <LogOut className="w-4 h-4" />
            Sign Out
          </button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="admin-header h-14 flex items-center px-4 gap-3">
          <button onClick={() => setSidebarOpen(true)} className="lg:hidden">
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-1 text-xs text-muted-foreground font-mono">
            <span>admin</span>
            <ChevronRight className="w-3 h-3" />
            <span className="text-foreground">{navItems.find(n => n.href === location.pathname)?.label || "Dashboard"}</span>
          </div>
        </header>
        <main className="admin-main p-6 max-w-4xl">
          <Outlet />
        </main>
      </div>

      {sidebarOpen && <div className="fixed inset-0 bg-background/80 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}
    </div>
  );
};

export default AdminLayout;
