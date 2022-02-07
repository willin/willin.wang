import { json, LinksFunction, useLoaderData } from 'remix';
import type { MetaFunction, LoaderFunction } from 'remix';
import { useMdxComponent } from '~/components/mdx';
import { LoaderFunctionArgs, WPost } from '~/types';
import { siteTitle } from '~/config';
import { PostMeta, PostTags } from '~/components/posts/post-meta';
import customCodeCss from '~/styles/code.css';
import { PostLayout } from '~/components/posts/post-prose';

export const meta: MetaFunction = ({ data }: { data: WPost }) => {
  let title = siteTitle;
  let description = '';
  if (data?.frontmatter?.title) {
    title = `${data.frontmatter.title} - ${siteTitle}`;
    description = data.frontmatter.description ?? '';
  }
  return {
    title,
    description
  };
};

export const links: LinksFunction = () => [
  {
    rel: 'stylesheet',
    href: customCodeCss
  }
];

export const loader: LoaderFunction = async ({
  params,
  context
}: LoaderFunctionArgs) => {
  const { slug } = params;
  if (!slug) {
    throw new Response('Not Found', { status: 404 });
  }
  const locale = 'zh';
  const type = 'posts';
  const { CONTENTS } = context.env;

  const data = await CONTENTS.get([locale, type, slug].join(':'), 'json');
  if (!data) {
    throw new Response('Not Found', { status: 404 });
  }

  return json(data);
};

export default function Post() {
  const post = useLoaderData<WPost>();
  const { html, frontmatter, code } = post;

  let Component = null;
  if (typeof window !== 'undefined' && code) {
    Component = useMdxComponent(code);
  }
  return (
    <PostLayout>
      <h1 className='mb-2 text-primary'>{frontmatter.title}</h1>
      <PostMeta post={post} />

      {Component ? (
        <article className='article'>
          <Component />
        </article>
      ) : (
        <article
          className='article'
          dangerouslySetInnerHTML={{ __html: html }}
        />
      )}

      <div className='flex my-2'>
        <div>本文标签：</div>
        <PostTags post={post} />
      </div>
    </PostLayout>
  );
}
