<script setup lang="ts">
import { reactive, ref } from 'vue';
import orgs from '../assets/orgs.json';
import members from '../assets/members.json';
import NestedOrganization from '../components/NestedOrganization.vue';
import { Org, Member, MemberOrigin } from '../types/Org'

const loaded = ref(false);

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
    } else {
      orgsData[i].membersData = [] as Member[]
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

function getTree(orgsData: Org[]): Org[] {
  for (let i = orgsData.length - 1; i >= 0; i--) {
    const current = orgsData[i];
    const { parent } = current;
    if (parent) {
      orgsData = moveToParent(orgsData, parent, i, orgsData);
    }
  }

  return orgsData;
}
const orgsData = orgs as Org[];

let treeData = getTree(orgsData)
const membersData = formatMembers(members);
treeData = mapMembers(membersData, treeData)

const backupTreeData = JSON.parse(JSON.stringify(treeData))

const state = reactive({ refTreeData: [] as Org[] });
state.refTreeData.push(...treeData)

loaded.value = true;

function restore(): void {
  const newTree = JSON.parse(JSON.stringify(backupTreeData))
  state.refTreeData.splice(0, state.refTreeData.length)
  state.refTreeData.push(...newTree)
}

function save(): void {
  console.debug('save', state.refTreeData)
}
</script>

<template>
  <NestedOrganization
    v-if="loaded"
    :organizations="state.refTreeData"
  />
  <el-button @click="restore">
    取消
  </el-button>
  <el-button @click="save">
    保存
  </el-button>
</template>

<style>
</style>
