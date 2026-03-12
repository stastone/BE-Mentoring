import type { RequestHandler } from "express";
import type CategoryService from "../../services/category.service.js";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import type { CategoryType } from "../../schemas/Category.schema.js";
import { catchAsync } from "../../utils/catchAsync.js";

class CategoryController extends BaseController {
  private readonly _categoryService: CategoryService;

  constructor(categoryService: CategoryService) {
    super();
    this._categoryService = categoryService;
  }

  public getCategoriesRequestHandler: RequestHandler<
    null,
    ResponsePayload<CategoryType[]>,
    null
  > = catchAsync(async (_req, res) => {
    const categories = await this._categoryService.getCategories();

    this.ok(res, categories);
  });

  public createCategoryRequestHandler: RequestHandler<
    never,
    ResponsePayload<CategoryType>,
    Omit<CategoryType, "id">
  > = catchAsync(async (req, res) => {
    const { name, parentCategoryId } = req.body;
    const newCategory = await this._categoryService.createCategory({
      name,
      parentCategoryId,
    });

    this.created(res, newCategory);
  });

  public getCategoryByIdRequestHandler: RequestHandler<
    { categoryId: string },
    ResponsePayload<CategoryType>,
    null
  > = catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const category = await this._categoryService.getCategoryById(categoryId);

    this.ok(res, category);
  });

  public updateCategoryRequestHandler: RequestHandler<
    { categoryId: string },
    ResponsePayload<CategoryType>,
    Partial<Omit<CategoryType, "id">>
  > = catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    const { name: newName, parentCategoryId: newParentCategoryId } = req.body;
    const updatedCategory = await this._categoryService.updateCategory(
      categoryId,
      {
        name: newName,
        parentCategoryId: newParentCategoryId,
      },
    );

    this.ok(res, updatedCategory);
  });

  public deleteCategoryRequestHandler: RequestHandler<
    { categoryId: string },
    ResponsePayload<null>,
    null
  > = catchAsync(async (req, res) => {
    const { categoryId } = req.params;
    await this._categoryService.deleteCategory(categoryId);

    this.ok(res, null);
  });
}

export default CategoryController;
