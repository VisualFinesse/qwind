import fs from "fs";
import matter from "gray-matter";
import axios from 'axios';

import type { Post } from "~/types";

// Function to fetch posts from Strapi API
export const fetchPosts = async () => {
  try {
      // Make GET request to your Strapi API endpoint for posts
      const response = await axios.get('http://127.0.0.1:1337/api/lessons/');

      // Extract posts data from response
      const posts = response.data.data;

      console.log(posts);

      // Map over posts to format them if needed
      const formattedPosts = posts.map((post:any) => {
        return {
          content: post.attributes.body,
          id: post.id,
          slug: post.attributes.slug,

          publishDate: new Date(post.attributes.publishedAt),

          title: post.attributes.Title,
        };
      });

      return formattedPosts;
  } catch (error:any) {
      // Handle error if request fails
      console.error('Error fetching posts:', error.message);
      return [];
  }
};


export const fetchPostByID = async (id:any) => {
  try {
      // Make GET request to your Strapi API endpoint for posts
      const response = await axios.get('http://127.0.0.1:1337/api/lessons/' + id);

      // Extract post data from response
      const post = response.data.data;

      // Map over post to format them if needed
      const formattedPost = post;

      return formattedPost;
  } catch (error:any) {
      // Handle error if request fails
      console.error('Error fetching posts:', error.message);
      return [];
  }
};

let _posts: Post[];

// Ensure only the minimal needed data is exposed
// fields.forEach((field) => {
//   if (field === 'slug') {
//     items[field] = realSlug
//   }
//   if (field === 'content') {
//     items[field] = content
//   }

//   if (typeof data[field] !== 'undefined') {
//     items[field] = data[field]
//   }
// })

/** */
// export const fetchPosts = async (): Promise<Post[]> => {
//   // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
//   _posts = _posts || load();

//   return await _posts;
// };

/** */
export const findLatestPosts = async ({ count, page }: { count?: number; page?: number } = {}): Promise<Post[]> => {
  const _count = count || 4;
  const _page = page || 1;
  const posts = await fetchPosts();

  return Array.isArray(posts) ? posts.slice((_page - 1) * _count, (_page - 1) * _count + _count) : [];
};

/** */
export const findPostBySlug = async (slug: string): Promise<Post | null> => {
  if (!slug) return null;

  try {
    const readFile = await fetchPostByID(slug);

    // const {
    //   publishDate: rawPublishDate = new Date(),
    //   updateDate: rawUpdateDate,
    //   title,
    //   excerpt,
    //   image,
    //   tags = [],
    //   category,
    //   author,
    //   draft = false,
    //   metadata = {},
    // } = data;

    // const publishDate = new Date(rawPublishDate);
    // const updateDate = rawUpdateDate ? new Date(rawUpdateDate) : undefined;

    return {
      content: readFile.attributes.body,
      id: readFile.id,
      slug: readFile.attributes.slug,

      publishDate: readFile.attributes.publishedAt,
      // updateDate: updateDate,

      title: readFile.attributes.Title,
      // excerpt: excerpt,
      // image: image,

      // category: category,
      // tags: tags,
      // author: author,

      // draft: draft,

      // metadata,

      // content
    };
  } catch (e) {
    /* empty */
  }

  return null;
};

/** */
export const findPostsByIds = async (ids: string[]) => {
  if (!Array.isArray(ids)) return [];

  const posts = await fetchPosts();

  return ids.reduce(function (r: Post[], id: string) {
    posts.some(function (post: Post) {
      return id === post.id && r.push(post);
    });
    return r;
  }, []);
};
