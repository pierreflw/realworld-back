import authorMapper from './author.mapper';

const articleMapper = (article: any, id?: number) => ({
  slug: article.slug,
  title: article.title,
  description: article.description,
  body: article.body,
  tagList: article.tagList.map((tag: any) => tag.name),
  createdAt: article.createdAt,
  updatedAt: article.updatedAt,
  favorited: id ? article.favoritedBy.some((item: any) => item.id === id) : false,
  favoritesCount: article.favoritedBy.length,
  author: authorMapper(article.author, id),
});


export default articleMapper;
