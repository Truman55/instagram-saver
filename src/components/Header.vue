<script>
export default {
    name: "Header"
};
</script>

<template lang="pug">
header.header
    .layout-wrapper
        .grid-row
            .grid-item-12
                .header__logo Instagram Photo Saver ver. 0.1

                slot
</template>

<style lang="scss" scoped>
@import "../styles/mixins/screen";
@import "../styles/variables";

.header {
    position: relative;
    background-color: #fff;
    border-bottom: 1px solid rgba(0, 0, 0, 0.09);
    position: fixed;
    top: 0;
    width: 100%;
    z-index: 1;
    height: $headerHeight;

    &__logo {
        padding: 0 $grid-gap;
        font-size: 1.25em;
        font-weight: bold;
        line-height: $headerHeight;
        height: $headerHeight;
        white-space: nowrap;

        @include screen-sm {
            font-size: 2em;
            padding: 0;
        }
    }
}
</style>
