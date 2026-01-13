'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Plus, Loader2, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Blog {
  id: string;
  title: string;
  slug: string;
  status: 'published' | 'draft' | 'scheduled';
  published_at: string | null;
  created_at: string;
  featured_image: string | null;
}

interface BlogsTableProps {
  onCreate: () => void;
  onEdit: (id: string) => void;
}

export function BlogsTable({ onCreate, onEdit }: BlogsTableProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('published');

  useEffect(() => {
    fetchBlogs();

    // Realtime subscription
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'blogs',
        },
        (payload) => {
          if (payload.eventType === 'INSERT') {
            setBlogs((current) => [payload.new as Blog, ...current]);
            toast.success('New blog post received');
          } else if (payload.eventType === 'UPDATE') {
            setBlogs((current) =>
              current.map((blog) => {
                if (blog.id === payload.new.id) {
                    const newStatus = payload.new.status;
                    const oldStatus = blog.status;
                    
                    // "Life Tracking" Notification
                    if (oldStatus === 'scheduled' && newStatus === 'published') {
                        toast.success(`Blog "${blog.title}" is now LIVE! 🚀`, {
                            duration: 5000,
                            description: 'Status updated automatically.'
                        });
                    }
                    return { ...blog, ...payload.new };
                }
                return blog;
              })
            );
             // Verify if status changed for user feedback, but UI updates automatically via state
          } else if (payload.eventType === 'DELETE') {
            setBlogs((current) =>
              current.filter((blog) => blog.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);

  // ... (existing fetchBlogs code remains same) ...
  async function fetchBlogs() {
    try {
      setLoading(true);
      
      // Auto-publish any scheduled posts that are due
      await supabase.rpc('publish_due_posts');

      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setBlogs(data || []);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      toast.error('Failed to load blogs');
    } finally {
      setLoading(false);
    }
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id);
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      setDeleting(true);
      const { error } = await supabase.from('blogs').delete().eq('id', deleteId);
      if (error) throw error;
      
      setBlogs(blogs.filter(b => b.id !== deleteId));
      toast.success('Blog deleted successfully');
    } catch (error) {
      console.error('Error deleting blog:', error);
      toast.error('Failed to delete blog');
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const filteredBlogs = blogs.filter(blog => {
    if (activeTab === 'published') return blog.status === 'published';
    if (activeTab === 'draft') return blog.status === 'draft';
    if (activeTab === 'scheduled') return blog.status === 'scheduled';
    return true;
  });

  // Mobile Blog Card Component
  const BlogCard = ({ blog }: { blog: Blog }) => (
      <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-100 flex flex-col gap-4">
          <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                  {blog.featured_image ? (
                        // eslint-disable-next-line @next/next/no-img-element
                      <img src={blog.featured_image} alt="" className="w-16 h-16 rounded-md object-cover border border-gray-100" />
                  ) : (
                      <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center text-gray-400 text-xs">No Img</div>
                  )}
                  <div>
                      <h3 className="font-semibold text-gray-900 line-clamp-1">{blog.title}</h3>
                      <p className="text-xs text-gray-500 font-mono">/{blog.slug}</p>
                  </div>
              </div>
              <Badge 
                  variant="outline" 
                  className={
                      blog.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                      blog.status === 'draft' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                      'bg-blue-50 text-blue-700 border-blue-200'
                  }
              >
                  {blog.status}
              </Badge>
          </div>
          
          <div className="flex items-center justify-between text-sm text-gray-500 border-t border-gray-100 pt-3">
             <div className="flex flex-col">
                 <span className="text-xs text-gray-400 uppercase tracking-wider">Date</span>
                 <span> {blog.published_at ? new Date(blog.published_at).toLocaleDateString() : 'N/A'}</span>
             </div>
             {(blog as any).views !== undefined && (
                 <div className="flex flex-col text-right">
                     <span className="text-xs text-gray-400 uppercase tracking-wider">Views</span>
                     <span className="font-medium text-gray-900">{(blog as any).views || 0}</span>
                 </div>
             )}
          </div>

          <div className="flex gap-2 mt-2">
              <Button size="sm" className="flex-1 bg-[#C5A572] hover:bg-[#B89660] text-black border-none" onClick={() => onEdit(blog.id)}>
                  <Pencil className="w-3 h-3 mr-2" /> Edit
              </Button>
              <Button variant="outline" size="sm" className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-100" onClick={() => handleDeleteClick(blog.id)}>
                  <Trash2 className="w-3 h-3 mr-2" /> Delete
              </Button>
          </div>
      </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-3xl font-bold tracking-tight font-serif text-[#111827]">Blogs</h2>
           <p className="text-muted-foreground mt-1">Manage your blog posts, articles, and updates.</p>
        </div>
        <Button 
           onClick={onCreate} 
           className="bg-[#C5A572] hover:bg-[#B89660] text-black font-semibold w-full md:w-auto"
        >
          <Plus className="w-4 h-4 mr-2" />
          Create New Blog
        </Button>
      </div>

      <Tabs defaultValue="published" onValueChange={setActiveTab} className="w-full">
        <TabsList className="flex w-full max-w-xl bg-white/50 backdrop-blur-sm border border-gray-200 p-1.5 rounded-full mb-8">
          <TabsTrigger 
            value="published"
            className="flex-1 rounded-full data-[state=active]:bg-[#C5A572] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-2.5 font-medium"
          >
            Published ({blogs.filter(b => b.status === 'published').length})
          </TabsTrigger>
          <TabsTrigger 
            value="draft"
            className="flex-1 rounded-full data-[state=active]:bg-[#C5A572] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-2.5 font-medium"
          >
            Drafts ({blogs.filter(b => b.status === 'draft').length})
          </TabsTrigger>
          <TabsTrigger 
            value="scheduled"
            className="flex-1 rounded-full data-[state=active]:bg-[#C5A572] data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 py-2.5 font-medium"
          >
            Scheduled ({blogs.filter(b => b.status === 'scheduled').length})
          </TabsTrigger>
        </TabsList>

        <div className="mt-6">
           {/* Desktop Table */}
           <div className="hidden md:block">
              <Card className="p-0 overflow-hidden border-none shadow-custom">
                 <Table>
                  <TableHeader>
                    <TableRow className="bg-gray-50/50 hover:bg-gray-50/50">
                      <TableHead className="w-[400px]">Title</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Views</TableHead>
                      <TableHead>Publish Date</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {loading ? (
                      <TableRow>
                         <TableCell colSpan={5} className="h-24 text-center">
                            <Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A572]" />
                         </TableCell>
                      </TableRow>
                    ) : filteredBlogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="h-32 text-center text-muted-foreground">
                          No blogs found in this section.
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredBlogs.map((blog) => (
                        <TableRow key={blog.id} className="hover:bg-gray-50/50 transition-colors">
                          <TableCell className="font-medium">
                            <div className="flex items-center gap-3">
                               {blog.featured_image && (
                                   // eslint-disable-next-line @next/next/no-img-element
                                  <img src={blog.featured_image} alt="" className="w-10 h-10 rounded object-cover border border-gray-100" />
                               )}
                               <div className="flex flex-col">
                                 <span className="text-base text-gray-900 line-clamp-1">{blog.title}</span>
                                 <span className="text-xs text-gray-400 max-w-[200px] truncate">/{blog.slug}</span>
                               </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge 
                              variant="outline" 
                              className={
                                 blog.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' :
                                 blog.status === 'draft' ? 'bg-gray-100 text-gray-700 border-gray-200' :
                                 'bg-blue-50 text-blue-700 border-blue-200'
                              }
                            >
                              {blog.status.charAt(0).toUpperCase() + blog.status.slice(1)}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-gray-600 font-mono">
                              {(blog as any).views || 0}
                          </TableCell>
                          <TableCell className="text-gray-500">
                             {blog.published_at ? new Date(blog.published_at).toLocaleDateString('en-AU', { 
                                day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
                             }) : 'Not scheduled'}
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" onClick={() => onEdit(blog.id)}>
                                <Pencil className="w-4 h-4 text-gray-600" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDeleteClick(blog.id)}>
                                <Trash2 className="w-4 h-4 text-red-600" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </Card>
           </div>
           
          {/* Mobile Cards */}
           <div className="md:hidden space-y-4">
               {loading ? (
                   <div className="text-center py-10"><Loader2 className="w-6 h-6 animate-spin mx-auto text-[#C5A572]" /></div>
               ) : filteredBlogs.length === 0 ? (
                   <div className="text-center py-10 text-gray-500 bg-gray-50 rounded-lg">No blogs found.</div>
               ) : (
                   filteredBlogs.map(blog => (
                       <BlogCard key={blog.id} blog={blog} />
                   ))
               )}
           </div>
        </div>
      </Tabs>

      <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Blog Post?</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this blog post? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteId(null)} disabled={deleting}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDelete} disabled={deleting}>
              {deleting ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Trash2 className="w-4 h-4 mr-2" />}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
