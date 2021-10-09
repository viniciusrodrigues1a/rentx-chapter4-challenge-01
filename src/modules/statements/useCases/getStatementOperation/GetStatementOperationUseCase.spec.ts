import "reflect-metadata";
import { mock } from "jest-mock-extended";
import { IUsersRepository } from "../../../users/repositories/IUsersRepository";
import { IStatementsRepository } from "../../repositories/IStatementsRepository";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";
import { User } from "../../../users/entities/User";
import { Statement } from "../../entities/Statement";
import { GetStatementOperationError } from "./GetStatementOperationError";

function makeSut() {
  const usersRepositoryMock = mock<IUsersRepository>();
  const statementsRepositoryMock = mock<IStatementsRepository>();
  const sut = new GetStatementOperationUseCase(
    usersRepositoryMock,
    statementsRepositoryMock
  );

  return { sut, usersRepositoryMock, statementsRepositoryMock };
}

describe("Get Statement Operation UseCase", () => {
  it("should be able to retrieve the operation of given statement", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const request = {
      user_id: "user-id-0",
      statement_id: "statement-id-0",
    };
    const statementAmount = 30;
    usersRepositoryMock.findById.mockResolvedValueOnce({
      id: request.user_id,
    } as User);
    statementsRepositoryMock.findStatementOperation.mockResolvedValueOnce({
      id: request.statement_id,
      amount: statementAmount,
    } as Statement);

    const response = await sut.execute(request);

    expect(response.amount).toBe(statementAmount);
  });

  it("should throw GetStatementOperationError.UserNotFound if user cannot be found", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const request = {
      user_id: "user-id-0",
      statement_id: "statement-id-0",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce(undefined);
    statementsRepositoryMock.findStatementOperation.mockResolvedValueOnce({
      id: request.statement_id,
      amount: 30,
    } as Statement);

    const when = () => sut.execute(request);

    await expect(when).rejects.toBeInstanceOf(
      GetStatementOperationError.UserNotFound
    );
  });

  it("should throw GetStatementOperationError.StatementNotFound if statement cannot be found", async () => {
    const { sut, usersRepositoryMock, statementsRepositoryMock } = makeSut();
    const request = {
      user_id: "user-id-0",
      statement_id: "statement-id-0",
    };
    usersRepositoryMock.findById.mockResolvedValueOnce({
      id: request.user_id,
    } as User);
    statementsRepositoryMock.findStatementOperation.mockResolvedValueOnce(
      undefined
    );

    const when = () => sut.execute(request);

    await expect(when).rejects.toBeInstanceOf(
      GetStatementOperationError.StatementNotFound
    );
  });
});
