import { ArrowUpRight, HeartHandshake } from "lucide-react";
import { motion } from "framer-motion";
import { useFriends } from "@/hooks/use-site-data";

type Friend = {
  id: string;
  name: string;
  relationship?: string;
  role?: string;
  context?: string;
  url?: string | null;
  avatar_url?: string | null;
};

const FriendsSection = () => {
  const { data: rawFriends } = useFriends({ onlyPublished: true });
  const friends = rawFriends as Friend[] | undefined;
  if (!friends?.length) return null;

  return (
    <section id="friends" className="section-padding">
      <div className="max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5"
        >
          <div>
            <p className="eyebrow mb-3">// good people</p>
            <h2 className="display-font text-4xl md:text-5xl font-bold tracking-tight">Built around good company.</h2>
          </div>
          <p className="text-sm text-muted-foreground max-w-sm leading-relaxed">
            People I learn from, build with, and recommend when the work deserves good company.
          </p>
        </motion.div>

        <div className="friends-grid">
          {friends.map((friend, index) => {
            const content = (
              <>
                <span className="friend-avatar">
                  {friend.avatar_url ? (
                    <img src={friend.avatar_url} alt="" loading="lazy" />
                  ) : (
                    friend.name.split(/\s+/).map((part: string) => part[0]).join("").slice(0, 2).toUpperCase()
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block font-semibold truncate">{friend.name}</span>
                  <span className="block mono-font text-[10px] text-muted-foreground truncate mt-1">
                    {friend.relationship || friend.role || "friend"}{friend.context ? ` · ${friend.context}` : ""}
                  </span>
                </span>
                {friend.url && <ArrowUpRight className="w-4 h-4 text-muted-foreground shrink-0" />}
              </>
            );

            return friend.url ? (
              <motion.a
                key={friend.id}
                href={friend.url}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="friend-row project-card"
                aria-label={`Open ${friend.name}'s profile`}
              >
                {content}
              </motion.a>
            ) : (
              <motion.article
                key={friend.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.06 }}
                className="friend-row project-card"
              >
                {content}
              </motion.article>
            );
          })}
        </div>

        <div className="mt-8 inline-flex items-center gap-2 text-xs text-muted-foreground mono-font">
          <HeartHandshake className="w-3.5 h-3.5 text-primary" />
          Community makes the work sharper.
        </div>
      </div>
    </section>
  );
};

export default FriendsSection;