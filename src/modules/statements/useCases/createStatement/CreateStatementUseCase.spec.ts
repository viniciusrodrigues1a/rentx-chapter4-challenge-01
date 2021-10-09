import { mock } from "jest-mock-extended";
import { User } from "../../../users/entities/User";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { OperationType } from "../../entities/Statement";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

function makeSut() {
  const usersRepositoryMock = mock<IUsersRepository>();
  const statementsRepositoryMock = mock<IStatementsRepository>();
  const sut = new CreateStatementUseCase(
    usersRepositoryMock,
    statementsRepositoryMock
  );

  return { sut, usersRepositoryMock, statementsRepositoryMock };
}

describe("Create Statement UseCase", () => {
  it("should be able to create a statement of type deposit", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    const statement = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "my deposit",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce(user as User);

    await sut.execute(statement);

    expect(statementsRepositoryMock.create).toHaveBeenCalledTimes(1);
  });

  it("should throw CreateStatementError.UserNotFound if user cannot be found", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    const statement = {
      user_id: user.id,
      type: OperationType.DEPOSIT,
      amount: 100,
      description: "my deposit",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce(undefined);

    const when = () => sut.execute(statement);

    await expect(when).rejects.toBeInstanceOf(
      CreateStatementError.UserNotFound
    );
  });

  it("should throw CreateStatementError.InsufficientFunds if type is withdraw and user doesn't have sufficient funds", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const user = {
      id: "user-id-0",
    };
    const statement = {
      user_id: user.id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: "my deposit",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce(user as User);
    statementsRepositoryMock.getUserBalance.mockResolvedValueOnce({
      balance: Math.floor(statement.amount / 2),
    });

    const when = () => sut.execute(statement);

    await expect(when).rejects.toBeInstanceOf(
      CreateStatementError.InsufficientFunds
    );
  });
});
