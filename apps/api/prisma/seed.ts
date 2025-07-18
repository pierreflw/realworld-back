import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Suppression en cascade pour éviter les contraintes
  await prisma.comment.deleteMany();
  await prisma.article.deleteMany();
  await prisma.tag.deleteMany();
  await prisma.user.deleteMany();

  // Crée 2 tags de démo
  const tags = await prisma.tag.createMany({
    data: [
      { name: 'demo' },
      { name: 'seed' },
    ],
  });

  // Crée 3 utilisateurs
  const users = await Promise.all(
    Array.from({ length: 3 }).map((_, i) =>
      prisma.user.create({
        data: {
          username: `user${i + 1}`,
          email: `user${i + 1}@example.com`,
          password: 'password123',
          demo: true  
        },
      })
    )
  );

  // Récupère les tags insérés
  const tagList = await prisma.tag.findMany();

  // Crée 2 articles par user avec 2 tags
  for (const user of users) {
    for (let a = 1; a <= 2; a++) {
      const title = `Article ${a} by ${user.username}`;
      const slug = `${user.username}-article-${a}-${Date.now()}`;
      const article = await prisma.article.create({
        data: {
          title,
          slug,
          description: `Description for ${title}`,
          body: `Contenu de ${title}`,
          author: { connect: { id: user.id } },
          tagList: {
            connect: tagList.map(tag => ({ id: tag.id })),
          },
        },
      });

      // 2 commentaires par article
      for (let c = 1; c <= 2; c++) {
        await prisma.comment.create({
          data: {
            body: `Commentaire ${c} sur ${title}`,
            author: { connect: { id: user.id } },
            article: { connect: { id: article.id } },
          },
        });
      }
    }
  }

  console.log('✅ Base seedée avec succès !');
}

main()
  .catch(async (err) => {
    console.error(err);
    await prisma.$disconnect();
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
