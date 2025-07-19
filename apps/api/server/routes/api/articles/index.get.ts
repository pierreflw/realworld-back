import articleMapper from "~/utils/article.mapper";
import { definePrivateEventHandler } from "~/auth-event-handler";

export default definePrivateEventHandler(async (event, { auth }) => {
  const query = getQuery(event);

  const andQueries = buildFindAllQuery(query, auth);
  const articlesCount = await usePrisma().article.count({
    where: {
      AND: andQueries,
    },
  });

  const articles = await usePrisma().article.findMany({
    omit: {
      body: true,
    },
    where: { AND: andQueries },
    orderBy: {
      createdAt: "desc",
    },
    skip: Number(query.offset) || 0,
    take: Number(query.limit) || 10,
    include: {
      tagList: {
        orderBy: {
          name: "asc",
        },
        select: {
          name: true,
        },
      },
      author: {
        select: {
          username: true,
          image: true,
          followedBy: true,
        },
      },
      favoritedBy: true,
      _count: {
        select: {
          favoritedBy: true,
        },
      },
    },
  });

  return {
    articles: articles.map((article: any) => articleMapper(article, auth.id)),
    articlesCount,
  };
}, { requireAuth: false });

const buildFindAllQuery = (query: any, auth: { id: number } | undefined) => {
  const queries: any[] = [];

  const orAuthorQuery: any[] = [{ demo: { equals: true } }];
  if (auth?.id) {
    orAuthorQuery.push({ id: { equals: auth.id } });
  }

  const andAuthorQuery: any[] = [];
  if ("author" in query && query.author) {
    andAuthorQuery.push({ username: { equals: query.author } });
  }

  if (orAuthorQuery.length > 0 || andAuthorQuery.length > 0) {
    const authorConditions: any = {};

    if (orAuthorQuery.length > 0) {
      authorConditions.OR = orAuthorQuery;
    }

    if (andAuthorQuery.length > 0) {
      authorConditions.AND = andAuthorQuery;
    }

    queries.push({ author: authorConditions });
  }

  if ("tag" in query && query.tag) {
    queries.push({
      tagList: {
        some: {
          name: query.tag,
        },
      },
    });
  }

  if ("favorited" in query && query.favorited) {
    queries.push({
      favoritedBy: {
        some: {
          username: {
            equals: query.favorited,
          },
        },
      },
    });
  }

  return queries;
};
