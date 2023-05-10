export class Article {
  id: number;
  isPublished: boolean;
  authorId: number;

  constructor(article: Article) {
    Object.assign(this, article);
  }
}
