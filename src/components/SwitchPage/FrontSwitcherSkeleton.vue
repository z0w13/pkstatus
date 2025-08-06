<template>
  <!-- form -->
  <div class="row justify-center col-auto">
    <div class="col-12 col-md-8 q-px-lg q-pt-md bg-lighten">
      <!-- selected fronter list -->
      <div class="row q-col-gutter-md q-mb-md" style="min-height: 64px">
        <div class="col-auto self-center">
          <q-skeleton type="rect" width="121px" height="21px" />
        </div>
        <div class="col">
          <q-skeleton type="QAvatar" />
        </div>
      </div>
      <div class="row q-col-gutter-x-md q-col-gutter-y-none q-mb-md">
        <!-- primary fronter dropdown -->
        <div class="col-sm-6 col-12">
          <q-skeleton class="QInput" height="48px" />
        </div>
        <!-- search field -->
        <div class="col-sm-6 col-12 q-mt-sm-none q-mt-xs-lg">
          <q-skeleton class="QInput" height="48px" />
        </div>
      </div>
    </div>
  </div>

  <!-- member tiles -->
  <q-scroll-area class="col q-mt-sm">
    <div class="row justify-center">
      <div class="row col-md-8 col-12 q-col-gutter-md q-mt-md">
        <div v-for="idx of 12" :key="idx" class="col-xl-2 col-md-3 col-4">
          <q-skeleton type="rect" style="aspect-ratio: 1/1" />
        </div>
      </div>
    </div>
  </q-scroll-area>

  <!-- buttons -->
  <q-footer>
    <q-btn-group spread style="height: 50px">
      <q-btn
        color="negative"
        icon="restart_alt"
        label="Reset"
        disabled
        loading
      />
      <q-btn
        color="positive"
        icon="swap_horiz"
        label="Switch"
        disabled
        loading
      />
    </q-btn-group>
  </q-footer>
</template>
