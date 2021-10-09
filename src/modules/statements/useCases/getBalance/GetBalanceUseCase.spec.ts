import "reflect-metadata";
import { mock } from "jest-mock-extended";
import { User } from "../../../users/entities/User";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetBalanceUseCase } from "./GetBalanceUseCase";
import { GetBalanceError } from "./GetBalanceError";

function makeSut() {
  const statementsRepositoryMock = mock<IStatementsRepository>();
  const usersRepositoryMock = mock<IUsersRepository>();
  const sut = new GetBalanceUseCase(
    statementsRepositoryMock,
    usersRepositoryMock
  );

  return { sut, statementsRepositoryMock, usersRepositoryMock };
}

describe("Get Balance UseCase", () => {
  it("should be able to retrieve the balance of given user", async () => {
    const { sut, statementsRepositoryMock, usersRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    const userBalance = {
      statement: [],
      balance: 100,
    };
    usersRepositoryMock.findById.mockResolvedValue(user as User);
    statementsRepositoryMock.getUserBalance.mockResolvedValueOnce(userBalance);

    const response = await sut.execute({ user_id: user.id });

    expect(response.balance).toBe(userBalance.balance);
  });

  it("should be able to retrieve the balance of given user", async () => {
    const { sut, usersRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    usersRepositoryMock.findById.mockResolvedValue(undefined);

    const when = () => sut.execute({ user_id: user.id });

    expect(when).rejects.toBeInstanceOf(GetBalanceError);
  });
});
