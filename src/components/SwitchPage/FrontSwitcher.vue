<template>
  <!-- form -->
  <div class="row justify-center col-auto">
    <div class="col-12 col-md-8">
      <div ref="searchForm" class="col-auto q-px-lg q-pt-md bg-lighten">
        <!-- selected fronter list -->
        <div class="row q-col-gutter-md q-mb-md" style="min-height: 64px">
          <div class="col-auto self-center">Selected Fronters:</div>
          <div class="col relative-position">
            <initial-fallback-avatar
              v-for="[idx, fronter] in fronters.toReversed().entries()"
              :key="fronter.id"
              :style="`left: ${(fronters.length - idx - 1) * 25 + 5}px; position: absolute; box-shadow: 0 0 2px 2px black`"
              :url="fronter.avatarUrl"
              :name="fronter.getName(detectPronouns)"
              @click="toggleMember(fronter.id)"
            />
          </div>
        </div>

        <div class="row q-col-gutter-x-md q-col-gutter-y-none q-mb-md">
          <!-- primary fronter dropdown -->
          <div class="col-sm-6 col-12">
            <q-select
              v-model="primaryFronterId"
              bottom-slots
              emit-value
              map-options
              :options="primaryFronterOptions"
              label="Primary Fronter"
            >
              <template v-if="primaryFronter" #append>
                <initial-fallback-avatar
                  :url="primaryFronter.avatarUrl"
                  :name="primaryFronter.getName(detectPronouns)"
                />
              </template>
            </q-select>
          </div>
          <!-- search field -->
          <div class="col-sm-6 col-12">
            <q-input v-model="searchText" bottom-slots label="Search" />
          </div>
          <div class="col-sm-6 col-12"></div>
        </div>
      </div>
    </div>
  </div>

  <!-- member tiles -->
  <q-scroll-area class="col">
    <div class="row justify-center">
      <div class="row col-md-8 col-12 q-col-gutter-md q-my-sm">
        <div
          v-for="member of filteredMembers"
          :key="member.id"
          class="col-xl-2 col-sm-3 col-4"
        >
          <labeled-tile
            style="
              box-shadow: 0px 0px 3px 3px var(--q-primary);
              user-select: none;
            "
            :img="member.avatarUrl"
            :label="member.getName(detectPronouns)"
            :caption="member.getPronouns(detectPronouns)"
            :flat="!selectedMemberIds.includes(member.id)"
            size="100%"
            @click="toggleMember(member.id)"
          />
        </div>
      </div>
    </div>
  </q-scroll-area>

  <!-- Filters -->
  <q-page-sticky position="bottom-right" :offset="[18, 18]">
    <q-btn-dropdown
      fab
      icon="filter_alt"
      color="primary"
      :menu-offset="[0, 18]"
    >
      <q-list dense bordered separator class="rounded-borders">
        <q-item-label header>Filters</q-item-label>
        <q-separator />
        <q-item>
          <q-item-section>
            <q-select
              v-model="switcher.lastSortMethod"
              borderless
              label="Sort By"
              map-options
              emit-value
              :options="Object.values(sortMethods)"
            />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <group-select
              v-model="switcher.excludeGroups"
              borderless
              label="Exclude Groups"
              multiple
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-btn-dropdown>
  </q-page-sticky>
  <q-footer>
    <q-btn-group spread style="height: 50px">
      <q-btn
        color="negative"
        icon="restart_alt"
        label="Reset"
        :disabled="saving"
        :loading="saving"
        @click="$emit('reset')"
      />
      <q-btn
        color="positive"
        icon="swap_horiz"
        label="Switch"
        :disabled="saving"
        :loading="saving"
        @click="$emit('save', selectedMemberIds)"
      />
    </q-btn-group>
  </q-footer>
</template>

<script setup lang="ts">
import { watch, computed, ref } from 'vue';
import { storeToRefs } from 'pinia';

import { useSettingsStore } from 'src/stores/settings-store';
import { caseInsensitiveIncludes, getNameSort, notEmpty } from 'src/util';

import { Group } from 'src/models/Group';
import { Member } from 'src/models/Member';

import GroupSelect from 'src/components/GroupSelect.vue';
import LabeledTile from 'src/components/StatusPage/Tile/LabeledTile.vue';
import InitialFallbackAvatar from 'src/components/InitialFallbackAvatar.vue';

// props/static
const { detectPronouns, switcher } = storeToRefs(useSettingsStore());
const props = defineProps<{
  groups: ReadonlyArray<Group>;
  members: ReadonlyArray<Member>;
  initialFronters: ReadonlyArray<Member>;
  saving: boolean;
}>();

const sortMethods: Record<
  string,
  {
    value: string;
    label: string;
    func: (a: Member, b: Member) => number;
  }
> = {
  'by-name': {
    value: 'by-name',
    label: 'Name',
    func: (a, b) => getNameSort(detectPronouns.value)(a, b),
  },
  'by-last-message': {
    value: 'by-last-message',
    label: 'Last Message',
    func: (a, b) =>
      (b.lastMessageAt?.valueOf() ?? 0) - (a.lastMessageAt?.valueOf() ?? 0),
  },
};

// events
defineEmits<{
  (evt: 'reset'): void;
  (evt: 'save', value: Array<string>): void;
}>();

// refs
const searchText = ref('');
const primaryFronterId = ref<string | null>(
  props.initialFronters[0]?.id ?? null,
);
const selectedMemberIds = ref<Array<string>>(
  props.initialFronters.map((f) => f.id),
);
const searchForm = ref<HTMLElement>();

// computed
const fronters = computed(() =>
  selectedMemberIds.value
    .map((id) => props.members.find((m) => m.id == id))
    .filter(notEmpty),
);

const excludedMemberIds = computed(() =>
  props.groups
    .filter((g) => switcher.value.excludeGroups.includes(g.id))
    .map((g) => g.members)
    .flat(),
);

const filteredMembers = computed(() =>
  props.members
    .filter(
      (m) =>
        // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing -- false positive
        (m.name && caseInsensitiveIncludes(m.name, searchText.value)) ||
        (m.displayName &&
          caseInsensitiveIncludes(m.displayName, searchText.value)),
    )
    .filter((m) => !excludedMemberIds.value.includes(m.uuid))
    .toSorted(sortMethods[switcher.value.lastSortMethod].func),
);

const primaryFronterOptions = computed(() =>
  props.members
    .filter((m) => selectedMemberIds.value.includes(m.id))
    .map((m) => ({
      value: m.id,
      label: m.getName(detectPronouns.value),
    })),
);

// watchers

// re-orders the selected member IDs so new primary fronter is first
watch(primaryFronterId, (val) => {
  if (!val) {
    return;
  }

  // Primary fronter is already first on the list, do nothing
  if (selectedMemberIds.value[0] == val) {
    return;
  }

  selectedMemberIds.value.splice(selectedMemberIds.value.indexOf(val), 1);
  selectedMemberIds.value.unshift(val);
});

const primaryFronter = computed(() =>
  props.members.find((m) => m.id == primaryFronterId.value),
);

// callbacks
function toggleMember(id: string) {
  if (selectedMemberIds.value.includes(id)) {
    selectedMemberIds.value.splice(selectedMemberIds.value.indexOf(id), 1);
  } else {
    selectedMemberIds.value.push(id);
  }

  if (!primaryFronterId.value) {
    // If there's no primary fronter selected set it to this one
    primaryFronterId.value = id;
  } else if (!selectedMemberIds.value.includes(primaryFronterId.value)) {
    // If primary fronter was removed from the list select the next member as primary
    primaryFronterId.value = selectedMemberIds.value[0];
  }
}
</script>
