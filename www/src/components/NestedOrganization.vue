<script setup lang="ts">
import { reactive } from 'vue';
import draggable from 'vuedraggable';
import { Org } from '../types/Org'

const props = defineProps({ organizations: { type: Array<Org>, default: [], required: true } });

const orgs = reactive(props.organizations);

</script>

<template>
  <draggable
    v-model="orgs"
    handle=".tree-dragger"
    group="origanization"
    item-key="id"
  >
    <template #item="{ element }">
      <div class="item-wrap">
        <div class="org-head">
          <el-icon
            :size="24"
            class="tree-dragger"
          >
            <Rank />
          </el-icon>
          <el-input v-model="element.name">
            <template #prepend>
              组织名称
            </template>
          </el-input>
        </div>
        <table class="member-table">
          <tr>
            <th class="move">
              移动
            </th>
            <th>
              姓名
            </th>
            <th>
              年龄
            </th>
            <th>
              激活
            </th>
            <th>
              管理者
            </th>
          </tr>
          <draggable
            v-model="element.membersData"
            handle=".member-dragger"
            group="member"
            item-key="id"
            :empty-insert-threshold="50"
          >
            <!-- <template #header>
              暂无成员
            </template> -->
            <template #item="{ element: memberElem }">
              <tr class="member-dragger">
                <td class="move">
                  <el-icon
                    :size="20"
                    class="member-dragger"
                  >
                    <Rank />
                  </el-icon>
                </td>
                <td>{{ memberElem.name }}</td>
                <td>{{ memberElem.age }}</td>
                <td>
                  <el-switch v-model="memberElem.status" />
                </td>
                <td>
                  <el-switch
                    v-model="memberElem.isManager"
                    :disabled="!memberElem.status"
                  />
                </td>
              </tr>
            </template>
            <!-- <template #footer>
              暂无成员
            </template> -->
          </draggable>
        </table>
        <div class="children">
          <nested-organization :organizations="element.children" />
        </div>
      </div>
    </template>
  </draggable>
</template>

<style>
.children {
  margin-top: 1rem;
  padding-left: 4rem;
}

.item-wrap {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: start;
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

.member-table {
  border: 1px;
}

.member-table th,
.member-table td {
  display: inline-block;
  width: 6rem;
}

.member-table .move {
  width: 2rem;
}

.member-tr {
  display: flex;
}
</style>
