export const POINT_ONE = '100000000000000000000000';

export class PostedMessage {
  sender: string;
  bet: bigint;
  hoursB: bigint;
  deadlineB: bigint;
  lastTimeB: bigint;
  readProcess: string;
  timerB: bigint;

  constructor({
    sender,
    bet,
    hoursB,
    deadlineB,
    lastTimeB,
    readProcess,
    timerB,
  }: PostedMessage) {
    this.sender = sender;
    this.bet = bet;
    this.hoursB = hoursB;
    this.deadlineB = deadlineB;
    this.lastTimeB = lastTimeB;
    this.readProcess = readProcess;
    this.timerB = timerB;
  }
}



export class Holders {
  user: string;
  tokens: number;

  constructor({
    user,
    tokens
  }: Holders) {
    this.user = user;
    this.tokens = tokens;
  }
}
