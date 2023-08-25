<template>
    <div class="t-color-picker__saturation" ref="refPanel" :style="panelBackground">
        <span class="t-color-picker__thumb" :tabindex="0" ref="refThumb" :style="styles"></span>
    </div>
</template>
<script>
import { Draggable } from "../utils";

export default {
    name: "ColorSaturation",
    props: {
        color: Object,
    },
    emit: ["change"],
    data() {
        return {
            panelRectWidth: 100,
            panelRectHeight: 300,
            draggerRef: null,
        };
    },
    computed: {
        panelBackground() {
            return { background: `hsl(${this.color.hue}, 100%, 50%)` };
        },
        styles() {
            const { saturation, value } = this.color;
            const width = this.panelRectWidth;
            const height = this.panelRectHeight;
            const top = Math.round((1 - value) * height);
            const left = Math.round(saturation * width);
            return {
                color: this.color.rgb,
                left: `${left}px`,
                top: `${top}px`,
            };
        },
    },
    methods: {
        handleDrag(coordinate, isEnded) {
            const { saturation, value } =
                this.getSaturationAndValueByCoordinate(coordinate);
            this.$emit("change", {
                saturation: saturation / 100,
                value: value / 100,
                addUsedColor: isEnded,
            });
        },
        handleDragEnd(coordinate) {
            this.$nextTick(() => {
                this.handleDrag(coordinate, true);
            });
        },
        getSaturationAndValueByCoordinate(coordinate) {
            const width = this.panelRectWidth;
            const height = this.panelRectHeight;

            const { x, y } = coordinate;
            const saturation = Math.round((x / width) * 100);
            const value = Math.round((1 - y / height) * 100);
            return {
                saturation,
                value,
            };
        },
    },
    mounted() {
        this.panelRectWidth = this.$refs.refPanel.offsetWidth;
        this.panelRectHeight = this.$refs.refPanel.offsetHeight;
        const refPanel = this.$refs.refPanel;
        this.draggerRef = new Draggable(this.$refs.refPanel, {
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
        this.draggerRef.destroy();
    },
};
</script>
<style lang="less" scoped>
.t-color-picker__panel {
    padding: 0;
    width: 280px;
    background: var(--bg-color-container);
    -webkit-box-shadow: var(--td-shadow-2), var(--td-shadow-inset-top),
        var(--td-shadow-inset-right), var(--td-shadow-inset-bottom),
        var(--td-shadow-inset-left);
    box-shadow: var(--td-shadow-2), var(--td-shadow-inset-top),
        var(--td-shadow-inset-right), var(--td-shadow-inset-bottom),
        var(--td-shadow-inset-left);
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
}




.t-color-picker__thumb {
    position: absolute;
    z-index: 1;
    outline: none;
    border-color: currentcolor;
    width: 14px;
    height: 14px;
    border-radius: 50%;
    -webkit-box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.15);
    background: white;
    color: var(--td-text-color-brand);
    padding: 4px;
}

.t-color-picker__thumb::before {
    content: "";
    width: 100%;
    height: 100%;
    background: currentcolor;
    border-radius: 50%;
    display: block;
}

.t-color-picker__saturation {
    height: 140px;
    border-radius: 4px;
    position: relative;
    overflow: hidden;
    background: transparent;
}

.t-color-picker__saturation::before,
.t-color-picker__saturation::after {
    content: "";
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

.t-color-picker__saturation::before {
    background: -webkit-gradient(linear,
            left top,
            right top,
            from(#fff),
            to(transparent));
    background: linear-gradient(90deg, #fff, transparent);
}

.t-color-picker__saturation::after {
    background: -webkit-gradient(linear,
            left bottom,
            left top,
            from(#000),
            to(transparent));
    background: linear-gradient(0deg, #000, transparent);
}

.t-color-picker__saturation .t-color-picker__thumb {
    width: 14px;
    height: 14px;
    border-radius: 50%;
    -webkit-transform: translate(-50%, -50%);
    transform: translate(-50%, -50%);
}

.t-color-picker__slider {
    height: 8px;
    position: relative;
    border-radius: 8px;
    cursor: pointer;
    color: transparent;
    outline: none;
}

.t-color-picker__slider .t-color-picker__thumb {
    -webkit-transform: translate(-7px, -50%);
    transform: translate(-7px, -50%);
    top: 50%;
}

.t-color-picker__slider .t-color-picker__rail {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    border-radius: inherit;
}

.t-color-picker__hue,
.t-color-picker__alpha,
.t-color-picker__format {
    margin: 16px 0 0 0;
}

.t-color-picker__hue {
    margin-top: 12px;
    background: -webkit-gradient(linear,
            left top,
            right top,
            from(red),
            color-stop(17%, #ff0),
            color-stop(33%, #0f0),
            color-stop(50%, #0ff),
            color-stop(67%, #00f),
            color-stop(83%, #f0f),
            to(red));
    background: linear-gradient(90deg,
            red,
            #ff0 17%,
            #0f0 33%,
            #0ff 50%,
            #00f 67%,
            #f0f 83%,
            red);
}
</style>
