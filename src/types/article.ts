// 定义文章类型
export interface Article {
  id: number;
  title: string;
  content: string;
  author: string;
  coverImage: string;
  isPublished: boolean;
  views: number;
  createdAt: string;
  updatedAt: string;
}

// 定义创建/更新文章的类型
export interface CreateArticleDto {
  title: string;
  content: string;
  author: string;
  coverImage: string;
  isPublished: boolean;
}
