<template>
  <div class="row justify-center" style="min-height: inherit">
    <div
      class="col-md-4 col-sm-6 col self-center"
      style="line-height: 2em; font-size: 1.5em"
    >
      <h3 class="text-center">Welcome to PKStatus</h3>
      To get started you can:
      <ul>
        <li>
          Track who of your friends is fronting by
          <q-btn dense color="primary" icon="add" to="/manage/add"
            >Adding A System</q-btn
          >
        </li>
        <li>
          set up your token in the
          <q-btn dense color="primary" icon="settings" to="/settings"
            >Settings Page</q-btn
          >
          if you wanna use the switcher
        </li>
        <li>
          Or access the menu using the <q-icon name="menu" /> icon in the top
          left
        </li>
      </ul>
    </div>
  </div>
</template>
