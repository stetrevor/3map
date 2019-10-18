<template>
  <div class="base-dialog">
    <div class="base-dialog__background"></div>

    <div class="base-dialog__dialog">
      <div class="base-dialog__content"><slot></slot></div>

      <button
        class="base-dialog__button base-dialog__button--cancel"
        @click="$emit('on-cancel')"
      >
        {{ cancelButtonText }}
      </button>
      <button
        class="base-dialog__button base-dialog__button--accept"
        @click="$emit('on-accept')"
      >
        {{ acceptButtonText }}
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    cancelButtonText: {
      type: String,
      default: "cancel"
    },
    acceptButtonText: {
      type: String,
      default: "ok"
    }
  }
};
</script>

<style lang="scss">
.base-dialog {
  position: relative;

  &__dialog {
    position: fixed;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    padding: 24px 16px;
    color: white;
    background-color: #2c3e50;
    display: grid;
    grid-template-columns: 1fr max-content;
    gap: 24px 8px;
  }

  &__content {
    grid-column: 1 / 3;

    display: flex;
    flex-direction: column;

    > h1 {
      font-size: 1.414em;
    }
  }

  &__button {
    text-transform: capitalize;
    justify-self: end;
    min-width: 64px;
  }

  &__background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(#2c3e50, 0.3);
  }
}
</style>
