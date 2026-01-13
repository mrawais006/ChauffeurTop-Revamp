import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { format } from 'date-fns';

interface RelatedPostsProps {
  currentSlug?: string;
  category?: string; // Optional: for future smart filtering
  limit?: number;
  title?: string;
}

export async function RelatedPosts({ currentSlug, category, limit = 4, title = "Related Stories" }: RelatedPostsProps) {
  let query = supabase
    .from('blogs')
    .select('id, title, slug, featured_image, published_at, categories')
    .eq('status', 'published')
    .neq('slug', currentSlug!) // Ensure currentSlug is handled safely if undefined, though typically present
    .order('published_at', { ascending: false })
    .limit(limit);

  if (category) {
      // Filter by category if one is provided
      query = query.contains('categories', [category]);
  }

  const { data: posts } = await query;

  // Fallback: If no related posts found (e.g. unique category), fetch recent posts instead
  if (!posts || posts.length === 0) {
      const { data: fallbackPosts } = await supabase
        .from('blogs')
        .select('id, title, slug, featured_image, published_at, categories')
        .eq('status', 'published')
        .neq('slug', currentSlug!)
        .order('published_at', { ascending: false })
        .limit(limit);
      
      if (!fallbackPosts || fallbackPosts.length === 0) return null;
      // return fallbackPosts render... -> actually we can reuse the same render logic by reassigning
      // But let's just use the fallbackPosts variable
      var displayPosts = fallbackPosts;
  } else {
      var displayPosts = posts;
  }

  return (
    <section className="py-24 bg-black border-t border-white/10 relative overflow-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-luxury-gold/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-7xl relative z-10">
        <h3 className="text-3xl md:text-4xl font-serif text-white mb-16 text-center">
            <span className="border-b-2 border-luxury-gold/30 pb-4">{title}</span>
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {displayPosts.map((post) => (
            <Link href={`/blogs/${post.slug}`} key={post.id} className="group block h-full">
              <div className="bg-white/5 backdrop-blur-sm border border-white/10 h-full rounded-sm overflow-hidden hover:border-luxury-gold/50 transition-all duration-500 hover:shadow-2xl hover:shadow-luxury-gold/10 hover:-translate-y-2 flex flex-col group-hover:bg-white/10">
                
                {/* Image Container - Aspect 3:2 for better presentation */}
                <div className="aspect-[3/2] relative overflow-hidden bg-gray-900 border-b border-white/5">
                  {post.featured_image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                      src={post.featured_image} 
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 opacity-90 group-hover:opacity-100"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-900">
                        <span className="text-xs uppercase tracking-widest text-[#C5A572]">ChauffeurTop</span>
                    </div>
                  )}
                  
                  {/* Category Tag Overlay */}
                  <div className="absolute top-4 left-4">
                    {post.categories && post.categories[0] && (
                      <span className="text-[10px] uppercase tracking-widest bg-black/90 text-[#C5A572] px-3 py-1.5 backdrop-blur-md border border-[#C5A572]/20 shadow-lg">
                        {post.categories[0]}
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <div className="text-xs text-gray-400 mb-3 font-medium tracking-wide flex items-center gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#C5A572]"></span>
                    {post.published_at ? format(new Date(post.published_at), 'MMMM d, yyyy') : ''}
                  </div>
                  
                  <h4 className="text-xl font-serif text-white group-hover:text-[#C5A572] transition-colors line-clamp-2 leading-relaxed mb-4">
                    {post.title}
                  </h4>
                  
                  <div className="mt-auto pt-4 border-t border-white/5 flex items-center text-[#C5A572] text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">
                      Read Article <span className="ml-2 transition-transform group-hover:translate-x-1">→</span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
