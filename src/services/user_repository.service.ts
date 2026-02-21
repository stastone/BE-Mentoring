import fs from "fs";

import type { User } from "../models/User.ts";

export default class UserRepositoryService {
  private _filePath: string;
  private data: User[];

  constructor(filePath: string) {
    this._filePath = filePath;
    this.data = JSON.parse(fs.readFileSync(this._filePath, "utf-8")) as User[];
  }

  public getAllUsers(): User[] {
    return this.data;
  }

  public saveUsers(users: User[]) {
    fs.writeFileSync(this._filePath, JSON.stringify(users, null, 2));
  }
}
