<script>
import '@/assets/clear.svg?sprite';

export default {
    name: 'BaseInput',
    props: {
        value: {
            type: String,
            required: true
        },
        placeholder: {
            type: String
        },
        maxLength: {
            type: Number,
            default: 256
        },
        noReset: {
            type: Boolean
        }
    },
    computed: {
        internalValue: {
            get: function () {
                return this.value;
            },

            set: function (value) {
                this.$emit('input', value)
            }
        }
    }
}
</script>

<template lang="pug">
.base-input
    input.base-input__input(
        :value="internalValue",
        :placeholder="placeholder",
        :maxLength="maxLength",
        @input="($event) => internalValue = $event.target.value"
    )

    span.base-input__reset(
        v-if="!noReset && internalValue.length",
        role="button",
        title="Clear",
        @click="$emit('reset')"
    )
        Icon(iconName="clear")
</template>

<style lang="scss" scoped>
@import '../styles/variables';

.base-input {
    position: relative;

    &__input {
        width: 100%;
        height: $grid-gap*8;
        border: solid 1px #dbdbdb;
        border-radius: $grid-gap/2;
        color: $blackLight;
        outline: 0;
        padding: 0 $grid-gap;
        font-size: 2em;
    }

    &__reset {
        position: absolute;
        color: $blackLight;
        width: $grid-gap*3;
        height: $grid-gap*3;
        right: $grid-gap;
        top: 50%;
        transform: translateY(-50%);
        cursor: pointer;
    }
}
</style>
