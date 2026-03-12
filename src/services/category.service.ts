import type { Repository } from "typeorm";
import { Category } from "../models/Category.model.js";
import { NotFoundError } from "../types/Error.js";
import type { CategoryType } from "../schemas/Category.schema.js";

export class CategoryService {
  private readonly _categoryRepository: Repository<Category>;

  constructor(categoryRepository: Repository<Category>) {
    this._categoryRepository = categoryRepository;
  }

  public async createCategory(payload: Omit<CategoryType, "id">) {
    let parent: Category | null = null;

    if (payload.parentCategoryId) {
      parent = await this._categoryRepository.findOneBy({
        id: payload.parentCategoryId,
      });

      if (!parent) {
        throw new NotFoundError("Parent category not found");
      }
    }

    const category = this._categoryRepository.create({
      name: payload.name,
      parent,
      parentCategoryId: payload.parentCategoryId ?? null,
    });

    return this._categoryRepository.save(category);
  }

  public async getCategories() {
    return this._categoryRepository.find({
      relations: ["parent"],
    });
  }

  public async getCategoryById(id: string) {
    const category = await this._categoryRepository.findOne({
      where: { id },
      relations: ["parent"],
    });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    return category;
  }

  public async updateCategory(
    id: string,
    payload: Partial<Omit<CategoryType, "id">>,
  ) {
    const category = await this._categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    if (payload.parentCategoryId) {
      const parent = await this._categoryRepository.findOneBy({
        id: payload.parentCategoryId,
      });

      if (!parent) {
        throw new NotFoundError("Parent category not found");
      }

      category.parent = parent;
      category.parentCategoryId = parent.id;
    }

    category.name = payload.name ?? category.name;

    return this._categoryRepository.save(category);
  }

  public async deleteCategory(id: string) {
    const category = await this._categoryRepository.findOneBy({ id });

    if (!category) {
      throw new NotFoundError("Category not found");
    }

    await this._categoryRepository.remove(category);

    return { success: true };
  }
}
