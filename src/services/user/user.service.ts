import { User } from "../../models/User.ts";
import type UserRepositoryService from "./user_repository.service.ts";

export default class UserService {
  private readonly _userRepository: UserRepositoryService;
  constructor(userRepository: UserRepositoryService) {
    this._userRepository = userRepository;
  }

  public getUserById(userId: number): User | null {
    const users = this._userRepository.getAllUsers();

    return users.find((user) => user.id === userId) || null;
  }

  public getUsers(): User[] {
    return this._userRepository.getAllUsers();
  }

  public updateUser(id: number, name: string, email: string): User {
    const users = this.getUsers();
    const userIndex = users.findIndex((user) => user.id === id);

    if (userIndex === -1 || !users[userIndex]) {
      throw new Error("User not found");
    }

    users[userIndex].name = name;
    users[userIndex].email = email;

    this._userRepository.saveUsers(users);

    return new User(id, name, email);
  }

  public createUser(name: string, email: string): User {
    const id = Math.floor(Math.random() * 1000);
    const newUser = new User(id, name, email);

    const users = this.getUsers();
    users.push(newUser);
    this._userRepository.saveUsers(users);

    return newUser;
  }

  public deleteUser(userId: number): void {
    const users = this.getUsers();
    const updatedUsers = users.filter((user) => user.id !== userId);
    this._userRepository.saveUsers(updatedUsers);
  }
}
