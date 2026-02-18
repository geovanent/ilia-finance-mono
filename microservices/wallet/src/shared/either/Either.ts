export type Either<L, R> = Left<L> | Right<R>;

export class Left<L> {
  readonly _tag = 'left' as const;

  constructor(readonly value: L) {}
}

export class Right<R> {
  readonly _tag = 'right' as const;

  constructor(readonly value: R) {}
}

export function left<L>(value: L): Left<L> {
  return new Left(value);
}

export function right<R>(value: R): Right<R> {
  return new Right(value);
}

export function isLeft<L, R>(either: Either<L, R>): either is Left<L> {
  return either._tag === 'left';
}

export function isRight<L, R>(either: Either<L, R>): either is Right<R> {
  return either._tag === 'right';
}
