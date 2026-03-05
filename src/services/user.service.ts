import type { Repository } from "typeorm";
import type { User } from "../models/User.model.js";
import { BadRequestError, NotFoundError } from "../types/Error.js";

class UserService {
  private readonly _userRepository: Repository<User>;
  constructor(userRepository: Repository<User>) {
    this._userRepository = userRepository;
  }

  public getUserById = async (userId: string) => {
    const user = await this._userRepository.findOneBy({ id: userId });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    return user;
  };

  public getUsers = async () => {
    return this._userRepository.find();
  };

  public updateUser = async (id: string, name?: string, email?: string) => {
    const user = await this._userRepository.findOne({
      where: { id },
    });

    if (!user) {
      throw new NotFoundError("User not found");
    }

    if (name !== undefined) {
      user.name = name;
    }

    if (email !== undefined) {
      user.email = email;
    }

    return this._userRepository.save(user);
  };
}

export default UserService;
