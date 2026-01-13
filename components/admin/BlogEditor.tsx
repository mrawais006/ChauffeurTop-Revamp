'use client';

import { useEditor, EditorContent, BubbleMenu } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Link from '@tiptap/extension-link';
import Placeholder from '@tiptap/extension-placeholder';
import Underline from '@tiptap/extension-underline';
import TextAlign from '@tiptap/extension-text-align';
import Typography from '@tiptap/extension-typography';
import { Color } from '@tiptap/extension-color';
import TextStyle from '@tiptap/extension-text-style';
import Highlight from '@tiptap/extension-highlight';
import BubbleMenuExtension from '@tiptap/extension-bubble-menu';
import Table from '@tiptap/extension-table';
import TableCell from '@tiptap/extension-table-cell';
import TableHeader from '@tiptap/extension-table-header';
import TableRow from '@tiptap/extension-table-row';

import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Loader2, ArrowLeft, Save, Upload, Image as ImageIcon,
  Bold, Italic, Underline as UnderlineIcon, Strikethrough, Highlighter,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote,
  Undo, Redo, Link as LinkIcon, Minus, X, Check,
  Table as TableIcon, Trash, Plus, GripHorizontal,
  Eye, Calendar, Key, ChevronDown, ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

interface BlogEditorProps {
  blogId?: string | null;
  onBack: () => void;
  onSave: () => void;
}

export function BlogEditor({ blogId, onBack, onSave }: BlogEditorProps) {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const contentImageInputRef = useRef<HTMLInputElement>(null);
  
  // Form State
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [excerpt, setExcerpt] = useState('');
  const [status, setStatus] = useState<'draft' | 'published' | 'scheduled'>('draft');
  const [publishedAt, setPublishedAt] = useState<string>(''); // For scheduled date
  const [featuredImage, setFeaturedImage] = useState<string | null>(null);
  
  // New Fields
  const [categories, setCategories] = useState<string[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [visibility, setVisibility] = useState('public');
  
  // UI State
  const [newCategory, setNewCategory] = useState('');
  const [newTag, setNewTag] = useState('');
  const [isSlugEdited, setIsSlugEdited] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  
  // Publish Card Toggles
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [isEditingVisibility, setIsEditingVisibility] = useState(false);
  const [isEditingDate, setIsEditingDate] = useState(false);

  // Tiptap Editor
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit.configure({
         heading: { levels: [1, 2, 3, 4, 5, 6] },
      }),
      Image.configure({
        inline: true,
        allowBase64: true,
      }),
      Link.configure({
         openOnClick: false,
         HTMLAttributes: {
             class: 'text-blue-500 hover:text-blue-700 underline cursor-pointer',
         }
      }),
      Placeholder.configure({
        placeholder: 'Write your story here... (Press "/" for commands)',
      }),
      Underline,
      TextAlign.configure({
        types: ['heading', 'paragraph'],
        alignments: ['left', 'center', 'right', 'justify'],
      }),
      Typography,
      TextStyle,
      Color,
      Highlight.configure({ multicolor: true }),
      Highlight.configure({ multicolor: true }),
      BubbleMenuExtension,
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: 'border-collapse table-auto w-full',
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: '',
    editorProps: {
      attributes: {
        class: 'prose prose-lg dark:prose-invert max-w-none focus:outline-none min-h-[500px] p-8',
      },
    },
  });

  // Load Blog Data if editing
  useEffect(() => {
    if (blogId) {
      fetchBlog(blogId);
    }
  }, [blogId, editor]);

  // Generate Slug from Title
  useEffect(() => {
    if (!blogId && title && !isSlugEdited) { // Auto-generate if not editing existing blog AND slug hasn't been manually touched
       const generatedSlug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
       setSlug(generatedSlug);
    }
  }, [title, blogId, isSlugEdited]);

  // Handle Slug Change Manually
  const handleSlugChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      setSlug(e.target.value);
      setIsSlugEdited(true);
  };

  async function fetchBlog(id: string) {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('blogs').select('*').eq('id', id).single();
      
      if (error) throw error;
      if (data) {
        setTitle(data.title);
        setSlug(data.slug);
        setExcerpt(data.excerpt || '');
        setStatus(data.status as any);
        setFeaturedImage(data.featured_image);
        setCategories(data.categories || []);
        setTags(data.tags || []);
        setVisibility(data.visibility || 'public');
        if (data.slug) setIsSlugEdited(true); // Treat existing slug as edited to prevent overwrite
        if (data.published_at) {
            // Format for datetime-local input: YYYY-MM-DDTHH:mm
            const date = new Date(data.published_at);
            const formatted = date.toISOString().slice(0, 16);
            setPublishedAt(formatted);
        }
        if (editor && data.content) {
            editor.commands.setContent(data.content);
        }
      }
    } catch (error) {
      console.error('Error fetching blog:', error);
      toast.error('Failed to load blog');
    } finally {
      setLoading(false);
    }
  }

  // Category & Tag Handlers
  const handleAddCategory = () => {
    if (newCategory.trim() && !categories.includes(newCategory.trim())) {
        setCategories([...categories, newCategory.trim()]);
        setNewCategory('');
    }
  };

  const handleRemoveCategory = (cat: string) => {
    setCategories(categories.filter(c => c !== cat));
  };

  const handleAddTag = () => {
     if (newTag.trim() && !tags.includes(newTag.trim())) {
         setTags([...tags, newTag.trim()]);
         setNewTag('');
     }
  };

  const handleRemoveTag = (t: string) => {
     setTags(tags.filter(t => t !== t));
  };
  
  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploadingImage(true);
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);

      setFeaturedImage(publicUrl);
      toast.success('Image uploaded successfully');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  }

  async function handleContentImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `content_${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;

      toast.loading('Uploading image...');

      const { error: uploadError } = await supabase.storage
        .from('blog_images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('blog_images')
        .getPublicUrl(filePath);

      editor?.chain().focus().setImage({ src: publicUrl }).run();
      toast.success('Image inserted');
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
    } finally {
      // Reset input
      if (contentImageInputRef.current) contentImageInputRef.current.value = '';
      toast.dismiss();
    }
  }

  const addLink = () => {
     if (!editor) return;
     const previousUrl = editor.getAttributes('link').href;
     const url = window.prompt('URL', previousUrl);
     
     if (url === null) return;
     if (url === '') {
        editor.chain().focus().extendMarkRange('link').unsetLink().run();
        return;
     }
     editor.chain().focus().extendMarkRange('link').setLink({ href: url }).run();
  };

  async function saveBlog() {
    if (!title) {
        toast.error('Title is required');
        return;
    }
    if (!slug) {
        toast.error('Slug is required');
        return;
    }

    try {
      setSaving(true);
      
      const content = editor?.getHTML() || '';
      
      const blogData = {
        title,
        slug,
        excerpt,
        content,
        status,
        visibility,
        categories,
        tags,
        featured_image: featuredImage,
        published_at: status === 'scheduled' && publishedAt ? new Date(publishedAt).toISOString() : 
                      status === 'published' ? (publishedAt ? new Date(publishedAt).toISOString() : new Date().toISOString()) : 
                      null,
        updated_at: new Date().toISOString(),
      };

      let error;
      if (blogId) {
        const { error: updateError } = await supabase
          .from('blogs')
          .update(blogData)
          .eq('id', blogId);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('blogs')
          .insert([blogData]);
        error = insertError;
      }

      if (error) throw error;

      toast.success(blogId ? 'Blog updated successfully' : 'Blog created successfully');
      onSave();
    } catch (error: any) {
      console.error('Error saving blog:', error);
      toast.error(error.message || 'Failed to save blog');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
     return <div className="flex justify-center items-center h-64"><Loader2 className="w-8 h-8 animate-spin text-[#C5A572]" /></div>;
  }

  // Toolbar Button Component
  const ToolbarBtn = ({ 
     isActive = false, 
     onClick, 
     children, 
     tooltip 
  }: { 
     isActive?: boolean; 
     onClick: () => void; 
     children: React.ReactNode; 
     tooltip?: string 
  }) => (
     <Button
       type="button"
       variant="ghost" 
       size="sm" 
       onClick={onClick}
       title={tooltip}
       className={cn(
          "h-8 w-8 p-0 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors",
          isActive && "bg-gray-200 dark:bg-gray-700 text-black dark:text-white font-medium"
       )}
     >
        {children}
     </Button>
  );

   const handlePreview = () => {
    const previewData = {
      title,
      slug,
      excerpt,
      content: editor?.getHTML() || '',
      featured_image: featuredImage,
      categories,
      tags,
      published_at: publishedAt || new Date().toISOString(),
      author: { full_name: 'Preview User' },
      reading_time: Math.ceil((editor?.getText().split(/\s+/).filter(w => w !== '').length || 0) / 200)
    };
    localStorage.setItem('blog_preview_data', JSON.stringify(previewData));
    window.open('/blogs/preview', '_blank');
  };

  return (
    <div className="max-w-7xl mx-auto pb-12">
        <input 
            type="file" 
            ref={contentImageInputRef} 
            className="hidden" 
            accept="image/*" 
            onChange={handleContentImageUpload} 
        />
        {/* Header Actions */}
      <div className="bg-gray-50/80 backdrop-blur-sm p-4 rounded-xl border border-white/20 shadow-sm transition-all duration-300 mb-6 sticky top-4 z-40">
        <div className="flex flex-wrap items-center justify-between gap-4">
           {/* Title - Order 1 on Mobile (Top), Order 2 on Desktop */}
           <h1 className="text-xl md:text-2xl font-serif font-bold text-gray-900 w-full md:w-auto text-center md:text-left order-1 md:order-2">
              {blogId ? 'Edit Blog Post' : 'Create New Story'}
           </h1>

           {/* Back Button - Order 2 on Mobile (Bottom Left), Order 1 on Desktop */}
           <Button variant="ghost" onClick={onBack} className="text-gray-600 hover:text-gray-900 -ml-2 order-2 md:order-1 flex-1 md:flex-none justify-start">
              <ArrowLeft className="w-4 h-4 mr-2" /> Back
           </Button>

           {/* Actions Group - Order 3 on Mobile (Bottom Right), Order 3 on Desktop */}
           <div className="flex items-center justify-end gap-3 order-3 md:order-3 flex-1 md:flex-none">
              <span className={cn(
                  "px-3 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center shrink-0",
                  status === 'published' ? "bg-green-100 text-green-700" :
                  status === 'scheduled' ? "bg-blue-100 text-blue-700" :
                  "bg-gray-100 text-gray-600"
              )}>
                  {status}
              </span>
              <div className="hidden md:block h-9 w-px bg-gray-300 mx-2"></div>
              <Button disabled={saving} onClick={saveBlog} className="bg-luxury-gold hover:bg-luxury-gold/90 text-black font-semibold shadow-lg shadow-luxury-gold/20 flex-1 md:flex-none min-w-[100px]">
                 {saving && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                 {saving ? 'Saving...' : 'Publish'}
              </Button>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
         {/* Main Editor Column */}
         <div className="lg:col-span-3 space-y-6">
            <Card className="border-none shadow-sm overflow-visible">
               <CardContent className="p-8 space-y-6">
                  {/* Title & Slug */}
                  <div className="space-y-4">
                     <div>
                        <Label htmlFor="title" className="sr-only">Title</Label>
                        <Input 
                          id="title" 
                          value={title} 
                          onChange={(e) => setTitle(e.target.value)} 
                          className="text-4xl font-serif font-bold border-2 border-gray-200 bg-gray-50 focus:bg-white px-4 py-6 text-luxury-black placeholder:text-gray-300 rounded-xl shadow-sm focus-visible:ring-2 focus-visible:ring-luxury-gold/50" 
                          placeholder="Enter an engaging title..." 
                        />
                     </div>
                     <div className="flex items-center gap-2 text-gray-500 text-sm font-mono bg-gray-100 p-2 rounded-lg border border-gray-200 w-fit">
                        <span className="select-none font-semibold">/blogs/</span>
                        <input 
                           value={slug} 
                           onChange={handleSlugChange} 
                           className="bg-transparent border-none focus:outline-none text-luxury-black w-full min-w-[200px] placeholder:text-gray-400"
                           placeholder="post-url-slug"
                        />
                     </div>
                  </div>

                  {/* Advanced Toolbar */}
                  <div className="sticky top-[88px] z-30 bg-white border border-gray-200 rounded-xl shadow-md p-2 flex flex-wrap gap-1 items-center mb-4 transition-all duration-200">
                     {/* ... Toolbar buttons enabled ... */}
                     {/* History */}
                     <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                        <ToolbarBtn onClick={() => editor?.chain().focus().undo().run()} tooltip="Undo"><Undo className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().redo().run()} tooltip="Redo"><Redo className="w-4 h-4" /></ToolbarBtn>
                     </div>

                     {/* Text Style */}
                     <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBold().run()} isActive={editor?.isActive('bold')} tooltip="Bold"><Bold className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleItalic().run()} isActive={editor?.isActive('italic')} tooltip="Italic"><Italic className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleUnderline().run()} isActive={editor?.isActive('underline')} tooltip="Underline"><UnderlineIcon className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleStrike().run()} isActive={editor?.isActive('strike')} tooltip="Strikethrough"><Strikethrough className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleHighlight().run()} isActive={editor?.isActive('highlight')} tooltip="Highlight"><Highlighter className="w-4 h-4" /></ToolbarBtn>
                     </div>

                     {/* Heading / Format Dropdown */}
                     <div className="border-r border-gray-200 pr-2 mr-1">
                        <Select 
                           value={
                              editor?.isActive('heading', { level: 1 }) ? 'h1' :
                              editor?.isActive('heading', { level: 2 }) ? 'h2' :
                              editor?.isActive('heading', { level: 3 }) ? 'h3' :
                              editor?.isActive('heading', { level: 4 }) ? 'h4' :
                              editor?.isActive('heading', { level: 5 }) ? 'h5' :
                              editor?.isActive('heading', { level: 6 }) ? 'h6' :
                              'p'
                           }
                           onValueChange={(val) => {
                              if (val === 'p') editor?.chain().focus().setParagraph().run();
                              else if (val.startsWith('h')) editor?.chain().focus().toggleHeading({ level: parseInt(val[1]) as any }).run();
                           }}
                        >
                           <SelectTrigger className="h-8 w-[130px] border-none bg-transparent hover:bg-gray-100 focus:ring-0 px-2 text-xs font-medium">
                              <SelectValue placeholder="Paragraph" />
                           </SelectTrigger>
                           <SelectContent>
                              <SelectItem value="p">Paragraph</SelectItem>
                              <SelectItem value="h1" className="font-bold text-2xl">Heading 1</SelectItem>
                              <SelectItem value="h2" className="font-bold text-xl">Heading 2</SelectItem>
                              <SelectItem value="h3" className="font-bold text-lg">Heading 3</SelectItem>
                              <SelectItem value="h4" className="font-bold text-base">Heading 4</SelectItem>
                              <SelectItem value="h5" className="font-bold text-sm">Heading 5</SelectItem>
                              <SelectItem value="h6" className="font-bold text-xs uppercase">Heading 6</SelectItem>
                           </SelectContent>
                        </Select>
                     </div>

                     {/* Lists & Quotes */}
                     <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBulletList().run()} isActive={editor?.isActive('bulletList')} tooltip="Bullet List"><List className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleOrderedList().run()} isActive={editor?.isActive('orderedList')} tooltip="Ordered List"><ListOrdered className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().toggleBlockquote().run()} isActive={editor?.isActive('blockquote')} tooltip="Quote/Card"><Quote className="w-4 h-4" /></ToolbarBtn>
                     </div>

                     {/* Alignment */}
                     <div className="flex gap-0.5 border-r border-gray-200 pr-2 mr-1">
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('left').run()} isActive={editor?.isActive({ textAlign: 'left' })} tooltip="Align Left"><AlignLeft className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('center').run()} isActive={editor?.isActive({ textAlign: 'center' })} tooltip="Align Center"><AlignCenter className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('right').run()} isActive={editor?.isActive({ textAlign: 'right' })} tooltip="Align Right"><AlignRight className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setTextAlign('justify').run()} isActive={editor?.isActive({ textAlign: 'justify' })} tooltip="Justify"><AlignJustify className="w-4 h-4" /></ToolbarBtn>
                     </div>

                     {/* Insert */}
                     <div className="flex gap-0.5">
                        <ToolbarBtn onClick={addLink} isActive={editor?.isActive('link')} tooltip="Link"><LinkIcon className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn onClick={() => contentImageInputRef.current?.click()} tooltip="Add Image"><ImageIcon className="w-4 h-4" /></ToolbarBtn>
                        <ToolbarBtn 
                           onClick={() => editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run()} 
                           tooltip="Insert Table"
                        >
                           <TableIcon className="w-4 h-4" />
                        </ToolbarBtn>
                        <ToolbarBtn onClick={() => editor?.chain().focus().setHorizontalRule().run()} tooltip="Divider"><Minus className="w-4 h-4" /></ToolbarBtn>
                     </div>

                     {/* Table Controls (Visible only when table active) */}
                     {editor?.isActive('table') && (
                        <div className="flex gap-0.5 border-l border-gray-200 pl-2 ml-1 items-center animate-in fade-in slide-in-from-left-2">
                           <ToolbarBtn onClick={() => editor.chain().focus().addColumnAfter().run()} tooltip="Add Col"><Plus className="w-3 h-3 rotate-90" /></ToolbarBtn>
                           <ToolbarBtn onClick={() => editor.chain().focus().deleteColumn().run()} tooltip="Del Col"><Minus className="w-3 h-3 rotate-90" /></ToolbarBtn>
                           <div className="w-px h-4 bg-gray-200 mx-1"></div>
                           <ToolbarBtn onClick={() => editor.chain().focus().addRowAfter().run()} tooltip="Add Row"><Plus className="w-3 h-3" /></ToolbarBtn>
                           <ToolbarBtn onClick={() => editor.chain().focus().deleteRow().run()} tooltip="Del Row"><Minus className="w-3 h-3" /></ToolbarBtn>
                           <div className="w-px h-4 bg-gray-200 mx-1"></div>
                           <ToolbarBtn onClick={() => editor.chain().focus().deleteTable().run()} tooltip="Delete Table" isActive><Trash className="w-3 h-3 text-red-500" /></ToolbarBtn>
                        </div>
                     )}
                  </div>

                  {/* Editor Area */}
                  <div className="min-h-[600px] border-2 border-gray-200 rounded-xl bg-white shadow-sm relative focus-within:ring-2 focus-within:ring-luxury-gold/50 transition-all">
                      {editor && (
                         <BubbleMenu editor={editor} tippyOptions={{ duration: 100 }}>
                            <div className="bg-luxury-black text-white rounded-lg shadow-xl border border-gray-700 flex gap-1 p-1">
                               <button onClick={() => editor.chain().focus().toggleBold().run()} className={cn("p-1 hover:bg-gray-700 rounded", editor.isActive('bold') && 'text-luxury-gold')}><Bold className="w-4 h-4"/></button>
                               <button onClick={() => editor.chain().focus().toggleItalic().run()} className={cn("p-1 hover:bg-gray-700 rounded", editor.isActive('italic') && 'text-luxury-gold')}><Italic className="w-4 h-4"/></button>
                               <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={cn("p-1 hover:bg-gray-700 rounded", editor.isActive('highlight') && 'text-luxury-gold')}><Highlighter className="w-4 h-4"/></button>
                               <button onClick={addLink} className={cn("p-1 hover:bg-gray-700 rounded", editor.isActive('link') && 'text-luxury-gold')}><LinkIcon className="w-4 h-4"/></button>
                            </div>
                         </BubbleMenu>
                      )}
                      {/* Prose Styling for WYSIWYG */}
                      <EditorContent editor={editor} className="
                          prose prose-lg max-w-none 
                          prose-headings:font-serif prose-headings:font-bold prose-headings:text-luxury-black 
                          prose-p:text-gray-700 prose-p:leading-relaxed 
                          prose-a:text-luxury-gold prose-a:no-underline hover:prose-a:underline
                          prose-strong:text-black prose-strong:font-bold
                          prose-ul:list-disc prose-ul:pl-6 prose-li:marker:text-luxury-gold
                          prose-ol:list-decimal prose-ol:pl-6 prose-li:marker:font-bold
                          prose-blockquote:border-l-4 prose-blockquote:border-luxury-gold prose-blockquote:bg-gray-50 prose-blockquote:py-2 prose-blockquote:px-4 prose-blockquote:rounded-r-lg prose-blockquote:not-italic
                          prose-img:rounded-xl prose-img:shadow-md
                          prose-table:border-collapse prose-table:table-auto prose-table:w-full prose-table:my-4
                          prose-td:border prose-td:border-gray-300 prose-td:p-2 prose-td:min-w-[100px]
                          prose-th:border prose-th:border-gray-300 prose-th:bg-gray-100 prose-th:p-2 prose-th:text-left prose-th:font-semibold
                      " />
                  </div>
               </CardContent>
            </Card>
         </div>

         {/* Sidebar Settings Column */}
         <div className="space-y-6">
             {/* Publish Card */}
            <Card className="border-none shadow-sm">
               <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg font-medium">Publishing</CardTitle>
               </CardHeader>
              <CardContent className="p-4 space-y-4">
                  {/* Actions Row */}
                  <div className="flex justify-between items-center mb-2">
                      <Button variant="outline" size="sm" className="h-8 text-xs border-gray-300 bg-white text-gray-700 hover:bg-gray-50" onClick={() => saveBlog()}>Save Draft</Button>
                      <Button variant="outline" size="sm" className="h-8 text-xs border-gray-300 bg-white text-gray-700 hover:bg-gray-50" onClick={handlePreview}>Preview</Button>
                  </div>

                  {/* Status Row */}
                  <div className="flex items-start gap-3 text-sm text-gray-700 px-1">
                      <Key className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-1">
                              <span>Status:</span>
                              <span className="font-bold text-black capitalize">{status}</span>
                              <button 
                                  onClick={() => setIsEditingStatus(!isEditingStatus)} 
                                  className="text-blue-600 hover:underline ml-1 text-xs font-medium"
                              >
                                  {isEditingStatus ? 'Cancel' : 'Edit'}
                              </button>
                          </div>
                          {isEditingStatus && (
                              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in zoom-in-95 duration-200">
                                  <Select value={status} onValueChange={(v: any) => setStatus(v)}>
                                     <SelectTrigger className="h-8 text-xs bg-white">
                                        <SelectValue placeholder="Select status" />
                                     </SelectTrigger>
                                     <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                        <SelectItem value="scheduled">Scheduled</SelectItem>
                                     </SelectContent>
                                  </Select>
                                  <Button size="sm" variant="outline" className="mt-2 h-6 text-xs w-full bg-gray-200 hover:bg-gray-300 text-black border border-gray-300" onClick={() => setIsEditingStatus(false)}>OK</Button>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Visibility Row */}
                  <div className="flex items-start gap-3 text-sm text-gray-700 px-1">
                      <Eye className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-1">
                              <span>Visibility:</span>
                              <span className="font-bold text-black capitalize">{visibility}</span>
                              <button 
                                  onClick={() => setIsEditingVisibility(!isEditingVisibility)} 
                                  className="text-blue-600 hover:underline ml-1 text-xs font-medium"
                              >
                                  {isEditingVisibility ? 'Cancel' : 'Edit'}
                              </button>
                          </div>
                          {isEditingVisibility && (
                              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in zoom-in-95 duration-200">
                                  <div className="space-y-1">
                                      {['public', 'private', 'password'].map((vis) => (
                                          <div key={vis} className="flex items-center space-x-2">
                                              <input 
                                                  type="radio" 
                                                  id={`vis-${vis}`} 
                                                  name="visibility" 
                                                  checked={visibility === vis} 
                                                  onChange={() => setVisibility(vis)} 
                                                  className="text-luxury-gold focus:ring-luxury-gold cursor-pointer"
                                              />
                                              <label htmlFor={`vis-${vis}`} className="text-xs cursor-pointer capitalize select-none">{vis}</label>
                                          </div>
                                      ))}
                                  </div>
                                   <Button size="sm" variant="outline" className="mt-2 h-6 text-xs w-full bg-gray-200 hover:bg-gray-300 text-black border border-gray-300" onClick={() => setIsEditingVisibility(false)}>OK</Button>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Publish Date Row */}
                  <div className="flex items-start gap-3 text-sm text-gray-700 px-1">
                      <Calendar className="w-4 h-4 mt-0.5 text-gray-400 shrink-0" />
                      <div className="flex-1">
                          <div className="flex items-center flex-wrap gap-1">
                              <span>Publish:</span>
                              <span className="font-bold text-black">
                                  {publishedAt ? new Date(publishedAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Immediately'}
                              </span>
                              <button 
                                  onClick={() => setIsEditingDate(!isEditingDate)} 
                                  className="text-blue-600 hover:underline ml-1 text-xs font-medium"
                              >
                                  {isEditingDate ? 'Cancel' : 'Edit'}
                              </button>
                          </div>
                          {isEditingDate && (
                              <div className="mt-2 p-2 bg-gray-50 border border-gray-200 rounded-md animate-in fade-in zoom-in-95 duration-200">
                                  <Input 
                                     type="datetime-local" 
                                     value={publishedAt} 
                                     onChange={(e) => {
                                         setPublishedAt(e.target.value);
                                         // Auto-switch to scheduled if future date
                                         if (new Date(e.target.value) > new Date()) {
                                             setStatus('scheduled');
                                         }
                                     }} 
                                     className="h-8 text-xs bg-white text-black border-gray-300"
                                  />
                                  <Button size="sm" variant="outline" className="mt-2 h-6 text-xs w-full bg-gray-200 hover:bg-gray-300 text-black border border-gray-300" onClick={() => setIsEditingDate(false)}>OK</Button>
                              </div>
                          )}
                      </div>
                  </div>

                  {/* Footer Actions */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4 bg-gray-50/50 -mx-4 px-4 py-3 mb-[-16px]">
                      <button 
                          onClick={() => toast.info("Move to Trash feature coming soon")} 
                          className="text-red-500 hover:text-red-600 text-xs underline decoration-red-200 hover:decoration-red-500 underline-offset-2 transition-colors"
                      >
                          Move to Trash
                      </button>
                      <Button 
                          disabled={saving} 
                          onClick={saveBlog} 
                          className="bg-[#2271b1] hover:bg-[#135e96] text-white font-semibold text-xs h-8 px-4 shadow-none rounded-[4px]"
                      >
                          {saving ? <Loader2 className="w-3 h-3 animate-spin" /> : (
                              status === 'scheduled' ? 'Schedule' : 
                              blogId ? 'Update' : 'Publish'
                          )}
                      </Button>
                  </div>
              </CardContent>
            </Card>

            {/* Categories Card */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-3 border-b flex flex-row items-center justify-between">
                   <CardTitle className="text-lg font-medium">Categories</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                            placeholder="Add New Category"
                            className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:ring-luxury-gold focus:border-luxury-gold"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddCategory()}
                        />
                        <Button onClick={handleAddCategory} variant="outline" size="icon" className="border-gray-300 bg-white text-black hover:bg-gray-100 shrink-0">
                            <Check className="w-4 h-4" />
                        </Button>
                    </div>
                    {/* Category List */}
                    <div className="flex flex-col gap-2 max-h-40 overflow-y-auto border rounded-md p-2 bg-gray-50">
                        {categories.length === 0 && <p className="text-xs text-gray-400 text-center py-2">No categories yet</p>}
                        {categories.map(cat => (
                            <div key={cat} className="flex items-center justify-between bg-white px-3 py-2 rounded border border-gray-200 text-sm">
                                <span>{cat}</span>
                                <button onClick={() => handleRemoveCategory(cat)} className="text-gray-400 hover:text-red-500">
                                    <X className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* Tags Card */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-3 border-b">
                   <CardTitle className="text-lg font-medium">Tags</CardTitle>
                </CardHeader>
                <CardContent className="pt-4 space-y-4">
                    <div className="flex gap-2">
                        <Input 
                            value={newTag}
                            onChange={(e) => setNewTag(e.target.value)}
                            placeholder="Separate tags with commas"
                            className="border-gray-300 bg-white text-black placeholder:text-gray-400 focus:ring-luxury-gold focus:border-luxury-gold"
                            onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
                        />
                        <Button onClick={handleAddTag} variant="outline" className="border-gray-300 bg-white text-black hover:bg-gray-100 shrink-0">Add</Button>
                    </div>
                    {/* Tag Cloud */}
                    <div className="flex flex-wrap gap-2">
                        {tags.map(tag => (
                            <div key={tag} className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full text-xs text-gray-700 border border-gray-200">
                                <span>{tag}</span>
                                <button onClick={() => setTags(tags.filter(t => t !== tag))} className="text-gray-400 hover:text-red-500 ml-1">
                                    <X className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
            
            {/* Featured Image Card */}
            <Card className="border-none shadow-sm">
               <CardHeader className="pb-3 border-b">
                  <CardTitle className="text-lg font-medium">Featured Image</CardTitle>
               </CardHeader>
               <CardContent className="pt-4">
                  <div className="border-2 border-dashed border-gray-200 rounded-xl p-4 text-center hover:bg-gray-50 transition-colors cursor-pointer relative group h-48 flex flex-col items-center justify-center">
                     <input 
                        type="file" 
                        accept="image/*" 
                        onChange={handleImageUpload} 
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                        disabled={uploadingImage}
                     />
                     {featuredImage ? (
                        <>
                            <img src={featuredImage} alt="Featured" className="absolute inset-0 w-full h-full object-cover rounded-lg" />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg z-20 pointer-events-none">
                                <span className="text-white text-sm font-medium bg-black/60 px-3 py-1 rounded-full">Click to replace</span>
                            </div>
                        </>
                     ) : (
                        <div className="text-gray-400 group-hover:text-luxury-gold transition-colors">
                           {uploadingImage ? (
                              <Loader2 className="w-10 h-10 animate-spin mx-auto mb-3" />
                           ) : (
                              <ImageIcon className="w-10 h-10 mx-auto mb-3" />
                           )}
                           <p className="text-sm font-medium text-gray-600">Upload Cover Image</p>
                           <p className="text-xs text-gray-400 mt-1">Recommended: 1200x630px</p>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* SEO / Excerpt Card */}
            <Card className="border-none shadow-sm">
                <CardHeader className="pb-3 border-b">
                   <CardTitle className="text-lg font-medium">SEO & Excerpt</CardTitle>
                </CardHeader>
                <CardContent className="pt-4">
                    <Label htmlFor="excerpt" className="text-xs uppercase font-bold text-gray-500 mb-2 block">Short Description</Label>
                    <Textarea 
                       id="excerpt" 
                       value={excerpt} 
                       onChange={(e) => setExcerpt(e.target.value)} 
                       className="min-h-[120px] resize-none text-sm" 
                       placeholder="Write a compelling summary for search engines and previews..."
                    />
                    <p className="text-xs text-right text-gray-400 mt-1">{excerpt.length}/160 chars</p>
                </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
