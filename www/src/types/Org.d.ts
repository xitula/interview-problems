export interface MemberOrigin {
  name: string;
  id: string;
  age?: number;
  status: string;
  manager?: boolean;
}

export interface Member {
  name: string;
  id: string;
  age?: number;
  status: boolean;
  isManager: boolean;
  type: 'member';
}

export interface Org {
  name: string;
  id: string;
  type: string;
  parent?: string;
  representation: string;
  members?: string[];
  membersData?: Member[];
  children?: Org[];
}
