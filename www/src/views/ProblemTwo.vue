<script setup lang="ts">
import { onMounted } from 'vue';
import Sortable from 'sortablejs';
import orgs from '../assets/orgs.json';
import members from '../assets/members.json';

interface MemberOrigin {
  name: string;
  id: string;
  age?: number;
  status: string;
  manager?: boolean;
}

interface Member {
  name: string;
  id: string;
  age?: number;
  status: boolean;
  isManager: boolean;
  type: 'member';
}

interface Org {
  name: string;
  id: string;
  type: string;
  parent?: string;
  representation: string;
  members?: string[];
  membersData?: Member[];
  children?: Org[];
}

const treeProps = {
  children: 'children',
  label: 'name',
  class: 'tree-draggable'
}

function formatMembers(members: MemberOrigin[]): Member[] {
  return members.map((elem) => {
    const { id, name, age, status: oldStatus, manager } = elem;
    let status = false;
    let isManager = false;
    if (oldStatus === 'activated') status = true;
    if (manager) isManager = true;

    return { id, name, age, status, isManager, type: 'member' };
  })
}

function restoreMembers(members: Member[]): MemberOrigin[] {
  return members.map((elem) => {
    const { id, name, age, status: oldStatus, isManager } = elem;
    let status = 'inactivated';
    let manager = false;
    if (oldStatus) status = 'activated';
    if (isManager) manager = true;

    return { id, name, age, status, manager };
  })
}

function mapMember(members: Member[], memberIds: string[]): Member[] {
  return members.filter(member => {
    return -1 !== memberIds.findIndex(id => id === member.id);
  });
}

function mapMembers(membersData: Member[], orgsData: Org[]): Org[] {
  for (let i = 0; i < orgsData.length; i++) {
    if (orgsData[i].members) {
      orgsData[i].membersData = mapMember(membersData, orgsData[i].members as string[])
    }
    if (orgsData[i].children instanceof Array<Org>) {
      orgsData[i].children = mapMembers(membersData, orgsData[i].children as Org[])
    }
  }
  return orgsData;
}

function moveToParent(parents: Org[], parent: string, currentIdx: number, originOrgs: Org[]): Org[] {
  const idx = parents.findIndex(elem => elem.id === parent);
  if (idx !== -1) {
    if (!parents[idx].children || Array.isArray(parents[idx].children)) {
      parents[idx].children = [parents[currentIdx]];
    }
    else {
      parents[idx].children?.push(parents[currentIdx]);
    }
    originOrgs.splice(currentIdx, 1);
  } else {
    // 当前层级找不到父节点时尝试查找其子节点
    parents.forEach((newParent, childIdx) => {
      if (newParent.children) {
        const newChildren = moveToParent(newParent.children, parent, currentIdx, originOrgs)
        parents[childIdx].children = newChildren;
      }
    })
  }

  return parents;
}

function getTree(): Org[] {
  let orgsData = orgs as Org[];

  for (let i = orgsData.length - 1; i >= 0; i--) {
    const current = orgsData[i];
    const { parent } = current;
    if (parent) {
      orgsData = moveToParent(orgsData, parent, i, orgsData);
    }
  }

  return orgsData;
}

let treeData = getTree()
const membersData = formatMembers(members);
treeData = mapMembers(membersData, treeData)
console.debug('treeData', treeData);

function onGroupNameChange(): void {
  console.debug('treeData', treeData);
}

function onStatusChange(): void {
  console.debug('treeData', treeData);
}

function onIsManagerChange(): void {
  console.debug('treeData', treeData);
}

function createOrganizationSortable() {
  const membersTables = document.querySelectorAll('.tree-draggable');
  // console.debug('membersTables', membersTables);
  membersTables.forEach(el => {
    Sortable.create(el, {
      group: 'organization',
      animation: 500,
      handle: '.tree-drag',
      onStart(event: Event) {
        console.debug('dragStart', event);
      },
      onEnd(event: Event) {
        console.debug('dragEnd', event);
      },
      onAdd(event: Event) {
        console.debug('dragAdd', event);
      },
      onRemove(event: Event) {
        console.debug('dragRemove', event);
      }
    });
  })
}

function createMemberSortable() {
  const membersTables = document.querySelectorAll('.members-table tbody');
  membersTables.forEach(el => {
    Sortable.create(el, {
      group: 'members',
      animation: 500,
      handle: '.member-drag',
      onStart(event: Event) {
        console.debug('dragStart', event);
      },
      onEnd(event: Event) {
        console.debug('dragEnd', event);
        console.debug('treeData', treeData);
      },
      onAdd(event: Event) {
        console.debug('dragAdd', event);
      },
      onRemove(event: Event) {
        console.debug('dragRemove', event);
      }
    });
  })
}

onMounted(() => {
  createOrganizationSortable()
  createMemberSortable()
})

</script>

<template>
  <el-tree
    :data="treeData"
    :props="treeProps"
    default-expand-all
    :expand-on-click-node="false"
    node-key="id"
    class="custom-tree"
    :indent="56"
  >
    <template #default="{ data }">
      <div class="item-wrap">
        <div class="org-head">
          <el-icon
            :size="24"
            class="tree-drag"
          >
            <Rank />
          </el-icon>
          <el-input
            v-model="data.name"
            @change="onGroupNameChange"
          >
            <template #prepend>
              组织名称
            </template>
          </el-input>
        </div>
        <el-table
          class="members-table"
          row-class-name="member-dragable"
          :data="data.membersData"
          :border="true"
          row-key="id"
        >
          <el-table-column
            label="移动"
            width="56"
          >
            <el-icon
              :size="20"
              class="member-drag"
            >
              <Rank />
            </el-icon>
          </el-table-column>
          <el-table-column
            prop="name"
            label="姓名"
            width="180"
          />
          <el-table-column
            prop="age"
            label="年龄"
            width="180"
          />
          <el-table-column
            prop="status"
            label="激活"
            width="180"
          >
            <template #default="scoop">
              <el-switch
                v-model="scoop.row.status"
                @change="onStatusChange"
              />
            </template>
          </el-table-column>
          <el-table-column
            prop="manager"
            label="管理者"
            width="180"
          >
            <template #default="scoop">
              <el-switch
                v-model="scoop.row.isManager"
                :disabled="!scoop.row.status"
                @change="onIsManagerChange"
              />
            </template>
          </el-table-column>
        </el-table>
      </div>
    </template>
  </el-tree>
</template>

<style>
.custom-tree {
  text-align: start;
}

.custom-tree .el-tree-node__content {
  align-items: start;
  height: auto;
}

.item-wrap {
  display: flex;
  flex-direction: column;
}

.org-head {
  display: flex;
  align-items: center;
}

.member-dragable {
  z-index: 99;
}

.tree-drag,
.member-drag {
  cursor: move;
}

.member-head {
  display: flex;
}

.member-info {
  display: flex;
}

.member-info>div {
  margin-left: 2rem;
}
</style>
