import type { Repository } from "typeorm";
import type { User } from "../models/User.ts";
import { BadRequestError, NotFoundError } from "../types/Error.ts";

export default class UserService {
  private readonly _userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this._userRepository = userRepository;
  }

  public async getUserById(userId: number) {
    const user = await this._userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  }

  public async getUsers(): Promise<User[]> {
    return this._userRepository.find();
  }

  public async updateUser(id: number, name?: string, email?: string) {
    const user = await this._userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (name === "" || email === "") {
      throw new BadRequestError("Name or email cannot be empty");
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    return this._userRepository.save(user);
  }
}
