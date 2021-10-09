import "reflect-metadata";
import { hash } from "bcryptjs";
import { mock } from "jest-mock-extended";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

function makeSut() {
  const usersRepositoryMock = mock<IUsersRepository>();
  const sut = new AuthenticateUserUseCase(usersRepositoryMock);

  return { sut, usersRepositoryMock };
}

describe("Authenticate use-case", () => {
  it("should authenticate a user", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const unhashedPassword = "jorgepa55";
    const user = {
      id: "user-id-0",
      email: "jorge@email.com",
      password: await hash(unhashedPassword, 8),
    };
    usersRepositoryMock.findByEmail.mockResolvedValueOnce(user as User);

    const response = await sut.execute({
      email: user.email,
      password: unhashedPassword,
    });

    expect(response).toHaveProperty("token");
  });

  it("should throw IncorrectEmailOrPasswordError if email is wrong", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    usersRepositoryMock.findByEmail.mockResolvedValueOnce(undefined);

    const when = () =>
      sut.execute({
        email: "wrong@email.com",
        password: "password",
      });

    await expect(when).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should throw IncorrectEmailOrPasswordError if password is wrong", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const unhashedPassword = "jorgepa55";
    const user = {
      id: "user-id-0",
      email: "jorge@email.com",
      password: await hash(unhashedPassword, 8),
    };
    usersRepositoryMock.findByEmail.mockResolvedValueOnce(user as User);

    const when = () =>
      sut.execute({
        email: user.email,
        password: "wrongpa55",
      });

    await expect(when).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
