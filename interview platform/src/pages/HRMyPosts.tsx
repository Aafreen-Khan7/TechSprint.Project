import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Building, Briefcase, MapPin, DollarSign, Clock, 
  Trash2, Plus, LayoutDashboard, FileText, Users, 
  Bell, Menu, X, ChevronRight, Search, LogOut,
  Calendar, MoreVertical, Edit3, Eye, Loader2
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getHRHiringPosts, deleteHiringPost } from '@/services/firebaseService';
import { HiringPost } from '@/types/interview';
import { toast } from "sonner";
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

const HRMyPosts = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [posts, setPosts] = React.useState<HiringPost[]>([]);
  const [isLoading, setIsLoading] = React.useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(true);

  const sidebarLinks = [
    { name: 'Dashboard', icon: LayoutDashboard, path: '/hr/dashboard' },
    { name: 'My Posts', icon: FileText, path: '/hr/my-posts' },
    { name: 'Candidates', icon: Users, path: '/hr/applications' },
  ];

  const loadPosts = async () => {
    if (!user) return;
    try {
      const hrPosts = await getHRHiringPosts(user.id);
      setPosts(hrPosts);
    } catch (error) {
      console.error('Error loading posts:', error);
      toast.error('Failed to load posts');
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    if (user?.id) {
      loadPosts();
    }
  }, [user]);

  const handleDeletePost = async (postId: string) => {
    if (!confirm('Are you sure you want to delete this post?')) return;
    try {
      await deleteHiringPost(postId);
      toast.success('Post deleted successfully');
      loadPosts();
    } catch (error) {
      console.error('Error deleting post:', error);
      toast.error('Failed to delete post');
    }
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-[#0B0F1A] text-slate-200 flex overflow-hidden">
      {/* Sidebar */}
      <aside 
        className={cn(
          "bg-[#111827] border-r border-slate-800 transition-all duration-300 z-50 flex flex-col",
          isSidebarOpen ? "w-64" : "w-20"
        )}
      >
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center flex-shrink-0">
            <Building className="w-6 h-6 text-white" />
          </div>
          {isSidebarOpen && <span className="font-bold text-xl tracking-tight text-white">HireBotics</span>}
        </div>

        <nav className="flex-1 px-4 space-y-2 mt-4">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => navigate(link.path)}
              className={cn(
                "w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-200 group",
                location.pathname === link.path 
                  ? "bg-blue-600/10 text-blue-400" 
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              )}
            >
              <link.icon className={cn(
                "w-5 h-5",
                location.pathname === link.path ? "text-blue-400" : "group-hover:text-slate-100"
              )} />
              {isSidebarOpen && <span className="font-medium">{link.name}</span>}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-slate-800">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-red-400 hover:bg-red-400/10 transition-all">
            <LogOut className="w-5 h-5" />
            {isSidebarOpen && <span className="font-medium">Sign Out</span>}
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navigation */}
        <header className="h-20 bg-[#111827]/50 backdrop-blur-md border-b border-slate-800 px-8 flex items-center justify-between z-40">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="p-2 hover:bg-slate-800 rounded-lg text-slate-400">
              {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            <h1 className="text-xl font-bold text-white hidden sm:block">My Hiring Posts</h1>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-white">{user.name}</p>
                <p className="text-xs text-slate-500">{user.companyName}</p>
              </div>
              <Avatar className="w-10 h-10 border-2 border-slate-800">
                <AvatarImage src={user.avatar} />
                <AvatarFallback className="bg-blue-600 text-white font-bold">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar">
          <div className="max-w-7xl mx-auto space-y-8">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-[#111827] p-6 rounded-2xl border border-slate-800 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-white">Job Postings</h2>
                <p className="text-slate-500 text-sm mt-1">Manage and track your active job advertisements.</p>
              </div>
              <Button onClick={() => navigate('/hr/dashboard')} className="bg-blue-600 hover:bg-blue-700 h-11 px-6 rounded-xl flex items-center gap-2 shadow-lg shadow-blue-600/20">
                <Plus className="w-5 h-5" />
                Post New Job
              </Button>
            </div>

            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-24 space-y-4">
                <Loader2 className="animate-spin h-12 w-12 text-blue-500" />
                <p className="text-slate-500 font-medium">Loading your posts...</p>
              </div>
            ) : posts.length === 0 ? (
              <div className="bg-[#111827] border-2 border-dashed border-slate-800 rounded-3xl p-20 text-center">
                <div className="w-20 h-20 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-6 border border-slate-800 text-slate-700">
                  <Briefcase className="w-10 h-10" />
                </div>
                <h3 className="text-white font-bold text-2xl">No job posts yet</h3>
                <p className="text-slate-500 max-w-sm mx-auto mt-3 text-lg">You haven't created any job advertisements. Start by posting your first job opening.</p>
                <Button onClick={() => navigate('/hr/dashboard')} className="mt-8 bg-blue-600 hover:bg-blue-700 h-12 px-8 rounded-xl">
                  Create First Posting
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-[#111827] border-slate-800 overflow-hidden flex flex-col group hover:border-slate-700 transition-all duration-300 shadow-sm">
                    {post.imageUrl ? (
                      <div className="relative h-48 overflow-hidden">
                        <img 
                          src={post.imageUrl} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" 
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#111827] to-transparent opacity-60" />
                        <Badge className="absolute top-4 right-4 bg-emerald-500/90 text-white border-none backdrop-blur-md">
                          Active
                        </Badge>
                      </div>
                    ) : (
                      <div className="h-48 bg-slate-900 flex items-center justify-center border-b border-slate-800 relative">
                        <Building className="w-12 h-12 text-slate-800" />
                        <Badge className="absolute top-4 right-4 bg-emerald-500/90 text-white border-none backdrop-blur-md">
                          Active
                        </Badge>
                      </div>
                    )}
                    
                    <CardHeader className="pb-2">
                      <div className="flex flex-col gap-1">
                        <CardTitle className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors line-clamp-1">
                          {post.title}
                        </CardTitle>
                        <CardDescription className="text-slate-500 font-medium">
                          {post.companyName}
                        </CardDescription>
                      </div>
                    </CardHeader>

                    <CardContent className="space-y-4 flex-grow">
                      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs font-medium uppercase tracking-wider text-slate-500">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-blue-500" />
                          {post.location}
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-blue-500" />
                          {post.jobType}
                        </div>
                      </div>
                      <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                        {post.description}
                      </p>
                    </CardContent>

                    <div className="p-6 pt-0 mt-auto flex items-center justify-between border-t border-slate-800/50 bg-slate-900/10">
                      <div className="flex items-center text-xs text-slate-500">
                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                        {post.createdAt.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg"
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button 
                          variant="ghost" 
                          size="icon" 
                          className="h-9 w-9 text-red-500/70 hover:text-red-400 hover:bg-red-500/10 rounded-lg"
                          onClick={() => handleDeletePost(post.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default HRMyPosts;
