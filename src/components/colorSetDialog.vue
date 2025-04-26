<template>
  <k-dialog
    ref="dialog"
    @open="onOpen"
    @close="onClose"
    @cancel="
      () => {
        choiceValue = Color(value);
        refreshPalette();
      }
    "
  >
    <div
      class="dialog-box"
      :style="{
        '--before': value,
        '--now': choiceValue.hex(),
      }"
    >
      <div class="color-pick">
        <div
          class="sl"
          :style="{
            '--s': hsv.s,
            '--v': hsv.v,
          }"
          :class="{
            'on-drag': slonDrag,
          }"
          @mousedown="((slonDrag = true), setSL($event))"
          @touchstart="((slonDrag = true), setSL($event.touches[0]))"
        >
          <canvas ref="slCanvas" class="sl" width="100" height="100"></canvas>
          <div
            class="block"
            @mousedown.stop="slonDrag = true"
            @touchstart.stop="slonDrag = true"
          ></div>
        </div>
        <div
          class="h"
          ref="hColor"
          :class="{
            'on-drag': honDrag,
          }"
          :style="{
            '--h': hsv.h,
          }"
          @mousedown="((honDrag = true), setH($event))"
          @touchstart="((honDrag = true), setH($event.touches[0]))"
        >
          <div
            class="block"
            @mousedown.stop="honDrag = true"
            @touchstart.stop="honDrag = true"
          ></div>
        </div>
        <div class="right">
          <k-icon id="eyedropper" class="eyedropper" @click="dropperColor" v-if="dropper" />
          <input
            type="text"
            :value="choiceValue.hex()"
            @change.capture="
              (e) => {
                let color: ReturnType<typeof Color>;
                const s = (e.target as HTMLInputElement).value;
                try {
                  color = Color(s);
                } catch {
                  try {
                    color = Color('#' + s);
                  } catch {
                    (e.target as HTMLInputElement).value = choiceValue.hex();
                    return;
                  }
                }
                hsv.h = color.hue();
                hsv.s = color.saturationv();
                hsv.v = color.value();
              }
            "
          />
          <div class="show">
            <div class="before"></div>
            <div class="now"></div>
          </div>
        </div>
      </div>
      <div class="texts">
        <div v-for="i of ['rgb', 'hsl', 'hsv', 'cmyk'] as const">
          <p class="title">{{ i }}</p>
          <div class="values">
            <template v-for="(value, name) in choiceValue[i]().object()">
              <p>{{ name }}:</p>
              <input
                type="text"
                :value="Math.round(value)"
                @change.capture="
                  (e) => {
                    const s = (e.target as HTMLInputElement).value;
                    try {
                      const n = parseInt(s, 10);
                      if (isNaN(n)) {
                        throw new Error();
                      } else {
                        const va = choiceValue[i]().object();
                        va[name] = n;
                        const co = Color(va);
                        hsv.h = co.hue();
                        hsv.s = co.saturationv();
                        hsv.v = co.value();
                      }
                    } catch {
                      (e.target as HTMLInputElement).value = Math.round(value).toString();
                    }
                  }
                "
              />
            </template>
          </div>
        </div>
      </div>
      <div class="defined-choices" v-if="definedChoice.length">
        <button
          v-for="i of definedChoice"
          @click="((choiceValue = Color(i.value)), refreshPalette())"
          :style="{
            '--value': i.value,
            '--text': getVisibleColor(i.value).hex(),
          }"
        >
          {{ i.name }}
        </button>
      </div>
      <div class="buttons">
        <button @click="dialog?.cancel()">取消</button>
        <button @click="((value = choiceValue.hex()), dialog?.close())">确定</button>
      </div>
    </div>
  </k-dialog>
</template>
<script setup lang="ts">
import Color from 'color';
import KIcon from './icon.vue';
import { getVisibleColor } from '@/scripts/uitl';
import KDialog from './dialog.vue';
const honDrag = ref(false);
const slonDrag = ref(false);
const hColor = ref<HTMLDivElement>();

declare class EyeDropper {
  open(): Promise<{ sRGBHex: string }>;
}
type DefinedChoice = {
  name: string;
  value: string;
};
const props = withDefaults(
  defineProps<{
    definedChoice?: DefinedChoice[];
  }>(),
  {
    definedChoice: () => [] as DefinedChoice[],
  }
);
const dropper = typeof EyeDropper === 'function' ? new EyeDropper() : null;
function dropperColor() {
  if (dropper) {
    dropper.open().then(
      ({ sRGBHex }) => {
        choiceValue.value = Color(sRGBHex);
        hsv.h = choiceValue.value.hue();
        hsv.s = choiceValue.value.saturationv();
        hsv.v = choiceValue.value.value();
      },
      () => {}
    );
  } else {
    alert('本浏览器不支持');
  }
}
function dragEnd() {
  honDrag.value = false;
  slonDrag.value = false;
}
function dragMove(e: { pageY: number; pageX: number }) {
  if (honDrag.value) setH(e);
  if (slonDrag.value) setSL(e);
}
function mouseMove(e: MouseEvent) {
  if (!(e.buttons | 1)) {
    honDrag.value = false;
    return;
  }
  dragMove(e);
}
function touchMove(e: TouchEvent) {
  if (!(e.touches.length | 1)) {
    honDrag.value = false;
    return;
  }
  e.preventDefault();
  dragMove(e.touches[0]);
}

const value = defineModel({
  type: String,
  required: true,
});
function rangeIn(min: number, value: number, max: number) {
  return Math.min(Math.max(min, value), max);
}
function setH(e: { pageY: number; pageX: number }) {
  const rect = hColor.value?.getBoundingClientRect()!;
  if (honDrag.value) {
    hsv.h = rangeIn(0, ((e.pageY - rect.top) / rect.height) * 360, 360);
  }
}
function setSL(e: { pageY: number; pageX: number }) {
  const rect = slCanvas.value?.getBoundingClientRect()!;
  if (slonDrag.value) {
    hsv.s = rangeIn(0, ((e.pageX - rect.left) / rect.width) * 100, 100);
    hsv.v = rangeIn(0, 100 - ((e.pageY - rect.top) / rect.height) * 100, 100);
  }
}
const slCanvas = ref<HTMLCanvasElement>();
onMounted(() => {
  watchEffect(() => {
    if (!slCanvas.value) {
      return;
    }
    const ctx = slCanvas.value.getContext('2d')!;
    ctx.clearRect(0, 0, 100, 100);
    for (let x = 0; x <= 100; x++) {
      const gradient = ctx.createLinearGradient(x, 0, x, 100);
      gradient.addColorStop(
        0,
        Color({
          h: hsv.h,
          s: x,
          v: 100,
        }).hex()
      );
      gradient.addColorStop(
        1,
        Color({
          h: hsv.h,
          s: x,
          v: 0,
        }).hex()
      );
      ctx.fillStyle = gradient;
      ctx.fillRect(x, 0, 1, 100);
    }
  });
});
const choiceValue = ref(Color(value.value));
const hsv = reactive({
  h: choiceValue.value.hue(),
  s: choiceValue.value.saturationv(),
  v: choiceValue.value.value(),
});
function refreshPalette() {
  hsv.h = choiceValue.value.hue();
  hsv.s = choiceValue.value.saturationv();
  hsv.v = choiceValue.value.value();
}
watchEffect(() => {
  const va = Color(value.value);
  choiceValue.value = va;
  hsv.h = va.hue();
  hsv.s = va.saturationv();
  hsv.v = va.value();
});
watchEffect(() => {
  choiceValue.value = Color(
    {
      h: hsv.h,
      s: hsv.s,
      v: hsv.v,
    },
    'hsl'
  );
});
const dialog = useTemplateRef('dialog');
function open() {
  dialog.value?.open();
}
function close() {
  dialog.value?.close();
}
function onOpen() {
  window.addEventListener('mouseup', dragEnd);
  window.addEventListener('touchend', dragEnd);
  window.addEventListener('mouseleave', dragEnd);
  window.addEventListener('touchcancel', dragEnd);
  window.addEventListener('mousemove', mouseMove);
  window.addEventListener('touchmove', touchMove, {
    passive: false,
  });
}
function onClose() {
  window.removeEventListener('mouseup', dragEnd);
  window.removeEventListener('touchend', dragEnd);
  window.removeEventListener('mouseleave', dragEnd);
  window.removeEventListener('touchcancel', dragEnd);
  window.removeEventListener('mousemove', mouseMove);
  window.removeEventListener('touchmove', touchMove);
}

defineExpose({
  open,
  close,
});
</script>
<style scoped lang="scss">
input {
  font-size: 1em;
  display: block;
  border: none;
  outline: none;
  border-bottom: #9c9c9c solid 0.1em;
  &:focus {
    border-bottom: #222 solid 0.1em;
  }
}

.dialog-box {
  display: flex;
  flex-direction: column;
  justify-content: start;
  align-items: stretch;
  row-gap: 1em;
}
.color-pick {
  flex: auto 0 0;
  display: flex;
  column-gap: 1em;
  align-items: stretch;
  .sl {
    border: 0.1em solid black;
    display: flex;
    position: relative;
    cursor: crosshair;
    flex: 0 0 auto;
    canvas {
      width: 60vmin;
      height: 60vmin;
    }
    .block {
      position: absolute;
      left: calc(1% * var(--s));
      bottom: calc(1% * var(--v));
      width: 0.5em;
      height: 0.5em;
      border: 0.15em solid black;
      transform: translate(-50%, 50%);
      cursor: grab;
    }
    &.on-drag {
      cursor: crosshair;
      & > .block {
        cursor: crosshair;
      }
    }
  }
  .h {
    border: 0.1em solid black;
    position: relative;
    width: 0.8em;
    flex: 0 0 auto;

    cursor: pointer;
    background: linear-gradient(
      to bottom,
      hsl(0, 100%, 50%),
      hsl(90deg, 100%, 50%),
      hsl(180deg, 100%, 50%),
      hsl(270deg, 100%, 50%),
      hsl(0, 100%, 50%)
    );
    .block {
      position: absolute;
      cursor: grab;
      height: 0.4em;
      border: 0.1em solid black;
      background-color: white;
      left: -0.2em;
      right: -0.2em;
      top: calc(100% * var(--h) / 360);
      transform: translate(0, -50%) scale(1.2);
    }
    &.on-drag {
      cursor: grabbing;
      & > .block {
        cursor: grabbing;
      }
    }
  }
  .right {
    justify-content: center;
    align-items: center;
    display: flex;
    flex-direction: column;
    row-gap: 0.8em;
    & > *:nth-child(1) {
      margin-top: auto;
    }
    .show {
      height: 4em;
      width: 5em;
      display: grid;
      grid-template-rows: 1fr 1fr;
      border: 0.15em solid black;
      box-sizing: border-box;
      .before {
        background-color: var(--before);
      }
      .now {
        background-color: var(--now);
      }
    }
    .eyedropper {
      font-size: 1.5em;
      padding: 0.75em;
      border: 0.1em solid black;
      cursor: pointer;
      transition: 0.3s;
      &:hover {
        background-color: black;
        color: white;
      }
    }
    input {
      width: 4.5em;
    }
  }
}
.texts {
  display: flex;
  & > * {
    flex: 1 1;
    .title {
      text-transform: uppercase;
      font-size: 1.2em;
      margin: 0;
      font-weight: bold;
    }
    .values {
      display: grid;
      grid-template-columns: max-content 1fr;
      column-gap: 0.5em;
      row-gap: 0.5em;
      input {
        width: 4em;
      }
      p {
        text-transform: uppercase;

        margin: 0;
        font-size: 1em;
        text-align: right;
      }
    }
  }
}
.buttons {
  display: flex;
  justify-content: end;
  column-gap: 1em;

  button {
    display: block;
    padding: 0.5em 1em;
    border: 0.1em solid black;
    outline: none;
    transition: 0.3s;
    cursor: pointer;
    background-color: #d6d6d6;
    &:hover {
      background-color: #000;
      color: white;
    }
  }
}
.defined-choices {
  display: flex;
  column-gap: 0.5em;
  row-gap: 0.5em;
  flex-wrap: wrap;
  button {
    font-size: 0.9em;
    display: block;
    padding: 0.5em 1em;
    border: solid 0.1em var(--value);
    outline: none;
    transition: 0.3s;
    cursor: pointer;
    background-color: var(--value);
    color: var(--text);
    &:hover {
      background-color: var(--text);
      color: var(--value);
    }
  }
}
</style>
