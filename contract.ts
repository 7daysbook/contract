import { NearBindgen, near, call, view, Vector, NearPromise } from 'near-sdk-js';
import { POINT_ONE, PostedMessage, Holders } from './model';
import { Near, utils } from 'near-api-js';


@NearBindgen({})
class GuestBook {
  messages: Vector<PostedMessage> = new Vector<PostedMessage>("v-uid");



  @call({ payableFunction: true })
  // Public - Adds a new message.
  add_message({ deadline, hours }: { deadline: number; hours: number }) {
    let proverka = true;
    const sender = near.predecessorAccountId();
    const bet: bigint = near.attachedDeposit() as bigint;

    this.messages.toArray().forEach((itemUser) => {
      if (itemUser.sender == sender && itemUser.readProcess == "reading") {
        proverka = false;
      }
    });
    if (proverka) {
      const deadlineB = BigInt(deadline * 1_000_000);
      const readProcess = "reading";
      const timerB = BigInt(0);
      const lastTimeB = BigInt(0);
      const hoursB = BigInt(hours) *  BigInt(3_600_000_000_000);


      const message: PostedMessage = {
        sender,
        bet,
        hoursB,
        deadlineB,
        lastTimeB,
        readProcess,
        timerB,
      };
      this.messages.push(message);
    }
  }

  @view({})
  getUser(user) {
    let res = {};
    if (this.messages.length) {
      this.messages.toArray().forEach((item, index) => {
        if (item.sender == user.user && item.readProcess == 'reading') {
          res = item;
        }
      });
    }
    return res;
  }

  @call({})
  timer() {
    const user = near.predecessorAccountId();
    const nowTime = near.blockTimestamp();
    const start = BigInt(604_800_000_000_000);
    this.messages.toArray().forEach((userItem, index) => {
      if (userItem.sender == user && userItem.readProcess == "reading" && userItem.deadlineB - start < nowTime) {
        if (userItem.timerB < userItem.hoursB) {
          if (BigInt(userItem.lastTimeB) - nowTime > BigInt(-120_000_000_000)) {
            userItem.timerB += nowTime - userItem.lastTimeB;
            userItem.lastTimeB = nowTime;
            this.messages.replace(index, userItem);
          } else {
            userItem.lastTimeB = nowTime;
            this.messages.replace(index, userItem);
          }
        } else {
          userItem.readProcess = "Win";
          userItem.lastTimeB = nowTime;
          this.messages.replace(index, userItem);
          const promise = near.promiseBatchCreate(userItem.sender);
          near.promiseBatchActionTransfer(promise, userItem.bet);
        }
      }
    });
  }

  @call({})
  loseMoney() {
    const now = near.blockTimestamp();
    this.messages.toArray().forEach((userItem, index) => {
      if (userItem.deadlineB < now && userItem.readProcess == 'reading') {
        const promise = near.promiseBatchCreate("book-jack.near");
        near.promiseBatchActionTransfer(promise, userItem.bet);
        userItem.readProcess = "fail";
        this.messages.replace(index, userItem);
      }
    });
  }

}
