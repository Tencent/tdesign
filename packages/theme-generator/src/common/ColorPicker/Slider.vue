<template>
    <div class="t-color-picker__slider t-color-picker__hue" ref="refPanel">
        <div class='t-color-picker__rail'></div>
        <span class="t-color-picker__thumb" role="slider" :tabindex="0" ref="refThumb" :style="styles"></span>
    </div>
</template>
<script>
import { Draggable } from "../utils";

export default {
    name: "ColorSlider",
    props: {
        color: Object,
        value: {
            type: Number,
            default: 0,
        },
        maxValue: {
            type: Number,
            default: 360,
        },
        railStyle: {
            type: Object,
        },
    },
    emit: ['change'],
    data() {
        return {
            panelRectWidth: 248,
        };
    },
    computed: {
        styles() {
            const width = this.panelRectWidth;
            if (!width) return;
            const left = Math.round((this.value / this.maxValue) * width);
            return {
                left: `${left}px`,
                color: this.color.rgb,
            };
        }
    },
    methods: {
        handleDrag(coordinate, isEnded) {
            const width = this.panelRectWidth;
            const { x } = coordinate;
            const value = Math.round((x / width) * this.maxValue * 100) / 100;
            this.$emit('change', value, isEnded);
        },
        handleDragEnd(coordinate) {
            this.handleDrag(coordinate, true);
        }
    },
    mounted() {
        this.panelRectWidth = this.$refs.refPanel.offsetWidth;
        this.panelRectHeight = this.$refs.refPanel.offsetHeight;
        const refPanel = this.$refs.refPanel
        new Draggable(this.$refs.refPanel, {
            start() {
                this.panelRectWidth = refPanel.offsetWidth;
                this.panelRectHeight = refPanel.offsetHeight;
            },
            drag: (coordinate) => {
                this.handleDrag(coordinate);
            },
            end: this.handleDragEnd,
        });
    },
    beforeUnmount() {
        this.draggerRef.destroy()
    },
};
</script>
<style lang="less" scoped>
.t-color-picker__hue {
    margin-top: 12px;
}
</style>
