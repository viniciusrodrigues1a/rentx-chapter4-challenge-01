import { mock } from "jest-mock-extended";
import "reflect-metadata";
import { User } from "../../entities/User";
import { IUsersRepository } from "../../repositories/IUsersRepository";
import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";

function makeSut() {
  const usersRepositoryMock = mock<IUsersRepository>();
  const sut = new ShowUserProfileUseCase(usersRepositoryMock);

  return { sut, usersRepositoryMock };
}

describe("Show user profile UseCase", () => {
  it("should be able to show user", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce(user as User);

    const response = await sut.execute(user.id);

    expect(response).toHaveProperty("id");
  });

  it("should throw ShowUserProfileError if user cannot be found", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    usersRepositoryMock.findById.mockResolvedValueOnce(undefined);

    const when = () => sut.execute("user-id-0");

    await expect(when).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});
