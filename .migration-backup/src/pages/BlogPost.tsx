import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { ArrowLeft, Calendar, Clock, Share2 } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const readingTime = (text: string) => {
  const words = (text || "").trim().split(/\s+/).length;
  return Math.max(1, Math.ceil(words / 200));
};

const BlogPost = () => {
  const { slug } = useParams();
  const { toast } = useToast();
  const { data: post, isLoading } = useQuery({
    queryKey: ["blog_post", slug],
    queryFn: async () => {
      const { data, error } = await supabase.from("blog_posts").select("*").eq("slug", slug!).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: post?.title, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast({ title: "Link copied!" });
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <article className="max-w-3xl mx-auto px-6 md:px-12 py-32">
        <Link to="/#blog" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground mb-10 group">
          <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> back to blog
        </Link>

        {isLoading ? (
          <div className="space-y-4">
            <div className="h-3 w-32 bg-secondary rounded animate-pulse" />
            <div className="h-10 w-3/4 bg-secondary rounded animate-pulse" />
            <div className="h-5 w-full bg-secondary rounded animate-pulse" />
            <div className="h-64 w-full bg-secondary rounded-lg animate-pulse mt-6" />
          </div>
        ) : !post ? (
          <div className="text-center py-20">
            <p className="text-muted-foreground mb-4">Post not found.</p>
            <Link to="/#blog" className="text-sm font-mono underline">return to blog</Link>
          </div>
        ) : (
          <>
            <motion.header
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <div className="flex items-center flex-wrap gap-3 text-xs font-mono text-muted-foreground mb-5">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="w-3 h-3" />
                  {new Date(post.published_at).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}
                </span>
                <span>·</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="w-3 h-3" />
                  {readingTime(post.content)} min read
                </span>
                <button
                  onClick={handleShare}
                  className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-border hover:border-foreground/30 hover:text-foreground transition-colors"
                >
                  <Share2 className="w-3 h-3" /> Share
                </button>
              </div>

              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold mb-5 tracking-tight leading-[1.05]">
                {post.title}
              </h1>

              {post.excerpt && (
                <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
                  {post.excerpt}
                </p>
              )}

              {(post.tags || []).length > 0 && (
                <div className="flex flex-wrap gap-1.5 mb-10">
                  {post.tags!.map((t: string) => (
                    <span key={t} className="font-mono text-[10px] px-2 py-1 rounded bg-secondary text-muted-foreground">#{t}</span>
                  ))}
                </div>
              )}
            </motion.header>

            {post.cover_image_url && (
              <motion.img
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: 0.1 }}
                src={post.cover_image_url}
                alt={post.title}
                className="w-full rounded-2xl border border-border mb-12 shadow-2xl shadow-foreground/5"
              />
            )}

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="blog-content"
            >
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {post.content || ""}
              </ReactMarkdown>
            </motion.div>

            <div className="mt-16 pt-8 border-t border-border flex items-center justify-between gap-4 flex-wrap">
              <Link to="/#blog" className="inline-flex items-center gap-2 font-mono text-xs text-muted-foreground hover:text-foreground group">
                <ArrowLeft className="w-3 h-3 group-hover:-translate-x-0.5 transition-transform" /> all posts
              </Link>
              <button
                onClick={handleShare}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-md border border-border text-sm hover:border-foreground/30 hover:bg-card/60 transition-colors"
              >
                <Share2 className="w-3.5 h-3.5" /> Share this post
              </button>
            </div>
          </>
        )}
      </article>
      <Footer />
    </div>
  );
};

export default BlogPost;
