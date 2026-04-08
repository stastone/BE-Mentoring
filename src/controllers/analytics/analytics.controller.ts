import type { RequestHandler } from "express";
import { BaseController, type ResponsePayload } from "../base.controller.js";
import type UserPreferenceService from "../../services/user-preference.service.js";
import type { UserPreferences } from "../../schemas/UserPreferences.schema.js";

class AnalyticsController extends BaseController {
  private readonly _userPreferencesService: UserPreferenceService;

  constructor(userPreferencesService: UserPreferenceService) {
    super();
    this._userPreferencesService = userPreferencesService;
  }
  public getUserPreferencesRequestHandler: RequestHandler<
    {
      userId: string;
      limit: number;
    },
    ResponsePayload<UserPreferences[]>,
    null
  > = async (req, res) => {
    const { userId, limit } = req.params;
    const userPreferences =
      await this._userPreferencesService.getUserPreferences({ userId, limit });

    this.ok(res, userPreferences);
  };
}

export default AnalyticsController;
