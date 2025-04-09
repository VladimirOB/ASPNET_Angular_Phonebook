export class Contact {
  constructor(
    public conId: number,
    public ownerId: number,
    public name: string,
    public groupId: number,
    public email: string,
    public address: string,
    public numbers: Number[],
    public isSelected: boolean = false,
    public group?: Group,
  ) { }
}

export class Number {
  constructor(
    public numId: number,
    public conId: number,
    public number1: string
  ) { }
}

export class Group {
  constructor(
    public groupId: number,
    public ownerId: number,
    public name: string,
    public contacts?: Contact[],
    public isSelected: boolean = false
  ) { }
}

export class User {
  constructor(
    public userId: number,
    public login: string,
    public password: string,
    public isSelected: boolean = false
  ) { }
}
