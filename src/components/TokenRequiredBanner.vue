<template>
  <div class="col col-md-8">
    <q-banner class="text-white bg-red col-auto">
      <template #avatar>
        <q-icon name="warning" color="white" />
      </template>
      You need to set your PluralKit token to use this feature
      <template #action>
        <q-btn
          to="/settings"
          flat
          class="bg-red text-white"
          label="Go To Settings"
        />
      </template>
    </q-banner>
  </div>
</template>
