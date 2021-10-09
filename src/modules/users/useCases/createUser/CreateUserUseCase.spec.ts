import "reflect-metadata";
import { mock } from "jest-mock-extended";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

function makeSut() {
  const usersRepositoryMock = mock<IUsersRepository>();
  const sut = new CreateUserUseCase(usersRepositoryMock);

  return { sut, usersRepositoryMock };
}

describe("Create User UseCase", () => {
  it("should be able to create a user", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const user = {
      name: "jorge",
      email: "jorge@email.com",
      password: "jorgepa55",
    };
    usersRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);

    await sut.execute(user);

    expect(usersRepositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it("should throw CreateUserError if user already exists", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const user = {
      name: "jorge",
      email: "jorge@email.com",
      password: "jorgepa55",
    };
    usersRepositoryMock.findByEmail.mockResolvedValueOnce(user as User);

    const when = () => sut.execute(user);

    await expect(when).rejects.toBeInstanceOf(CreateUserError);
  });
});
