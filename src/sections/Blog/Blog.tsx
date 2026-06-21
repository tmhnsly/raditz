import type { ReactNode } from 'react';
import { SectionShell, type SectionBaseProps } from '../../lib/SectionShell';
import { CardArrow } from '../../components/utility/CardArrow';

export interface BlogProps extends SectionBaseProps {
  /** Blog posts to render (required). */
  posts: {
    title: ReactNode;
    href?: string;
    excerpt?: ReactNode;
    image?: ReactNode;
    date?: ReactNode;
    tag?: ReactNode;
  }[];
  /** Section heading. */
  heading?: ReactNode;
}

/** Blog A — card grid with cover image. */
export function BlogA({ posts, heading, background = 'none', children, ...props }: BlogProps) {
  return (
    <SectionShell wrap="sx-g3 sx-gap-5" background={background} {...props}>
      {children ?? (
        <>
          {heading && <h3 className="h-section s-wrap__full">{heading}</h3>}
          {posts.map((post, i) => (
            <article key={i} className="rdz-card sx-blog__card">
              {post.image && <div className="ph sx-blog__cover">{post.image}</div>}
              <div className="col sx-blog__body">
                {post.tag && <span className="eyebrow2 sx-fs-caption">{post.tag}</span>}
                <strong className="sx-blog__title">{post.title}</strong>
                {post.excerpt && <span className="muted sx-body-s">{post.excerpt}</span>}
              </div>
            </article>
          ))}
        </>
      )}
    </SectionShell>
  );
}

/** Blog B — editorial list rows. */
export function BlogB({ posts, heading, background = 'surface-2', children, ...props }: BlogProps) {
  return (
    <SectionShell wrap="col sx-blog__list" background={background} {...props}>
      {children ?? (
        <>
          {heading && <h3 className="h-section">{heading}</h3>}
          {posts.map((post, i) => (
            <a key={i} href={post.href ?? '#'} className="blogrow rdz-card-arrow-host">
              <div className="col sx-blog__row-body">
                <div className="row sx-blog__row-meta">
                  {post.tag && <span className="eyebrow2 sx-fs-caption">{post.tag}</span>}
                  {post.date && <span className="muted sx-fs-caption">{post.date}</span>}
                </div>
                <strong className="sx-blog__row-title">{post.title}</strong>
              </div>
              <CardArrow />
            </a>
          ))}
        </>
      )}
    </SectionShell>
  );
}
