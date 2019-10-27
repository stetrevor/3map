<template>
  <div class="upgrade-dialog">
    <div class="upgrade-dialog__message">
      A new version is found. Refresh to load it?
    </div>
    <div
      class="upgrade-dialog__button upgrade-dialog__button--accept"
      @click="$emit('upgrade')"
    >
      Refresh
    </div>
    <div
      class="upgrade-dialog__button upgrade-dialog__button--cancel"
      @click="$emit('cancel')"
    >
      Later
    </div>
  </div>
</template>

<script>
export default {};
</script>

<style lang="scss">
.upgrade-dialog {
  position: fixed;
  bottom: 24px;
  left: 50%;
  transform: translateX(-50%);
  border-radius: 4px;
  box-sizing: border-box;
  padding: 8px 12px;
  color: white;
  background-color: #2c3e50;
  box-shadow: 0 4px 4px rgba(#2c3e50, 0.4);
  display: grid;
  grid-template-columns: 1fr max-content;
  gap: 8px;

  &__message {
    grid-column: 1 / 3;
  }

  &__button {
    padding: 0 8px;
    height: 36px;
    line-height: 36px;
    font-weight: bold;
    cursor: pointer;
    user-select: none;
    &--accept {
      justify-self: end;
    }
  }
}
</style>
